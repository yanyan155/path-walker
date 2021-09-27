const { userRepository } = require('../repositories/userRepository');
const { logger } = require('../libs/logger');
const config = require('../config');

class UserServices {
  async sendStats(path) {
    try {
      const stats = await userRepository.sendFileDetails(path);
      const data = {
        size: stats.size,
        type: stats.isDirectory() ? 'directory' : 'file',
        modifiedDate: stats.mtimeMs,
      };
      return JSON.stringify(data);
    } catch (error) {
      logger.error(error);
      throw new Error('cant receive stats');
    }
  }

  async login(name, password, reqSession) {
    try {
      const preparedData = prepareUserData(name, password, reqSession.id);
      const usersJson = await userRepository.readFileData(config.db);
      const users = await JSON.parse(usersJson);
      const user = users.find(el => el.name === name);
      if (!user) {
        users.push(preparedData);
        await userRepository.writeFileData(config.db, users);
        reqSession.name = name;
        users.forEach(el => {
          delete el.password;
          delete el.sessionId;
        });
        return {
          users: users,
          isNewUser: true,
        };
      } else if (user && user.password === password) {
        if (user.sessionId) {
          user.sessionId.push(reqSession.id);
        } else {
          user.sessionId = [reqSession.id];
        }
        await userRepository.writeFileData(config.db, users);
        reqSession.name = name;
        return {
          isNewUser: false,
        };
      } else if (user && user.password !== preparedData.password) {
        logger.error('wrong user password');
        throw new Error('wrong password / login');
      }
    } catch (error) {
      logger.error(error);
      throw new Error('cant login');
    }
  }

  async getData(path, type, isAdmin) {
    try {
      if (type === '' && isAdmin) {
        const stats = await userRepository.sendFileDetails(path);
        if (stats.isDirectory()) {
          return await getDataDirectory(path, isAdmin);
        } else {
          return await getDataFiles(path);
        }
      } else if (type === 'file' && isAdmin) {
        return await getDataFiles(path);
      } else {
        return await getDataDirectory(path, isAdmin);
      }
    } catch (error) {
      logger.error(error);
      throw new Error('cant read file');
    }
  }

  async getDiscs(isAdmin) {
    try {
      const discs = await userRepository.getDiscsNames();
      const discsArr = discs[0].mountpoints.map(el =>
        el.path.replace('\\', '/')
      );
      const data = {
        files: discsArr,
        path: '/',
        isAdmin,
      };
      return JSON.stringify(data);
    } catch (error) {
      logger.error(error);
      throw new Error('cant read file');
    }
  }

  async checkuser(sessionId) {
    try {
      const usersJson = await userRepository.readFileData(config.db);
      const users = await JSON.parse(usersJson);
      const user = users.find(el => el.sessionId?.some(el => el === sessionId));
      return {
        isExist: !!user,
        isAdmin: user?.isAdmin,
      };
    } catch (error) {
      logger.error(error);
      throw new Error('cant check user');
    }
  }

  async createFile(isDirectory, text, path) {
    try {
      if (isDirectory) {
        await userRepository.createDir(path);
      } else {
        await userRepository.writeFileData(path, text, 'string');
      }
    } catch (error) {
      logger.error(error);
      throw new Error('do not able to create file/directory');
    }
  }

  async deleteFile(path, isDirectory) {
    try {
      if (isDirectory) {
        await userRepository.removeDir(path);
      } else {
        await userRepository.delFile(path);
      }
    } catch (error) {
      logger.error(error);
      throw new Error('do not able to delete file/directory');
    }
  }
  async receiveUsers() {
    try {
      const usersJson = await userRepository.readFileData(config.db);
      const users = await JSON.parse(usersJson);
      const tosend = users.map(el => {
        return {
          name: el.name,
          isAdmin: el.isAdmin,
          sessionId: el.sessionId,
        };
      });
      return tosend;
    } catch (error) {
      logger.error(error);
      throw new Error('do not able to delete file/directory');
    }
  }

  async updateRolesService(changedUsers) {
    try {
      const usersJson = await userRepository.readFileData(config.db);
      const dbUsers = await JSON.parse(usersJson);
      dbUsers.forEach(el =>
        changedUsers.some(elem => elem.name === el.name)
          ? (el.isAdmin = !el.isAdmin)
          : ''
      );
      await userRepository.writeFileData(config.db, dbUsers);
      return dbUsers.map(el => {
        delete el.password;
        delete el?.sessionId;
        return el;
      });
    } catch (error) {
      logger.error(error);
      throw new Error('do not able to updateRoles');
    }
  }

  async logoutUsers(name) {
    try {
      const usersJson = await userRepository.readFileData(config.db);
      const dbUsers = JSON.parse(usersJson);
      if (name) {
        dbUsers.forEach(el => {
          if (el.name === name) {
            delete el.sessionId;
          }
        });
        await userRepository.writeFileData(config.db, dbUsers);
      } else {
        dbUsers.forEach(el => delete el.sessionId);
        await userRepository.writeFileData(config.db, dbUsers);
      }
    } catch (error) {
      logger.error(error);
      throw new Error('cant logoutUsers from db');
    }
  }
}

const userServices = new UserServices();
module.exports.userServices = userServices;

const prepareUserData = (name, password, sessionId) => {
  return {
    name,
    password,
    isAdmin: false,
    sessionId: [sessionId],
  };
};

async function getDataDirectory(path, isAdmin) {
  try {
    const files = await userRepository.readDirData(path);
    const data = {
      files,
      path,
      isAdmin,
    };
    return JSON.stringify(data);
  } catch (error) {
    logger.error(error);
    throw new Error('cant getDataDirectory');
  }
}

async function getDataFiles(path) {
  try {
    const fileText = await userRepository.readFileData(path);
    const data = {
      fileText,
      path,
    };
    return JSON.stringify(data);
  } catch (error) {
    logger.error(error);
    throw new Error('cant getDataDirectory');
  }
}

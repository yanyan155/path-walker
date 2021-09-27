const {
  readFile,
  writeFile,
  stat,
  readdir,
  mkdir,
  unlink,
} = require('fs').promises;
const { logger } = require('../libs/logger');
const { resolve } = require('path');
const util = require('util');
const rimrafAsync = util.promisify(require('rimraf'));
const drivelist = require('drivelist');

class UserRepository {
  async readFileData(filePath) {
    try {
      return await readFile(resolve(filePath), 'utf8');
    } catch (error) {
      logger.error(error);
      throw new Error('readFile returns error');
    }
  }

  async getDiscsNames() {
    try {
      let drives = await drivelist.list();
      return drives;
    } catch (error) {
      logger.error(error);
      throw new Error('readFile returns error');
    }
  }

  async createDir(filePath) {
    try {
      return await mkdir(resolve(filePath));
    } catch (error) {
      logger.error(error);
      throw new Error('createDir returns error');
    }
  }

  async writeFileData(filePath, data, type = 'json') {
    try {
      if (type === 'string') {
        return await writeFile(resolve(filePath), data.toString());
      } else {
        return await writeFile(resolve(filePath), JSON.stringify(data));
      }
    } catch (error) {
      logger.error(error);
      throw new Error('writeFile returns error');
    }
  }

  async readDirData(path) {
    try {
      return await readdir(resolve(path));
    } catch (error) {
      logger.error(error);
      throw new Error('readdir returns error');
    }
  }

  async sendFileDetails(path) {
    try {
      return await stat(resolve(path));
    } catch (error) {
      logger.error(error);
      throw new Error('stat returns error');
    }
  }

  async delFile(path) {
    try {
      return await unlink(resolve(path));
    } catch (error) {
      logger.error(error);
      throw new Error('stat returns error');
    }
  }

  async removeDir(path) {
    return rimrafAsync(path);
  }
}

const userRepository = new UserRepository();
module.exports.userRepository = userRepository;

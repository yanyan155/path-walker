const { userServices } = require('../services/userServices');

async function auth(req, res, next) {
  try {
    const check = await userServices.checkuser(req.session.id);
    if (check?.isExist) {
      next();
    } else {
      res.redirect('/login.html');
    }
  } catch (error) {
    res.redirect('/login.html');
  }
}

async function adminAction(req, res, next) {
  const check = await userServices.checkuser(req.session.id);
  if (check?.isAdmin) {
    next();
  } else {
    res.end('forbidden action');
  }
}

module.exports.auth = auth;
module.exports.adminAction = adminAction;

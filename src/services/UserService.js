const User = require('../models/User');
const BaseService = require('./BaseService');
class UserService extends BaseService {
  constructor() {
    super(User);
  }

  findById(id,select){
    return User.findById(id).select(select);
  }
}

module.exports = new UserService();

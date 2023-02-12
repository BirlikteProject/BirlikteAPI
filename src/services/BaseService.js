let BaseModel = null;
class BaseService {
  constructor(model) {
    this.BaseModel = model;
  }
  create(data) {
    return new this.BaseModel(data).save();
  }
  list(where) {
    return this.BaseModel.find(where || {});
  }
  findById(id){
    return this.BaseModel.findById(id);
  }
  findOne(where) {
    return this.BaseModel.findOne(where);
  }
  update(id, data) {
    return this.BaseModel.findByIdAndUpdate(id, data, { new: true });
  }
  updateWhere(where,data){
    return this.BaseModel.findOneAndUpdate(where,data,{new:true});
  }
  delete(id) {
    return this.BaseModel.findByIdAndDelete(id);
  }


}
module.exports = BaseService;

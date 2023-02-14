const Advert = require('../models/Advert');
require("../models/City");
const {ACCEPTED} = require("../config/constants");
const BaseService = require('./BaseService');
class AdvertService extends BaseService {
  constructor() {
    super(Advert);
  }
  async listProfile(where) {
    return Advert.find(where)
      .populate('category_id')
      .populate('user_id', 'fullName image_url username email')
      .populate('city_id');
  }
  async listPagination(where, limit, skip) {
    const adverts = await Advert.find(where)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .populate('category_id')
      .populate('user_id',"fullName image_url username email");

    return { total:adverts.length ?? 0 , data: adverts };
  }
  async search(city_id, term) {
    const filteredAdverts= await Advert.find({ city_id, title: new RegExp(term, 'i'),isApproved:ACCEPTED }).sort({
      createdAt: -1,
    });
    return {total:filteredAdverts.length ?? 0,data:filteredAdverts} 
  }
  async findOne(where) {
    return Advert.findOne(where)
      .populate('category_id')
      .populate('user_id', 'fullName image_url username email')
      .populate("city_id")
  }
}

module.exports = new AdvertService();

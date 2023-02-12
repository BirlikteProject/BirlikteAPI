const ErrorResponse = require("../scripts/utils/ErrorResponse");
const idChecker = (field) => (req,res,next) => {
    const idField = field || 'id';
    if(!req.params[idField]?.match(/^[0-9a-fA-F]{24}$/)){
        next(new ErrorResponse("You entered an invalid id!",404));
        return;
    }
    next();
}

module.exports=idChecker
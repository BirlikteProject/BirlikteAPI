const validate = (schema)=> (req,res,next) => {

    const {value,error }=schema.validate(req.body);
    if(error){
        const errorMessage=error.details?.map(detail => detail.message).join(", ");
        // console.log(error)
        res.status(400).json({status:false,message:errorMessage,data:null})
        return;
    }
    Object.assign(req,value);
    return next();
    }
    
    module.exports=validate;
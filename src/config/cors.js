
const corsOptions = {
    origin: [
      'http://localhost:5000',
      'http://localhost:3200',
      'http://142.93.106.148:5000',
      'http://142.93.106.148:3200'
    ],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
module.exports=corsOptions;
const express = require("express");
const app=express();
const config = require("./config"); 
const loaders = require("./loaders"); 
const helmet= require("helmet");
const cors = require("cors");
const corsOptions = require("./config/cors");
const mongoSanitize = require('express-mongo-sanitize');

config();
loaders();


const errorHandler = require("./middlewares/Error");


app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.use(helmet());
app.use(cors());
app.use(
  mongoSanitize({
    replaceWith: '_',
  }),
);
//routes
app.use("/api/v1/category",require("./routes/categories"));
app.use("/api/v1/authenticate",require("./routes/auth"));
app.use("/api/v1/advert",require("./routes/adverts"));
app.use("/api/v1/profile",require("./routes/profiles"));
app.use("/api/v1/conversation",require("./routes/conversations"));
app.use("/api/v1/message",require("./routes/messages"));

app.use("/cities",require("./routes/cities"));
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log("Server is running: "+PORT);
  });

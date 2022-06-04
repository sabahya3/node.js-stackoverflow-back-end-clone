/* Database Connect */ 

const mongoose = require("mongoose");

const connectDatabase = () => {
      /* Connection to the database occurs with "mongoose.connect()". Give the database connection link as a parameter. */
      mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true})
      /* If the connection to the database is made, the callback functions will work. */
      .then(()=>{console.log("Veritabanı bağlantısı gerçekleşti.")})
      .catch((err)=>{console.log(err)});
};

module.exports = connectDatabase;
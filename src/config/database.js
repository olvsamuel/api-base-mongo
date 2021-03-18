const mongoose = require('mongoose');
const secrets = require('../core/secrets');

module.exports = {
  connection: () =>{    
    return {
      connect(){
        mongoose.connect(secrets.MONGO_CONN_STRING)
        mongoose.Promise = global.Promise;
      },
      mongo() {
        return mongoose;
      },      
    };
  },
};

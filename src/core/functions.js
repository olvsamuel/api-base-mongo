const secrets = require('./secrets');
const db = require("../config/database");


async function runQuery(query,params){

    const client = db.connection();

    let rows = await client.query(query,params)
  
    return rows;    
}

module.exports = {
    runQuery
}






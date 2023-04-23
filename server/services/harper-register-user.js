var axios = require('axios');

const harperRegisterUser = (username, password) => {
    const dbUrl = process.env.HARPERDB_URL;
    const dbPw = process.env.HARPERDB_PW;
    if (!dbUrl || !dbPw) return null;

    var data = JSON.stringify({
        operation: 'insert',
        schema: 'chat_app',
        table: 'messages',
        //should I add the records to both table?
        records: [
          {  
             
            username,            
            password,
          },
        ],
        
      });

      var config = {
        method: 'post',
        url: dbUrl,
        headers: {
          'Content-Type': 'application/json',
          Authorization: dbPw,
        },
        data: data,
      };

      return new Promise((resolve, reject) => {
        axios(config)
          .then(function (response) {
            resolve(JSON.stringify(response.data));
          })
          .catch(function (error) {
            reject(error);
          });
      });


  
}

module.exports = harperRegisterUser;
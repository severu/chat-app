var axios = require('axios');

const harperGetUsername = (username) => {
    const dbUrl = process.env.HARPERDB_URL;
    const dbPw = process.env.HARPERDB_PW;
    if (!dbUrl || !dbPw) return null;

    let data = JSON.stringify({
        operation: 'sql',
        //get user that matches the username being registered.
        sql: `SELECT username FROM chat_app.messages WHERE username= '${username}'`,
        
      });

      let config = {
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

module.exports = harperGetUsername;
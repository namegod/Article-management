const mysql = require('mysql');

let mysql = require('../config/mysql.json');

var joinData = mysql.createConnection({
    ...mysql
});

// 连接mysql数据
joinData.connect(err => {
    if (err) {
        throw err;
    }
    console.log('connection is successful');
});

function sqlQuery(sql) {
    return new Promise((resolve, reject) => {
        joinData.query(sql, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    })
}
module.exports = sqlQuery;
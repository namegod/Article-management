
let sqlQuery = require('../util/query.js');
let {
    message_err,
    login_success,
    login_fail,
    register_success,
    register_fail,
    upload_success,
    upload_fail,
    update_pass_success,
    update_pass_err,
    update_pass_fail
} = require('../util/resMesssge.js');

const fs = require('fs');

let Usercontroller = {

    login: (req, res) => {
        res.render('login.html');
    },

    updatePass: (req, res) => {
        res.render('updatePass.html');
    },

    loginApi: async (req, res) => {
        let { username, password, last_login } = req.body;

        let sql = `select * from user_admin where username='${username}' and password='${password}'`;
        let result = await sqlQuery(sql);
        console.log(result);
        if (result.length) {

            let userInfo = result[0];
            req.session.userInfo = userInfo;

            let sql2 = `update user_admin set last_login='${last_login}' where username='${username}'`;
            await sqlQuery(sql2);
            res.json(login_success);
        } else {
            res.json(login_fail);
        }
    },

    insertUser: async (req, res) => {

        let { username, password, user_avatar, email, petName } = req.body;
        let sql = `insert into user_admin(username,password, user_avatar, email, petName ) 
        values('${username}','${password}','${user_avatar}','${email}','${petName}')`;
        try {
            var result = await sqlQuery(sql);
            if (result.affectedRows) {
                res.json(register_success);
            } else {
                res.json(register_fail);
            }
        } catch (err) {
            console.log(err);
            res.json(delete_abnormal);
        }
    },


    quitLogin: (req, res) => {

        req.session.destroy(err => {
            if (err) { throw err; }
        })
        res.json({ message: '退出成功' })
    },

    getUserInfor: async (req, res) => {
        let { username } = req.query;
        let sql = `select * from user_admin where username='${username}'`;
        let result = await sqlQuery(sql);

        if (result.length) {
            res.json(result[0]);
        } else {
            res.json(message_err);
        }
    },

    uploadUserAvatar: (req, res) => {

        if (req.file) {
            let { originalname, filename, destination } = req.file;
            let newName = originalname.substring(originalname.lastIndexOf('.'));
            let oldPath = `${destination}${filename}`;
            let newPath = `${destination}${filename}${newName}`;
            fs.rename(oldPath, newPath, err => {
                if (err) throw err;
                upload_success.path = newPath;

                res.json(upload_success);
            })
        } else {
            res.json(upload_fail);
        };
    },


    updateUserAvatar: (req, res) => {

        if (req.file) {
            let { username } = req.query;
            let { originalname, filename, destination } = req.file;
            let newName = originalname.substring(originalname.lastIndexOf('.'));
            let oldPath = `${destination}${filename}`;
            let newPath = `${destination}${filename}${newName}`;
            fs.rename(oldPath, newPath, async (err) => {
                if (err) throw err;

                let sql = `update user_admin set user_avatar='${newPath}' where username='${username}'`;
                let result = await sqlQuery(sql);

                if (result.affectedRows) {
                    upload_success.path = newPath;
                    res.json(upload_success);
                } else {
                    res.json(upload_fail);
                }
            })
        } else {
            res.json(message_err);
        };
    },
    updatePassInfor: async (req, res) => {

        let { oldPassword, newPassword, username } = req.body;
        let sql = `select * from user_admin where username='${username}'`;
        let data = await sqlQuery(sql);
        let pass = data[0].password;

        if (oldPassword == pass) {

            let sql2 = `update user_admin set password='${newPassword}' where username='${username}'`;
            let result = await sqlQuery(sql2);
            if (result.affectedRows) {
                res.json(update_pass_success);
            } else {
                res.json(update_pass_fail);
            }
        } else {
            res.json(update_pass_err);
        }
    }
};


module.exports = Usercontroller;
const express = require('express');
const path = require('path');
const artTemplate = require('art-template');
const express_template = require('express-art-template');

const app = express();

let router = require('./router/router.js');

app.use(express.static(path.join(__dirname)));

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

let session = require('express-session');

let options = {
    name: "LUOZHIKANG", 
    secret: "!@#$%^&*(LUO)",
    cookie: {
        httpOnly: true,
        secure: false, 
        maxAge: 60000 * 10, 
    }
};
app.use(session(options));

app.set('views', __dirname + '/views/');


app.engine('html', express_template);

app.set('view engine', 'html');

app.use(function(req, res, next) {
    let path = req.path.toLowerCase(); 
    let noSession = ['/login', '/loginApi', '/insertUser'] 
    if (noSession.includes(path)) {
  
        next();
    } else {
     
        if (req.session.userInfo) {
       
            next();
        } else {
       
            res.redirect('/login');
        }
    }
});

app.use(router);

app.listen(4567, () => {
    console.log('server is running at port 4567')
});
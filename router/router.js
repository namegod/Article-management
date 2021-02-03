const express = require('express');
const multer = require('multer');
const path = require('path');

var image = multer({ dest: 'image/' });

var user_avatar = multer({ dest: 'user_avatar/' });

let router = express.Router();

let Sortcontroller = require('../controller/Sortcontroller.js');

let Articlecontroller = require('../controller/Articlecontroller.js');

let Usercontroller = require('../controller/Usercontroller.js');

router.get(/^\/$|^\/admin$/, Sortcontroller.admin); 

router.get('/getSingleData', Sortcontroller.getSingleData); 

router.post('/editSingData', Sortcontroller.editSingData);

router.get('/article', Articlecontroller.article); 

router.get('/sort', Sortcontroller.sort); 

router.get('/getSort', Sortcontroller.getSort); 

router.post('/deleteSort', Sortcontroller.deleteSort); 

router.get('/addSortTable', Sortcontroller.addSortTable);

router.post('/insertSortTable', Sortcontroller.insertSortTable); 

router.get('/updateSortTable', Sortcontroller.updateSortTable); 

router.post('/deleteArticle', Articlecontroller.deleteArticle); 

router.get('/getArticle', Articlecontroller.getArticle); 

router.get('/addArticleTable', Articlecontroller.addArticleTable); 

router.post('/coverApi', image.single('file'), Articlecontroller.coverApi); 

router.post('/insertArcontent', Articlecontroller.insertArcontent); 

router.get('/updateArticleTable', Articlecontroller.updateArticleTable);    

router.get('/getArticleSort', Articlecontroller.getArticleSort); 

router.get('/getArticleSingleData', Articlecontroller.getArticleSingleData); 

router.post('/updateSingArtile', Articlecontroller.updateSingArtile); 

router.get('/login', Usercontroller.login); 

router.get('/updatePass', Usercontroller.updatePass); 

router.post('/loginApi', Usercontroller.loginApi); 

router.get('/quitLogin', Usercontroller.quitLogin); 

router.post('/insertUser', Usercontroller.insertUser); 

router.get('/getStatistic', Articlecontroller.getStatistic); 

router.get('/getMonthlyArt', Articlecontroller.getMonthlyArt);

router.get('/getUserInfor', Usercontroller.getUserInfor);

router.post('/uploadUserAvatar', user_avatar.single('user_avatar'), Usercontroller.uploadUserAvatar); 

router.post('/updateUserAvatar', user_avatar.single('user_avatar'), Usercontroller.updateUserAvatar);

router.post('/updatePassInfor', Usercontroller.updatePassInfor); 


router.get('/', (req, res) => {
    res.render('userInfor.html')
});

module.exports = router;

let sqlQuery = require('../util/query.js');
let {
    message_err,
    delete_success,
    delete_fail,
    delete_abnormal,
    insert_success,
    insert_fail,
    getData_fail,
    update_success,
    update_fail,
    upload_success,
    upload_fail
} = require('../util/resMesssge.js');

const fs = require('fs');

let Sortcontroller = {
    admin: (req, res) => {
        res.render('admin.html');
    },
    
    sort: (req, res) => {
        res.render('sort.html');
    },
    getSort: async(req, res) => {
        let sql = 'select * from article_sort order by rank';
        let result = await sqlQuery(sql);
        res.json(result);
    },
    deleteSort: async(req, res) => {
        var response;
        let { article_id } = req.body;

        if (!article_id) {
            res.json(message_err);
        } else {
            let mysql = `delete from article_sort where article_id=${article_id}`;
            try {
                var result = await sqlQuery(mysql);
                if (result.affectedRows) {
                    response = delete_success;
                } else {
                    response = delete_fail;
                }
            } catch (err) {
                console.log(err);
                response = delete_abnormal;
            }
        };
        res.json(response);
    },

    addSortTable: (req, res) => {
        res.render('addSortTable.html');
    },

    insertSortTable: async(req, res) => {
        let { category, rank, add_time } = req.body;
        let sql = `insert into article_sort(category,rank,add_time) values('${category}',${rank},'${add_time}')`;
        try {
            var result = await sqlQuery(sql);
            if (result.affectedRows) {
                response = insert_success;
            } else {
                response = insert_fail;
            }
        } catch (err) {
            console.log(err);
            response = delete_abnormal;
        }
        res.json(response);
    },

    updateSortTable: (req, res) => {
        res.render('updateSortTable.html');
    },

    getSingleData: async(req, res) => {
        let { article_id } = req.query;
        if (!article_id) {
            res.json(message_err);
            return;
        }
        let sql = `select * from article_sort where article_id=${article_id}`;
        let result = await sqlQuery(sql);
        if (result.length) {
            result[0].errcode = 0;
            res.json(result[0]);
        } else {
            res.json(getData_fail);
        }
    },

    editSingData: async(req, res) => {

        let { category, rank, add_time, article_id } = req.body;
        if (!article_id) {
            res.json(message_err);
            return;
        }
        let sql = `update article_sort set category='${category}',rank=${rank},add_time='${add_time}' where article_id=${article_id}`;
        try {
            var result = await sqlQuery(sql);
            if (result.affectedRows) {
                response = update_success;
            } else {
                response = update_fail;
            }
        } catch (err) {
            console.log(err);
            response = delete_abnormal;
        }
        res.json(response);
    },
 
    article: (req, res) => {
        res.render('article.html');
    },

    getArticle: async(req, res) => {
        let sql = 'select * from articles';
        let result = await sqlQuery(sql);

        res.json(result);
    },

    deleteArticle: async(req, res) => {
        var response;
        let { article_id } = req.body;

        if (!article_id) {
            res.json(message_err);
        } else {
            let mysql = `delete from articles where article_id=${article_id}`;
            try {
                var result = await sqlQuery(mysql);
                if (result.affectedRows) {
                    response = delete_success;
                } else {
                    response = delete_fail;
                }
            } catch (err) {
                console.log(err);
                response = delete_abnormal;
            }
        };
        res.json(response);
    },
    addArticleTable: (req, res) => {
        res.render('addArticleTable.html');
    },
    coverApi: (req, res) => {
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

    insertArcontent: async(req, res) => {
        let { title, author, content, sort, cover, status, release_time } = req.body;
        let sql = `insert into articles(title,author,content,sort,cover,status,release_time) 
        values('${title}','${author}','${content}','${sort}','${cover}','${status}','${release_time}')`;
        try {
            var result = await sqlQuery(sql);
            if (result.affectedRows) {
                response = insert_success;
            } else {
                response = insert_fail;
            }
        } catch (err) {
            console.log(err);
            response = delete_abnormal;
        }
        res.json(response);
    },

    updateArticleTable: (req, res) => {
        res.render('updateArticleTable.html');
    },

    getArticleSingleData: async(req, res) => {
        let { article_id } = req.query;
        if (!article_id) {
            res.json(message_err);
            return;
        }
        let sql = `select * from articles where article_id=${article_id}`;
        let result = await sqlQuery(sql);
        if (result.length) {
            result[0].errcode = 0;
            res.json(result[0]);
        } else {
            res.json(getData_fail);
        }
    },

    updateSingArtile: async(req, res) => {

        let { title, author, content, sort, cover, status, release_time, article_id } = req.body;
        if (!article_id) {
            res.json(message_err);
            return;
        }
        let sql = `update articles set title='${title}',author='${author}',content='${content}',sort='${sort}',cover='${cover}',status='${status}',release_time='${release_time}' where article_id=${article_id}`;
        try {
            var result = await sqlQuery(sql);
            if (result.affectedRows) {
                response = update_success;
            } else {
                response = update_fail;
            }
        } catch (err) {
            console.log(err);
            response = delete_abnormal;
        }
        res.json(response);
    }
};


module.exports = Sortcontroller;
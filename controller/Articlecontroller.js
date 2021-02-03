
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

let Articlecontroller = {

    article: (req, res) => {
        res.render('article.html');
    },

    getArticle: async (req, res) => {
        let { page, limit: pagesize } = req.query;
        let initial = (page - 1) * pagesize;
        let sql = `select t1.*,t2.category from articles t1 left join article_sort t2 on t1.sort_id = t2.sort_id order by sort_id limit ${initial}, ${pagesize}`;
        let sql2 = 'select count(*) as count from articles';
        let promise1 = sqlQuery(sql2);
        let promise2 = sqlQuery(sql);

        let data = await Promise.all([promise1, promise2]);
        let result = {
            code: 0,
            count: data[0][0].count,
            msg: '',
            data: data[1]
        };
        res.json(result);
    },
    deleteArticle: async (req, res) => {
        let { article_id, oldCover } = req.body;
        if (!article_id) {
            res.json(message_err);
        } else {
            let mysql = `delete from articles where article_id=${article_id}`;
            try {
                var result = await sqlQuery(mysql);
                if (result.affectedRows) {
                    res.json(delete_success);
                    oldCover && fs.unlinkSync(oldCover);
                } else {
                    res.json(delete_fail);
                }
            } catch (err) {
                console.log(err);
                res.json(delete_abnormal);
            }
        };

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
    insertArcontent: async (req, res) => {
        let { title, author, content, sort_id, cover, status, release_time } = req.body;
        let statusObj = {
            '已发布': 1,
            '未发布': 0
        }
        let sql = `insert into articles(title,author,content,sort_id,cover,status,release_time) 
        values('${title}','${author}','${content}','${sort_id}','${cover}','${statusObj[status]}','${release_time}')`;
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
    getArticleSort: async (req, res) => {
        let sql = `select * from article_sort`;
        let result = await sqlQuery(sql);
        res.json(result);
    },
    getArticleSingleData: async (req, res) => {
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
    updateSingArtile: async (req, res) => {
        let { title, content, sort_id, cover, status, article_id, oldCover } = req.body;
        if (!article_id) {
            res.json(message_err);
            return;
        }
        var sql;
        if (cover) {
            sql = `update articles set title='${title}',content='${content}',sort_id='${sort_id}',cover='${cover}',status='${status}' where article_id=${article_id}`;
        } else {
            sql = `update articles set title='${title}',content='${content}',sort_id='${sort_id}',status='${status}' where article_id=${article_id}`;
        };
        try {
            var result = await sqlQuery(sql);
            if (result.affectedRows) {
                cover && fs.unlink(oldCover, (err) => {
                    if (err) throw err;
                    console.log('已成功地删除文件');
                });
                res.json(update_success);
            } else {
                res.json(update_fail);
            }
        } catch (err) {
            console.log(err);
        }
    },

    getStatistic: async (req, res) => {

        let sql = `select count(*) total ,t2.category,t1.sort_id from articles t1 left join article_sort t2 on t1.sort_id = t2.sort_id group by t1.sort_id`;
        let data = await sqlQuery(sql);

        res.json(data);
    },

    getMonthlyArt: async (req, res) => {

        let sql = 'select month(release_time) month,count(*) as total from articles where year(release_time) = year(now()) group by month(release_time)';
        let data = await sqlQuery(sql);

        res.json(data);
    }
};

module.exports = Articlecontroller;
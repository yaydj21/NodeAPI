// 导入数据库操作模块
const db = require('../db/index');

// 导入bcryptjs
const bcryptjs = require('bcryptjs');

// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken');
// 导入全局的配置文件
const config = require('../config');

// 注册新用户
exports.regUser = (req, res) => {
    // 获取客户端提交到服务器的用户信息
    const userinfo = req.body;
    // 对表单的数据,进行合法性校验
    // if (!userinfo.username || !userinfo.password) {
    //     console.log(userinfo);
    //     return res.send({ status: 1, message: '用户名或密码不合法' });
    // }

    
    // 定义sql语句,查询用户名是否被占用
    const sqlStr = 'select * from ev_users where username=?';
    db.query(sqlStr, userinfo.username, (err, results) => {
        // 执行sql语句失败
        if (err) {
            // return res.send({ status: 1, message: err.message });
            return res.cc(err.message);
        }

        // 判断用户名是否被占用 查询出来的是数组 如果被占用了 查询出来的数组长度肯定大于0
        if (results.length > 0) {
            // return res.send({ status: 1, message: '用户名被占用，请更换其他用户名！' })
            return res.cc('用户名被占用，请更换其他用户名！');
        }
        // 调用bcryptjs.hashSync()对密码加密
        userinfo.password = bcryptjs.hashSync(userinfo.password, 10);
        // 定义插入新用户的sql语句
        const sql = 'insert into ev_users set ?';
        db.query(sql, {username:userinfo.username, password:userinfo.password}, (err, results) => {
            // if (err) {
            //     return res.send({ status: 1, message: err.message });
            // }
            if(err){
                return res.cc(err.message);
            }
            // 判断影响行数是否为1
            // if (results.affectedRows !== 1) {
            //     return res.send({ status: 1, message: '注册用户失败,请稍后再试!' });
            // }
            if(results.affectedRows !== 1){
                return res.cc('注册用户失败,请稍后再试!');
            }
            // 注册用户成功
            // res.send({status:0,message:'注册成功'});
            res.cc('注册成功',0);
        })

    })

}

// 登陆处理
exports.login = (req, res) => {
    // 接受表单的数据
    const userinfo = req.body;
    // 定义SQL语句
    const sql = `select * from ev_users where username=?`;
    // 执行SQL语句，根据用户名查询用户的信息
    db.query(sql,userinfo.username,(err,results) =>{
        // 执行SQL语句失败
        if(err){
            return res.cc(err);
        }
        // 执行SQL语句成功，但是获取到的数据条数不等于1
        if(results.length !== 1){
            return res.cc('登录失败');
        }
        // TODO：判定密码是否正确
        const compareResult  = bcryptjs.compareSync(userinfo.password,results[0].password);
        if(!compareResult){
            return res.cc('登录失败！');
        }
        // TODO:在服务器端生成Token的字符串
        const user = {...results[0], password:'',user_pic:''};
        // 对用户的信息进行加密，生成Token字符串
        const tokenStr = jwt.sign(user,config.jwtSecretKey,{expiresIn:config.expiresIn});
        res.send({
            status:0,
            message:'登录成功',
            token: 'Bearer ' + tokenStr,
        });
    });
}
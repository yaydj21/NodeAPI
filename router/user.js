// 导入express
const express = require('express');

// 创建router对象
const router = express.Router();

// 导入用户路由处理函数对应模块
const userhandler = require('../router_handler/user')

// 1.导入验证数据的中间件
const expressJoi = require('@escook/express-joi');
// 2.导入需要的验证规则对象
const {reg_login_schema} = require('../schema/user');

// 注册新用户
router.post('/reguser',expressJoi(reg_login_schema),userhandler.regUser);

// 登陆
router.post('/login',expressJoi( reg_login_schema ),userhandler.login);

module.exports = router;    
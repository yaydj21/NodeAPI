// 导入定义验证规则的模块
const joi = require('joi');

// 定义name和alias的校验规则
const name = joi.string().required();
const alias = joi.string().alphanum().required();
// 定义分类id的校验规则
const id = joi.number().integer().min(1);

// 向外共享验证规则对象
// 校验规则对象 - 添加分类
exports.add_cate_schema ={
    body:{
        name,
        alias,
    }
}

// 校验规则对象 - 删除分类
exports.delete_cate_schema ={
    params:{
        id
    }
}

// 校验规则对象 - 根据Id获取分类
exports.get_cate_schema = {
    params:{
        id,
    }
}
// 校验规则对象 - 更新分类
exports.update_cate_schema ={
    body:{
        Id:id,
        name,
        alias,
    }
}
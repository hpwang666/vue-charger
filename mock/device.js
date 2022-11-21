//util.js


  
  module.exports = [
    // user login
    {
        url: '/getAllDevice',
        type: 'post',
        response: _ => {
          return {
            code: 20004,
            data: {
              "id": "@id()",
              "username": "@cname()",
              "date": "@date()",
              "avatar": "@image('200x200','red','#fff','avatar')",
              "description": "@paragraph()",
              "ip": "@ip()",
              "email": "@email()",
              "array|10": ["@integer(100,103)"],
            }
          }
        }
      },
    {
      url: '/admin/category/all',
      type: 'post',
      response: _ => {
        return {
          code: 20004,
          data: {
            "array|20": [{ "id": "@id()",
            "cateName": "@cname()",
            "date": "@date()",
          "onLine":"@onOffLine"}],
          }
        }
      }
    },
    {
      url: '/admin/category/update',
      type: 'post',
      response: _ => {
        return {
          status: 20000,
          data: '更新成功'
        }
      }
    },
    {
      url: '/admin/category/create',
      type: 'post',
      response: _ => {
        return {
          status: 20000,
          data: '添加成功'
        }
      }
    },
    {
      url: '/admin/category/delete',
      type: 'post',
      response: _ => {
        return {
          status: 20000,
          data: '删除成功'
        }
      }
    }
  ]
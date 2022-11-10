//util.js

  
  module.exports = [
    // user login
    
    {
      url: '/admin/city/all',
      type: 'post',
      response: _ => {
        return {
          code: 20004,
          data: {
            "array|20": [{ 
              "id":"@id",
            "cateName": "@cname()",
            "date": "@date('yyyy-MM-dd HH:mm:ss')"}],
          }
        }
      }
    },
    {
      url: '/admin/city/update',
      type: 'post',
      response: _ => {
        return {
          status: 20000,
          data: '更新成功'
        }
      }
    },
    {
      url: '/admin/city/create',
      type: 'post',
      response: _ => {
        return {
          status: 20000,
          data: '添加成功'
        }
      }
    },
    {
      url: '/admin/city/delete',
      type: 'post',
      response: _ => {
        return {
          status: 20000,
          data: '删除成功'
        }
      }
    },
    {
      url: '/vue-element-admin/org/userList',
      type: 'post',
      response: _ => {
        return {
          code: 20000,
          data: {
            "array|8": [{ 
             "userAccount":"@name",
             "userName": "@cname()",
             "phone":/^1[385][1-9]\d{8}/,
            "lastLogin": "@date('yyyy-MM-dd HH:mm:ss')",
          "createTime": "@date('yyyy-MM-dd HH:mm:ss')"
          }],
          }
        }
      }
    },
  ]
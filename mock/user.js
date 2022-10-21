//util.js

const tokens = {
    admin: {
      token: 'admin-token'
    },
    editor: {
      token: 'editor-token'
    }
  }
  const depart={
    options: [{
      value: '湖北',
      label: '指南',
      children: [{
        value: '宜昌市',
        label: '设计原则',
        children: [{
          value: '西陵区',
          label: '侧向导航',
          children: [{
            value: '泛海巨涛',
            label: '公司'
          }]
        }]
      },
      {
        value: 'dingbudaohang',
        label: '顶部导航',
          children: [{
          value: 'yizhi',
          label: '一致'
        }]
      }]
    },
    {
      value: 'diyilan',
      label: '第一栏'
    }
  ]
}
 
  
  const users = {
    'admin-token': {
      roles: ['admin'],
      introduction: 'I am a super administrator',
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      name: 'Super Admin'
    },
    'editor-token': {
      roles: ['editor'],
      introduction: 'I am an editor',
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      name: 'Normal Editor'
    }
  }
  
  module.exports = [
    // user login
    {
      url: '/vue-element-admin/user/login',
      type: 'post',
      response: config => {
        const { username } = config.body
        const token = tokens[username]
        // mock error
        if (!token) {
          return {
            code: 60205,
            message: 'Account and password are incorrect.'
          }
        }
  
        return {
          code: 20000,
          data: token.token
        }
      }
    },
   
    // get user info
    {
      url: '/vue-element-admin/user/info',
      type: 'get',
      response: config => {
        const { token } = config.query
        const info = users[token]
        console.log(token,config.query);
        // mock error
        if (!info) {
          return {
            code: 50008,
            message: 'Login failed, unable to get user details.'
          }
        }
  
        return {
          code: 20000,
          data: [info,depart]
        }
      }
    },
   
    // user logout
    {
      url: '/vue-element-admin/user/logout',
      type: 'get',
      response: _ => {
        console.log('logout');
        return {
          code: 20000,
          data: '更新成功'
        }
      }
    },
    {
        url: '/vue-element-admin/user/fuck',
        type: 'post',
        response: _ => {
          return {
            code: 20004,
            data: {
              "userid": "@id()",
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
      } ,
      {
        url: '/chart',
        type: 'post',
        response: _ => {
          return {
            code: 20004,
            data: {
              "array|12": ["@integer(2000,3000)"
            ],
            }
          }
        }
      },
      {
        url: '/log',
        type: 'post',
        response: _ => {
          return {
            code: 20004,
            data: {
              "array|12": [{"ip": "@ip()", "name": "@cname()","date": "@date()","op":"登录"}
            ],
            }
          }
        }
      }
  ]
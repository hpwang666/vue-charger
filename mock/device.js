//util.js

const rates={
  id:'1212234',
  phone: '13545842564',
  address: '湖北宜昌市西陵区南湖大道23号',
  data1:'',
  rates:[
    {name:'尖',data0:'0.8',data1:'0.4'},
    {name:'峰',data0:'1.1',data1:'0.4'},
    {name:'平',data0:'1.0',data1:'0.4'},
    {name:'谷',data0:'0.3',data1:'0.4'}
  ],
  timeQuantum:[
    {
      startTime:'0:00',
      endTime:'22:00',
      rate:'1'          
    },
    {
      startTime:'22:00',
      endTime:'23:00',
      rate:'0'          
    }

  ],
  row_last_startTime:"23:00",
  row_last_endTime:'24:00',
  row_last_rate:'2',
  desc: '第一个充电桩'
}
  
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
    },
    {
      url: '/vue-element-admin/dev/chargerList',
      type: 'post',
      response: config => {
        console.log(config.query)
        return {
          code: 20000,
          data: {
            "array|8": [{ 
              "id":"@id",
             "rate":"1.00元/度",
             "onLine":"@onOffLine",
             "slots":"1",
             "phone":/^1[385][1-9]\d{8}/,
            "address":"@city(true)" 
          }],
          }
        }
      }
    },
    {
      url: '/vue-element-admin/dev/genId',
      type: 'get',
      response: _ => {
        return {
          code: 20000,
          data: {id:'1234567'}
          }
        }
    },
    {
      url: '/vue-element-admin/dev/getRateById',
      type: 'get',
      response: _ => {
        return {
          code: 20000,
          data: rates
          }
        }
    },
    {
      url: '/vue-element-admin/dev/chargerAdd',
      type: 'post',
      response: config => {
        console.log(config.body)
        return {
          code: 20000,
          data: '好了',
          }
        }
    }
    

  ]
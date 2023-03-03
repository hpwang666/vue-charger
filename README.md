# vue-charger

这是基于vue2.6  以及elemen-ui的一个后台管理框架
目前支持权限菜单管理，登录管理，动态路有权限
支持部门的选择
dev 里面也是设置了环境变量的--development
```
npm install
npm run dev
```


打包,这里使用env-cross 来设置环境变量 分别为 process.env.NODE_ENV = testing/production

```
npm run build--test 
npm run build--prod
```

支持压缩打包，需要安装
```
npm install compression-webpack-plugin@1.1.12 --save-dev

```

无论是打包还是测试，都只需要更改config里面对应JS 里面的BASE_URL即可
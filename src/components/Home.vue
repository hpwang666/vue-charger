<template>
  <el-container class="home_container">
    <el-header height=90px>
      <div class="home_title" color = "#000">大连杂货码头公司能耗管理系统</div>
    
      <div class="user_depart" >
        <i v-if="value[0]" class="el-icon-map-location" ></i>
        {{ value[0]}}  
        <i v-if="value[1]" class="el-icon-office-building" ></i>
        {{ value[1]}}  
          <i v-if="value[2]" class="el-icon-office-building" ></i>
        {{ value[2]}}  
          <i v-if="value[3]" class="el-icon-s-home" ></i>
        {{ value[3]}}
        
      </div>
      <el-dialog
        title="车场选择"
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="handleClose">
        
       <div class="depark—block">
        <span>车场 </span>
        <el-cascader
          v-model="value"
          :options="options"
          :props="{ expandTrigger: 'hover' }"
          @change="handleChange"></el-cascader>
      </div>
      
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <div class="home_userinfoContainer">
      
        <el-dropdown @command="handleCommand">
            

        <span class="el-dropdown-link home_userinfo">
          {{currentUserName}}<i class="el-icon-arrow-down el-icon--right home_userinfo"></i>
        </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="sysMsg">系统消息</el-dropdown-item>
            <el-dropdown-item command="MyHome">个人主页</el-dropdown-item>
            <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button class="home_exchange_button" icon="el-icon-sort" type="primary" size="mini"  @click="dialogVisible = true">切换</el-button>
      </div>
      
    </el-header>


    <el-container>
      <el-aside width="210px">
        <el-menu
          default-active="0"
          class="el-menu-vertical-demo" style="background-color: #304156" text-color="#ECECEC" active-text-color="#ffd04b" router>
          <template v-for="(item,index) in permission_routes">
            <template v-if="!item.hidden">
            <el-submenu :index="index+''" v-if="item.children.length>1" :key="index" class="ddd">
              <template slot="title" >
                <i :class="item.iconCls"></i>
                <span >{{item.name}}</span>
              </template>
              <el-menu-item v-for="child in showItems(item.children)"  :index="item.path+'/'+child.path" :key="child.path">
                  {{child.name}}
              </el-menu-item>
            </el-submenu>
            <template v-else>
              <el-menu-item :index="item.path+'/'+item.children[0].path" :key=index>
                <i :class="item.children[0].iconCls"></i>
                <span slot="title">{{item.children[0].name}}</span>
              </el-menu-item>
            </template>
            </template>
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/dataView' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-text="this.$router.currentRoute.name"></el-breadcrumb-item>
          </el-breadcrumb>
         
            <router-view></router-view>
         
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
   import { mapGetters } from 'vuex'

  export default{
    computed: {
      ...mapGetters(['name','depart','permission_routes'])
   
    },
    methods: {
      handleCommand(command){
        var _this = this;
        if (command == 'logout') {
          this.$confirm('注销登录吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(function () {
           _this.$store.dispatch('user/logout').then(()=>{
               _this.currentUserName = '游客';
              _this.$router.replace({path: '/login'});
           }).catch(() => {
             _this.$alert('注销失败');
            });
      
          }, function () {
            //取消
          })
        }
      },
      handleChange(value){
        console.log(value.length)
      },
      showItems(value) {
            return value.filter(function(item){
              return !item.hidden;
            });
    }
    },
    mounted: function () {
      var _this = this;
     
      this.$store.dispatch('user/getInfo').then((resp)=> {
          _this.currentUserName = this.name;
          this.options = this.depart;

          var _depart = this.depart[0];
          var i=0;
          while(true)
          {
              this.value[i]=_depart.value;
              i++;
              if(_depart.hasOwnProperty('children'))
              _depart=_depart.children[0];
              else break;
          }
                

        }).catch(() => {
             _this.$alert('获取用户信息失败');
      });
    },
    data(){
      return {
        currentUserName: '',
        dialogVisible: false,
        value:[],
        options:[]
      }
    }
  }
</script>
<style>
  .home_container {
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
  }

  .el-header {
    background-color: #1f2d3d;
    color: #333;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .home_exchange_button{
  margin-top:10px;
   margin-right: 20px;
  }

  .el-aside {
    background-color: #304156 !important;
  }
 
 .el-submenu .el-menu-item {
      background-color: #1f2d3d !important;
 }
.el-menu-item:hover{
    background-color: #263445 !important;
}

 .el-submenu__title:hover {
  background: #263445 !important;
}
 

.el-menu-item.is-active {
   background-color: rgb(23, 112, 221) !important;
}


  .el-main {
    
    color: #000;
    text-align: center;
  }

  .home_title {
    color: #fff;
    font-size: 25px;
    display: inline;
  }

  .home_userinfo {
    color: #fff;
    cursor: pointer;
   
  }
  .user_depart{
    
    position:absolute;
    right:200px;
    padding-top:45px;
    padding-bottom: 6px;
    color: #fff;
    
  }
  .el-cascader-menu{
    height: 200px;
  }


  .home_userinfoContainer {
    display: flex;
    flex-direction: column;
    
    
    position:absolute;
    right:0;
  }
</style>

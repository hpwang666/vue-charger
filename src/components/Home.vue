<template>
  <el-container class="home_container">
    <el-header height=90px>
      <div class="home_title" color = "#000">易路充充电管理系统</div>
    
      <div class="user_depart" >
        <i v-if="selectedPark[0]" class="el-icon-map-location" ></i>
        {{ selectedPark[0]}}  
        <i v-if="selectedPark[1]" class="el-icon-office-building" ></i>
        {{ selectedPark[1]}}  
          <i v-if="selectedPark[2]" class="el-icon-office-building" ></i>
        {{selectedPark[2]}}  
          <i v-if="selectedPark[3]" class="el-icon-s-home" ></i>
        {{ selectedPark[3]}}
        
      </div>
      <el-dialog
        title="充电站选择"
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="handleClose">
        
       <div class="depark—block">
        <span>充电站 </span>
        <el-cascader
          v-model="value"
          :options="options"
          :props="{ expandTrigger: 'hover' }"
          @change="handleChange"></el-cascader>
      </div>
      
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="hangleSelectionConfirm">确 定</el-button>
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
        <div class="home_exchange_button">
        <el-button  icon="el-icon-sort" type="primary" size="mini"  @click="dialogVisible = true">切换</el-button>
        </div>
      </div>
      
    </el-header>


    <el-container>
      <el-aside width="210px">
        <el-menu
          default-active="0"
          class="el-menu-vertical-demo" style="background-color: #304156" text-color="#ECECEC" active-text-color="#ffd04b" router>
          <template v-for="(item,index) in permission_routes">
            <template v-if="!item.hidden">
              <el-menu-item v-if="hasOneShowingChild(item.children,item)" :index="item.path+'/'+item.children[0].path" :key=index>
                <i :class="item.children[0].iconCls"></i>
                <span slot="title">{{item.children[0].name}}</span>
              </el-menu-item>   
              <template v-else>

                <el-submenu :index="index+''"  :key="index" class="ddd">
                  <template slot="title" >
                  <i :class="item.iconCls"></i>
                  <span >{{item.name}}</span>
                  </template>
                <el-menu-item v-for="child in showItems(item.children)"  :index="item.path+'/'+child.path" :key="child.path">
                  {{child.name}}
                </el-menu-item>
                </el-submenu>
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
      ...mapGetters(['name','depart','departTree','permission_routes','stationId'])
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
      hangleSelectionConfirm(){
        
        if(this.value.length == 4){
          this.selectedPark = this.value;
          this.dialogVisible = false;
          this.$store.commit('station/SET_STATION_ID', this.value[3]);   
         
          this.findIdByName(this.departTree,this.value[3]);
         //console.log(this.stationId)
        }
        else{
          this.$alert('请选择一个充电站');
        }
      },
      findIdByName(departs,stationName){
        departs.forEach(element => {
          if(element.orgCategory===4&& element.value===stationName) {
           this.$store.commit('station/SET_STATION_ID', element.key);  
          }
          if(element.hasOwnProperty('children')&&element.children!=null )
          {
              this.findIdByName(element.children,stationName);
          }
          return;
        });
      },
      hasOneShowingChild(children = [], parent) {
        //当只有一个可显示的children时候，就不再显示父目录，而此时可以显示图标，
        //但是当多个子目录时是不会显示图标的
        var _this=this
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          _this.onlyOneChild = item

          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
       
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
      handleChange(value){
        //console.log(value.length)
      },
      handleClose()
      {},
      showItems(value) {
            return value.filter(function(item){
              return !item.hidden;
            });
    }
    },
    mounted: function () {
      var _this = this;
     
      this.$store.dispatch('user/getInfo').then(()=> {
          _this.currentUserName = _this.name;
        }).catch(() => {
             _this.$alert('获取用户信息失败');
      });

      this.$store.dispatch('user/getDepartTree').then(()=> {
        
        _this.options = _this.departTree;
        var _depart = _this.departTree[0];
        var i=0;
        while(true)
        {
            _this.selectedPark[i]=_depart.value;
            i++;
            if(_depart.hasOwnProperty('children')&&_depart.children!=null )
            _depart=_depart.children[0];
            else break;
        }

        //如果是完整的即包含了电站ID ，那么就进行存储更新
        if(i==4){
            _this.$store.commit('station/SET_STATION_ID', _depart.key);   
            console.log("存储ID: "+_this.stationId)

        }
            
      }).catch((e) => {
            _this.$alert('获取用户部门树失败'+e);
      });
    },
    data(){
      return {
        currentUserName: '',
        dialogVisible: false,
        value:[],
        selectedPark:[],
        options:[],
        onlyOneChild:null
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
      margin-top:20px;
   margin-right: 25px;
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
    margin-right: 18px;
    
   
  }
</style>

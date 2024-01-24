<template>
  <el-container class="home_container">
    <el-header height=90px>
      <div class="home_title" color = "#000">{{homeTitle}}</div>
    
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
        class="dialogClass">
       <div class="el-dialog-div">
          <el-row :gutter="20">
            
            <el-col :span=22>
              <el-cascader
            id="el-cascader"
            v-model="value"
            :options="options"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange"></el-cascader>
            </el-col>
          </el-row>
          
          <el-row>
            <el-col :span=8 :offset="17">
            <el-button size="small" @click="dialogVisible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="hangleSelectionConfirm">确 定</el-button>
            </el-col>
            
          </el-row>
          
       </div>
         
       
      </el-dialog>

      <div class="home_userinfoContainer">
      
        <el-dropdown @command="handleCommand">
            

        <span class="el-dropdown-link home_userinfo">
          {{currentUserName}}<i class="el-icon-arrow-down el-icon--right home_userinfo"></i>
        </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="sysMsg">系统消息</el-dropdown-item>
            <el-dropdown-item command="modify">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="home_exchange_button">
        <el-button  icon="el-icon-sort" type="primary" size="mini"  @click="handleEx">切换</el-button>
        </div>
      </div>
      
    </el-header>


    <el-container class="el-aside-container">
      <el-aside width="210px">
        <el-menu
          default-active="0"
          :unique-opened="true"
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


      
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/dataView' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-text="this.$router.currentRoute.name"></el-breadcrumb-item>
          </el-breadcrumb>
         
          <div class="rview">
          <router-view></router-view>
        </div>

         <el-dialog class ="dialogClass" title="修改密码" :visible.sync="passwdVisible" width="400px">
          <el-form ref="modifyForm" :rules="rulesMap" :model="temp" label-position="right" size="mini" label-width="80px" style="width: 100%">
      
         <el-form-item label="密码" prop="passwd">
          <el-input type="password" v-model="temp.passwd" />
        </el-form-item>
          <el-form-item label="重复密码" prop="repasswd">
          <el-input type="password" v-model="temp.repasswd" />
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="passwdVisible = false">
          取消
        </el-button>
        <el-button  size="small" type="primary" @click="handleConfirmPasswd">
          确认
        </el-button>
      </div>
    </el-dialog>
         
        </el-main>
     
    </el-container>
  </el-container>
</template>
<script>
   import { mapGetters } from 'vuex'
   import { getSelection, setSelection, removeSelection } from '@/utils/auth'
   import request from '@/utils/request'

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
        if(command=='modify'){
          this.handlemodifyPasswd();
        }
      },
      hangleSelectionConfirm(){
        
        if(this.value.length == 4){
          this.selectedPark = this.value;
          this.dialogVisible = false;
          
          console.log("存储ID_1: "+this.value[3]+" 名称_1:"+this.value[3])  
         
          this.findIdByName(this.departTree,this.value[3]);
          setSelection(this.value);
          
        }
        else{
          this.$alert('请选择一个充电站');
        }
      },
      findIdByName(departs,stationName){
        departs.forEach(element => {
          if(element.orgCategory===4&& element.value===stationName) {
           this.$store.commit('station/SET_STATION_ID', element.key);  
           this.$store.commit('station/SET_STATION_NAME', element.value); 
           console.log("存储ID_2: "+element.key+" 名称_2:"+element.value)  
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
        
      },
      handleClose()
      {},
      showItems(value) {
            return value.filter(function(item){
              return !item.hidden;
            });
    },
   
    handleEx(){
      this.options = this.departTree;
      this.dialogVisible=true;
    },
     handlemodifyPasswd(){
      this.passwdVisible=true;
      this.temp={};
       
    },
    handleConfirmPasswd(){
      
      let _this = this;
      this.$refs['modifyForm'].validate((valid) => {
        if (valid) {
          request({
            url: '/sys/user/modifyPassword',
            method: 'get',
            params:{
              password:_this.temp.passwd
            }
          }).then(resp=> {
            _this.$message({
              type: 'success',
              message: resp.result
            });
            this.passwdVisible=false;
        
          }).catch(()=>{
            _this.$message({
              type: 'error',
              message: '加载失败'
            });
          });
          }
      })
    },
    treeFind (tree, func) {
      for (const data of tree) {
        if (func(data)) return data
        if (data.children) {
          const res = this.treeFind(data.children, func)
          if (res) return res
        }
      }
      return null
    },
    treeFindPath (tree, func,path=[]) {
        if (!tree) return []
        for (const node of tree) {
          path.push(node.value)
          if (func(node)) return path
          if (node.children) {
            const findChildren = this.treeFindPath(node.children,func, path)
            if (findChildren.length) return findChildren
          }
          path.pop()
        }
        return []
      }
    },
    mounted: function () {
      var _this = this;
     this.homeTitle=process.env.NODE_ENV=='development'?'大连杂货码头电源管理系统':'易路充充电管理系统';
      this.$store.dispatch('user/getInfo').then(()=> {
          _this.currentUserName = _this.name;
        }).catch(() => {
             _this.$alert('获取用户信息失败');
      });

      this.$store.dispatch('user/getDepartTree').then(()=> {
        
        _this.options = _this.departTree;
        var _depart = _this.departTree[0];
        var i=0;
        let s = getSelection()
        if(s){
          let cookiedSelection = JSON.parse(s);//字符串转数组
            let station=_this.treeFind(_this.departTree,node=>node.value==cookiedSelection[3]) ;//找出充电站
            if(station){
              let path=[];
              _this.treeFindPath(_this.departTree,node=>node.value==station.value,path) ;//城市，集团，公司,项目
               if(path.toString==cookiedSelection.toString){//要求充电站名字  路径 完全一样
                 _depart=station;
                _this.selectedPark = cookiedSelection;
                i=4;
                _this.value = cookiedSelection;
               }
            }
        }
        if(i==0){
          while(true)
          {
              _this.selectedPark[i]=_depart.value;
              i++;
              if(_depart.hasOwnProperty('children')&&_depart.children!=null )
              _depart=_depart.children[0];
              else break;
          }
        }
       

        //如果是完整的即包含了电站ID ，那么就进行存储更新
        if(i==4){
            _this.$store.commit('station/SET_STATION_ID', _depart.key);   
            console.log("存储ID: "+_this.stationId+" 名称："+_depart.value)
            this.$store.commit('station/SET_STATION_NAME', _depart.value); 
        }
            
      }).catch((e) => {
            _this.$alert('获取用户部门树失败'+e);
      });
    },
    data(){
       var validatePasswd = (rule, value, callback) => {
          if (value === "") {
              callback(new Error("请输入密码"));
          } else {
              if (this.temp.repasswd !== "") {
                  this.$refs.modifyForm.validateField("repasswd");
              }
              callback();
          }
      };
      var validateRePassWd = (rule, value, callback) => {
        console.log( this.temp.passwd);
          if (value === "") {
            console.log(this.temp.passwd);
              callback(new Error("请再次输入密码"));
          } else if (value !== this.temp.passwd) {
              callback(new Error("两次输入密码不一致!"));
          } else {
            
              callback();
          }
      };
      return {
        currentUserName: '',
        dialogVisible: false,
        passwdVisible: false,
        temp: {},
        value:[],
        selectedPark:[],
        options:[],
        onlyOneChild:null,
        homeTitle:'',
        rulesMap:{ 
          passwd:[{ validator: validatePasswd, trigger: ["blur", "change"]}],
           repasswd:[{ validator: validateRePassWd, trigger: ["blur", "change"]}]
        },
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
    overflow-y:hidden;
  }

.rview {
  margin-top: 3px;
  width: calc(100% -30px);
  min-height: calc(100vh - 156px);
  max-height: calc(100vh - 156px);
  overflow-y: scroll;
  background-color: #fff;
  padding: 15px;
}

.rview::-webkit-scrollbar {
  width: 10px;
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
  .el-aside-container{
    height:100%
  }
  .el-aside::-webkit-scrollbar {
     display: none;

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

  .el-row{
    margin-top:10px;
  }

  /*选择器框框的宽度 */
  #el-cascader{
    width:90%;
  }

  .dialogClass .el-dialog__body {
  /*padding: 20px;*/
  padding-top: 0px;
  padding-bottom: 0px;
  margin-left: 10px;
  color: #606266;
  font-size: 14px;
}
.dialogClass .el-dialog__footer {
  text-align: left;
}


</style>



<style lang="scss" scoped>           
.el-dialog-div {
  height: 100px;
}


</style>

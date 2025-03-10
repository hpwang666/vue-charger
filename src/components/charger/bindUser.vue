<template>
  <el-container>
    <el-header class="bindUser_header">
          <el-button type="primary" icon="el-icon-back" size="medium" style="margin-left: 10px" @click="handleBack">返回</el-button>
          <el-input type="text" v-model="phone" auto-complete="off" placeholder="电话" style="width:200px;margin-left: 120px"></el-input>
        
          <el-input type="text" v-model="openid" auto-complete="off" placeholder="openid" style="margin-left: 20px;width:300px"></el-input>
       
          <el-input type="text" v-model="userId" auto-complete="off" placeholder="userId" style="margin-left: 20px;width:300px" ></el-input>
        
          <el-button type="success" size="small" style="margin-left: 20px" @click="handleQueryUserInfo" >查询</el-button>
          <el-button type="success" size="small" style="margin-left: 20px" @click="resetAll" >清空</el-button>
          <el-button id="bindBtn" type="success" size="small" style="margin-left: 20px;" @click="bindUser" >绑定</el-button>
    </el-header>

    <h3 style="margin:3px;margin-top:30px; text-align:left; padding-left:20px;color:#00b7ff;">已绑定用户</h3>
    <el-main class="bindUser_main">
      <el-table
        ref="multipleTable"
        :data="bindedUsers"
        style="width: 100%"
        max-height="600"
        border>
         <el-table-column
          label="序号"
          type = "index"
          width="130" align="left">
        </el-table-column>
        <el-table-column
          label="账号"
          prop="openId"
          width="280" align="left">
        </el-table-column>
      
        <el-table-column
          label="电话"
          prop="phone"
          width="160" align="left">
        </el-table-column>
       
        <el-table-column
          label="绑定时间"
          prop="createTime"
          width="260" align="left">
        </el-table-column>
      
       
        <el-table-column label="操作" align="left">
          <template v-slot="scope">
       
           
            <el-button
              size="mini"
              type="danger"
              @click="handleUnbind(scope.$index,scope.row)">解绑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <div style="height: 20px"></div>
   

   
    
  </el-container>
  
</template>
<script>
  import request from '@/utils/request'
   import { mapGetters } from 'vuex'
  
  export default{
    mounted:function(){
        this.chargerId=this.$route.query.id;
        this.handleQuery();
    },
    methods: {
      
      handleBack(){
        var _this = this;
        this.$router.push({
          path: 'chargers'
        })
      },
      resetAll() {
        this.userId='';
        this.openid='';
        this.phone='';
        
        this.DisplayAndHiddenBtn("bindBtn","h");
      },
      handleQuery()
      { 
        let _this = this;
        request({
          url: '/ylc/charger/queryBindedUsers',
          method: 'post',
          data: {
                chargerId:_this.chargerId
          } 
        }).then(resp=> {


         _this.bindedUsers= resp.result;

        _this.$message({
            message:resp.message,
            type: 'success',
            duration: 2000
          })
      
        }).catch(()=>{
          _this.$message({
            type: 'error',
            message: '加载失败'
          });
        });
     },
     handleQueryUserInfo()
     { 
        let _this = this;
        request({
          url: '/ylc/query/userInfo',
          method: 'post',
          data: {
                phone:_this.phone==''?null:_this.phone,
                userId:_this.userId==''?null:_this.userId,
                openid:_this.openid==''?null:_this.openid
          } 
        }).then(resp=> {


          _this.phone = resp.result.phone;
          _this.userId = resp.result.userId;
          _this.openid = resp.result.openid;

          if(_this.userId!=null && _this.openid!=null){
             _this.DisplayAndHiddenBtn("bindBtn","d");
          }
          else _this.DisplayAndHiddenBtn("bindBtn","h");

          _this.$message({
            message: (_this.userId!=null && _this.openid!=null)?resp.message:'查无此用户',
            type: 'success',
            duration: (_this.userId!=null && _this.openid!=null)?2000:4000
          })
      
        }).catch(()=>{
          _this.$message({
            type: 'error',
            message: '加载失败'
          });
        });
     },
       handleUnbind(index,row){
        let _this = this;
        this.$confirm('确认解除 ' + row.phone + ' 绑定?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.unbind(index,row.userId);
        });
      },
      unbind(index,id){
      var _this = this;
      request({
        url: '/ylc/charger/unbindUser',
       method: 'post',
        data:{
            chargerId:_this.chargerId,
            userId:id
        }    
      }).then(resp=> {
        _this.$message({
          type: 'success',
          message: resp.result
        });
        _this.bindedUsers.splice(index, 1)
      })
      },

      bindUser(){
      var _this = this;
     
      request({
        url: '/ylc/charger/bindUser',
        method: 'post',
        data:{
            chargerId:_this.chargerId,
            userId:_this.userId
        }   
      }).then(()=> {
        _this.$message({
          type: 'success',
          message: '绑定成功'
        });
       _this.handleQuery();
      })
      },
   
      DisplayAndHiddenBtn(btnId, type) 
      {    
        var currentBtn = document.getElementById(btnId);    
        if (type == "d")
        {       
          currentBtn.style.display = "block"; //style中的display属性   
        }    
        else if (type == "h") 
        {        
          currentBtn.style.display = "none";    
        }
      }
    },
   
    data(){
      return {
        userId:'',
        chargerId:'',
        openid:'',
        phone:'',
        bindedUsers: [],
      }
    }
  }
</script>
<style>
  .bindUser_header {
    background-color: #ececec;
    margin-top: 20px;
    padding-left: 5px;
  display: flex;
    justify-content: flex-start;
   
  }

  .bindUser_main {
    /*justify-content: flex-start;*/
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    background-color: #ececec;
    margin-top: 10px;
    padding-top: 30px;
    width:1300px;
  }
  #bindBtn{
    display: none;
  }
</style>

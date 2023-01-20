<template>
  <el-container>
    <el-header class="account_header">
      <el-button type="primary" icon="el-icon-back" size="medium" style="margin-left: 10px" @click="handleBack">返回</el-button>
      <el-input
        placeholder="请输入用户名称"
        v-model="inputUsername" style="width: 230px;margin-left: 160px">
      </el-input>
     
      <el-button type="primary" icon="el-icon-search" size="medium" style="margin-left: 10px" @click="handleCreate">搜索用户</el-button>
      <el-button type="success" size="medium" style="margin-left: 20px" @click="handleCreate">添加用户</el-button>
    </el-header>
    <el-main class="account_main">
      <el-table
        ref="multipleTable"
        :data="users"
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
          prop="account"
          width="260" align="left">
        </el-table-column>
        <el-table-column
          label="姓名"
          prop="name"
          width="160" align="left">
        </el-table-column>
        <el-table-column
          label="电话"
          prop="phone"
          width="160" align="left">
        </el-table-column>
       
        <el-table-column
          label="最后登录时间"
          prop="loginTime"
          width="260" align="left">
        </el-table-column>
      
       
        <el-table-column label="操作" align="left">
          <template v-slot="scope">
       
            <el-button
              size="mini"
              @click="handleUpdate(scope.row,scope.$index)">修改
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="dataForm" :rules="rulesMap[dialogStatus]" :model="temp" label-position="right" size="mini" label-width="100px" style="width: 100%">
       
        <el-form-item label="集团名称" >
          <el-input :disabled=true v-model="temp.departName" />
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input :disabled="dialogStatus==='update'" v-model="temp.account" />
        </el-form-item>
        <el-form-item label="用户名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
         <el-form-item label="密码" prop="passwd">
          <el-input type="password" v-model="temp.passwd" />
        </el-form-item>
         <el-form-item label="重复密码" prop="repasswd">
          <el-input type="password" v-model="temp.repasswd" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
    </el-main>
    <div style="height: 20px"></div>
   

   
    
  </el-container>
  
</template>
<script>
  import request from '@/utils/request'

  export default{
    methods: {
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)

            request({
              url: '/sys/user/add',
              method: 'post',
               params:{
                  departId:tempData.departId
              },
              data:{
                account:tempData.account,
                name:tempData.name,
                password:tempData.repasswd,
                phone:tempData.phone
              }   
            }).then(resp => {
              
              this.temp.id = resp.result.id;
              this.users.unshift(this.temp)//新的object添加到数组头部
              this.dialogFormVisible = false
              this.$message({
                message: '添加用户： '+this.temp.name+'成功',
                type: 'success',
                duration: 2000
              })
            }).catch(()=>{
               this.dialogFormVisible = false
               this.$message({
                  message: "提交失败",
                  type: 'error',
                  duration: 2000
                })
            })
          }
        })
      },
      handleUpdate(row,index) {
        this.resetTemp()
        this.temp = Object.assign({}, row) // copy obj
        this.temp.index = index;
        this.temp.departName = this.$route.query.departName
        this.temp.loginTime=undefined
        this.temp.id =row.id 
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            request({
              url: '/sys/user/edit',
              method: 'post',
              data:{
                id:tempData.id,
                name:tempData.name,
                password:tempData.repasswd,
                phone:tempData.phone
              }   
            }).then(resp => {
              const index = this.temp.index
              this.users.splice(index, 1, this.temp) //添加新元素
              this.dialogFormVisible = false
              this.$message({
                message: '更新用户： '+this.temp.name+'成功',
                type: 'success',
                duration: 2000
              })
            }).catch(()=>{
               this.dialogFormVisible = false
               this.$message({
                  message: "提交失败",
                  type: 'error',
                  duration: 2000
                })
            })
          }
        })
      },    
      handleDelete(index, row){
        let _this = this;
        this.$confirm('确认删除 ' + row.name + ' ?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.deleteCate(index,row.id);
        });
      },
      deleteCate(index,ids){
      var _this = this;
      request({
        url: '/sys/user/delete',
        method: 'get',
        params:  {userId:ids} 
      }).then(()=> {
        _this.$message({
          type: 'success',
          message: '删除成功'
        });
        this.users.splice(index, 1)
      })
      },
      refresh(){
        let _this = this;
        let departId=_this.$route.query.id
        request({
          url: '/sys/user/getUsersByDepId',
          method: 'get',
          params: {
            departId:departId
          }  
        }).then(resp=> {
          _this.users = resp.result;
        }).catch(()=>{
          _this.$message({
            type: 'error',
            message: '加载失败'
          });
        });
      },
      resetTemp() {
        this.temp = {
          departName:this.$route.query.departName,
          departId:this.$route.query.id,
          index:undefined,
          id:undefined,
          name: undefined,
          account:undefined,
          passwd:undefined,
          repasswd:undefined,
          phone:undefined,
          loginTime:undefined,
          memo: undefined
        }
      },
      handleBack(){
        var _this = this;
        this.$router.push({
          path: _this.$route.query.depart
        })
      }
    },
    mounted: function () {
      this.refresh();
    },
    data(){
      var validatePasswd = (rule, value, callback) => {
          if (value === "") {
              callback(new Error("请输入密码"));
          } else {
              if (this.temp.repasswd !== "") {
                  this.$refs.dataForm.validateField("repasswd");
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
        users: [],
        inputUsername:"",
        temp: "",
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '修改',
          create: '新建'
        },
        writableMap: {
          update: true,
          create: false
        },
        rulesMap:{ 
          update:
              {
                phone: [{ required: true, message: '手机号码未填写', trigger: 'blur' },
                        {pattern:/^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/,message: '手机号码格式错误', trigger: 'blur'}],
                name: [{ required: true, message: 'name is required', trigger: 'blur' }],
                account: [{ required: true, message: '账号未填写', trigger: 'blur' }],
                passwd:[{ validator: validatePasswd, trigger: ["blur", "change"]}],
                repasswd:[{ validator: validateRePassWd, trigger: ["blur", "change"]}]
              },
          create:
              {
                phone: [{ required: true, message: '手机号码未填写', trigger: 'blur' },
                        {pattern:/^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/,message: '手机号码格式错误', trigger: 'blur'}],
                name: [{ required: true, message: 'name is required', trigger: 'blur' }],
                account: [{ required: true, message: '账号未填写', trigger: 'blur' }],
                passwd:[{ required: true, validator: validatePasswd, trigger: ["blur"]}],
                repasswd:[{ required: true, validator: validateRePassWd, trigger: ["blur", "change"]}]
              }
        }
      }
    }
  }

  Date.prototype.format = function(fmt) { 
     var o = { 
        "M+" : this.getMonth()+1,                 //月份 
        "d+" : this.getDate(),                    //日 
        "h+" : this.getHours(),                   //小时 
        "m+" : this.getMinutes(),                 //分 
        "s+" : this.getSeconds(),                 //秒 
        "q+" : Math.floor((this.getMonth()+3)/3), //季度 
        "S"  : this.getMilliseconds()             //毫秒 
    }; 
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
     for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
         }
     }
    return fmt; 
}        
</script>
<style>
  .account_header {
    background-color: #ececec;
    margin-top: 20px;
    padding-left: 5px;
    display: flex;
    justify-content: flex-start;
  }

  .account_main {
    /*justify-content: flex-start;*/
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    background-color: #ececec;
    margin-top: 20px;
    padding-top: 10px;
  }
</style>

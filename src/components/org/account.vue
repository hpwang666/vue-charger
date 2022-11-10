<template>
  <el-container>
    <el-header class="cate_mana_header">
      <el-button type="primary" icon="el-icon-back" size="medium" style="margin-left: 10px" @click="handleBack">返回</el-button>
      <el-input
        placeholder="请输入用户名称"
        v-model="userName" style="width: 230px;margin-left: 160px">
      </el-input>
     
      <el-button type="primary" icon="el-icon-search" size="medium" style="margin-left: 10px" @click="addNewCate">搜索用户</el-button>
      <el-button type="success" size="medium" style="margin-left: 20px" @click="handleCreate">添加用户</el-button>
    </el-header>
    <el-main class="cate_mana_main">
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
          prop="userAccount"
          width="260" align="left">
        </el-table-column>
        <el-table-column
          label="姓名"
          prop="userName"
          width="160" align="left">
        </el-table-column>
        <el-table-column
          label="电话"
          prop="phone"
          width="160" align="left">
        </el-table-column>
       
        <el-table-column
          label="最后登录时间"
          prop="lastLogin"
          width="260" align="left">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间" align="left">
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" size="mini" label-width="100px" style="width: 100%">
       
       
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="temp.userName" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
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
            tempData.date = +new Date(tempData.date) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
    
           postRequest("/admin/user/list", tempData).then(resp => {
              
              this.temp.date=new Date().format("yyyy-MM-dd hh:mm:ss");//生成个最新时间
              this.users.unshift(this.temp)//新的object添加到数组头部
              this.dialogFormVisible = false
              this.$message({
                message: resp.data.data,
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
        this.temp = Object.assign({}, row) // copy obj
        this.temp.index = index
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
            tempData.date = +new Date(tempData.date) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            postRequest("/admin/city/update", tempData).then(resp => {
              const index = this.temp.index
              this.temp.date=new Date().format("yyyy-MM-dd hh:mm:ss");//生成个最新时间
              this.users.splice(index, 1, this.temp) //添加新元素
              this.dialogFormVisible = false
              this.$message({
                message: resp.data.data,
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
        this.$confirm('确认删除 ' + row.userName + ' ?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.deleteCate(index,row.id);
        });
      },
      deleteCate(index,ids){
        var _this = this;
        postRequest("/admin/city/delete" ,{id: ids}).then(resp=> {
          var json = resp.data;
          _this.$message({
            type: 'success',
            message: json.data
          });
          this.users.splice(index, 1)
        })
      },
      refresh(){
        let _this = this;
        let departId={departId:"1q1q1q"}
        request({
          url: '/vue-element-admin/org/userList',
          method: 'post',
          data:  departId 
        }).then(resp=> {
          _this.users = resp.data.array;
        }).catch(()=>{
          _this.$message({
            type: 'error',
            message: '加载失败'
          });
        });
      },
      resetTemp() {
        this.temp = {
          index:-1,
          userName: undefined,
          date: new Date(),
          remark: ''
        }
      },
      handleBack(){
        var _this = this;
        this.$router.push({
          path: _this.$route.query.name
        })
      },
    },
    mounted: function () {
      this.refresh();
    },
    data(){
      return {
        userName: '',
        users: [],
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
        rules: {
          date: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          userName: [{ required: true, message: 'name is required', trigger: 'blur' }]
        }
      }
    },
    filters: {
    statusFilter(status) {
      const statusMap = {
        在线: 'success',
        离线: 'danger'
      }
      return statusMap[status]
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
  .cate_mana_header {
    background-color: #ececec;
    margin-top: 20px;
    padding-left: 5px;
    display: flex;
    justify-content: flex-start;
  }

  .cate_mana_main {
    /*justify-content: flex-start;*/
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    background-color: #ececec;
    margin-top: 20px;
    padding-top: 10px;
  }
</style>

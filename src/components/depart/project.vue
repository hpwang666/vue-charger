<template>
  <el-container>
    <el-header class="cate_mana_header">
      <el-input
        placeholder="请输入城市名称"
        v-model="departName" style="width: 230px;">
      </el-input>
     
      <el-button type="primary" icon="el-icon-search" size="medium" style="margin-left: 10px" @click="handleCreate">搜索城市</el-button>
      <el-button type="success" size="medium" style="margin-left: 20px" @click="handleCreate">添加城市</el-button>
    </el-header>
    <el-main class="cate_mana_main">
      <el-table
        ref="multipleTable"
        :data="citys"
        style="width: 100%"
        max-height="600"
        border>
         <el-table-column
          label="序号"
          type = "index"
          width="130" align="left">
        </el-table-column>
        <el-table-column
          label="城市名称"
          prop="departName"
          width="360" align="left">
        </el-table-column>
        <el-table-column
          prop="date"
          label="启用时间" align="left">
        </el-table-column>
        <el-table-column label="分配账号">
           <template v-slot="scope">
            <el-button
              size="mini"
              type="success"
              @click="handleAccount(scope.row)">账户
            </el-button>
          </template>
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
              @click="handleDelete(scope.row,scope.$index)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" size="mini" label-width="100px" style="width: 100%">
       
       
        <el-form-item label="城市名称" prop="departName">
          <el-input v-model="temp.departName" />
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
   
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="20"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
      align="left">
    </el-pagination>
   
    
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
            request({
              url: '/admin/city/create',
              method: 'post',
              data:  tempData 
            }).then(resp => {
              
              this.temp.date=new Date().format("yyyy-MM-dd hh:mm:ss");//生成个最新时间
              this.temp.id=resp.data.id;//返回的新的ID
              this.citys.unshift(this.temp)//新的object添加到数组头部
              this.dialogFormVisible = false
              this.$message({
                message: resp.data.msg,
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
            request({
              url: '/admin/city/update',
              method: 'post',
              data:  tempData 
            }).then(resp => {
              const index = this.temp.index
              this.temp.date=new Date().format("yyyy-MM-dd hh:mm:ss");//生成个最新时间
              this.citys.splice(index, 1, this.temp) //添加新元素
              this.dialogFormVisible = false
              this.$message({
                message: resp.data,
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
      handleDelete(row,index){
        let _this = this;
        this.$confirm('确认删除 ' + row.departName + ' ?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.deleteDepart(index,row.id);
        });
      },
      deleteDepart(index,ids){
        var _this = this;
        request({
          url: '/admin/city/delete',
          method: 'post',
          data:{id: ids}
        }).then(resp=> {
          _this.$message({
            type: 'success',
            message: resp.data
          });
          this.citys.splice(index, 1)
        })
      },
      handleAccount(row){
        var _this = this;
        this.$router.push({
          path: 'cityAccount',
          query: {
            id: row.id,
            depart:"city",
            departName:row.departName
          }
        })
      },
      refresh(){
        let _this = this;
         request({
          url: '/sys/depart/list',
          method: 'get',
          params: {
            orgCategory:4
          }
        }).then(resp=> {
          _this.citys = resp.result;
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
          id:'0',
          departName: undefined,
          date: new Date(),
          remark: ''
        }
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
    },
    mounted: function () {
      this.refresh();
    },
    data(){
      return {
        departName: '',
        onOffLine: '',
        citys: [],
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
          departName: [{ required: true, message: 'name is required', trigger: 'blur' }]
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

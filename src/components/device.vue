<template>
  <el-container>
    <el-header class="cate_mana_header">
      <el-input
        placeholder="请输入设备名称"
        v-model="cateName" style="width: 150px;">
      </el-input>
      <el-select v-model="onOffLine" placeholder='在线状态' clearable style="margin-left: 10px" class="filter-item">
        <el-option v-for="item in onLineStatus" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button type="primary" icon="el-icon-search" size="medium" style="margin-left: 10px" @click="addNewCate">搜索设备</el-button>
      <el-button type="success" size="medium" style="margin-left: 20px" @click="handleCreate">添加设备</el-button>
    </el-header>
    <el-main class="cate_mana_main">
      <el-table
        ref="multipleTable"
        :data="categories"
        style="width: 100%"
        max-height="600"
        border>
        <el-table-column
          label="设备ID"
          prop="id"
          width="180" align="left">
        </el-table-column>
        <el-table-column
          label="设备名称"
          prop="cateName"
          width="180" align="left">
        </el-table-column>
        <el-table-column
          prop="date"
          label="启用时间" align="left">
        </el-table-column>
        <el-table-column
          label="在线状态"
          prop="onLine"
          width="180" >
          <template slot-scope="{row}">
            <el-tag :type="row.onLine | statusFilter" effect="dark" size="small">
              {{ row.onLine }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="left">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdate(scope.row)">修改
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
        <el-form-item label="设备ID" prop="id">
          <el-input :disabled="writableMap[dialogStatus]" v-model="temp.id" />
        </el-form-item>
        <el-form-item label="时间" prop="date">
          <el-date-picker v-model="temp.date" type="datetime" />
        </el-form-item>
        <el-form-item label="设备名称" prop="cateName">
          <el-input v-model="temp.cateName" />
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
  import {postRequest} from '../utils/api'
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
            postRequest("/admin/category/create", tempData).then(resp => {
              const index = this.categories.findIndex(v => v.id === this.temp.id)
              //this.categories.splice(index, 1, this.temp)
              this.categories.unshift(this.temp)
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
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.date = new Date(this.temp.date)
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
            postRequest("/admin/category/update", tempData).then(resp => {
              const index = this.categories.findIndex(v => v.id === this.temp.id)
              this.categories.splice(index, 1, this.temp)
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
        this.$confirm('确认删除 ' + row.cateName + ' ?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.deleteCate(index,row.id);
        });
      },
      deleteCate(index,ids){
        var _this = this;
        postRequest("/admin/category/delete" ,{id: ids}).then(resp=> {
          var json = resp.data;
          _this.$message({
            type: 'success',
            message: json.data
          });
          this.categories.splice(index, 1)
        })
      },
      refresh(){
        let _this = this;
        postRequest("/admin/category/all").then(resp=> {
          _this.categories = resp.data.data.array;
        }).catch(()=>{
          _this.$message({
            type: 'error',
            message: '加载失败'
          });
        });
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          cateName: undefined,
          date: new Date(),
          onLine: '离线',
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
        cateName: '',
        onOffLine: '',
        categories: [],
        onLineStatus: ['在线','离线'],
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
          id: [{ required: true, message: 'id is required', trigger: 'change' }],
          date: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          cateName: [{ required: true, message: 'name is required', trigger: 'blur' }]
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

<template>
  <el-container>
    <el-header class="charger_header">
     
      <el-select v-model="onOffLine" placeholder='在线状态' clearable style="margin-left: 10px" class="filter-item">
        <el-option v-for="item in onLineStatus" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button type="primary" icon="el-icon-search" size="medium" style="margin-left: 10px" @click="addNewCate">搜索设备</el-button>
      <el-button type="success" size="medium" style="margin-left: 20px" @click="handleCreate">添加设备</el-button>
    </el-header>
    <el-main class="charger_main">
     
    <el-descriptions title="电桩信息" class="margin-top"  >
    <template slot="extra">
      <el-button type="primary" size="small">操作</el-button>
      <el-button type="success" size="small">编辑</el-button>
    </template>
    <el-descriptions-item label="电桩ID">kooriookami</el-descriptions-item>
    <el-descriptions-item label="当前费率">1.00 元/度</el-descriptions-item>
    <el-descriptions-item label="状态">
        <el-tag size="small" type="danger">离线</el-tag>
    </el-descriptions-item>    
    <el-descriptions-item label="充电枪数量">2</el-descriptions-item>
    <el-descriptions-item label="手机号">18100000000</el-descriptions-item>
    <el-descriptions-item label="地址">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
    </el-descriptions>
    <el-divider></el-divider>


 <el-descriptions title="电桩信息" class="margin-top"  >
      <template slot="extra">
        <el-button type="primary" size="small">操作</el-button>
      </template>
      <el-descriptions-item label="电桩ID">kooriookami</el-descriptions-item>
      <el-descriptions-item label="手机号">18100000000</el-descriptions-item>
      <el-descriptions-item label="充电枪数量">2</el-descriptions-item>
      <el-descriptions-item label="状态">
        <el-tag size="small" type="danger">离线</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="联系地址">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
    </el-descriptions>

    <el-divider></el-divider>
 <el-descriptions title="电桩信息" class="margin-top"  >
      <template slot="extra">
        <el-button type="primary" size="small">操作</el-button>
      </template>
      <el-descriptions-item label="电桩ID">kooriookami</el-descriptions-item>
      <el-descriptions-item label="手机号">18100000000</el-descriptions-item>
      <el-descriptions-item label="充电枪数量">2</el-descriptions-item>
      <el-descriptions-item label="状态">
        <el-tag size="small" type="danger">离线</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="联系地址">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
    </el-descriptions>


    </el-main>
    <div style="height: 20px"></div>
   
    
   
    
  </el-container>
  
</template>
<script>
  import {postRequest} from '../utils/api'
  export default{
    methods: {
      
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
          date: new Date(),
          onLine: '离线',
          remark: ''
        }
      }
    },
    mounted: function () {
      this.refresh();
    },
    data(){
      return {
        onOffLine: '',
        categories: [],
        onLineStatus: ['在线','离线'],
        temp: ""
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
  .charger_header {
    background-color: #ececec;
    margin-top: 20px;
    padding-left: 5px;
    display: flex;
    justify-content: flex-start;
  }

  .charger_main {
    /*justify-content: flex-start;*/
    display: flex;
    flex-direction: column;
    padding-left: 50px;
    background-color: #ffffff;
    margin-top: 20px;
    padding-top: 10px;
  }

 
  .margin-top{
     background-color: #FAFFF0;
  }
</style>

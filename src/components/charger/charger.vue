<template>
  <el-container>
    <el-header class="charger_header">
      
      <el-select v-model="onOffLine" placeholder='在线状态' clearable style="margin-left: 10px" >
        <el-option v-for="item in onLineStatus" :key="item" :label="item" :value="item" />
      </el-select>
      
      <el-button type="success" size="medium" style="margin-left: 20px" @click="handleCreate">添加设备</el-button>
    </el-header>
    <el-main class="charger_main">
      <el-table
        ref="multipleTable"
        :data="chargers"
        style="width: 100%"
        max-height="600"
        max-width="600"
        border>
        <el-table-column
          label="设备ID"
          prop="id"
          width="180" align="left">
        </el-table-column>
         <el-table-column
          label="当前费率"
          prop="rate"
          width="160" align="left">
        </el-table-column>
        <el-table-column
          label="地址"
          prop="address"
          width="320" align="left">
        </el-table-column>
        <el-table-column
          label="电话"
          prop="phone"
          width="160" align="left">
        </el-table-column>
        <el-table-column
          prop="slots"
          label="充电枪数量" align="left">
        </el-table-column>
        <el-table-column
          label="在线状态"
          prop="onLine"
          width="140" >
          <template slot-scope="{row}">
            <el-tag :type="row.onLine | statusFilter" effect="dark" size="small">
              {{ row.onLine }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="left" width="180">
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


     
    </el-main>
    <div style="height: 20px"></div>
   

   
    
  </el-container>
  
</template>
<script>
  import {postRequest} from '../../utils/api'
  import request from '@/utils/request'
  export default{
    watch: {
      onOffLine: function () {
       
        //console.log(this.chargers.length+" fuck "+this.onOffLine);
        //return this.onOffLine
        this.refresh();
        
          }
    },
    methods: {
      handleCreate() {
         this.$router.push({
          path: 'chargerEdit',
          query: {
            id: '000',
            action:'add'
          }
        })
      },
     
      handleUpdate(row) {
       var _this = this;
        this.$router.push({
          path: 'chargerEdit',
          query: {
            id: row.id,
            action:'update'
          }
        })
      },
     
      handleDelete(index, row){
        let _this = this;
        this.$confirm('确认删除 ' + row.id + ' ?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.deleteCharger(index,row.id);
        });
      },
      deleteCharger(index,ids){
        var _this = this;
        postRequest("/admin/category/delete" ,{id: ids}).then(resp=> {
          var json = resp.data;
          _this.$message({
            type: 'success',
            message: json.data
          });
          this.chargers.splice(index, 1)
        })
      },
      refresh(){
        let _this = this;
        request({
          url: '/vue-element-admin/dev/chargerList',
          method: 'post'
        }).then(resp=> {
          var i = 0;
          var tempList = resp.data.array;
          if(_this.onOffLine!=''){
            while (i < tempList.length) {
              if (tempList[i].onLine != _this.onOffLine) {
                console.log(tempList[i].onLine);
                tempList.splice(i, 1);
              } else {
                ++i;
              }
            }
          }
          
          _this.chargers = tempList;
        }).catch(()=>{
          _this.$message({
            type: 'error',
            message: '加载失败'
          });
        });
      }
    },
    mounted: function () {
      this.refresh();
    },
    data(){
      return {
        onOffLine: '',
        chargers: [],
        onLineStatus: ['在线','离线'],
        dialogStatus: ''
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
    padding-left: 5px;
    background-color: #ececec;
    margin-top: 20px;
    padding-top: 10px;
  }
</style>

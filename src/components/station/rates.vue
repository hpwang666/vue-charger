<template>
  <el-container>
    <el-header class="charger_header">
      
     
      
      <el-button type="success" size="medium" style="margin-left: 20px" @click="handleCreate">添加费率</el-button>
    </el-header>
    <el-main class="charger_main">
      <el-table
        ref="multipleTable"
        :data="models"
        style="width: 100%"
        max-height="600"
        max-width="600"
        border>
        <el-table-column
          label="费率名称"
          prop="modelName"
          width="180" align="left">
        </el-table-column>
         <el-table-column
          label="当前费率 (元/度)"
          prop="rate"
          width="160" align="left">
        </el-table-column>
        
       <el-table-column
          label="当前时间段"
          prop="timeInRate"
          width="260" align="left">
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


     
    </el-main>
    <div style="height: 20px"></div>
   

   
    
  </el-container>
  
</template>
<script>
  import request from '@/utils/request'
   import { mapGetters } from 'vuex'
  
  export default{
    watch: {
    
      stationId:function (){ //动态监听电站ID的变化，刷新界面
         this.refresh();
      }
    },
     computed: {
      ...mapGetters(['stationId'])
    },
    methods: {
      handleCreate() {
         this.$router.push({
          path: 'ratesEdit',
          query: {
            id: '000',
            action:'create'
          }
        })
      },
     
      handleUpdate(row) {
       var _this = this;
        this.$router.push({
          path: 'ratesEdit',
          query: {
            id: row.id,
            action:'update'
          }
        })
      },
     
      handleDelete(index, row){
        let _this = this;
        this.$confirm('确认删除 ' + row.modelName + ' ?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.deleteCharger(index,row.id);
        });
      },
      deleteCharger(index,id){
        var _this = this;
         request({
          url: '/ylc/feeModel/delete',
          method: 'get',
          params:{
            id:id
          }
        }).then(resp=> {
          
          _this.$message({
            type: 'success',
            message: resp.result
          });
          this.models.splice(index, 1)
        })
      },
      refresh(){
        let _this = this;
        request({
          url: '/ylc/feeModel/queryByDepartId',
          method: 'get',
          params:{
            departId:_this.stationId
          }
        }).then(resp=> {
          var i = 0;
          var tempList = resp.result;
          
          
          _this.models = tempList;
          console.log(_this.models);
        }).catch(()=>{
          _this.$message({
            type: 'error',
            message: '加载失败'
          });
        });
      }
    },
    mounted: function () {
      
      setTimeout(() => {
        this.refresh();
      }, 120)
    },
    data(){
      return {
        models: [],
        dialogStatus: ''
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

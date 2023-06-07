<template>
  <el-container>
    <el-header class="cate_mana_header">
      账户余额: 1298.23 元
    </el-header>
    <el-main class="cate_mana_main">
           
     
       <el-table
        ref="multipleTable"
        :data="orders"
        style="width: 100%"
        max-height="600"
        max-width="600"
        border>
        <el-table-column
          label="订单号"
          prop="orderNum"
          width="280" align="left">
        </el-table-column>
        
         
          <el-table-column
          label="电站名称"
          prop="totalCost"
          width="280" align="left">
        </el-table-column>

        <el-table-column
          label="充电金额"
          prop="totalCost"
          width="120" align="left">
         </el-table-column>
        <el-table-column
          label="分润金额"
          prop="startType"
          width="120" align="left">
        </el-table-column>

        
        <el-table-column
          prop="orderTime"
          label="结算时间" width="220" align="left">
        </el-table-column>
        
      </el-table>
    </el-main>
  
   
    
    
  </el-container>
  
</template>
<script>
 import request from '@/utils/request'
   import { mapGetters } from 'vuex'
  
  export default{
     computed: {
      ...mapGetters(['stationId'])
    },
    methods: {
      refresh(){
        let _this = this;
        request({
          url: '/ylc/order/list',
          method: 'get',
          params:{
            departId:_this.stationId
          }
        }).then(resp=> {
          var i = 0;
          var tempList = resp.result;
           
          _this.orders = tempList;
          
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
        orders: []
      }
    }
  }
</script>
<style>
  .cate_mana_header {
    background-color: #fcf8f8;
    font-size: 30px;
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

<template>
  <el-container>
   
    <el-main class="order_main">
      <el-table
        ref="multipleTable"
        :data="orders"
        style="width: 100%"
        max-height="600"
        max-width="600"
        border>
        <el-table-column
          label="商户名称"
          prop="orderNum"
          width="280" align="left">
        </el-table-column>
         <el-table-column
          label="电话号码"
          prop="serialNum"
          width="160" align="left">
        </el-table-column>
         <el-table-column
          label="商户机构"
          prop="totalKwh"
          width="120" align="left">
        </el-table-column>
        <el-table-column
          label="账户余额"
          prop="totalCost"
          width="120" align="left">
        </el-table-column>
       
       
        <el-table-column label="操作" align="left" width="180">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleSettlement(scope.row)">提现
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
      settlement: function () {
       
        //console.log(this.orders.length+" fuck "+this.settlement);
        //return this.settlement
        this.refresh();
        
          },
      stationId:function (){ //动态监听电站ID的变化，刷新界面
         this.refresh();
      }

    },
     computed: {
      ...mapGetters(['stationId'])
    },
    methods: {
      
      handleSettlement(row) {
       var _this = this;
        
      },
     handleQuery()
     {
        
        let _this = this;
        request({
          url: '/ylc/order/list',
          method: 'get',
          params:{
            departId:_this.stationId,
            begin:isNaN(+new Date(this.selectedDate[0]))?null:+new Date(this.selectedDate[0]),
            end:isNaN(+new Date(this.selectedDate[0]))?null:+new Date(this.selectedDate[1]),
          }
        }).then(resp=> {
         
          _this.orders = resp.result;
          _this.$message({
              type: 'success',
              message:resp.message
            });
          
        }).catch(()=>{
          _this.$message({
            type: 'error',
            message: '查询失败: '+resp.message
          });
        });
     },
      refresh(){
        let _this = this;
        request({
          url: '/ylc/order/list',
          method: 'get',
          params:{
            departId:_this.stationId,
            begin:isNaN(+new Date(this.selectedDate[0]))?null:+new Date(this.selectedDate[0]),
            end:isNaN(+new Date(this.selectedDate[0]))?null:+new Date(this.selectedDate[1]),
          }
        }).then(resp=> {
          var i = 0;
          var tempList = resp.result;
          if(_this.settlement!=''){
            while (i < tempList.length) {
              if (tempList[i].settleFlag != _this.settlement) {
                tempList.splice(i, 1);
              } else {
                ++i;
              }
            }
          }
          
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
        settlement: '',
        orders: [],
        settleFlag: ['结算成功','未能结算'],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        selectedDate: []
      }
    },
    filters: {
    statusFilter(status) {
      const statusMap = {
        结算成功: 'success',
        未能结算: 'danger'
      }
      return statusMap[status]
    }
  }
  }
</script>
<style>
  .order_header {
    background-color: #ececec;
    margin-top: 20px;
    padding-left: 5px;
    display: flex;
    justify-content: flex-start;
  }

  .order_main {
    /*justify-content: flex-start;*/
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    background-color: #ececec;
    margin-top: 20px;
    padding-top: 10px;
  }
</style>

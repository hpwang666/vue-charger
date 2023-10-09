<template>
  <el-container>
    <el-header class="query_header">
      
          <el-input type="text" v-model="phone" auto-complete="off" placeholder="电话" style="width:200px"></el-input>
       
        
          <el-input type="text" v-model="openid" auto-complete="off" placeholder="openid" style="margin-left: 20px;width:300px"></el-input>
       
       
           <el-input type="text" v-model="userId" auto-complete="off" placeholder="userId" style="margin-left: 20px;width:300px" ></el-input>
        
          <el-button type="success" size="small" style="margin-left: 20px" @click="handleQuery" >查询</el-button>
           <el-button type="success" size="small" style="margin-left: 20px" @click="resetAll" >清空</el-button>
    </el-header>

    <h3 style="margin:3px;margin-top:10px; text-align:left; padding-left:20px;color:#00b7ff;">近三天充电</h3>
    <el-main class="query_main">
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
          label="充电度数"
          prop="totalKwh"
          width="110" align="left">
        </el-table-column>
        <el-table-column
          label="充电金额"
          prop="totalCost"
          width="110" align="left">
        </el-table-column>

       

      <el-table-column
          label="车牌"
          prop="carNum"
          width="120" align="left">
        </el-table-column>

       
        <el-table-column
          prop="stopType"
          label="停止原因" align="left">
        </el-table-column>
        <el-table-column
          prop="orderTime"
          label="结算时间" align="left">
        </el-table-column>
        <el-table-column
          label="结算状态"
          prop="settleFlag"
          width="140" >
          <template slot-scope="{row}">
            <el-tag :type="row.settleFlag | statusFilter" effect="dark" size="small">
              {{ row.settleFlag }}
            </el-tag>
          </template>
        </el-table-column>
        
      </el-table>
    </el-main>

    <h3 style="margin:3px;margin-top:15px; text-align:left; padding-left:20px;color:#00b7ff;">近三天充值</h3>
    <el-main  class="query_main">
          <el-table
        ref="multipleTable"
        :data="trade"
        style="width: 100%"
        max-height="600"
        max-width="600"
        border>
        <el-table-column
          label="充值订单号"
          prop="oriOrgTrace"
          width="260" align="left">
        </el-table-column>

       <el-table-column
          label="充值前余额"
          prop="oriAmt"
          width="110" align="left">
        </el-table-column>
       
        <el-table-column
          label="充值金额"
          prop="settleAmount"
          width="110" align="left">
        </el-table-column>

       

    
        <el-table-column
          prop="settleTime"
          label="结算时间" align="left">
        </el-table-column>
        <el-table-column
          label="结算状态"
          prop="settleFlag"
          width="140" >
          <template slot-scope="{row}">
            <el-tag :type=textMap[row.settleFlag]  effect="dark" size="small">
              {{ computedSiteType(row.settleFlag) }}
            </el-tag>
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
 computed: {
    computedSiteType(){
      return function(settleFlag){
        return settleFlag==1?'结算成功':'未能结算'
      }
    }},

    methods: {
      
      handleSettlement(row) {
       var _this = this;
        
      },
      resetAll() {
        this.userId='';
        this.openid='';
        this.phone='';
        this.settlement= '';
        this.orders= [];
        this.trade=[];
        
      },
       resetSome() {
        var _this=this;
        this.userId= _this.userId==''?'':_this.userId;
        this.openid= _this.openid==''?'':_this.openid;
        this.phone= _this.phone==''?'':_this.phone;
        this.settlement= '';
        this.orders= [];
        this.trade=[];
        
      },
    
     handleQuery()
     { 
      this.pageNo=1;
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
              this.handleOrder();
              this.handleTrade();
          }
            else _this.resetSome();

          this.$message({
            message: resp.message,
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
      handleOrder()
      {
        let _this = this;
        request({
          url: '/ylc/query/userOrder',
          method: 'get',
          params:{
            userId:_this.userId
          }
        }).then(resp=> {
          var i = 0;
          var tempList = resp.result.records;
          _this.total=  resp.result.total;
        
          
          _this.orders = tempList;
      
        }).catch(()=>{
          _this.$message({
            type: 'error',
            message: '加载失败'
          });
        });
      },
    handleTrade()
    {
      let _this = this;
      request({
        url: '/ylc/query/userTrade',
        method: 'get',
        params:{
          userId:_this.userId
        }
      }).then(resp=> {
       
        _this.trade = resp.result;
    
      }).catch(()=>{
        _this.$message({
          type: 'error',
          message: '加载失败'
        });
      });
    },
    refresh(){
   
    }
    },
   
    data(){
      return {
        userId:'',
        openid:'',
        phone:'',
        settlement: '',
        orders: [],
        trade:[],
        settleFlag: ['结算成功','未能结算'],
        textMap: {
          0: 'danger',
          1: 'success'
        },
        total:1,
        pageSize:5,
        pageNo:1,
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
  .query_header {
    background-color: #ececec;
    margin-top: 20px;
    padding-left: 5px;
  display: flex;
    justify-content: flex-start;
   
  }

  .query_main {
    /*justify-content: flex-start;*/
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    background-color: #ececec;
    margin-top: 10px;
    padding-top: 10px;
    width:1300px;
  }
</style>

<template>
  <el-container class="calcu_container">
    <el-header class="calcu_header">
      <el-row :gutter="20" id="calcu_total">
         <el-col :span="8">
          站点总收益: {{amount}} 元
         </el-col>
         <el-col :span=8>
           成交: {{totalCount}}笔 
         </el-col>
      </el-row>
    </el-header>

   

    <el-main class="calcu_main">
    <div style="text-align: right;">
      <el-radio-group v-model="byTime">
        <el-radio-button label="今天"></el-radio-button>
        <el-radio-button label="7天"></el-radio-button>
        <el-radio-button label="1个月"></el-radio-button>
        <el-radio-button label="6个月"></el-radio-button>
      </el-radio-group>
    </div>
       
      <el-divider content-position="left">统计信息</el-divider>
   
       <el-row :gutter="20" >
         <el-col :span="6">
         <showData :content="byTime+`充电总额`" :amount="chargeFeeByTime" :count="chargeQtyByTime"></showData>
         </el-col>
         <el-col :span=6>
          <showData :content="byTime+`占位总额`"></showData>
         </el-col>
          <el-col :span=6>
          <showData :content="byTime+`利润总额`"></showData>
         </el-col>
          <el-col :span=6>
          <showData :content="byTime+`充值总额`"></showData>
         </el-col>
      </el-row>
       <el-row :gutter="20" >
         <el-col :span="8">
           <pieChart id='pie-chart0' :pieTitle="byTime+`充电时长分布`" :pieData="pieData0"></pieChart>
         </el-col>
          <el-col :span="8">
           <pieChart id='pie-chart1' :pieTitle="byTime+`占位时长分布`" :pieData="pieData1"></pieChart>
         </el-col>
         <el-col :span="8">
           <pieChart id='pie-chart2' :pieTitle="byTime+`发生占位比例`" :pieData="pieData2"></pieChart>
         </el-col>
         
       </el-row>
    
   
    </el-main>
  
    
    
  </el-container>
  
</template>
<script>
  import request from '@/utils/request'
  import showData from './show-data'
  import pieChart from './pie-chart'
  import { mapGetters } from 'vuex'
  
  export default{
     computed: {
      ...mapGetters(['stationId','name'])
    },
    components: { showData,pieChart },
    watch: {
      byTime: function () {
       
        //console.log(this.chargers.length+" fuck "+this.onOffLine);
        //return this.onOffLine
        this.refresh();
      },
      stationId:function (){ //动态监听电站ID的变化，刷新界面
         this.refresh();
      }
    },
    methods: {
      refresh(){
        this.getAccount();
       
      },
      getAccount(){
         let _this = this;

         request({
          url: '/ylc/order/chart',
          method: 'get',
          params:{
            departId:_this.stationId,
            days:_this.byTime
          }
        }).then(resp=> {
          
          _this.$message({
            type: 'success',
            message: resp.message
          });
          _this.amount = resp.result.totalCost;
          _this.totalCount=resp.result.costQty;
          _this.pieData0 = resp.result.chargeTimeZone;

          _this.chargeFeeByTime = resp.result.chargeFeeByTime;
          _this.chargeQtyByTime = resp.result.chargeQtyByTime;

          if(_this.pieData0==null){
            _this.pieData0= new Array();
          }

          if(_this.pieData0.length == 0){
            _this.pieData0.push( {value:0, name:'=0h'});
          }

        })
      }
    },
    mounted: function () {
      
      setTimeout(() => {
        this.refresh();
      }, 320)
    },
    data(){
      return {
        amount:'',
        totalCount:'',
        byTime:'7天',
        chargeQtyByTime:0,
        chargeFeeByTime:'',
        pieData0:[],
        pieData1:[
            {value:80, name:'< 1h'},
            {value:274, name:'1-2h'},
            {value:310, name:'2-4h'},
            {value:335, name:'4-8'},
            {value:400, name:'> 8h'}
        ],
        pieData2:[
            {value:80, name:'占位订单'},
            {value:274, name:'未占位订单'}
        ]
      }
    }
  }
</script>
<style>

  .calcu_header {
    background-color: #fcf8f8;
    font-size: 30px;
    margin-top: 20px;
    padding-left: 5px;
   display: block;
  }

  .calcu_main {
    /*justify-content: flex-start;*/
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    width: 100%;
     display: block;
  }

  #calcu_total{
    padding-top: 8px;
  }

  
</style>

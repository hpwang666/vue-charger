<template>
  <el-container class="cash_out_trade_container">
    <el-header class="cash_out_trade_header">
      <el-row :gutter="20" >
         <el-col :span="18">
          账户余额: {{amount}} 元   
         </el-col>
         <el-col :span=3>
          <el-button type="success" size="medium" style="margin-left: 20px" @click="handleCashOut">账户提现</el-button>
         </el-col>
      </el-row>
    </el-header>

    <br />
      <el-divider content-position="left">账户信息</el-divider>
      <el-descriptions >
          <el-descriptions-item label="账户名称"><el-tag size="small">{{sharerName}}</el-tag></el-descriptions-item>
          <el-descriptions-item label="账户级别"><el-tag size="small">{{type}}</el-tag></el-descriptions-item>
          <el-descriptions-item label="账户余额"><el-tag size="small">{{amount}}元</el-tag> </el-descriptions-item>
      </el-descriptions>
      
      <br />
      <el-divider content-position="left">分润流水</el-divider>

    <el-main class="cash_out_trade_main">
      
     
       <el-table
        ref="multipleTable"
        :data="trades"
        style="width: 100%"
        max-height="600"
        max-width="600"
        border>
       
        
         
          <el-table-column
          label="操作员"
          prop="departName"
          width="280" align="left">
        </el-table-column>

       
        <el-table-column
          label="提现金额"
          prop="tradeAmount"
          width="120" align="left">
        </el-table-column>

        
        <el-table-column
          prop="settleTime"
          label="结算时间" width="220" align="left">
        </el-table-column>

        <el-table-column
          label="结算状态"
          prop="settleFlag"
          width="140" >
          
           <template slot-scope="scope">
            <el-tag :type=textMap[scope.row.settleFlag] effect="dark" size="small">
              {{ computedSiteType(scope.row.settleFlag) }}
            </el-tag>
          </template>
         
        </el-table-column>
        
      </el-table>

       <el-dialog title="提现" :visible.sync="dialogFormVisible" width="520px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" size="mini" label-width="100px" style="width: 100%">
        
        <el-row>
          <el-form-item label="账户名称" prop="sharerName" >
            <el-input v-model="temp.sharerName" :disabled="true"/>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="操作员" prop="controller">
            <el-input v-model="temp.controller" :disabled="true"/>
          </el-form-item>
        </el-row>
        <el-row :gutter="10">
          <el-col :span=16>
            <el-form-item label="提现金额" prop="cashOutAmt">
              <el-input v-model="temp.cashOutAmt" />
            </el-form-item>
          </el-col>
          余额: {{amount}} 元
          <el-col :span=8>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="备注">
            <el-input v-model="temp.memo" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="cashOut">
          确认
        </el-button>
      </div>
    </el-dialog>

    </el-main>
  
   
    
    
  </el-container>
  
</template>
<script>
 import request from '@/utils/request'
   import { mapGetters } from 'vuex'
  
  export default{
     computed: {
      ...mapGetters(['stationId','name']),
      isSettled : function(){
        return this.trades['settleFlag']==0 ? "已受理":"未受理"
      },
      computedSiteType(){
        return function(settleFlag){
            return settleFlag==1?'已受理':'未受理'
      }
    },
    },
    methods: {
      refresh(){
        let _this = this;
        this.getAccount();
        request({
          url: '/ylc/share/queryCashOutTrade',
          method: 'get',
         
        }).then(resp=> {
          var i = 0;
          var tempList = resp.result.records;
           
          _this.trades = tempList;
          
        }).catch(()=>{
          _this.$message({
            type: 'error',
            message: '加载失败'
          });
        });
      },
      getAccount(){
         let _this = this;
        request({
          url: '/ylc/share/queryAccount',
          method: 'get',
          params:{
            departId:_this.stationId
          }
        }).then(resp=> {
          
          _this.amount = resp.result.amount;
          _this.type = resp.result.type;
          _this.sharerId = resp.result.sharerId;
          _this.sharerName = resp.result.name;
          
        }).catch(()=>{
          _this.$message({
            type: 'error',
            message: '查询账户失败'
          });
        });
      },
       resetTemp() {
       let _this = this;
        this.temp = {
          sharerId:_this.sharerId,
          sharerName: _this.sharerName,
          cashOutAmt:'',
          controller:  _this.name,
          memo: ''
        }
      },
       handleCashOut() {
        this.resetTemp()
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      cashOut() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            request({
              url: '/ylc/share/cashOut',
              method: 'post',
              data:  {
                sharerId:tempData.sharerId,
                departName:tempData.controller,
                tradeAmount:tempData.cashOutAmt,
              } 
            }).then(resp => {
              
              this.dialogFormVisible = false
              this.$message({
                message: resp.message,
                type: 'success',
                duration: 2000
              })
            }).catch(()=>{
               this.dialogFormVisible = true
               this.$message({
                  message: resp.message,
                  type: 'error',
                  duration: 2000
                })
            })
          }
        })
      }
    },
    mounted: function () {
      
      setTimeout(() => {
        this.refresh();
      }, 120)
    },
    data(){
      return {
        amount:100,
        sharerId:'',
        sharerName:'',
        type:'',
        temp: "",
        trades: [],
        textMap: {
          0: 'danger',
          1: 'success'
        },
        dialogFormVisible: false,
        rules:{
          cashOutAmt: [{ required: true, message: '金额未填写', trigger: 'change' },{pattern:/(^\d{1,4}.[0-9]{2}?$)/,message: '填2位小数并金额小于9999.99', trigger: 'blur'}]
      }
        
      }
    }
  }
</script>
<style>


  .cash_out_trade_header {
    background-color: #fcf8f8;
    font-size: 30px;
    margin-top: 20px;
    padding-left: 5px;
    display: flex;
    justify-content: flex-start;
  }

  .cash_out_trade_main {
    /*justify-content: flex-start;*/
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    background-color: #ececec;
    margin-top: 20px;
    padding-top: 10px;
    width: 80%;
  }
</style>

<template>
  <el-container class="cash_out_container">
    <el-header class="cash_out_header">
     
    </el-header>

    
  

    <el-main class="cash_out_main">
      
     
       <el-table
        ref="multipleTable"
        :data="trades"
        style="width: 100%"
        max-height="600"
        max-width="600"
        border>
       
         <el-table-column
          label="账户名称"
          prop="sharerName"
          width="280" align="left">
        </el-table-column>

         <el-table-column
          label="账户级别"
          prop="type"
          width="280" align="left">

            <template slot-scope="scope">
            <el-tag type="success"  size="small">
              {{ computedOrgType(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        
         
          <el-table-column
          label="提现发起人"
          prop="operator"
          width="280" align="left">
        </el-table-column>

       
        <el-table-column
          label="提现金额"
          prop="tradeAmount"
          width="120" align="left">
        </el-table-column>

         <el-table-column label="操作" align="left">
          <template v-slot="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleCashOut(scope.row,scope.$index)">受理提现
            </el-button>
          </template>
        </el-table-column>

        
      </el-table>

       <el-dialog title="受理提现" :visible.sync="dialogFormVisible" width="520px">
    
    账户 {{temp.sharerName}} 将提现 {{temp.tradeAmount}} 元
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
      computedOrgType(){
        return function(type){
            return this.typeMap[type];
      }
    },
    },
    methods: {
      refresh(){
        let _this = this;
       
        request({
          url: '/ylc/share/queryCashOutNotProcessed',
          method: 'get',
         
        }).then(resp=> {
          var i = 0;
          var tempList = resp.result;
           
          _this.trades = tempList;
          
        }).catch(()=>{
          _this.$message({
            type: 'error',
            message: '加载失败'
          });
        });
      },
     
       handleCashOut(row,index) {
        this.temp = Object.assign({}, row) // copy obj
        this.dialogFormVisible = true
       
      },
      cashOut() {
        const tempData = Object.assign({}, this.temp)
        request({
          url: '/ylc/share/processCashOut',
          method: 'get',
          params:  {
            id:tempData.id
          } 
        }).then(resp => {
          
          this.dialogFormVisible = false
          this.refresh();
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
        typeMap: {
          0: '个人',
          1: '城市',
          2: '集团',
          3: '公司'
        },
        dialogFormVisible: false
      }
    }
  }
</script>
<style>


  .cash_out_header {
    background-color: #fcf8f8;
    font-size: 30px;
    margin-top: 20px;
    padding-left: 5px;
    display: flex;
    justify-content: flex-start;
  }

  .cash_out_main {
    /*justify-content: flex-start;*/
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    background-color: #ececec;
    margin-top: 20px;
    padding-top: 10px;
  }
</style>

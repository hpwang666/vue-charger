<template>
<div>
<div  id="income_details_body">
    <el-table
        ref="multipleTable"
        :data="trades"
        style="width: 100%"
        :max-height="tableHeight"
        max-width="600"
        size="small"
        border>
        <el-table-column
          label="订单号"
          prop="orderNum"
          width="280" align="left">
        </el-table-column>
        
       
         
          <el-table-column
          label="分润来源"
          prop="departName"
          width="280" align="left">
        </el-table-column>

       
        <el-table-column
          label="分润金额"
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
          
            <el-tag type="success" effect="dark" size="mini">
              结算成功
            </el-tag>
         
        </el-table-column>
        
      </el-table>
    

</div>
<div style="padding-bottom:0px"  class="income_details_footer">
  <br/>
     <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-sizes="[10, 20]"
      :page-size="20"
      layout="total, sizes, prev, pager, next, jumper"
      :total=total
      align="left">
    </el-pagination>
</div>
</div>
</template>

<script>
import request from '@/utils/request'


export default {
  props: {
    id: {
      type: String,
      default: null
    },
    tableHeightOffset: {
      type: Number,
      default: 200
    },
  },
 
  mounted: function (){
    let _this=this;
    this.$nextTick(() => {
          this.tableHeight = window.innerHeight - _this.tableHeightOffset;
      }),
      setTimeout(() => {
        this.refresh();
      }, 120)
  },
  data() {
    return {
      tableHeight:200,
      total:1,
      pageSize:20,
      pageNo:1,
      trades: [],
    }
  },
 
  beforeDestroy() {
    //console.log('beforeDestroy');
  },
  methods: {
    handleSizeChange(val){
       //console.log("handleSizeChange: "+val)
        this.pageSize=val;
        //以下是为了当pageNo变化时候会触发两次请求
       // if (this.pageNo * (val-1) > this.total) return
        
        this.refresh();
      },
    handleCurrentChange(val){
        this.pageNo=val;
        this.refresh();
      },
    refresh(){
      let _this = this;
      request({
        url: '/ylc/share/queryShareTrades',
        method: 'get',
        params:{
          sharerId:_this.id,
          pageNo:_this.pageNo,
          pageSize:_this.pageSize
        }
      }).then(resp=> {
        var i = 0;
        _this.trades = resp.result.records;
        _this.total=  resp.result.total;
        
      }).catch(()=>{
        _this.$message({
          type: 'error',
          message: '加载失败'
        });
      });
    },
  }// end of methods
}
</script>

<style>
  #income_details_body {
    /*justify-content: flex-start;*/
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    background-color: #ececec;
    margin-top: 20px;
    padding-top: 10px;
  }
  .income_details_footer{
    width: 100%;
    position: absolute;
    bottom: 15px;
  }
</style>

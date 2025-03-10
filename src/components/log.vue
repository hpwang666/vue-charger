
<template>
<div>
  <div class="log_header">
    <div class="block"  style="margin-left: 20px">
      <span class="demonstration">日期:</span>
      <el-date-picker
        v-model="selectedDate"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions">
      </el-date-picker>
    </div>
    <div>
      <el-button type="success" size="medium" style="margin-left: 20px" @click="handleQuery">查询</el-button>
    </div>
  </div>

  <div>
  <el-table
    :data="tableData"
    style="width: 100%"
    :row-class-name="tableRowClassName">
    <el-table-column
      prop="username"
      label="用户名"
      width="220" align="left">
    </el-table-column>
    <el-table-column
      prop="logContent"
      label="操作内容"
      width="250" align="left">
    </el-table-column>
    <el-table-column
      prop="operateType"
      label="操作属性"
      width="220" align="left">
    </el-table-column>
    <el-table-column
      prop="requestUrl"
      label="url"
      width="280" align="left">
    </el-table-column>
     <el-table-column
      prop="createTime"
      label="操作时间"
      width="250" align="left">
    </el-table-column>
  </el-table>
  </div>
  <div style="height: 50px"></div>
  <div class="block" align="left">
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page=1
      :page-sizes="[10, 20, 30, 50]"
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
    methods: {
      tableRowClassName({row, rowIndex}) {
        if (rowIndex%2 === 0) {
          return 'warning-row';
        } else if (0) {
          return 'success-row';
        }
        return '';
      },
      handleSizeChange(val){
        this.pageSize=val;
        //以下是为了当pageNo变化时候会触发两次请求
        if (this.pageNo * (val-1) > this.total) return
        
        this.refresh();
      },
      handleCurrentChange(val){
        this.pageNo=val;
        this.refresh();
      },
      handleQuery()
      { 
        this.pageNo=1;
        this.refresh();
        this.$message({
              message: '查询成功',
              type: 'success',
              duration: 2000
            })
     },
      refresh(){
        var _this =this;
        request({
          url: '/sys/log',
          method: 'get',
          params:{
            begin:(_this.selectedDate==null)?null:( isNaN(+new Date(_this.selectedDate[0]))?null:+new Date(_this.selectedDate[0]) )   ,
            end:  (_this.selectedDate==null)?null:( isNaN(+new Date(_this.selectedDate[0]))?null:+new Date(_this.selectedDate[1]) )  ,
            
            pageNo:_this.pageNo,
            pageSize:_this.pageSize
          }
        }).then(resp=> {
          _this.tableData = resp.result.records;
          _this.total=  resp.result.total;
      }).catch(()=>{
          _this.$message({
            type: 'error',
            message: '加载失败'
          });
        });
      }
    },
    mounted: function (){
       setTimeout(() => {
        this.refresh();
      }, 300)
    },
    data() {
      return {
        tableData: [],
        selectedDate: [],
        total:1,
        pageSize:20,
        pageNo:1,
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
      }
    }
  }
</script>

<style>
.el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

  .log_header {
    background-color: #ececec;
    margin-top: 0px;
    padding-left: 5px;
    display: flex;
    justify-content: flex-start;
  }
</style>

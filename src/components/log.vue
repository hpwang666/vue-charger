
<template>
<div>
  <div>
<el-table
    :data="tableData"
    style="width: 100%"
    :row-class-name="tableRowClassName">
    <el-table-column
      prop="ip"
      label="ip地址"
      width="250" align="left">
    </el-table-column>
    <el-table-column
      prop="date"
      label="日期"
      width="250" align="left">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="250" align="left">
    </el-table-column>
    <el-table-column
      prop="op"
      label="操作"
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
      :current-page="currentPage4"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="20"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
    </el-pagination>
  </div>
</div>

</template>

<script>
  import {postRequest} from '../utils/api'
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
       handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
    },
    mounted: function (){
       postRequest("/log").then(resp=> {
        if (resp.status == 200) {
          this.tableData = resp.data.data.array;
        }
      }, resp=> {
        this.$message({type: 'error', message: '页面加载失败!'});
      });
    },
    data() {
      return {
        tableData: [],
        currentPage1: 5,
        currentPage2: 5,
        currentPage3: 5,
        currentPage4: 4
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
</style>

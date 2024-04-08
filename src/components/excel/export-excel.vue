<template>
  <!-- <div class="app-container"> -->
  <div class="fw flex-col jc-center ai-start">
    <div class="fw flex-row flex-wrap jc-between ai-center">
      <div>
        <span class="demonstration" style="font-size: 14px">日期:</span>
        <el-date-picker
          style="width: 250px"
          v-model="selectedDate"
          type="daterange"
          align="right"
          size="small"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
        <el-button
          type="success"
          size="small"
          style="margin-left: 20px"
          @click="fetchData"
          >查询</el-button
        >
      </div>

      <div>
        <FilenameOption v-model="filename" />
      </div>
      <div>
        <BookTypeOption v-model="bookType" />
      </div>
      <div>
        <AutoWidthOption v-model="autoWidth" />
      </div>

      <div>
        <el-button
          :loading="downloadLoading"
          size="small"
          type="primary"
          icon="el-icon-document"
          @click="handleDownload"
          >导出
        </el-button>
      </div>
    </div>
    <br />
    <el-table
      v-loading="listLoading"
      size="small"
      :data="list"
      element-loading-text="Loading..."
      border
      fit
      highlight-current-row
      :header-cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column align="center" label="序号" min-width="10%">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="电站名称" min-width="50%">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="订单数量" min-width="10%" align="right">
        <template slot-scope="scope">
          {{ scope.row.count }}
        </template>
      </el-table-column>
      <el-table-column label="用电量" min-width="15%" align="right">
        <template slot-scope="scope">
          {{ scope.row.kwh }}
        </template>
      </el-table-column>
      <el-table-column label="金额" min-width="15%" align="right">
        <template slot-scope="scope">
          {{ scope.row.income }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<script>
import { parseTime } from '@/utils'
import request from '@/utils/request'
// options components
import FilenameOption from './components/FilenameOption'
import AutoWidthOption from './components/AutoWidthOption'
import BookTypeOption from './components/BookTypeOption'

export default {
  name: 'ExportExcel',
  components: { FilenameOption, AutoWidthOption, BookTypeOption },
  data() {
    return {
      list: null,
      listLoading: true,
      downloadLoading: false,
      filename: '',
      autoWidth: true,
      bookType: 'xlsx',
      selectedDate: [],
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
    }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      var _this = this;
       request({
          url: '/ylc/sum/ordersInDepartsByTime',
          method: 'get',
          params:{
           
            begin:(_this.selectedDate==null)?null:( isNaN(+new Date(_this.selectedDate[0]))?null:+new Date(_this.selectedDate[0]) )   ,
            end:  (_this.selectedDate==null)?null:( isNaN(+new Date(_this.selectedDate[0]))?null:+new Date(_this.selectedDate[1]) )  ,
          }
        }).then(resp=> {
          this.list = resp.result;
          this.listLoading = false;
      
        }).catch(()=>{
          _this.$message({
            type: 'error',
            message: '加载失败'
          });
        });

       
       
      
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['序号', '电站名称', '订单数量', '用电量','金额']
        const filterVal = ['index', 'name', 'count', 'kwh','income']
        const list = this.list
        const data0 = [];

        list.map((item, index) => {
          data0.push(
            Object.assign({ index: index+1},item )
          );
        });
       const data = this.formatJson(filterVal, data0);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
          return v[j]
      }))
    }
  }
}
</script>

<style>
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
.excel_head{
  margin-top: 20px;
  padding-left: 5px;
  display: flex;
  justify-content: flex-start;
}
</style>

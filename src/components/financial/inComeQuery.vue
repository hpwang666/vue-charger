<template>
  <div>
    <el-header class="inCome_query_header">
      <el-input
        placeholder="请输入名称或拼音"
        v-model="inputDepartName" clearable style="width: 230px;">
      </el-input>
     
      <el-button type="primary" icon="el-icon-search" size="medium" style="margin-left: 10px" @click="queryDepart">搜索充电站</el-button>
    </el-header>
    <el-main class="inCome_query_main ">
      <el-table
        ref="multipleTable"
        :data="departs"
        :max-height="tableHeight"
        border>
         <el-table-column
          label="序号"
          type = "index"
          width="80" align="left">
        </el-table-column>
        <el-table-column
          label="充电站名称"
          prop="departName"
          width="250" align="left">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="启用时间" align="left">
        </el-table-column>
        <el-table-column
          label="备注"
          prop="memo"
          width="300" align="left">
        </el-table-column>
        <el-table-column label="分润配置">
           <template v-slot="scope">
            <el-button
              size="mini"
              type="success"
              @click="handleAccount(scope.row)">分润
            </el-button>
          </template>
        </el-table-column>
     
      </el-table>

   
    </el-main>
    <div style="height: 20px"></div>
   
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-sizes="[10, 20]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total=total
      align="left">
    </el-pagination>
   
    
  </div>
  
</template>
<script>
  import request from '@/utils/request'
  export default{
    computed: {
     
    },
    watch:{
       inputDepartName: function () {
       
        //console.log(this.chargers.length+" fuck "+this.searchSerialNum);
        //return this.onOffLine
        if(this.inputDepartName == '')
          this.refresh();
        
      },

    },
    
    methods: {
      queryDepart(){
        let _this = this;
        request({
          url: '/sys/depart/searchBy',
           method: 'get',
          params:{
            
            keyWord:_this.inputDepartName,
            
          }
        }).then(resp=> {
          _this.departs = resp.result;
          _this.total= _this.departs.length;
      
        }).catch(()=>{
          _this.$message({
            type: 'error',
            message: '加载失败'
          });
        });
      },
     
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

      handleAccount(row){
        var _this = this;
        this.$router.push({
          path: 'incomeCfg',
          query: {
            id: row.id,
            departName:row.departName
          }
        })
      },
      refresh(){
        let _this = this;
        request({
          url: '/sys/depart/allStations',
           method: 'get',
          params:{
            
            pageNo:_this.pageNo,
            pageSize:_this.pageSize
          }
        }).then(resp=> {
          _this.departs = resp.result.records;
          _this.total=  resp.result.total;
        }).catch(()=>{
          _this.$message({
            type: 'error',
            message: '加载失败'
          });
        });
      },
      resetTemp() {
        this.temp = {
          index:-1,
          id:'0',
          departName: undefined,
          parentId: undefined,
          updateTime: new Date(),
          memo: ''
        }
      }
    },

    mounted: function () {
      this.refresh();
       this.$nextTick(() => {
            this.tableHeight = window.innerHeight - 330;
        })

      
    },
    data(){
      return {
        inputDepartName:"",
        departs: [],
        temp: "",
        tableHeight:0,

        total:1,
        pageSize:10,
        pageNo:1,
      }
    }
  }

 
</script>
<style>
  .inCome_query_header {
    background-color: #ececec;
    margin-top: 5px;
    padding-left: 5px;
    display: flex;
    justify-content: flex-start;
  }

  .inCome_query_main {
    /*justify-content: flex-start;*/
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    background-color: #ececec;
    margin-top: 20px;
    padding-top: 10px;
  }

</style>

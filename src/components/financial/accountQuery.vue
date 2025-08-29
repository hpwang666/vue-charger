<template>
  <el-container>
    <el-header class="account_query_header">
      <div   class="fw flex-row flex-start" style="align-items: center;">
        
        <div style="width:200px;padding-left: 20px">
          <el-input v-model="searchName" clearable placeholder="账户查询" ></el-input>
        </div>
      <div  style="padding-left:20px;">
        <el-button  type="success" size="medium"  @click="handleSearch">搜索</el-button>
      </div>
    
      </div>
    </el-header>
    <el-main class="account_query_body">
      <el-table
        ref="multipleTable"
        :data="accounts"
        size="small"
        style="width: 100%;"
        :max-height="tableHeight"
        max-width="600"
     
        border>
         <el-table-column
          label="序号"
          type = "index"
          width="70" align="left">
        </el-table-column>
        <el-table-column
          label="账户名称"
          prop="name"
          width="140" align="left">
        </el-table-column>

        <el-table-column
          prop="type"
           width="200"
          label="账户级别" align="left">
        </el-table-column>

        <el-table-column
          prop="amount"
           width="200"
          label="账户余额" align="left">
        </el-table-column>

      
      
     
        <el-table-column label="操作" align="left" >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleDetail(scope.$index, scope.row)">收入详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>


          
    </el-main>

    <div style="padding-bottom:0px" class="account_query_footer">
   
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
  </el-container>

  
  
</template>
<script>
   import request from '@/utils/request'

  
  export default{
   
    watch: {
      searchStatus: function () {
        this.queryDone=false;
      },
      searchName:function(){
        this.queryDone=false;
      }


    },//end watch 
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
      
     
      handleSearch(){
          this.pageNo=1;
          this.pageSize=10;
          this.accounts=[];
          this.searchCharges()
      },
      searchCharges(){
         let _this = this;
        request({
          url: '/ylc/share/listAccount',
          method: 'get',
          params:{
            name:_this.searchName,
            pageNo:_this.pageNo,
            pageSize:_this.pageSize
          }
        }).then(resp=> {
          _this.queryDone=true;

          var tempList = resp.result.records;;
          _this.total = resp.result.total;

          _this.accounts = tempList;

           _this.$message({
            type: 'success',
            message: resp.message,
            duration:800
          });
        
        }).catch(()=>{
          _this.$message({
            type: 'error',
            message: '加载失败'
          });
        });
      },

     
    
   
      handleDetail(index, row){
       let _this = this;
         _this.$router.push({
          path: 'details',
          query: {
            sharerId: row.sharerId,
          }
        })
      },

      refresh(){
       this.searchCharges();
    }
    },
    mounted: function () {
      
      this.refresh();
       this.$nextTick(() => {
            this.tableHeight = window.innerHeight - 350;
        })
    },
    data(){
      return {
      tableHeight:200,

        searchName:'',
        searchStatus:'',
        queryDone:false,
        selectedQr:'',
        selectedUrl:'',

        pageSize:10,
        pageNo:1,
        total:0,
      
        addChargerPre:'',
        accounts: [],
        

        rulesMap:{ 
            preSerialNum: [{ required: true, message: '未填写', trigger: 'blur' },
                        {pattern:/^(\d{3})$/,message: '数据仅限3位', trigger: 'blur'}]    },
        uploading:false

      }
    }
  }
</script>
<style>

 .account_query_header {
    background-color: #ececec;
    margin-top: 12px;
    padding-left: 5px;
    display: flex;
    justify-content: flex-start;
  }
  .account_query_body {
    /*justify-content: flex-start;*/
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    background-color: #ececec;
    margin-top: 20px;
    padding-top: 10px;
  }



  .export_btn{
    margin-left: auto;
     
  }

  .account_query_footer{
    width: 100%;
    position: absolute;
    bottom: 15px;
  }
  
 
  #qrHtml{
    padding-top:20px;
    padding-bottom:20px;
    display: flex;
    justify-content:space-around;
  }
 
</style>

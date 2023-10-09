<template>
  <el-container class="feedback_container">
    <el-header class="feedback_header">
    
    </el-header>

    
  

    <el-main class="feedback_main">
      
     
       <el-table
        ref="multipleTable"
        :data="feedback"
        style="width: 100%"
        max-height="600"
        max-width="600"
        border>
       
         <el-table-column
          label="用户ID"
          prop="userId"
          width="280" align="left">
        </el-table-column>
        
         
          <el-table-column
          label="电话号码"
          prop="phone"
          width="220" align="left">
        </el-table-column>

       
    
         <el-table-column
          label="异常类型"
          prop="type"
          width="200" align="left">

            <template slot-scope="scope">
            <el-tag type="success"  size="small">
              {{ computedOrgType(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        
          <el-table-column
          label="用户留言"
          prop="feedback"
          width="420" align="left">
        </el-table-column>
         <el-table-column
          label="提交时间"
          prop="createTime"
          width="320" align="left">
        </el-table-column>

         <el-table-column label="操作" align="left">
          <template v-slot="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleFeedback(scope.row,scope.$index)">受理异常
            </el-button>
          </template>
        </el-table-column>

        
      </el-table>

       <el-dialog title="受理异常" :visible.sync="dialogFormVisible" width="520px">
             用户故障已被处理 
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
          url: '/ylc/query/userFeedback',
          method: 'get',
         
        }).then(resp=> {
          var i = 0;
          var tempList = resp.result;
           
          _this.feedback = tempList;
          
        }).catch(()=>{
          _this.$message({
            type: 'error',
            message: '加载失败'
          });
        });
      },
     
       handleFeedback(row,index) {
        this.temp = Object.assign({}, row) // copy obj
        this.dialogFormVisible = true
       
      },
      cashOut() {
        const tempData = Object.assign({}, this.temp)
        request({
          url: '/ylc/query/processFeedback',
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
        feedback: [],
        typeMap: {
          1: '充值失败',
          2: '不能退款',
          3: '扣款异常',
          4: '电价异常'
        },
        dialogFormVisible: false
      }
    }
  }
</script>
<style>


  .feedback_header {
    background-color: #fcf8f8;
    font-size: 30px;
    margin-top: 20px;
    padding-left: 5px;
    display: flex;
    justify-content: flex-start;
  }

  .feedback_main {
    /*justify-content: flex-start;*/
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    background-color: #ececec;
    margin-top: 20px;
    padding-top: 10px;
  }
</style>

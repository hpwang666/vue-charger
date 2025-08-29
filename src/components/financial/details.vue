<template>
  <el-container class="details_container">
    <el-header class="details_header">
      <el-button type="primary" icon="el-icon-back" size="medium" style="margin-left: 10px" @click="handleBack">返回</el-button>
    </el-header>

    <div class="details_main">
    <incomeDetails :id="sharerId" :tableHeightOffset="tableHeightOffset"  />
    </div>
   
  </el-container>
  
</template>

<script>

import incomeDetails from './incomeDetails/incomeDetails'

export default{
   
    components: { incomeDetails },
    beforeMount: function (){
        this.sharerId=this.$route.query.sharerId;
    },
    data(){
      return {
        sharerId:'',
        tableHeightOffset:310
      }
    },
    methods:{
       handleBack(){
        this.$router.push({
          path: 'accountQuery'
        })
      }
    }
    
}
</script>
    
<style>

  .details_header {
    background-color: #ececec;
    font-size: 30px;
    padding-left: 15px;
      display: flex;
    justify-content: flex-start;
  }

  .details_main {
    /*justify-content: flex-start;*/
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    width: 100%;
  
  }


  
</style>

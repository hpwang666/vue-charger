<template>

<div >
  
 <el-main class="income_cfg_edit">
  
<br />
<el-divider content-position="left">分润配置</el-divider>

  <el-row :gutter="20" >
  <el-col :span="16"><div class="grid-content bg-purple"  style="text-align:left">
    <el-transfer v-model="value" :data="toShareUsers" :titles="titles" label-position="left"></el-transfer>
    </div>
  </el-col>


  <el-col :span="8"  style="padding-right:0"><div  v-for="(domain,index) in value" :key="index"  class="grid-content bg-purple">
     <el-row >
      <el-col :span="8">
        <div  class="name-ylc">{{toShareUsers[domain].label+': '}}</div>
      </el-col >

      <el-col :span="12"><div>
        <el-input v-model="ratio[domain]"  size="small"  > <template slot="append">百分比</template></el-input>
      </div>
  
      </el-col>
    </el-row>
  </div>
  <br />
   <el-row>
        合计: {{sum}}%
      </el-row>
  </el-col>
 
</el-row>
  
 <br />
 <br />
 <br />
 <el-row :gutter="10" >
      <el-button type="success" @click="handleCommit()">保存</el-button>
 </el-row>





</el-main>


</div>
</template>
<script>
import request from '@/utils/request'
import { mapGetters } from 'vuex'

    export default {
   
      watch: {
      stationId:function (){ //动态监听电站ID的变化，刷新界面
         this.refresh();
      },
      value:function(val,old){//为了能够检测到value的变化   value 必须用push改变
        if(val===old){}
        else{
          if(old.length>val.length){
            old.forEach(element => {
               let ii =val.indexOf(element)
              if(-1==ii)  {
                console.log('del  found: '+ element)
                this.ratio.splice(element,1);
                this.ratio.splice(element,0,0);
              }
            });
          }
          else{
             val.forEach(element => {
               let jj =old.indexOf(element)
              if(-1==jj)  {
                console.log('add  found: '+ element)
                this.ratio.splice(element,1);
                this.ratio.splice(element,0,0);//保证数据结构 长度不变
              }
            });
            
          }
          console.log('mod '+this.ratio)
                  
        }
       
      }
    },
      computed: {
        ...mapGetters(['stationId']),
        sum:{
          get:function(){
            return this.ratio.reduce((sum, e) => sum + Number(e || 0), 0)
          },
          set:function(a){

          }
          
        }
      },
      mounted: function () {
        
         setTimeout(() => {
           this.refresh();
         }, 120)
      },
    
    data() {
      return {
        dialogVisible:false,
        value:[],
        ratio:[],
        titles:['待选股东','已选股东'],
        action:'',
        serialNum:'',
        toShareUsers:[] ,
        shareRatios:[],
        sharers:[],
        allUsers:'',
        
      }
    },
    methods: {
    
       handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      refresh(){
        let _this = this;
        _this.toShareUsers.splice(0);//所有股东的待选项
        _this.ratio.splice(0);//百分比列表，长度是按照selected 固定的
        _this.value.splice(0);//已经有的股东
        _this.sharers.splice(0);
        request({
          url: '/ylc/station/shareHolding',
          method: 'get',
          params:{
            departId:_this.stationId
          }
        }).then(resp=> {
          var i = 0;
          _this.allUsers = resp.result.allUsers;
          _this.sharers =  resp.result.sharers;
          
          
           _this.allUsers.map(((item, index)=> {
              _this.toShareUsers.push({key:index,label:item.name,disabled:false})
            }))
         
       
          for(i=0;i<_this.toShareUsers.length;i++){
            this.ratio.push(0);
          }

        
        // this.ratio.splice(3,1);
        // console.log('init '+this.ratio)
        // this.ratio.splice(3,0,11);
        console.log('init '+this.ratio)  

        //挑出已经有的股东，放在value里面，那么在待选项里面就不会出现
        //挑出股东比例放在对应的radio里面
        _this.sharers.map(((item, index)=> {
          let ii =  _this.allUsers.indexOf(this.indexOfById( _this.allUsers,item.userId));
          if(ii!=-1){
            this.value.push(ii)
            _this.ratio[ii]=item.ratio;
          }
        }));
        

        }).catch(()=>{
          _this.$message({
            type: 'error',
            message: '加载失败'
          });
        });


      },
      
      indexOfById(array, id) {
        return array.find(function(element) {
          return element.id === id;
        });
      },
      findByUserId(array, userId) {
        return array.find(function(element) {
          return element.userId === userId;
        });
      },
       
      handleCommit(){
        let _this = this;
        this.$alert('百分比合计 ' + this.sum +'%'+ ' ?  请确保100%或则0%', '提示', {
          confirmButtonText: '确定',
          cancelButtonText:'取消',
          showConfirmButton:this.sum==100||this.sum==0,
          showCancelButton:true,
          type: 'warning'
        }).then(() => {
          _this.shareRatios.splice(0)
           _this.value.map(((item, index)=> {
               console.log(item)

                //把id重新写进去
               var ii =  _this.findByUserId( _this.sharers,_this.allUsers[item].id);
               var id=ii==undefined?null:ii.id
             
              _this.shareRatios.push({id:id,userId:_this.allUsers[item].id,departId: _this.$store.getters.stationId,ratio:_this.ratio[item]});
            }));
            console.log(_this.shareRatios)
          _this.commitShare();
        });
      },
      commitShare(){
        var _this = this;
         request({
           url: '/ylc/station/updateSharers',
            method: 'post',
            data:  _this.shareRatios ,
            params:{
              departId: _this.$store.getters.stationId
            }
        }).then(resp=> {
          
          _this.$message({
            type: 'success',
            message: resp.result
          });
        })
      },
    }
  }
</script>


<style>

  .income_cfg_edit {
    justify-content: flex-start;
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    background-color: #ffffff;
    margin-top: 20px;
    padding-top: 10px;
    width: 1000px;
  }

  .income_form_main{
    text-align: left;
    display: flex;
    flex-direction: column;
    width:400px;
  }

.name-ylc{
    font-size: 90%;
    line-height:32px;
    height:30px;
}
 
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
 

</style>

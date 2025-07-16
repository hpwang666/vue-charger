<template>

 <div class="income_cfg_edit -w10">
      

  <div>
   
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      </br>
      <span style="display: block; text-align:left; color:#6495ED; font-size:24px;">充电站名称: {{$route.query.departName}}</span>
     <el-tab-pane label="分润管理" name="share"> <el-divider content-position="left">分润配置</el-divider></el-tab-pane>
     <el-tab-pane label="电费管理" name="electricity"> <el-divider content-position="left">电费管理</el-divider></el-tab-pane>
    </el-tabs>
    </br>
    <div class="grid-content bg-purple"  style="text-align:left">
      <myTransfer 
            v-model="value" 
            :data="toShareUsers" 
            :titles="titles" 
            :isShowLeftInput="false" 
            :isShowRightInput="true"
            ref="qqq">
      </myTransfer>
    </div>

  </div>
  
 <br />
 <br />
 <br />

 <div class="inCome_btn">
  <el-button type="primary" icon="el-icon-back" size="medium" style="margin-left: 10px" @click="handleBack">返回</el-button>
      <el-button type="success" size="medium" @click="handleCommit()">保存</el-button>
 </div>

</div>

</template>


<script>
import request from '@/utils/request'
import myTransfer from './myTransfer/src/main'

    export default {
      components: { myTransfer },
      watch: {

      activeName:function(name){
        console.log(name);
        if(name==='share') {
          this.requestUrl='/ylc/station/shareHolding';
          this.committUrl='/ylc/station/updateSharers';
        }
        if(name==='electricity') {
          this.requestUrl='/ylc/station/elecHolding';
          this.committUrl='/ylc/station/updateElecSharers';
        }
         this.refresh();
      }
    },
    computed: {
       
        sum:{
          get:function(){
            return this.ratio.reduce((sum, e) => sum + Number(e || 0), 0)
          },
          set:function(a){

          }
          
        }
      },
      mounted: function () {
           this.refresh();
      },
    
    data() {
      return {
        requestUrl:'/ylc/station/shareHolding',
        committUrl:'/ylc/station/updateSharers',
        activeName: 'share',
        value:[],
        titles:['待选股东','已选股东'],
        action:'',
        serialNum:'',
        toShareUsers:[] ,
        shareRatios:[],
        sharers:[],
        allSharers:'',
        
      }
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      handleBack(){
        var _this = this;
        this.$router.push({
          path: 'inComeQuery'
        })
      },
    
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
        _this.value.splice(0);//已经有的股东
        _this.sharers.splice(0);
        request({
          url: _this.requestUrl,
          method: 'get',
          params:{
            departId:_this.$route.query.id
          }
        }).then(resp=> {
          var i = 0;
          _this.allSharers = resp.result.allSharers;
          _this.sharers =  resp.result.sharers;
          
          

            _this.allSharers.map(((item, index)=> {
              _this.toShareUsers.push({key:index,label:item.name,Number:0,disabled:false});
             }))
         
       
          // for(i=0;i<_this.toShareUsers.length;i++){
          //   this.ratio.push(0);
          // }

        
        

        //挑出已经有的股东，放在value里面，那么在待选项里面就不会出现
        
        _this.sharers.map(((item, index)=> {
          let ii =  _this.allSharers.indexOf(this.indexOfById( _this.allSharers,item.sharerId));
          if(ii!=-1){
            this.value.push(ii)
            //_this.ratio[ii]=item.ratio;
            _this.toShareUsers[ii].Number=item.ratio;
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
          return element.sharerId === userId;
        });
      },
       
      handleCommit(){
        let _this = this;
        console.log( );
        this.$alert('百分比合计 ' + _this.$refs.qqq.aaa() +'%'+ ' ?  请确保100%或则0%', '提示', {
          confirmButtonText: '确定',
          cancelButtonText:'取消',
          showConfirmButton: _this.$refs.qqq.aaa()==100|| _this.$refs.qqq.aaa()==0,
          showCancelButton:true,
          type: 'warning'
        }).then(() => {
          _this.shareRatios.splice(0)
           _this.value.map(((item, index)=> {
               console.log(item)

                //把id重新写进去
               var ii =  _this.findByUserId( _this.sharers,_this.allSharers[item].id);
               var id=ii==undefined?123:ii.id
             if(_this.toShareUsers[item].Number>0)
              _this.shareRatios.push({id:id,sharerId:_this.allSharers[item].id,departId: _this.$route.query.id,ratio:_this.toShareUsers[item].Number});
            }));
            console.log(_this.shareRatios)
          _this.commitShare();
        });
      },
      commitShare(){
        var _this = this;
         request({
           url: _this.committUrl,
            method: 'post',
            data:  _this.shareRatios ,
            params:{
              departId: _this.$route.query.id
            }
        }).then(resp=> {
          
          _this.$message({
            type: 'success',
            message: resp.result
          });
          _this.refresh();
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

  .inCome_btn{
    margin-left:300px;
    text-align: left;
    
  }
 


</style>

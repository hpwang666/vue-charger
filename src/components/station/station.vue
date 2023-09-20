<template>

<div >
  
 <el-main class="station_edit_main">
   <el-row :gutter="30" >
     <el-col :span="7">
      <el-form class= "station_form_main" ref="dataForm" :model="form"  :rules="rules" label-width="80px" >
        <el-form-item label="电站名称"  >
      
          <el-input  v-model="form.name"  :disabled="true" show-word-limit ></el-input>
        
        </el-form-item>
        <el-form-item label="电站地址" >
          <el-input  v-model="form.address"    show-word-limit ></el-input>
        </el-form-item>
        
        <el-form-item label="电话号码"  prop="phone">    
          <el-input  v-model="form.phone"   show-word-limit ></el-input>  
        </el-form-item>
        
        <el-form-item style="float: left" >
          <el-button style="float: left" type="success" @click="dialogVisible = true">设置经纬度</el-button>
        </el-form-item>
      
        <el-form-item label="纬度" label-width="80px" prop="latitude" >
          <el-input  :disabled="true" size="small"  v-model="form.latitude"> <template slot="append">度</template></el-input>
        </el-form-item>
        <el-form-item label="经度" label-width="80px" prop="longitude">
          <el-input  :disabled="true" size="small"  v-model="form.longitude"> <template slot="append">度</template></el-input>
        </el-form-item>

        
        <el-form-item label="电站位置" prop="location" >
          <el-radio v-model="form.location" class="input-reader-name" label="1">地上电站</el-radio>
          <el-radio v-model="form.location" class="input-reader-name" label="2">地下电站</el-radio>
        </el-form-item>

        <el-form-item label="供电模式" style="padding-left" prop="supplyMode">
          
          <el-radio v-model="form.supplyMode" label="1">独立增容</el-radio>
          <el-radio v-model="form.supplyMode" label="2">扩展容量</el-radio>
          
        </el-form-item>


        <el-form-item label="供电容量"  prop="supplyCapacity">
          
            <el-input  v-model="form.supplyCapacity"    ><template slot="append">K.VA</template></el-input>
          
        </el-form-item>
        
        <el-form-item label="电站类型" prop="ownType" >
          
            <el-select v-model="form.ownType" placeholder="请选择电站类型">
              <el-option label="个人" value="1"></el-option>
              <el-option label="公共" value="2"></el-option>
              <el-option label="出租车(专用)" value="3"></el-option>
            </el-select>
          
        </el-form-item>

    </el-form>
     </el-col>
     <el-col :span="7">
        <br />
        <el-divider content-position="left">提供服务</el-divider>
       <el-form class= "station_form_main" ref="serviceForm" :model="form"   label-width="80px" >
        <el-form-item label="休息室"  >
      
          <el-input  v-model="form.name"  :disabled="true" show-word-limit ></el-input>
        
        </el-form-item>

        <el-form-item label="停车收费" >
        
          <el-input  v-model="form.address"    show-word-limit ></el-input>
        
        </el-form-item>
       </el-form>
     </el-col>
   </el-row>

<br />
<el-divider content-position="left">其他配置</el-divider>

 

 <br />
 <el-row :gutter="10" >
      <el-button type="success" @click="commitStation()">保存</el-button>
 </el-row>

<el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  width="60%" height="80%"
  :before-close="handleClose">

 
<tencent-map  @childValueChange="fuck"></tencent-map>
 
  <span>
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>



</el-main>


</div>
</template>
<script>
import request from '@/utils/request'
import TencentMap from './tencentMap'
import { mapGetters } from 'vuex'

    export default {
      components: {
      TencentMap
    },
      watch: {
      stationId:function (){ //动态监听电站ID的变化，刷新界面
         this.refresh();
      }
    },
      computed: {
        ...mapGetters(['stationId'])
      },
      mounted: function () {
        
         setTimeout(() => {
           this.refresh();
         }, 120)
      },
    
    data() {
      return {
        dialogVisible:false,
               
        form:{
          id:'',
          name:'',
          address:'',
          phone:'',
          latitude:'123',
          longitude:'456',
          location:'1',
          supplyMode:'1',
          supplyCapacity:'200',
          ownType:'2'
        },
        rules:{
          supplyMode: [{ required: true, message: '未选择', trigger: 'change' }],
          phone: [{ required: true, message: '未选择', trigger: 'change' }],
          location: [{ required: true, message: '未选择', trigger: 'change' }],
          supplyCapacity: [{ required: true, message: '未选择', trigger: 'change' }],
          ownType: [{ required: true, message: '未选择', trigger: 'change' }],
          longitude: [{ required: true, message: '未选择', trigger: 'change' }],
          latitude: [{ required: true, message: '未选择', trigger: 'change' }]
      }
      }
    },
    methods: {
      fuck(val,val2){
        this.form.latitude=val;
        this.form.longitude = val2;
        console.log("fuck"+val)
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
        

        request({
          url: '/ylc/station/query',
          method: 'get',
          params:{
            departId:_this.stationId
          }
        }).then(resp=> {
          var i = 0;
        
          _this.form =  resp.result;
          

        }).catch(()=>{
          _this.$message({
            type: 'error',
            message: '加载失败'
          });
        });

      },
      

      
   
    commitStation(){
        var _this = this;
        this.$refs['dataForm'].validate((valid) => {
        if (valid) { 
         request({
           url: '/ylc/station/edit',
            method: 'post',
            data:  _this.form 
        }).then(resp=> {
          _this.$message({
            type: 'success',
            message: resp.result
          });
        })

        } 
      })
    }
  }
    }
</script>


<style>

  .station_edit_main {
    
    max-height:750px;
     padding-left: 5px;
    background-color: #ffffff;
    margin-top: 20px;
    padding-top: 10px;
   
  }

  .station_form_main{
    text-align: left;
    display: flex;
    flex-direction: column;
   
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

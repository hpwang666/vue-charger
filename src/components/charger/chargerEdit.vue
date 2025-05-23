<template>

<div style="max-height:600px">
  
 <el-main class="charger_edit_main">
  <el-form ref="dataForm" :model="form"   :rules="rules" label-width="120px" >
   
  <el-form-item label="电桩ID"  >
    <div style="width:140px">
    <el-input :disabled=true v-model="form.serialNum"   show-word-limit ></el-input>
    </div>
  </el-form-item>
   <el-form-item label="电桩名称"  >
    <div style="width:200px">
    <el-input  v-model="form.name"   show-word-limit ></el-input>
    </div>
  </el-form-item>

  <el-row :gutter="10" >
     <el-col :span="8">
      <el-form-item label="电枪数量" prop="plugs" >
        <el-select v-model="form.plugs"  placeholder="请选择电枪数量">
           <el-option label="1" :value=1></el-option>
          <el-option label="2" :value=2></el-option>
        </el-select>
    </el-form-item>
    </el-col> 
  </el-row>

  <el-row :gutter="10" >
    <el-col :span="8">
    <el-form-item label="电桩厂家" prop="brand" >
      <el-select value-key=value v-model="form.brand" placeholder="请选择电桩厂家">
        <el-option label="易路充CHA-01" :value=1></el-option>
        <el-option label="瑞华" :value=2></el-option>
        <el-option label="易路充YX" :value=3></el-option>
      </el-select>
    </el-form-item>
    </el-col>

    <el-col :span="8">
      <el-form-item label="充电方式" prop="ifFast">
        <el-radio v-model="form.ifFast" class="input-reader-name" :label=2>慢充</el-radio>
        <el-radio v-model="form.ifFast" class="input-reader-name" :label=1>快充</el-radio>
      </el-form-item>
    </el-col> 
  </el-row>

  <el-row :gutter="10" >
    <el-col :span="8">
      <el-form-item label="充电功率"  prop="power">
      <el-select v-model="form.power" placeholder="请选择充电功率">
        <el-option label="7KW" :value=1></el-option>
        <el-option label="34KW" :value=2></el-option>
      </el-select>
    </el-form-item>
    </el-col> 

    <el-col :span="8">
    <el-form-item label="充电模式" prop="acdc">
      <el-radio v-model="form.acdc"  class="input-reader-name" :label=1>交流</el-radio>
      <el-radio v-model="form.acdc" class="input-reader-name" :label=2>直流</el-radio>
    </el-form-item>
    </el-col> 

  </el-row>
  <el-row :gutter="10" >
     <el-col :span="8">
      <el-form-item label="选择费率" prop="modelId" >
        <el-select v-model="form.modelId"  placeholder="请选择">
          <el-option
            v-for="item in models"
            :key="item.id"
            :label="item.modelName"
            :value="item.id">
          </el-option>
        </el-select>
    </el-form-item>
    </el-col> 
  </el-row>
  

   <el-form-item label="物联网卡"  >
    <div style="width:200px">
    <el-input  v-model="form.iccid"   show-word-limit ></el-input>
    </div>
  </el-form-item>  
<br/>
<br/>
   
<el-row>
  <el-col :span="16">
    <el-form-item label="备注">
      <el-input type="textarea" v-model="form.desc"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="action==='create'?createData():updateData()" :loading=uploading>确认</el-button>
      <el-button  @click="handleBack">取消</el-button>
    </el-form-item>
  </el-col>
</el-row>
</el-form>
</el-main>
</div>
</template>
<script>
import request from '@/utils/request'
    export default {
   mounted:function(){
      this.action=this.$route.query.action;
      if(this.action =='create')
        this.getId();
      else {
        this.id =this.$route.query.id;
        this.refresh();
      }
      this.$refs['dataForm'].clearValidate();

       setTimeout(() => {
        this.getFeeModel();
      }, 120)
     
   },
    data() {
      return {
        textMap: {
          update: '修改',
          create: '新建'
        },
        action:'',
        serialNum:'',
        uploading:false,
        id:'',
        models:[],
        value:'',
        form: {   },
        rules:{
          modelId: [{ required: true, message: '费率未选择', trigger: 'change' }],
          acdc: [{ required: true, message: '未选择', trigger: 'change' }],
          power: [{ required: true, message: '未选择', trigger: 'change' }],
          ifFast: [{ required: true, message: '未选择', trigger: 'change' }],
          brand: [{ required: true, message: '未选择', trigger: 'change' }],
          plugs: [{ required: true, message: '未选择', trigger: 'change' }]
      }
      }
    },
    methods: {
      updateData() {
        var _this = this;
        this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          _this.uploading=true;
          request({
            url: '/ylc/charger/edit',
            method: 'post',
            data:  _this.form ,
            params:{
              id: _this.id
            }
          }).then(resp => {
                _this.$message({
              type: 'success',
              message:resp.result
            });
              setTimeout(function () {
                _this.handleBack();
              },1200);
          });
        }
        })
      },
      createData() {
        var _this= this;
        this.$refs['dataForm'].validate((valid) => {
        if (valid) {
           _this.uploading=true;
          request({
            url: '/ylc/charger/add',
            method: 'post',
            data:  _this.form ,
            params:{
              departId: _this.$store.getters.stationId,
            }
          }).then(resp => {
                _this.$message({
              type: 'success',
              message:resp.result
            });
              setTimeout(function () {
                _this.handleBack();
              },1200);
          });
        }
        })
      },
      getFeeModel(){
        var _this = this;
          request({
          url: '/ylc/feeModel/queryByDepartId',
            method: 'get',
            params:{
              departId:_this.$store.getters.stationId
            }
          }).then(resp => {
              _this.$message({
              type: 'success',
              message:resp.message,
            });
            _this.models = resp.result;
            console.log(_this.models)
          });
      },

      refresh(){
       var  _this=this;
        request({
        url: '/ylc/charger/queryById',
        method: 'get',
        params:{
          id:_this.id
        }
      }).then(resp => {
            _this.$message({
          type: 'success',
          message:resp.message,
        });
        _this.form = resp.result;
      });
      },
      getId(){
        var _this= this;
         request({
              url: '/ylc/charger/genSerialNum',
              method: 'get'
            }).then(resp => {
              _this.form.serialNum = resp.result.serialNum;
            });
      },
     
      handleBack(){
        var _this = this;
        this.$router.push({
          path: 'chargers'
        })
      }
    }
  }
</script>


<style>

  .charger_edit_main {
    justify-content: flex-start;
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    background-color: #ffffff;
    margin-top: 20px;
    padding-top: 10px;
    width: 1000px;
  }


  #defaultStartTime{
    background-color: #d0d0d0;
  }
   #defaultEndTime{
    background-color: #d0d0d0;
  }
 
</style>

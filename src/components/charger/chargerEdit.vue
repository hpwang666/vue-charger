<template>

<div style="max-height:600px">
  
 <el-main class="charger_edit_main">
  <el-form ref="dataForm" :model="form" :rules =rules label-width="120px" >
  <el-form-item label="电桩ID"  >
    <div style="width:120px">
    <el-input :disabled=true v-model="form.id"   show-word-limit ></el-input>
    </div>
  </el-form-item>
  <el-form-item label="电站地址" prop="address">
    <div style="width:60%">
    <el-input v-model="form.address"></el-input>
    </div>
  </el-form-item>

  <el-form-item label="联系电话" prop="phone">
    <div style="width:30%">
    <el-input v-model="form.phone"></el-input>
    </div>
  </el-form-item>

  <el-form-item  v-for="(domain,index) in form.rates" :key=index :label="'设置'+domain.name+'费率： '" :prop="'rates[' + index + '].data0'">
    
    <el-col :span="7"  >
      <el-input v-model="domain.data0"  size="small"  ><template slot="prepend">电费</template> <template slot="append">元/度</template></el-input>
    </el-col>
    <el-col  :span="2"> -</el-col>
      <el-col :span="7">
      <el-input v-model="domain.data1"  size="small" ><template slot="prepend">服务费</template><template slot="append">元/度</template></el-input>
    </el-col>
  </el-form-item>  
   

  <el-form-item v-for="(item,index) in form.timeQuantum"   :key=item.startTime :label="'配置时间段'+index">
    <el-col :span="7">
      <el-time-select  size="small"  v-model="item.startTime"  style="width: 60%;" 
        :picker-options="{
        start: item.startTime,
        step: '01:00',
        end: item.endTime
      }"> 
      </el-time-select>
    </el-col>
  
    <el-col :span="7">
      <el-time-select placeholder="选择时间"  size="small" v-model="item.endTime" style="width: 60%;" 
      :picker-options="{
        start:item.startTime,
        step: '01:00',
        end: '24:00'
      }"> 
      </el-time-select>
    </el-col>

    <el-col :span="4">
      <el-select v-model="item.rate" placeholder="请选择费率" size="small">
        <el-option label="尖费率" value="0"></el-option>
        <el-option label="峰费率" value="1"></el-option>
        <el-option label="平费率" value="2"></el-option>
        <el-option label="谷费率" value="3"></el-option>
      </el-select>
    </el-col>

    <el-col :span="4" v-if="ifNeddRestRow && index==0">
      <el-button  size="small" type="success" icon="el-icon-plus" circle @click="addNewRate"></el-button>
       <el-button  size="small" type="danger" icon="el-icon-minus" circle @click="delNewRate"></el-button>
    </el-col>

  </el-form-item>

 <el-form-item v-if="ifNeddRestRow" label="配置剩余时间段" >
    <el-col :span="7"  >
      <el-time-select id="defaultStartTime"  placeholder="选择时间"  size="small" :clearable=false v-model="form.row_last_startTime"  style="width: 60%;" 
      :picker-options="{
        start: form.row_last_startTime,
        step: '01:00',
        end: form.row_last_startTime
      }"> 
      </el-time-select>
    </el-col>
  
    <el-col :span="7">
      <el-time-select id="defaultEndTime" placeholder="选择时间"   size="small" :clearable=false v-model="form.row_last_endTime" style="width: 60%; "
      :picker-options="{
        start: form.row_last_endTime,
        step: '01:00',
        end: form.row_last_startTime
      }"> 
      </el-time-select>
    </el-col>

    <el-col :span="4">
      <el-select v-model="form.row_last_rate" placeholder="请选择费率" size="small">
        <el-option label="尖费率" value="0"></el-option>
        <el-option label="峰费率" value="1"></el-option>
        <el-option label="平费率" value="2"></el-option>
        <el-option label="谷费率" value="3"></el-option>
      </el-select>
    </el-col>

  </el-form-item>

  
  <el-form-item label="备注">
    <el-input type="textarea" v-model="form.desc"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">提交</el-button>
    <el-button  @click="handleBack">取消</el-button>
  </el-form-item>
</el-form>
</el-main>
</div>
</template>
<script>
import request from '@/utils/request'
    export default {
   mounted:function(){
      this.action=this.$route.query.action;
      if(this.action =='add')
      this.getId();
      else {
        //this.form.id = this.$route.query.id;
        this.getRateById();
      }
      this.$refs['dataForm'].clearValidate()
   },
    data() {
      return {
        action:'',
        form: {
          id:'',
          phone: '',
          address: '',
          rates:[
            {name:'尖',data0:'',data1:''},
            {name:'峰',data0:'',data1:''},
            {name:'平',data0:'',data1:''},
            {name:'谷',data0:'',data1:''}
          ],
          timeQuantum:[
          {
            startTime:'0:00',
            endTime:'',
            rate:''          }
          ],
          row_last_startTime:"0:00",
          row_last_endTime:'',
          row_last_rate:'',
          desc: ''
        },
      rules:{
        phone: [{ required: true, message: '手机号码未填写', trigger: 'blur' },
                {pattern:/^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/,message: '手机号码格式错误', trigger: 'blur'}],
        address: [{ required: true, message: '地址未填写', trigger: 'blur' }],
        rates:[
          {data0: [{ required: true, message: '费率未配置', trigger: 'blur' },{pattern:/^[0-9]+(.[0-9]{2})?$/,message: '只允许数字,小数2位', trigger: 'blur'}]},
          {data0: [{ required: true, message: '费率未配置', trigger: 'blur' },{pattern:/^[0-9]+(.[0-9]{2})?$/,message: '只允许数字,小数2位', trigger: 'blur'}]},
          {data0: [{ required: true, message: '费率未配置', trigger: 'blur' },{pattern:/^[0-9]+(.[0-9]{2})?$/,message: '只允许数字,小数2位', trigger: 'blur'}]},
          {data0: [{ required: true, message: '费率未配置', trigger: 'blur' },{pattern:/^[0-9]+(.[0-9]{2})?$/,message: '只允许数字,小数2位', trigger: 'blur'}]},
          ]
      }
      }
    },
    methods: {
      onSubmit() {
        this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var _this = this;
          request({
            url: '/vue-element-admin/dev/chargerAdd',
            method: 'post',
            data:  this.form 
          }).then(resp => {
                _this.$message({
              type: 'success',
              message:resp.data
            });
                _this.handleBack();
          });
        }
        })
      },
      getId(){
        var _this= this;
         request({
              url: '/vue-element-admin/dev/genId',
              method: 'get'
            }).then(resp => {
              _this.form.id = resp.data.id;
            });
      },
      getRateById(){
          var _this= this;
          request({
              url: '/vue-element-admin/dev/getRateById',
              method: 'get'
            }).then(resp => {
              _this.form = resp.data;
            });
      },
      addNewRate(){
        const tempNewRate =   {
            startTime:this.form.timeQuantum[this.form.timeQuantum.length-1].endTime,
            endTime:'',
            rate:''}
        this.form.timeQuantum.splice(this.form.timeQuantum.length, 1, tempNewRate)
      },
      delNewRate(){
          if(this.form.timeQuantum.length>1){
            this.form.timeQuantum.splice(this.form.timeQuantum.length-1, 1);
          }
      },
      handleBack(){
        var _this = this;
        this.$router.push({
          path: 'chargers'
        })
      }
    },
    computed:{
      ifNeddRestRow(){
        if(this.form.timeQuantum[this.form.timeQuantum.length-1].endTime ==='24:00'||this.form.timeQuantum[this.form.timeQuantum.length-1].endTime ===''){
          this.form.row_last_startTime ='';
          this.form.row_last_endTime = '';
          return false;
        }
        else {
          this.form.row_last_startTime = this.form.timeQuantum[this.form.timeQuantum.length-1].endTime;
          this.form.row_last_endTime = '24:00';

          return true;
        }
    }}
  }
</script>


<style>

  .charger_edit_main {
    /*justify-content: flex-start;*/
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    background-color: #ffffff;
    margin-top: 20px;
    padding-top: 10px;
    width: 70%;
  }

  #defaultStartTime{
    background-color: #d0d0d0;
  }
   #defaultEndTime{
    background-color: #d0d0d0;
  }
 
</style>

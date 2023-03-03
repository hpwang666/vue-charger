<template>

<div style="max-height:600px">
  
 <el-main class="charger_edit_main">
  <el-form ref="dataForm" :model="form" :rules =rules  label-width="120px" >
  <el-form-item label="电桩ID"  >
    <div style="width:140px">
    <el-input :disabled=true v-model="serialNum"   show-word-limit ></el-input>
    </div>
  </el-form-item>
  

  <el-form  :model="form"    label-width="80px" :inline="true" label-position="right">
    <div  v-for="(domain,index) in form.rates" :key="index"  style=" float:left" >
      <el-form-item :label="domain.name+'电费： '" label-width="100px" :prop="'rates[' + index + '].data0'" :rules="ratesRules.data0" >
        <el-input v-model="domain.data0"  size="small"  > <template slot="append">元/度</template></el-input>
      </el-form-item>
      <el-form-item :label="domain.name+'服务费： '" label-width="100px" :prop="'rates[' + index + '].data1'" :rules="ratesRules.data1">
        <el-input v-model="domain.data1"  size="small"  > <template slot="append">元/度</template></el-input>
      </el-form-item>
    </div>  
  </el-form>
   
<div style=" float:left" >
  <el-form-item v-for="(item,index) in form.timeQuantum"    :key=index :label="'配置时间段'+index">
    <el-col :span="7">
      <el-time-select  size="small"  v-model="item.startTime"  :readonly=true :clearable=false style="width: 60%;" 
        :picker-options="{
        start: item.startTime,
        step: '01:00',
        end: item.endTime
      }"> 
      </el-time-select>
    </el-col>
  
    <el-col :span="7">
      <el-time-select placeholder="选择时间"  size="small" :readonly=fuckRead[index] :clearable=false v-model="item.endTime" style="width: 60%;" 
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
      <el-time-select id="defaultStartTime"  placeholder="选择时间"  size="small" :clearable=false  v-model="row_last_startTime"  style="width: 60%;" 
      :picker-options="{
        start: row_last_startTime,
        step: '00:30',
        end: row_last_startTime
      }"> 
      </el-time-select>
    </el-col>
  
    <el-col :span="7">
      <el-time-select id="defaultEndTime" placeholder="选择时间"   size="small" :clearable=false  v-model="row_last_endTime" style="width: 60%; "
      :picker-options="{
        start: row_last_endTime,
        step: '01:00',
        end: row_last_startTime
      }"> 
      </el-time-select>
    </el-col>

    <el-col :span="4">
      <el-select v-model="row_last_rate" placeholder="请选择费率" size="small">
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
    <el-button type="primary" @click="action==='create'?createData():updateData()">确认</el-button>
    <el-button  @click="handleBack">取消</el-button>
  </el-form-item>
</div>
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
        this.serialNum =this.$route.query.serialNum;
        this.getRateById();
      }
      this.$refs['dataForm'].clearValidate()
   },
    data() {
      return {
        textMap: {
          update: '修改',
          create: '新建'
        },
        action:'',
        serialNum:'',
        fuckRead:[false,false,false,false,false,false,false,false],
        form: {
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
          desc: ''
        },
        row_last_startTime:"0:00",
        row_last_endTime:'',
        row_last_rate:'',   
      rules:{
        address: [{ required: true, message: '地址未填写', trigger: 'blur' }]
        
      },
      ratesRules: {
        data0: [
          { required: true, message: '费率未XX', trigger: 'blur' },{pattern:/(^(0){1}$)|(^[0-9]\.[0-9]{2}?$)/,message: '需填写2位小数', trigger: 'blur'}
        ],
        data1: [
          { required: true, message: '费率未XX', trigger: 'blur' },{pattern:/(^(0){1}$)|(^[0-9]\.[0-9]{2}?$)/,message: '需填写2位小数', trigger: 'blur'}
        ]
      }
      }
    },
    methods: {
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var _this = this;
            if(_this.row_last_endTime !=''){
               const tempNewRate =   {
                  startTime:_this.row_last_startTime,
                  endTime:_this.row_last_endTime,
                  rate:_this.row_last_rate}
            this.form.timeQuantum.splice(this.form.timeQuantum.length, 1, tempNewRate)
            }

          
          request({
            url: '/charger/feeModel/edit',
            method: 'post',
            data:  _this.form ,
            params:{
              serialNum: _this.serialNum
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
          if(_this.row_last_endTime !=''){
               const tempNewRate =   {
                  startTime:_this.row_last_startTime,
                  endTime:_this.row_last_endTime,
                  rate:_this.row_last_rate}
            _this.form.timeQuantum.splice(_this.form.timeQuantum.length, 1, tempNewRate)
            }
          request({
            url: '/charger/add',
            method: 'post',
            data:  _this.form ,
            params:{
              departId: _this.$store.getters.stationId,
              serialNum:_this.serialNum
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
      getId(){
        var _this= this;
         request({
              url: '/charger/genSerialNum',
              method: 'get'
            }).then(resp => {
              _this.serialNum = resp.result.serialNum;
            });
      },
      getRateById(){
          var _this= this;
          request({
              url: '/charger/feeModel',
              method: 'get',
              params:{
                serialNum:_this.serialNum
              }
            }).then(resp => {
              _this.form = resp.result;

              //为了美观，当2个时间段以上时 最后一行删除，那么显示的时候就会自动的将最后一行以 <剩余时间> 模式显示
              if((this.form.timeQuantum[this.form.timeQuantum.length-1].endTime ==='24:00')&&(this.form.timeQuantum.length>1)){
                this.row_last_rate = this.form.timeQuantum[this.form.timeQuantum.length-1].rate;
                this.form.timeQuantum.splice(this.form.timeQuantum.length-1, 1);
              }
                
              //添加之后之前的就不能选择了，否则逻辑就乱了
              for(let i=0;i<this.form.timeQuantum.length-1;i++){
                  this.fuckRead[i]=true
              }
              
            });
      },
      addNewRate(){
        const tempNewRate =   {
            startTime:this.form.timeQuantum[this.form.timeQuantum.length-1].endTime,
            endTime:'',
            rate:'2'}
        this.form.timeQuantum.splice(this.form.timeQuantum.length, 1, tempNewRate)
        
        //添加之后之前的就不能选择了，否则逻辑就乱了
        for(let i=0;i<this.form.timeQuantum.length-1;i++){
          
             this.fuckRead[i]=true
        }
      },
      delNewRate(){
          if(this.form.timeQuantum.length>1){
           
            this.form.timeQuantum.splice(this.form.timeQuantum.length-1, 1);
            
            this.fuckRead[this.form.timeQuantum.length-1]=false
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
          this.row_last_startTime ='';
          this.row_last_endTime = '';
          return false;
        }
        else {
          this.row_last_startTime = this.form.timeQuantum[this.form.timeQuantum.length-1].endTime;
          this.row_last_endTime = '24:00';
          if( this.row_last_rate=='') this.row_last_rate='2';
          return true;
        }
    }}
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
    width: 70%;
  }


  #defaultStartTime{
    background-color: #d0d0d0;
  }
   #defaultEndTime{
    background-color: #d0d0d0;
  }
 
</style>

<template>

<div style="max-height:600px">
  
 <el-main class="charger_edit_main">
  <el-form ref="form" :model="form" label-width="120px" >
  <el-form-item label="电桩ID"  >
    <div style="width:120px">
    <el-input v-model="form.id" maxlength="7"  show-word-limit ></el-input>
    </div>
  </el-form-item>
  <el-form-item label="电站地址">
    <div style="width:60%">
    <el-input v-model="form.address"></el-input>
    </div>
  </el-form-item>

  <el-form-item label="联系电话">
    <div style="width:30%">
    <el-input v-model="form.phone"></el-input>
    </div>
  </el-form-item>

  <el-form-item  v-for="(domain) in rate" :key="domain" :label="'设置'+domain+'费率： '" >
    
    <el-col :span="7">
      <el-input v-model="form.data1"  size="small" ><template slot="prepend">电费</template> <template slot="append">元/度</template></el-input>
    </el-col>
    <el-col  :span="2"> -</el-col>
      <el-col :span="7">
      <el-input v-model="form.data2"  size="small" ><template slot="prepend">服务费</template><template slot="append">元/度</template></el-input>
    </el-col>
  </el-form-item>  
   

  <el-form-item v-for="(item,index) in rateInTime.timeQuantum"   :key=item.startTime :label="'配置时间段'+index">
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
      <el-select v-model="form.resource" placeholder="请选择费率" size="small">
        <el-option label="尖费率" value="shanghai"></el-option>
        <el-option label="平费率" value="beijing"></el-option>
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
        <el-option label="尖费率" value="shanghai"></el-option>
        <el-option label="平费率" value="beijing"></el-option>
      </el-select>
    </el-col>

  </el-form-item>

  <el-form-item label="即时配送">
    <el-switch v-model="form.delivery"></el-switch>
  </el-form-item>
  <el-form-item label="活动性质">
    <el-checkbox-group v-model="form.type">
      <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
      <el-checkbox label="地推活动" name="type"></el-checkbox>
      <el-checkbox label="线下主题活动" name="type"></el-checkbox>
      <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
    </el-checkbox-group>
  </el-form-item>
  <el-form-item label="特殊资源">
    <el-radio-group v-model="form.resource">
      <el-radio label="线上品牌商赞助"></el-radio>
      <el-radio label="线下场地免费"></el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="备注">
    <el-input type="textarea" v-model="form.desc"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">创建</el-button>
    <el-button>取消</el-button>
  </el-form-item>
</el-form>
</el-main>
</div>
</template>
<script>
    export default {
    data() {
      return {
        row1_endTime:'',
        form: {
          id:'',
          phone: '',
          address: '',
          data1: '',
          data2: '',
          data3:'',
          data4:'',
          row1_startTime:"0:00",
          row1_endTime:'',
          row1_rate:'',
          row_last_startTime:"0:00",
          row_last_endTime:'',
          row_last_rate:'',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formInline: {
          user: '',
          region: ''
        },
        rate:['尖','峰','平','谷'],
        rateInTime:{
          timeQuantum:[
          {
            startTime:'0:00',
            endTime:'',
            rate:'',
            restRow:false}//这里用来表示默认的行，用于显示余下的时间
          ],
          row_last_endTime:''//这个决定着是否添加静态行来显示剩下的时间
        }

      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      addNewRate(){
        const tempNewRate =   {
            startTime:this.rateInTime.timeQuantum[this.rateInTime.timeQuantum.length-1].endTime,
            endTime:'',
            rate:'',
            restRow:false}//这里用来表示默认的行，用于显示余下的时间
        this.rateInTime.timeQuantum.splice(this.rateInTime.timeQuantum.length, 1, tempNewRate)
      },
      delNewRate(){
          if(this.rateInTime.timeQuantum.length>1){
            this.rateInTime.timeQuantum.splice(this.rateInTime.timeQuantum.length-1, 1);
          }
      },
    },
    computed:{
      ifNeddRestRow(){
         console.log('rateInTime!'+this.rateInTime.timeQuantum.length);
        if(this.rateInTime.timeQuantum[this.rateInTime.timeQuantum.length-1].endTime ==='24:00'||this.rateInTime.timeQuantum[this.rateInTime.timeQuantum.length-1].endTime ==='')
          return false;
        else {
          this.form.row_last_startTime = this.rateInTime.timeQuantum[this.rateInTime.timeQuantum.length-1].endTime;
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

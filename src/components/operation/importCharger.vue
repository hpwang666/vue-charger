<template>
  <el-container>
    <el-header class="charger_import_header">
      <div   class="fw flex-row flex-start" style="align-items: center;">
        
        
        <div style="width:200px;padding-left: 20px">
          <el-input v-model="searchSerialNum" clearable placeholder="桩号模糊查询" ></el-input>
        </div>
      <div  style="padding-left:20px;">
        <el-button  type="success" size="medium"  @click="handleSearch">搜索</el-button>
      </div>
      <div class="import_btn">
        <el-button type="success" size="medium"  @click="handleImport">关联项目</el-button>
      </div>
      </div>
    </el-header>
    <el-main class="charger_import_body">
      <el-table
        ref="multipleTable"
        :data="chargers"
        style="width: 100%;"
        :max-height="tableHeight"
        :max-width="tableWidth"
        size="small"
        @selection-change="handleSelectionChange"
        border>
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="序号"
          type = "index"
          width="70" align="left">
        </el-table-column>
        <el-table-column
          label="设备序列号"
          prop="serialNum"
          width="140" align="left">
        </el-table-column>

        <el-table-column
          prop="departName"
           width="200"
          label="所属项目" align="left">
        </el-table-column>

        <el-table-column
          prop="plugs"
          label="枪头数量" align="left">
        </el-table-column>

        <el-table-column
          label="电桩型号"
          prop="brand"
          width="200" align="left">
        </el-table-column>

      
       <el-table-column
          label="绑定状态"
          prop="status"
          width="140" >
          <template slot-scope="{row}">
            <el-tag :type="row.status | statusFilter" effect="dark" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
      
      
      </el-table>

    

      <el-dialog title="批量关联桩号" :visible.sync="importChargerVisible" width="450px">
      <el-form ref="importChargersForm"  :model="importChargerData" :rules="rulesMap" label-position="right" size="mini" label-width="100px" style="width: 100%;padding-left:20px;">
       
     
        <el-form-item label="导入项目" >
          <div style="width:200px;padding-left:20px;">
          <el-input  :disabled=true v-model="importChargerData.projectName" >
          
          </el-input>
          </div>
        </el-form-item>
       
        <el-form-item label="导入数量" prop="num">
           <div style="width:200px;padding-left:20px;">
            <el-input  :disabled=true v-model="importChargerData.num" >
               </el-input>
           </div>
        </el-form-item>

         <el-form-item label="名称前缀" prop="chargerName" >
          <div style="width:200px;padding-left:20px;">
          <el-input   v-model="importChargerData.chargerName" >
          
          </el-input>
          </div>
        </el-form-item>

        <el-form-item label="选择费率" prop="modelId" >
           <div style="width:180px;padding-left:20px;">
          <el-select v-model="importChargerData.modelId"  placeholder="请选择">
            <el-option
              v-for="item in models"
              :key="item.id"
              :label="item.modelName"
              :value="item.id">
            </el-option>
          </el-select>
           </div>
        </el-form-item>

      </el-form>
      <div  class="dialog-import-chargers">
        <el-button size="small"  @click="importChargerVisible = false">
          取消
        </el-button>
        <el-button size="small" type="primary" :loading=uploading @click="importChargers()">
          确认
        </el-button>
      </div>
    </el-dialog>
          
    </el-main>

    <div style="padding-bottom:0px" class="charger_import_footer">
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
   import { mapGetters } from 'vuex'
  
  export default{
   
   
    watch: {
        stationId:function (){ //动态监听电站ID的变化，刷新界面
         this.getFeeModel();
      }
     

    },//end watch 
    methods: {
      handleSizeChange(val){
       //console.log("handleSizeChange: "+val)
        this.pageSize=val;
        //以下是为了当pageNo变化时候会触发两次请求
       // if (this.pageNo * (val-1) > this.total) return
        
         this.searchCharges();
      },
      handleCurrentChange(val){
        this.pageNo=val;
         this.searchCharges();
      },
       handleSelectionChange(val) {
         this.multipleSelection = val;
      },
      
      handleImport(){
        var _this = this;
        if(_this.multipleSelection.length==0)
        {
            this.$alert('请勾选至少一个桩号', '请勾选', {
            confirmButtonText: '确定',
          });
        return;
        }

        request({
            url: '/ylc/charger/checkStation',
            method: 'get',
            params:{
              departId:_this.stationId
            }
          }).then(resp=> {
           _this.importChargerData = {
              projectName:_this.stationName,
              num: _this.multipleSelection.length,
              chargerName:'',
              modelId:''
            };
          _this.importChargerVisible=true;
        }).catch();

        
      },
      handleSearch(){
          
          this.pageNo=1;
          this.pageSize=10;
          this.chargers=[];
          this.searchCharges()
      },
      getFeeModel(){
        var _this = this;
          request({
          url: '/ylc/feeModel/queryByDepartId',
            method: 'get',
            params:{
              departId:_this.stationId
            }
          }).then(resp => {
              _this.$message({
              type: 'success',
              message:resp.message,
            });
            _this.models = resp.result;
          });
      },
      searchCharges(){
         let _this = this;
        request({
          url: '/ylc/charger/chargersOpr',
          method: 'get',
          params:{
            preSerialNum:_this.searchSerialNum,
            status:2,
            pageNo:_this.pageNo,
            pageSize:_this.pageSize
          }
        }).then(resp=> {

          var tempList = resp.result.records;;
          _this.total = resp.result.total;

          _this.chargers = tempList;

           _this.$message({
            type: 'success',
            message: resp.message,
            duration:1800
          });
        
        }).catch(()=>{
          _this.$message({
            type: 'error',
            message: '加载失败'
          });
        });
      },
     
      importChargers() {
        var _this= this;
        _this.$refs['importChargersForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, _this.importChargerData)
          var selectedSerialNum=_this.multipleSelection.map(item=>item.serialNum);
          // _this.importChargerData.map(((item)=> {
          //     selectedSerialNum.push(item.serialNum);
          // }));
          _this.uploading=true;
          request({
            url: '/ylc/charger/importChargers',
            method: 'post',
            data:  selectedSerialNum ,
            params:{
              name: tempData.chargerName,
              stationId:_this.stationId,
              modelId: tempData.modelId
              
            }
          }).then(resp => {
              _this.$message({
                type: 'success',
                message:resp.result,
                duration:2800
              });
              setTimeout(() => {
                _this.uploading=false;
                _this.importChargerVisible=false;
                _this.searchCharges();
              }, 1200)
              
          }).catch(err=>{
            _this.uploading=false;
            _this.importChargerVisible=false;
          });
        }
        })
      },
      refresh(){
        this.getFeeModel();
       this.searchCharges();
    }
    },//end methods
    mounted: function () {
      setTimeout(() => {
        this.refresh();
      }, 300)
      this.$nextTick(() => {
          this.tableHeight = window.innerHeight - 340;
          this.tableWidth =  window.innerWidth-500;
      })
    },
    computed: {
        ...mapGetters(['stationId','stationName'])
    },
    data(){
      return {
        tableHeight:200,
        tableWidth:200,
        searchSerialNum:'',
       
        pageSize:10,
        pageNo:1,
        total:0,
      
        models:'',
        multipleSelection:[],
        importChargerVisible:false,
        importChargerData:'',
        chargers: [],
        bindStatus: [{value:0,lable:'已绑定'},{value:1,lable:'已删除'},{value:2,lable:'未绑定'}],
       
        

        rulesMap:{ 
            chargerName: [{ required: true, message: '未填写', trigger: 'blur' }],
             modelId: [{ required: true, message: '未选择', trigger: 'change' }]    },
        uploading:false

      }
    },
    filters: {
    statusFilter(status) {
      const statusMap = {
        已绑定: 'info',
        未绑定: 'success',
        已删除: 'warning'
      }
      return statusMap[status]
    }
  }
  }
</script>
<style>

 .charger_import_header {
    background-color: #ececec;
    margin-top: 12px;
    padding-left: 5px;
    display: flex;
    justify-content: flex-start;
  }
  .charger_import_body {
    /*justify-content: flex-start;*/
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    background-color: #ececec;
    margin-top: 20px;
    padding-top: 10px;
  }

  .dialog-import-chargers{
    text-align: center;
    padding-top:20px;
  }

  .import_btn{
    margin-left: auto;
     
  }

  .charger_import_footer{
    width: 100%;
    position: absolute;
    bottom: 25px;
  }
  
 
  #qrHtml{
    padding-top:20px;
    padding-bottom:20px;
    display: flex;
    justify-content:space-around;
  }
 
</style>

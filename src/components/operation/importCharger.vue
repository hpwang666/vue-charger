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

    

      <el-dialog title="批量关联桩号" :visible.sync="importChargerVisible" width="480px">
      <el-form ref="importChargersForm"  :model="importChargerData" :rules="rulesMap" label-position="right" size="mini" label-width="100px" style="width: 100%;padding-left:20px;">
       
           <el-form-item label="所属城市" id="cityInPrj">
            <div style="width:180px;padding-left:20px;">
          <el-select v-model="cityId" placeholder="请选择城市">
            <el-option
              v-for="item in citys"
              :key="item.id"
              :label="item.departName"
              :value="item.id">
            </el-option>
          </el-select>
            </div>
        </el-form-item>

        <el-form-item label="所属集团" prop="groupId" id="groupInPrj">
          <div style="width:180px;padding-left:20px;">
          <el-select v-model="groupId" placeholder="请选择集团">
            <el-option
              v-for="item in groups"
              :key="item.id"
              :label="item.departName"
              :value="item.id">
            </el-option>
          </el-select>
          </div>
        </el-form-item>
       
        <el-form-item label="所属公司" prop="companyId" id="companyInPrj">
          <div style="width:180px;padding-left:20px;">
          <el-select v-model="companyId" placeholder="请选择公司">
            <el-option
              v-for="item in companys"
              :key="item.id"
              :label="item.departName"
              :value="item.id">
            </el-option>
          </el-select>
          </div>
        </el-form-item>
        <el-form-item label="所属项目" prop="parentId" id="stationInPrj">
          <div style="width:180px;padding-left:20px;">
          <el-select v-model="stationId" placeholder="请选择充电站">
            <el-option
              v-for="item in stations"
              :key="item.id"
              :label="item.departName"
              :value="item.id">
            </el-option>
          </el-select>
             </div>
        </el-form-item>
        
       
        <el-form-item label="导入数量" prop="num">
           <div style="width:180px;padding-left:20px;">
            <el-input  :disabled=true v-model="importChargerData.num" >
               </el-input>
           </div>
        </el-form-item>

         <el-form-item label="电桩名称" prop="chargerName" >
          <div style="width:180px;padding-left:20px;">
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
   import { treeFilter,treeFind } from '@/utils/utils'
   import { mapGetters } from 'vuex'
  
  export default{
   
   
    watch: {
    
      cityId: function (val) {
        var _this=this;

         if(this.cityId==null) return;//cityId的变化导致这个可能为null
        
        //let cityChildren=this.departTree.filter(ele => ele.key == val);
        let cityChildren=treeFind(this.departTree,node=>node.key==val).children ;//找出城市下面的集团
       
        _this.groups.length=0;
        if( cityChildren == null){//这个城市没有子节点
          _this.groupId=null;
          return;
        }


        if(cityChildren.length>0){
          cityChildren.map(((item, index)=> {
            _this.groups.push({id:item.key,departName:item.value});
          }))
        }
        

        if(_this.groupId!=null){
          let v= _this.groups.filter(i=>i.id==_this.groupId);
          if( v.length==0)//这时候已经不属于城市下面的集团id了
            _this.groupId=null;
        }

    

      },
       groupId: function (val) {
        var _this=this;
        if(this.groupId==null){
          _this.companys.length=0;
          _this.companyId=null;
           return;
        }
        //cityId的变化导致这个可能为null

        let groupChildren= treeFind(this.departTree,node=>node.key==this.groupId).children ;//找出是哪个集团

        _this.companys.length=0;
        if(groupChildren==null){
           _this.companyId=null
           return;
        }

        groupChildren.map(((item, index)=> {
          _this.companys.push({id:item.key,departName:item.value});
        }))


        
        if(_this.companyId!=null){
          let v= _this.companys.filter(i=>i.id==_this.companyId);
          if( v.length==0)//这时候已经不属于城市下面的集团id了
            _this.companyId=null;
        }

     
      },
      companyId: function (val) {
        var _this=this;
        if(this.companyId==null) 
        {
          _this.stationId=null;
          _this.stations.length=0;
          return;//cityId的变化导致这个可能为null
        }

        let companyChildren= treeFind(this.departTree,node=>node.key==this.companyId).children ;//找出是哪个集团

        _this.stations.length=0;
        if(companyChildren==null){
           _this.stationId=null;
           return;
        }

        companyChildren.map(((item, index)=> {
          _this.stations.push({id:item.key,departName:item.value});
        }))

        if(_this.stationId!=null){
          let v= _this.stations.filter(i=>i.id==_this.stationId);
          if( v.length==0)//这时候已经不属于公司下面的集团id了
            _this.stationId=null;
        }
     
      },
      stationId:function (){ //动态监听电站ID的变化，刷新界面
        if(this.stationId==null){
            this.models.length=0;
        }
        else{
          this.importChargerData.modelId=null;
           this.getFeeModel();
        }
        
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
        this.resetTemp();

     


        this.citys.length=0;
        this.cityId=null;
        this.companys.length=0;
        this.companyId=null;
        this.groups.length=0;
        this.groupId=null;
        this.stations.length=0;
        this.stationId=null;
        
        let tmpCity = treeFilter(this.departTree,node=>node.orgCategory==1) ;//过滤出所有城市
        if(tmpCity.length>0){
            tmpCity.map(((item, index)=> {
              this.citys.push({id:item.key,departName:item.value});
            }))
           
        }else{
            let tmpGroup=treeFilter(this.departTree,node=>node.orgCategory==2) ;//过滤出所有集团
            if(tmpGroup.length>0){
              tmpGroup.map(((item, index)=> {
                this.groups.push({id:item.key,departName:item.value});
              }))
            }
            else{
               let tmpCompany=treeFilter(this.departTree,node=>node.orgCategory==3) ;//过滤出所有公司
              if(tmpCompany.length>0){
                tmpCompany.map(((item, index)=> {
                  this.companys.push({id:item.key,departName:item.value});
                }))
              }
            }
        }
          _this.importChargerVisible=true;

        
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
       this.searchCharges();
      },
      resetTemp() {
        this.temp = {
          index:-1,
          id:'0',
          departName: undefined,
          parentId: undefined,
          updateTime: new Date(),
          memo: ''
        };
         this.importChargerData = {
             num: this.multipleSelection.length,
            chargerName:'',
            modelId:''
           };

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
        ...mapGetters(['stationName','departTree'])
    },
    data(){
      return {
        tableHeight:200,
        tableWidth:200,
        searchSerialNum:'',
       
        pageSize:10,
        pageNo:1,
        total:0,

        stations:[],
        stationId:'',
        companyId:'',
        companys:[],
        groups: [],
        groupId:'',
        citys:[],
        cityId:'',
        temp: "",
      
        models:[],
        multipleSelection:[],
        importChargerVisible:false,
        importChargerData:'',
        chargers: [],
       
        

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

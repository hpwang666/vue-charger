<template>
  <el-container>
    <el-header class="charger_opr_header">
      <div   class="fw flex-row flex-start" style="align-items: center;">
        <el-select v-model="searchStatus" placeholder='绑定状态' clearable style="margin-left: 10px" >
          <el-option v-for="item in bindStatus" :key="item.value" :label="item.lable" :value="item.value" />
        </el-select>
        
        
        <div style="width:200px;padding-left: 20px">
          <el-input v-model="searchSerialNum" clearable placeholder="桩号模糊查询" ></el-input>
        </div>
      <div  style="padding-left:20px;">
        <el-button  type="success" size="medium"  @click="handleSearch">搜索</el-button>
      </div>
      <div class="export_btn">
        <el-button type="success" size="medium"  @click="handleCreate">批量添加</el-button>
        <el-button type="success" size="medium"  @click="handleExport">导出设备</el-button>
      </div>
      </div>
    </el-header>
    <el-main class="charger_opr_body">
      <el-table
        ref="multipleTable"
        :data="chargers"
        style="width: 100%;"
        :max-height="tableHeight"
        max-width="600"
        size="small"
        border>
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
      
      
        <el-table-column
          prop="plugs"
          label="二维码" align="left">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleQrcode(scope.row)">查看
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="left" width="240">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog width=35% :visible.sync="qrVisible" class="qrDialog">
        <div id="qrHtml">
          <div >
            <div class="qrContent">
              <span>{{selectedQr}}</span>
            </div>
            <vue-qr   :logoSrc=logoSrc :text=selectedUrl :size="300"></vue-qr>
          </div>
          <div  v-if="plug2Visable">
            <div class="qrContent">
              <span>{{selectedQr_2}}</span>
            </div>
            <vue-qr   :logoSrc=logoSrc :text=selectedUrl_2 :size="300"></vue-qr>
          </div>
        </div>
        <div>
           <el-button type="primary" class="myButton"  @click="downloadPoster(selectedQr)">生成下载二维码</el-button>
        </div>

      </el-dialog>

      <el-dialog title="批量添加桩号" :visible.sync="addChargerVisible" width="450px">
      <el-form ref="addChargersForm"  :model="addChargerPre" :rules="rulesMap" label-position="right" size="mini" label-width="100px" style="width: 100%;padding-left:20px;">
       
     
        <el-form-item label="桩号" prop="preSerialNum">
          <div style="width:160px;padding-left:20px;">
          <el-input placeholder="3位批量编号"  v-model="addChargerPre.preSerialNum" >
            <template slot="prepend">58</template>
          </el-input>
          </div>
        </el-form-item>
         <el-form-item label="厂家" prop="brand">
          <div style="width:160px;padding-left:20px;">
          <el-select value-key=value v-model="addChargerPre.brand" placeholder="请选择电桩厂家">
            <el-option label="易路充CHA-01" :value=1></el-option>
            <el-option label="瑞华" :value=2></el-option>
            <el-option label="公牛" :value=3></el-option>
            <el-option label="宇视" :value=4></el-option>
          </el-select>
          </div>
        </el-form-item>
        <el-form-item label="充电枪数量" prop="plugs">
          <div style="width:160px;padding-left:20px;">
          <el-select v-model="addChargerPre.plugs"  placeholder="请选择电枪数量">
          <el-option label="1" :value=1></el-option>
          <el-option label="2" :value=2></el-option>
         </el-select>
          </div>
        </el-form-item>
        <el-form-item label="生成数量" prop="num">
           <div style="width:160px;padding-left:20px;">
           <el-input-number v-model="addChargerPre.num"  :min="1" :max="99" label="生成数量"></el-input-number>
           </div>
        </el-form-item>
      </el-form>
      <div  class="dialog-add-chargers">
        <el-button size="small"  @click="addChargerVisible = false">
          取消
        </el-button>
        <el-button size="small" type="primary" :loading=uploading @click="addChargers()">
          确认
        </el-button>
      </div>
    </el-dialog>
          
    </el-main>

    <div style="padding-bottom:0px" class="charger_opr_footer">
   
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
   import VueQr from 'vue-qr'
   import html2canvas from 'html2canvas';
  
  export default{
    components:{
      VueQr
    },
   
    watch: {
      searchStatus: function () {
        this.queryDone=false;
      },
      searchSerialNum:function(){
        this.queryDone=false;
      }


    },//end watch 
    methods: {
      handleSizeChange(val){
       //console.log("handleSizeChange: "+val)
        this.pageSize=val;
        //以下是为了当pageNo变化时候会触发两次请求
       // if (this.pageNo * (val-1) > this.total) return
        
        this.refresh();
      },
      handleCurrentChange(val){
        this.pageNo=val;
        this.refresh();
      },
      
      handleCreate(){
        this.addChargerPre = {
          serialNumPre:'',
          brand:2,
          plugs:1,
          num: 1
        };
        this.addChargerVisible=true;
      },
      handleSearch(){
          this.pageNo=1;
          this.pageSize=10;
          this.chargers=[];
          this.searchCharges()
      },
      searchCharges(){
         let _this = this;
        request({
          url: '/ylc/charger/chargersOpr',
          method: 'get',
          params:{
            preSerialNum:_this.searchSerialNum,
            status:_this.searchStatus,
            pageNo:_this.pageNo,
            pageSize:_this.pageSize
          }
        }).then(resp=> {
          _this.queryDone=true;

          var tempList = resp.result.records;;
          _this.total = resp.result.total;

          _this.chargers = tempList;

           _this.$message({
            type: 'success',
            message: resp.message,
            duration:800
          });
        
        }).catch(()=>{
          _this.$message({
            type: 'error',
            message: '加载失败'
          });
        });
      },

      addChargers() {
        var _this= this;
        this.$refs['addChargersForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, _this.addChargerPre)
           _this.uploading=true;
          request({
            url: '/ylc/charger/addChargers',
            method: 'get',
            params:{
              num: tempData.num,
              brand:tempData.brand,
              plugs:tempData.plugs,
              preSerialNum:'58'+tempData.preSerialNum
            }
          }).then(resp => {
              _this.$message({
                type: 'success',
                message:resp.result
              });
              _this.uploading=false;
              _this.addChargerVisible=false;
          }).catch(err=>{
            _this.uploading=false;
            _this.addChargerVisible=false;
          });
        }
        })
      },
      handleExport(){
        if(this.queryDone==false){
          this.$message({
            type: 'error',
            message: '先查询再导出'
          });
          return;
        }
        if(this.total>0){
          this.excelExport();
        }
        else {
          this.$message({
            type: 'error',
            message: '导出数据为空'
          });
        }
      },
      excelExport(){
        var _this=this;
         request({
          url: '/ylc/charger/exportChargerExcel',
          method: 'get',
          responseType: 'blob',
          params:{
            status:_this.searchStatus,
            preSerialNum:_this.searchSerialNum
          }
        }).then((resp) => {
      // const blob = new Blob([resp.data], {
      //   type: 'application/octet-stream'
      // })
      //   let url = window.URL.createObjectURL(blob);
      //   let link = document.createElement('a');
      //   link.style.display = 'none';
      //   link.href = url;
      //   link.setAttribute('download', 'filename.xls');
      //   document.body.appendChild(link);
      //   link.click()

       
         const blob = new Blob([resp.data], {
        type: 'application/vnd.ms-excel;charset=utf-8'})

        const href = window.URL.createObjectURL(blob); // 创建下载的链接
        const downloadElement = document.createElement("a");
        downloadElement.href = href;
        downloadElement.download =decodeURIComponent(resp.headers['content-disposition'].split('filename=')[1]);
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
      }
        ).catch();
     },
      
      handleAdd() {
            this.addChargerVisible=true;
      },
     
      handleQrcode(row) {
        this.qrVisible = true;
        if(row.plugs==2){
            this.plug2Visable = true;  
            this.selectedQr = row.serialNum+'-01';
            this.selectedUrl = 'http://www.ylc5858.com/ylc?chargerId='+row.serialNum+'01';
            this.selectedQr_2 = row.serialNum+'-02';
            this.selectedUrl_2 = 'http://www.ylc5858.com/ylc?chargerId='+row.serialNum+'02';
        }
        if(row.plugs==1){
            this.plug2Visable = false; 
            this.selectedQr = row.serialNum;
            this.selectedUrl = 'http://www.ylc5858.com/ylc?chargerId='+row.serialNum+'01';
        }
      },
       // 生成海报
      createPoster(fileName) {
          let that = this
          let qrDOM = document.getElementById('qrHtml')
          html2canvas(qrDOM, {
              width: qrDOM.offsetWidth,
              height: qrDOM.offsetHeight,
              //按比例增加分辨率
              scale: window.devicePixelRatio, // 设备像素比
              useCORS: true,//（图片跨域相关）
              allowTaint: true,//允许跨域（图片跨域相关）
              logging: false,
              letterRendering: true,
          }).then(function (canvas) {
              that.qrImgURL = canvas.toDataURL('image/png')

              let a = document.createElement('a')
              a.download = fileName
              a.href =  that.qrImgURL
              a.dispatchEvent(new MouseEvent('click'))

          })
      },
      // 下载二维码
      downloadPoster(fileName) {
          this.createPoster(fileName);
         
      },
     
      handleDelete(index, row){
        let _this = this;
        this.$confirm('确认删除 ' + row.serialNum + ' ?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.deleteCharger(index,row.serialNum);
        });
      },
      deleteCharger(index,serialNum){
        var _this = this;
         request({
          url: '/ylc/charger/delete',
          method: 'get',
          params:{
            serialNum:serialNum
          }
        }).then(resp=> {
          
          _this.$message({
            type: 'success',
            message: resp.result
          });
          this.chargers.splice(index, 1)
        })
      },
      refresh(){
       this.searchCharges();
    }
    },
    mounted: function () {
      
      this.refresh();
       this.$nextTick(() => {
            this.tableHeight = window.innerHeight - 350;
        })
    },
    data(){
      return {
      tableHeight:200,

        searchSerialNum:'',
        searchStatus:'',
        queryDone:false,
        selectedQr:'',
        selectedUrl:'',

        pageSize:10,
        pageNo:1,
        total:0,
      
        plug2Visable :false,
        selectedQr_2:'',
        selectedUrl_2:'',

        qrVisible:false,
        addChargerVisible:false,
        addChargerPre:'',
        chargers: [],
        bindStatus: [{value:0,lable:'已绑定'},{value:1,lable:'已删除'},{value:2,lable:'未绑定'}],
        dialogStatus: '',
        logoSrc: require('@/assets/YLC.png'), // 二维码中间的logo
        //logoSrc: 'http://image.ylc5858.com/l1.png', // 二维码中间的logo

        rulesMap:{ 
            preSerialNum: [{ required: true, message: '未填写', trigger: 'blur' },
                        {pattern:/^(\d{3})$/,message: '数据仅限3位', trigger: 'blur'}]    },
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

 .charger_opr_header {
    background-color: #ececec;
    margin-top: 12px;
    padding-left: 5px;
    display: flex;
    justify-content: flex-start;
  }
  .charger_opr_body {
    /*justify-content: flex-start;*/
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    background-color: #ececec;
    margin-top: 20px;
    padding-top: 10px;
  }

  .dialog-add-chargers{
    text-align: center;
    padding-top:20px;
  }

  .export_btn{
    margin-left: auto;
     
  }

  .charger_opr_footer{
    width: 100%;
    position: absolute;
    bottom: 15px;
  }
  
 
  #qrHtml{
    padding-top:20px;
    padding-bottom:20px;
    display: flex;
    justify-content:space-around;
  }
 
</style>

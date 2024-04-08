<template>
  <el-container>
    <el-header class="charger_header">
      
      <el-select v-model="onOffLine" placeholder='在线状态' clearable style="margin-left: 10px" >
        <el-option v-for="item in onLineStatus" :key="item" :label="item" :value="item" />
      </el-select>
      
      <el-button type="success" size="medium" style="margin-left: 20px" @click="handleCreate">添加设备</el-button>
    </el-header>
    <el-main class="charger_main">
      <el-table
        ref="multipleTable"
        :data="chargers"
        style="width: 100%"
        max-height="600"
        max-width="600"
        border>
         <el-table-column
          label="序号"
          type = "index"
          width="70" align="left">
        </el-table-column>
        <el-table-column
          label="设备ID"
          prop="serialNum"
          width="180" align="left">
        </el-table-column>

         <el-table-column
          label="电桩名称"
          prop="name"
          width="220" align="left">
        </el-table-column>

        <el-table-column
          label="电桩型号"
          prop="terminalName"
          width="200" align="left">
        </el-table-column>

        <el-table-column
          label="功率"
          prop="power"
          width="160" align="left">
        </el-table-column>

         <el-table-column
          label="充电模式"
          prop="ifFast"
          width="160" align="left">
        </el-table-column>

        <el-table-column
          prop="plugs"
          label="充电枪数量" align="left">
        </el-table-column>
        <el-table-column
          label="在线状态"
          prop="onLine"
          width="140" >
          <template slot-scope="{row}">
            <el-tag :type="row.onLine | statusFilter" effect="dark" size="small">
              {{ row.onLine }}
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
              type="success"
              @click="handleBind(scope.$index, scope.row)">绑定
            </el-button>
            <el-button
              size="mini"
              @click="handleUpdate(scope.row)">修改
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog width=25% :visible.sync="qrVisible" class="qrDialog">
        <div id="qrHtml">
          <div class="qrContent">
            <span>{{selectedQr}}</span>
          </div>
          <vue-qr   :logoSrc=logoSrc :text=selectedUrl :size="300"></vue-qr>
        </div>
        <div>
           <el-button type="primary" class="myButton"  @click="downloadPoster(selectedQr)">生成下载二维码</el-button>
        </div>

      </el-dialog>
          
    </el-main>
    <div style="height: 20px"></div>
   
    
  </el-container>
  
</template>
<script>
   import request from '@/utils/request'
   import { mapGetters } from 'vuex'
   import VueQr from 'vue-qr'
   import html2canvas from 'html2canvas';
  
  export default{
    components:{
      VueQr
    },
    watch: {
      onOffLine: function () {
       
        //console.log(this.chargers.length+" fuck "+this.onOffLine);
        //return this.onOffLine
        this.refresh();
        
          },
      stationId:function (){ //动态监听电站ID的变化，刷新界面
         this.refresh();
      }
    },
     computed: {
      ...mapGetters(['stationId'])
    },
    methods: {
      handleCreate() {
         this.$router.push({
          path: 'chargerEdit',
          query: {
            id: '000',
            stationId:this.stationId,
            action:'create'
          }
        })
      },
     
      handleUpdate(row) {
       var _this = this;
        this.$router.push({
          path: 'chargerEdit',
          query: {
            id: row.id,
            stationId:_this.stationId,
            action:'update'
          }
        })
      },
       handleBind(row) {
       var _this = this;
        this.$router.push({
          path: 'bindUser',
          query: {
            id: row.id,
            stationId:_this.stationId,
            action:'update'
          }
        })
      },

      handleQrcode(row) {
        this.qrVisible = true;
        this.selectedQr = row.serialNum;
        this.selectedUrl = 'http://www.ylc5858.com/ylc?chargerId='+row.serialNum+'01';
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
        let _this = this;
        request({
          url: '/ylc/charger/list',
          method: 'get',
          params:{
            departId:_this.stationId
          }
        }).then(resp=> {
          var i = 0;
          var tempList = resp.result;
          if(_this.onOffLine!=''){
            while (i < tempList.length) {
              if (tempList[i].onLine != _this.onOffLine) {
                console.log(tempList[i].onLine);
                tempList.splice(i, 1);
              } else {
                ++i;
              }
            }
          }
          
          _this.chargers = tempList;
          console.log(_this.chargers);
        }).catch(()=>{
          _this.$message({
            type: 'error',
            message: '加载失败'
          });
        });
      }
    },
    mounted: function () {
      
      setTimeout(() => {
        this.refresh();
      }, 300)
    },
    data(){
      return {
        onOffLine: '',
        selectedQr:'',
        selectedUrl:'',
        qrVisible:false,
        chargers: [],
        onLineStatus: ['在线','离线','充电'],
        dialogStatus: '',
        logoSrc: 'http://image.ylc5858.com/l1.png', // 二维码中间的logo
      }
    },
    filters: {
    statusFilter(status) {
      const statusMap = {
        在线: 'success',
        离线: 'danger',
        充电: ''
      }
      return statusMap[status]
    }
  }
  }
</script>
<style>
  .charger_header {
    background-color: #ececec;
    margin-top: 20px;
    padding-left: 5px;
    display: flex;
    justify-content: flex-start;
  }

  .charger_main {
    /*justify-content: flex-start;*/
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    background-color: #ececec;
    margin-top: 20px;
    padding-top: 10px;
  }
  
  .qrContent {
    font-size:20px;
    font-family:"Microsoft YaHei";
    font-weight:bold;
  }
  #qrHtml{
    padding-top:20px;
    padding-bottom:20px;
  }
</style>

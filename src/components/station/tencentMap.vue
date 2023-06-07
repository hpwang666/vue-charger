<template>
 <el-main class="charger_edit_main">
  <div class ="serachinput">
    <el-input   v-model="keyword" ></el-input>
     <el-button type="success" @click="searchByKeyword">搜索</el-button>
  </div>


 
  <div id="tmapApp">
    
  <div id="suggest">
    <li v-for="(item,index) in suggestionList" :key="index">
      <a  href="javascript:void(null);"  @click="setSuggestion(item,index)">{{item.title}}
      </a>
    </li>
  </div>
  </div>

  <div>{{zuobiao}}</div>
      <div slot="footer" style="margin-left:340px;bottom:12px;background:#fff;">
        <el-button type="primary">确认</el-button>
  </div>

  </el-main>
</template>

<script>
import $ from 'jquery'

$(document).ready(function(){
  
  	$("#tmapApp").click(function(event){
      event.stopPropagation();  // 阻止子元素(input)的click事件冒泡到父元素(div)
			//alert("你点击了父元素的方法！");
		});
		
		$("#suggest").click(function(event){
			event.stopPropagation();  // 阻止子元素(input)的click事件冒泡到父元素(div)
			//alert("你点击了子元素的方法.......")
		});
})
export default {
  data () {
    return {
      parentId:'',
      keyword:'湖北省宜昌市',
      map:'',
      isListShow:'',
      suggestionList:[],
      searchItem:'',
      suggest:'',

      infoWindowList:[],
      markers:'',
      zuobiao:'',
      lat:'',
      lng:''

    }
  },
  methods: {

    // 地图初始化函数，本例取名为init，开发者可根据实际情况定义
    initMap () {
    // 定义地图中心点坐标
      var center = new window.TMap.LatLng(30.618122, 111.460685)
      // 定义map变量，调用 TMap.Map() 构造函数创建地图
      this.map = new window.TMap.Map(document.getElementById('tmapApp'), {
        center: center, // 设置地图中心点坐标
        zoom: 17.2, // 设置地图缩放级别
        pitch: 43.5, // 设置俯仰角
        rotation: 45 // 设置地图旋转角度
      });
      this.isListShow=false;


      this.markers = new window.TMap.MultiMarker({
          map: this.map,
          styles: {
            // 点标记样式
            marker: new window.TMap.MarkerStyle({
              width: 20, // 样式宽
              height: 30, // 样式高
              anchor: { x: 10, y: 30 }, // 描点位置
              src: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png' // 标记路径
            })
          }
      });
       //监听点击事件添加marker
       this.map.on("click", (evt) => {
            // this.markers.add({
            // 	position: evt.latLng
            // });        
            this.markers.setGeometries([])
            this.markers.updateGeometries([
            {
              id: 'marker-layer', // 点标注数据数组
              position: evt.latLng,
              },
            ]);   
            this.zuobiao = '坐标点为'+evt.latLng.getLat().toFixed(5)+' ,'+evt.latLng.getLng().toFixed(5)
            //清除提示窗口
            this.infoWindowList.forEach((infoWindow) => {
                infoWindow.close();
              });

            this.infoWindowList.length = 0;           
        });
     // console.log(map)
    //  console.log(window)
    },
    searchByKeyword(){
      this.searchItem = new TMap.service.Search({ pageSize: 10 });
      // 搜索类
      this.suggest = new TMap.service.Suggestion({
        // 新建一个关键字输入提示类
        pageSize: 10, // 返回结果每页条目数
        region: '', // 限制城市范围
        regionFix: false, // 搜索无结果时是否固定在当前城市
        });
       //console.log('suggest',this.suggest)
      this.onSearchValue = this.keyword 
      if (this.onSearchValue) {
        console.log('this.onsearch',this.onSearchValue)
        // 请求腾讯地图接口
        this.suggest.getSuggestions({ keyword: this.onSearchValue, location: this.map.getCenter() }).then((result) => {
        this.isListShow=true
        // console.log('result',result)
        // 以当前所输入关键字获取输入提示
        // suggestionListContainer.innerHTML = '';
        this.suggestionList = result.data;
         console.log('this.suggestionList',this.suggestionList);
         
        });
      } else {

        this.$message({
            type: 'error',
            message: '请输入地址'
          });
      
      } 
    },
   setSuggestion(item,index){
    // console.log('index',item)
    // 点击输入提示后，于地图中用点标记绘制该地点，并显示信息窗体，包含其名称、地址等信息
    this.infoWindowList.forEach((infoWindow) => {
      infoWindow.close();
    });
    this.infoWindowList.length = 0
    this.keyword = this.suggestionList[index].title;
    this.isListShow = false
    this.markers.setGeometries([])
    this.markers.updateGeometries([
    {
      id: 'marker-layer', // 点标注数据数组
      position: this.suggestionList[index].location,
      },
    ]);
    var infoWindow = new TMap.InfoWindow({
      map: this.map,
      position: item.location,
      content: `<h3>${item.title}</h3><p>地址：${item.address}</p ><p>坐标：${item.location.lat},${item.location.lng}</p >`,
      offset: { x: 0, y: -50 }
      }) // 新增信息窗体显示地标的名称与地址、电话等信息
      this.lat = item.location.lat
      this.lng=item.location.lng
      this.zuobiao = '坐标点为'+this.lat+' ,'+this.lng
      // console.log('infoWindow',infoWindow)
      this.infoWindowList.push(infoWindow);
      // console.log(' this.infoWindowList', this.infoWindowList)

      this.map.setCenter(this.suggestionList[index].location);
      this.markers.on('click', (e) => {
        console.log('e',e)
        console.log('sa',this.infoWindowList[Number(e.geometry.id)])
      this.infoWindowList[Number(e.geometry.id)].open();
      });
      }
    },
    mounted () {
     this.initMap();
     
    }
}
</script>


<style>
.serachinput {
  display: flex;
  flex-direction: row;
  width: 300px;
  padding-left: 5px;
 
}

#suggest{
  width: 300px;top:2px;left:300;
  float: left;
  z-index: 9999;
  position:absolute;/*absolute*/
  text-align: left;
  background-color: #ececec;
  pointer-events:auto;
  cursor:context-menu;
}

#tmapApp{
  width: 1066px;height: 600px;
  position: relative;
  pointer-events:auto;
}

.point{
  cursor:help;
}

</style>


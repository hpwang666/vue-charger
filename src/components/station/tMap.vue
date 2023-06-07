<!-- 新增地图组件 -->
    <Modal v-model="mapSelect" title="设置经纬度" @on-visible-change="mapSelectChange" width="80">
     <!-- <input id='keyword' type="text" value='湖北省宜昌市' @input="getSuggestions"><input id="search" type="button" class="btn" value="搜索" @click="searchByKeyword()" /> -->
      <input id='keyword' type="text" value='湖北省宜昌市'><input id="search" type="button" class="btn" value="搜索" @click="searchByKeyword()" />
      <ul id="suggestionList" v-if="isListShow">
       <li v-for="(item,index) in suggestionList" :key="index">
        <a href=" " @click="setSuggestion(item,index)">{{item.title}}
         <span class="item_info">{{item.address}}</span>
         </a >
         </li>
      </ul>
      <div id="container" style="width:100%;height:400px;"></div>
      <div>{{zuobiao}}</div>
      <div slot="footer" style="margin-left:340px;bottom:12px;background:#fff;">
        <Button type="primary" @click="add0jinweiSubmit()">确认</Button>
      </div>
    </Modal>


    searchByKeyword(){
   this.searchItem = new TMap.service.Search({ pageSize: 10 });
   // 搜索类
   this.suggest = new TMap.service.Suggestion({
    // 新建一个关键字输入提示类
    pageSize: 10, // 返回结果每页条目数
    region: '', // 限制城市范围
    regionFix: false, // 搜索无结果时是否固定在当前城市
    });
   // console.log('suggest',this.suggest)
  this.onSearchValue = document.getElementById('keyword').value 
   if (this.onSearchValue) {
    console.log('this.onsearch',this.onSearchValue)
    // 请求腾讯地图接口
    this.suggest.getSuggestions({ keyword: this.onSearchValue, location: this.map.getCenter() }).then((result) => {
     this.isListShow=true
     // console.log('result',result)
     // 以当前所输入关键字获取输入提示
    // suggestionListContainer.innerHTML = '';
     this.suggestionList = result.data;
     // console.log('this.suggestionList',this.suggestionList)
    });
   } else {
    this.$Message.warning('请输入地点再进行搜索！');
   
   } 
  },
  setSuggestion(item,index){
   // console.log('index',item)
   // 点击输入提示后，于地图中用点标记绘制该地点，并显示信息窗体，包含其名称、地址等信息
   this.infoWindowList.forEach((infoWindow) => {
    infoWindow.close();
   });
     this.infoWindowList.length = 0
     document.getElementById('keyword').value = this.suggestionList[index].title;
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
  },
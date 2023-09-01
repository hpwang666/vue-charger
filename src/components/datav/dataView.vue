<template>
  <div id="data-view">
    <dv-full-screen-container>
      <div class="main-header">
        <div class="mh-middle">易路充数据中心</div>
        <div class="mh-right">
          <dv-border-box-2
            style="width: 120px; height: 50px; line-height: 50px; text-align:center;margin-left:200px;"
          >
          <p><a  href="/#/home" style="text-decoration:none; color:#fff">退出全屏</a></p>
          </dv-border-box-2>
        </div>
      </div>

      <dv-border-box-1 class="main-container">
        <dv-border-box-3 class="left-chart-container">

           <Left-Chart-1 content='天门' count='123'/>
           <Left-Chart-1 content='远安' count='12'/>
           <Left-Chart-1 content='荆州' count='213'/>

        </dv-border-box-3>

        <div class="middle-chart-container">
         
            <dv-border-box-3 class="rmc-top-container">

              <Center-Cmp />

            </dv-border-box-3>

           <dv-border-box-4 class="rmc-bottom-container">

           <Left-Chart-1 content='宜昌' count='123'/>
           <Left-Chart-1 content='大桥北' count='12'/>
           <Left-Chart-1 content='武汉市' count='213'/>
           </dv-border-box-4>
          
        </div>
         <dv-border-box-3 class="right-chart-container">
              <Left-Chart-3 content='宜昌中心充电站' count='123'/>
              <Left-Chart-3 content='大桥北充电站' count='12'/>
              <Left-Chart-3 content='湖北高速充电站' count='213'/>
          </dv-border-box-3>
      </dv-border-box-1>

    </dv-full-screen-container>
  </div>
</template>

<script>
import LeftChart1 from './LeftChart1'
import LeftChart2 from './LeftChart2'
import LeftChart3 from './LeftChart3'

import CenterCmp from './CenterCmp'

import RightChart1 from './RightChart1'
import RightChart2 from './RightChart2'

import BottomCharts from './BottomCharts'

export default {
  name: 'dataView',
  components: {
    LeftChart1,
    LeftChart2,
    LeftChart3,
    CenterCmp,
    RightChart1,
    RightChart2,
    BottomCharts
  },
  data () {
    return {}
  }
}
</script>

<style lang="less">
#data-view {
  width: 100%;
  height: 100%;
  background-color: #030409;
  color: #fff;

  #dv-full-screen-container {
    background-image: url('./img/bg.png');
    background-size: 100% 100%;
    box-shadow: 0 0 3px blue;
    display: flex;
    flex-direction: column;
  }

  .main-header {
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    .mh-left {
      font-size: 20px;
      color: rgb(1,134,187);

      a:visited {
        color: rgb(1,134,187);
      }
    }

    .mh-middle {
      font-size: 30px;
    }

    .mh-left, .mh-right {
      width: 450px;
    }
  }

  .main-container {
    height: calc(~"100% - 220px");

    .border-box-content {
      padding: 20px;
      box-sizing: border-box;
      display: flex;
    }
  }

  .left-chart-container {
    width: 20%;
    padding: 5px;
    box-sizing: border-box;

    .border-box-content {
      flex-direction: column;
    }
  }
 .middle-chart-container {
    width: 60%;
    padding-left: 5px;
    box-sizing: border-box;
  }
  .right-chart-container {
    width: 20%;
    padding-left: 5px;
    box-sizing: border-box;

     .border-box-content {
      flex-direction: column;
    }
  }

  .rmc-top-container {
    height: 65%;
    display: flex;
  }


  .rmc-bottom-container {
    height: 35%;
     display: flex;
  }

}
</style>

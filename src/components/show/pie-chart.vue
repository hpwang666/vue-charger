<template>
  <div :id="id" :class="className"  style="width: 450px;height:350px;"/>
</template>

<script>
import echarts from 'echarts'
import request from '@/utils/request'


export default {
  props: {
    className: {
      type: String,
      default: 'pie-chart'
    },
    id: {
      type: String,
      default: 'pie-chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    pieTitle:{
       type: String,
      default: '饼图'
    },
    pieData:{
      type: Array,
      default : () => [
        {value:235, name:'< 1h'},
        {value:274, name:'1-2h'},
        {value:310, name:'2-4h'},
        {value:335, name:'4-8'},
        {value:400, name:'> 8h'}
      ]
    }
  },
   watch: {
      pieTitle: function () {
        this.setChart();
      },
      pieData:function () {
        this.setChart();
      }
    },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      var  _this=this;
      this.chart = echarts.init(document.getElementById(this.id));
      this.setChart();      
    },
    setChart(){
      this.chart.setOption({
        series : [
          {
            name: '充电时长',
            
            type: 'pie',    // 设置图表类型为饼图
            radius: '55%',  // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
            data:this.pieData
          }
      ],
      title: {
        show:true,
          text: this.pieTitle,
          x:'center',
          y:'bottom'
      },
       tooltip :{
        show: true,//默认值true，可选为：true（显示） | false（隐藏）
          zlevel: 1,//默认值1，一级层叠控制。每一个不同的zlevel将产生一个独立的canvas，相同zlevel的组件或图标将在同一个canvas上渲染。zlevel越高越靠顶层，canvas对象增多会消耗更多的内存和性能，并不建议设置过多的zlevel，大部分情况可以通过二级层叠控制z实现层叠控制。
          z: 8,//默认值8，二级层叠控制，同一个canvas（相同zlevel）上z越高约靠顶层。
          showContent: true,//默认值true，tooltip主体内容显示策略，只需tooltip触发事件或显示axisPointer而不需要显示内容时可配置该项为false，
          trigger: 'item',//默认值'item'，触发类型，默认数据触发，见下图，可选为：'item' | 'axis'
          position: null,//默认值null，位置指定，传入{Array}，如[x, y]， 固定位置[x, y]；传入{Function}，如function([x, y]) {return [newX,newY]}，默认显示坐标为输入参数，用户指定的新坐标为输出返回。
          formatter: '{a} <br/>{b} : {c}',//默认值null，内容格式器
      }
    })
    }
  }
}
</script>

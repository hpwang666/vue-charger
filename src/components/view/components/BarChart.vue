<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '@/components/mixins/resize'
import request from '@/utils/request'

const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '280px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
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
      let _this = this;
      request({
          url: '/ylc/sum/trades7days',
          method: 'get'
        }).then(resp=> {
           resp.result.forEach(element => {
            _this.xaxis.push(element.day);
            _this.value.push(element.value);

            _this.chart = echarts.init(this.$el, 'macarons');
            _this.setOptions()
          });
        }).catch(()=>{
          _this.$message({
            type: 'error',
            message: 'trades7days'
          });
      });
    },
    setOptions(){
      let _this=this;
        this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        title: {
          text: '最近充值',
          left: '10%',
            top: '5%'
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: _this.xaxis,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '金额',
          type: 'bar',
          stack: 'vistors',
          barWidth: '35%',
           color: '#fc8452',
          data: _this.value,
          animationDuration
        }]
      })
    }
  },//end of method
  data(){
    return{
      chart: null,
      xaxis:[],
      value:[]
    }
  }
}
</script>

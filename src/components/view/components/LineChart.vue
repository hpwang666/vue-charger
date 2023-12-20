<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '@/components/mixins/resize'
  import request from '@/utils/request'

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
      default: '330px'
    },
    autoResize: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chart: null,
      xaxis:[],
      kwh:[],
      income:[]

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
      var _this = this;
       request({
          url: '/ylc/sum/orders30days',
          method: 'get'
        }).then(resp=> {
           resp.result.orders30days.forEach(element => {
            _this.xaxis.push(element.name);
            _this.kwh.push(element.kwh);
            _this.income.push(element.income);

            this.chart = echarts.init(this.$el, 'macarons')
            this.setOptions()
          });
        }).catch(()=>{
          _this.$message({
            type: 'error',
            message: '加载失败'
          });
      });
      
    },
    setOptions() {
      var _this = this;
      this.chart.setOption({
        xAxis: {
          data: _this.xaxis,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['金额', '电量']
        },
        series: [{
          name: '金额', itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: false,
          type: 'line',
          data: _this.income,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '电量',
          smooth: false,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: _this.kwh,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    }
  }
}
</script>

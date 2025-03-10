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
      default: '280px'
    }
  },
  data() {
    return {
      chart: null,
       yaxis:[],
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
          url: '/ylc/sum/ordersInDeparts',
          method: 'get'
        }).then(resp=> {
           resp.result.forEach(element => {
            _this.yaxis.push(element.name);
            _this.kwh.push(element.kwh);
            _this.income.push(element.income);

            _this.chart = echarts.init(this.$el, 'macarons',{ 
              renderer: 'canvas',
              useDirtyRect: false
            });
            _this.setOptions()
          });
        }).catch(()=>{
          _this.$message({
            type: 'error',
            message: '加载失败ordersInDeparts'
          });
      });
      
     
    },
    setOptions(){

      this.chart.setOption({
      title: {
        text: '热门电站'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {},
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: 'category',
        data: this.yaxis,
        inverse:true
      },
      series: [
        {
          name: '充电金额',
          type: 'bar',
          color: '#36a3f7',
          data: this.income
        },
        {
          name: '充电量',
          type: 'bar',
          color: '#fc8452',
          data: this.kwh
        }
        
      ]
    })
    }
  }
}
</script>

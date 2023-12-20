<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '@/components/mixins/resize'

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
      default: '300px'
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
    unix2hm(v) {
    const dateObj = new Date(v)
  const hours = dateObj.getHours() > 10 ? dateObj.getHours() : '0' + dateObj.getHours()
    const minutes = dateObj.getMinutes() < 10 ? dateObj.getMinutes() + '0' : dateObj.getMinutes()
    const UnixTimeToDate = hours + ':' + minutes
   
    return UnixTimeToDate
  },
  
    initChart() {
      // prettier-ignore
  const data = [
    [
      ['2021-11-11 00:00:00', 77, 17096869, 'Australia'],
      ['2021-11-11 12:21:22', 77.4, 27662440, 'Canada'],
      ['2021-11-11 13:21:22', 68, 1154605773, 'China'],
      ['2021-11-11 14:21:22', 54.7, 10582082, 'Cuba'],
      ['2021-11-11 9:21:22', 64.7, 10582082, 'Cuba1'],
      ['2021-11-11 10:21:22', 74.7, 10582082, 'Cuba'],
      ['2021-11-11 21:21:22', 66.7, 10582082, 'Cuba'],
      ['2021-11-11 22:21:22', 7.7, 10582082, 'Cuba']
      
    ]
  ];
  const option = {
    backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [
      {
        offset: 0,
        color: '#f7f8fa'
      }
    ]),
    title: {
      text: '时间段分布',
      left: '8%',
      top: '1%'
    },
    legend: {
      right: '10%',
      top: '3%',
      data: ['1990']
    },
    grid: {
      left: '8%',
      top: '10%'
    },
    xAxis: {
      type: 'time',
      interval: 7200000,
      axisLabel: {
      formatter: (value, index)=> {
        return this.unix2hm(value)
      }
    },
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    yAxis: {
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      },
      scale: true
    },
    series: [
      {
        name: '1990',
        data: data[0],
        type: 'scatter',
        symbolSize: function (data) {
          return Math.sqrt(data[2]) / 5e2;
        },
        emphasis: {
          focus: 'series',
          label: {
            show: true,
            formatter: function (param) {
              return param.data[2];
            },
            position: 'top'
          }
        },
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(120, 36, 50, 0.5)',
          shadowOffsetY: 5,
          color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
            {
              offset: 0,
              color: 'rgb(251, 118, 123)'
            },
            {
              offset: 1,
              color: 'rgb(204, 46, 72)'
            }
          ])
        },
        
      }
    ]
  };
    this.chart = echarts.init(this.$el);


    this.chart.setOption(option)
    }
  }
}
</script>

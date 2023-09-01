<template>
  <div class="left-chart-3">
    <div class="lc3-header">{{content}}</div>
    <div class="lc3-details">设备运行总数<span>{{count}}</span></div>
    <dv-capsule-chart class="lc3-chart" :config="config" />
  </div>
</template>

<script>
export default {
  name: 'LeftChart3',
  data () {
    return {
      config: {
        data: [
          {
            name: '快充电中',
            value: 78
          },
          {
            name: '慢充电中',
            value: 54
          },
          {
            name: '检修',
            value: 8
          },
          {
            name: '离线',
            value: 3
          },
          {
            name: '空闲',
            value: 77
          }
        ],
        colors: ['#00baff', '#3de7c9', '#fff', '#ffc530', '#469f4b'],
        unit: '件'
      }
    }
  },
   props: {
    content: {
      type: String,
      default: '200px'
    },
    amount: {
      type: String,
      default: '100'
    },
    count: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="less">
.left-chart-3 {
  width: 100%;
  height: 33%;
  display: flex;
  flex-direction: column;

  .lc3-header {
    height: 20px;
    line-height: 20px;
    font-size: 16px;
    text-indent: 20px;
    margin-top: 10px;
  }

  .lc3-details {
    height: 40px;
    font-size: 16px;
    display: flex;
    align-items: center;
    text-indent: 20px;

    span {
      color: #096dd9;
      font-weight: bold;
      font-size: 35px;
      margin-left: 20px;
    }
  }

  .lc3-chart {
    flex: 1;
  }
}
</style>

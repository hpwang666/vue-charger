<template>
  <div class="left-chart-1">
    <div class="lc1-header">{{content}}</div>
    <div class="lc1-details">在线电桩<span>{{count}}</span> 台</div>
     <div class="lc1-details">今日充电<span>4300</span>度</div>
    <dv-capsule-chart class="lc1-chart" :config="config" />
    <dv-decoration-2 style="height:10px;" />
  </div>
</template>

<script>
export default {
  name: 'LeftChart1',
  data () {
    return {
      config: {
        data: [
          {
            name: '充电金额',
            value: 100
          },
          {
            name: '充值金额',
            value: 90
          },
          {
            name: '占位金额',
            value: 22
          }
        ],
        colors: ['#00baff', '#ffc530', '#469f4b'],
        unit: 'KW'
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
.left-chart-1 {
  width: 100%;
  height: 37%;
  display: flex;
  flex-grow: 0;
  flex-direction: column;

  .lc1-header {
    text-align: center;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    margin-bottom: 20px;
  }

  .lc1-details {
    height: 40px;
    font-size: 14px;
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

  .lc1-chart {
    flex: 1;
  }
}
</style>

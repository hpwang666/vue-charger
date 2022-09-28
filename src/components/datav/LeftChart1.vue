<template>
  <div class="left-chart-1">
    <div class="lc1-header">001号龙门</div>
    <div class="lc1-details">在线时长<span>430</span> 小时</div>
     <div class="lc1-details">今日用电<span>430</span>度</div>
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
            name: '有功功率',
            value: 100
          },
          {
            name: '无功功率',
            value: 90
          },
          {
            name: '视功率',
            value: 22
          }
        ],
        colors: ['#00baff', '#ffc530', '#469f4b'],
        unit: 'KW'
      }
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

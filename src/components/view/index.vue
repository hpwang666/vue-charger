<template>
  <div class="dashboard-editor-container">
  
    <panel-group/>

    <line-chart style="background:#fff;padding:8px 8px 0;margin-bottom:8px;"  />
  
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>


  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import RaddarChart from './components/RaddarChart'
import LineChart from './components/LineChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'

var result = window.matchMedia('(max-width: 1200px)');

if (result.matches) {
  console.log('页面宽度小于等于700px');
} else {
  console.log('页面宽度大于700px');
}

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
      LineChart,
      PieChart,
      BarChart,
    RaddarChart
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 1px;
  background-color: rgb(240, 242, 245);
  position: relative;
  height:100%;


  .chart-wrapper {
    background: #fff;
    padding: 12px 12px 0;
    margin-bottom: 1px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>

<template>
 <el-container>
  <div class="chart-container">
    <chart height="100%" width="100%" />
  </div>
 </el-container>
</template>

<script>
import Chart from './MixChart'

export default {
  name: 'MixChart',
  components: { Chart }
}
</script>

<style>
.chart-container{
  margin-top: 20px;
  position: relative;
  width: 100%;
  height: calc(100vh - 184px);
}
</style>


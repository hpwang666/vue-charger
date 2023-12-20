<template>
  <div>
    <label class="radio-label" style="padding-left:0;">文件名: </label>
    <el-input v-model="filename" size="small" placeholder="文件名 (默认 易路充电站报表)" style="width:250px;" prefix-icon="el-icon-document" />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    filename: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>

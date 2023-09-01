
<template>
  <div class="show_amt_header">
    <div>
      <p id="show_amt_content">{{content}}</p>
    </div>
   <div style="border:1px solid #CCC"></div>
   <h2 id="show_amt_money">{{amount}} 元</h2>
    <h4>{{count}}笔</h4>
</div>
</template>

<script>
export default {
  name: 'showData',
  data () {
    return {
      radio: '2'
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

<style>
  .show_amt_header {
    background-color: #e5e9e9;
    padding-left: 5px;
    text-align: left;
    line-height: 0.3em;
    display: flex;
    flex-direction: column;
    width:250px;
  }
  #show_amt_content{
    text-align: center;
  }

   #show_amt_money{
    margin-left: 40px;
    color: blue;
  }

</style>

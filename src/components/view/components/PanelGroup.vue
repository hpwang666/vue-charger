<template>
  <el-row :gutter="20" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="{span: '4-8'}" class="card-panel-col">
      <div style="height:4px;background-color:#40c9c6"></div>
      <div class="card-panel" >
        <div class="card-panel-icon-wrapper icon-charging">
          <svg-icon  icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            充电金额
          </div>
          <count-to :start-val="0" :end-val="money" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="{span: '4-8'}" class="card-panel-col">
      <div style="height:4px;background-color:#36a3f7"></div>
      <div class="card-panel" >
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="orders" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            订单数量
          </div>
          <count-to :start-val="0" :end-val="orders" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="{span: '4-8'}" class="card-panel-col">
      <div style="height:4px;background-color:#f4516c"></div>
      <div class="card-panel" >
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="kwh" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            充电度数
          </div>
          <count-to :start-val="0" :end-val="kwh" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>

     <el-col :xs="12" :sm="12" :lg="{span: '4-8'}" class="card-panel-col">
      <div style="height:4px;background-color:#40c9c6"></div>
      <div class="card-panel" >
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            充电用户
          </div>
          <count-to :start-val="0" :end-val="wxusers" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>

    <el-col :xs="12" :sm="12" :lg="{span: '4-8'}" class="card-panel-col">
      <div style="height:4px;background-color:#34bfa3"></div>
      <div class="card-panel" >
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="charger" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            电桩数量
          </div>
          <count-to :start-val="0" :end-val="chargers" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>

    
    
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
  import request from '@/utils/request'

export default {
  components: {
    CountTo
  },
  data(){
    return{
      money:0,
      wxusers:0,
      orders:0,
      chargers:0,
      kwh:0
    }
  },
  mounted: function () {
      this.fetchData();
    },
  methods:{
    fetchData() {
      this.listLoading = true;
      var _this = this;
       request({
          url: '/ylc/sum/all',
          method: 'get'
        }).then(resp=> {
          _this.money = resp.result.money;
         _this.wxusers = resp.result.wxusers;
         _this.orders = resp.result.orders;
         _this.chargers = resp.result.chargers;
        _this.kwh = resp.result.kwh;
        }).catch(()=>{
          _this.$message({
            type: 'error',
            message: '加载失败'
          });
        });
    },
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 8px;

  .card-panel-col {
    margin-bottom: 8px;
    width: 20%;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-charging {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-charging {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>

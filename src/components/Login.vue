<template>
  <el-form :rules="rules" ref="dataForm" :model="loginForm" class="login-container" label-position="left"
           label-width="0px" v-loading="loading">
    <h3 class="login_title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="loginForm.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox class="login_remember" v-model="checked" label-position="left">记住密码</el-checkbox>
    <el-form-item style="width: 100%">
      <el-button type="primary" @click="submitClick()" style="width: 100%">登录</el-button>
    </el-form-item>
   
  </el-form>
</template>
<script>
  import { mapGetters } from 'vuex'
  export default{
     computed: {
      ...mapGetters(['token'])
    },
    data(){
      return {
        rules: {
          account: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          checkPass: [{required: false, message: '请输入密码', trigger: 'blur'}]
        },
        checked: true,
        loginForm: {
          account: 'whp001',
          password: 'a'
        },
        loading: false
      }
    },
    mounted:function(){
      this.$refs['dataForm'].clearValidate()
    },
    methods: {
      submitClick() {
         this.$refs['dataForm'].validate((valid) =>{
          if(valid){
            var _this = this;
            this.loading = true;
            this.$store.dispatch('user/login', this.loginForm).then((resp)=> {
              _this.loading = false;
            //console.log(this.token,resp.result.token);
              _this.$router.push({path: '/home'});
            }).catch(() => {
                this.loading = false
                _this.$alert('登录失败', '失败~');
              }
            );
          }
         })
      }
    }
  }
</script>
<style>
  .login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }

  .login_remember {
    margin: 0px 0px 35px 0px;
    text-align: left;
  }
</style>

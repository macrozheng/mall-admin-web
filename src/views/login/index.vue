<template>

  <div>

    <el-card class="login-form-layout">

      <el-form autoComplete="on"
               :model="loginForm"
               :rules="loginRules"
               ref="loginForm"
               label-position="left">

        <slide-verify ref="slideblock" @success="onSuccess" @again="onAgain" @fulfilled="onFulfilled" @fail="onFail" @refresh="onRefresh" :slider-text="textSlider" :w="352" :l="64" :imgs="imgs" :accuracy="accuracy" ></slide-verify>

        <div style="text-align: center">
          <!--svg-icon icon-class="login-mall" style="width: 56px;height: 56px;color: #409EFF"></svg-icon-->
        </div>
        <h2 class="login-title color-main">{{$t('login.systemname')}}</h2>

        <el-form-item prop="username">
          <el-input name="username"
                    type="text"
                    v-model="loginForm.username"
                    autoComplete="on"
                    :placeholder= "$t('login.username')">
          <span slot="prefix">
            <svg-icon icon-class="user" class="color-main"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password"
                    :type="pwdType"
                    @keyup.enter.native="handleLogin"
                    v-model="loginForm.password"
                    autoComplete="on"
                    :placeholder= "$t('login.psw')">
          <span slot="prefix">
            <svg-icon icon-class="password" class="color-main"></svg-icon>
          </span>
            <span slot="suffix" @click="showPwd">
            <svg-icon icon-class="eye" class="color-main"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <div style="text-align: center">
            <el-dropdown class="international" @command="handleCommand">
              <span class="el-dropdown-link">
            {{$t('login.languange')}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :disabled="language==='zh'" command="zh">中文</el-dropdown-item>
                <el-dropdown-item :disabled="language==='en'" command="en">English</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          <el-switch
            v-model="rememberflag"
            :active-text= "$t('login.rem')"
            inactive-text=""
            active-value="1"
            inactive-value="0"
            @change="rememberMe">
          </el-switch>
        </div>
        <div style="text-align: center">
          <h2></h2>
        </div>
        <el-form-item style="margin-bottom: 60px;text-align: center">
          <el-button :disabled="submissionFlag" style="width: 45%" type="primary" :loading="loading" @click.native.prevent="handleLogin">
            {{$t('login.login')}}
          </el-button>
          <el-button style="width: 45%" type="primary" @click.native.prevent="handleTry">
            {{$t('login.getaccount')}}
          </el-button>
        </el-form-item>
      </el-form>

    </el-card>


    <img :src="login_center_bg" class="login-center-layout">
    <el-dialog
      title="公众号二维码"
      :visible.sync="dialogVisible"
      :show-close="false"
      :center="true"
      width="30%">
      <div style="text-align: center">
        <span class="font-title-large"><span class="color-main font-extra-large">关注公众号</span>回复<span class="color-main font-extra-large">体验</span>获取体验账号</span>
        <br>
        <img src="http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/banner/qrcode_for_macrozheng_258.jpg" width="160" height="160" style="margin-top: 10px">
      </div>

      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogConfirm">确定</el-button>
      </span>
    </el-dialog>


  </div>


</template>ges

<script>
  import img0 from '@/assets/images/1.jpg';
  import img1 from '@/assets/images/2.jpg';
  import img2 from '@/assets/images/3.jpg';

  import {isvalidUsername} from '@/utils/validate';
  import {setSupport,getSupport,setCookie,getCookie} from '@/utils/support';
  import login_center_bg from '@/assets/images/login_center_bg.png'
  import Cookies from 'js-cookie'

  export default {
    name: 'login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsername(value)) {
          callback(new Error(this.$t('login.userverify')))
        } else {
          callback()
        }
      };
      const validatePass = (rule, value, callback) => {
        if (value.length < 3) {
          callback(new Error(this.$t('login.pswverify')))
        } else {
          callback()
        }
      };
      return {
        rememberflag: 0,
        submissionFlag: true,
        textSlider: "",
        imgs: [
          img0,
          img1,
          img2,
        ],
        accuracy: 5,

        language: sessionStorage.getItem("lang"),//重缓存中获取语言状态

        loginForm: {
          username: '',
          password: '',
        },
        loginRules: {
          username: [{required: true, trigger: 'blur', validator: validateUsername}],
          password: [{required: true, trigger: 'blur', validator: validatePass}]
        },
        loading: false,
        pwdType: 'password',
        login_center_bg,
        dialogVisible:false,
        supportDialogVisible:false
      }

    },
    created() {
      this.loginForm.username = getCookie("username");
      this.loginForm.password = getCookie("password");
      this.rememberflag = window.localStorage.getItem("rememberflag");

      if(this.loginForm.username === undefined||this.loginForm.username==null||this.loginForm.username===''){
        this.loginForm.username = 'admin';
      }
      if(this.loginForm.password === undefined||this.loginForm.password==null){
        this.loginForm.password = '';
      }
      this.$i18n.locale = getCookie("lang");
      this.language = window.localStorage.getItem("lang");

    },
    methods: {
      rememberMe(){
        window.localStorage.setItem("rememberflag", this.rememberflag);

        if(this.rememberflag == "1")
        {
          setCookie("username",this.loginForm.username,15);
          setCookie("password",this.loginForm.password,15);

          window.localStorage.setItem("lang", this.language);
          setCookie("lang",this.language,15);
        } else{
          Cookies.remove("username");
          Cookies.remove("password");
        }
      },
      onSuccess(){
        console.log('验证通过');
        this.submissionFlag=false;
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            // let isSupport = getSupport();
            // if(isSupport===undefined||isSupport==null){
            //   this.dialogVisible =true;
            //   return;
            // }
            this.loading = true;
            this.$store.dispatch('Login', this.loginForm).then(() => {
              this.loading = false;
              if(this.rememberflag == "1") {
                setCookie("username", this.loginForm.username, 15);
                setCookie("password", this.loginForm.password, 15);
                window.localStorage.setItem("lang", this.language);
                setCookie("lang",this.language,15);
              }
              this.$router.push({path: '/'})
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('参数验证不合法！');
            return false
          }
        })


      },
      onFail(){
        this.$notify({
          title: '警告',
          message: '验证不通过',
          type: 'warning'
        });
        //console.log('验证不通过');
        this.msg = ''
      },
      onRefresh(){
        console.log('点击了刷新小图标');
        this.msg = ''
      },
      onFulfilled() {
        console.log('刷新成功啦！');
      },
      onAgain() {
        this.$notify({
          title: '警告',
          message: '检测到非人为操作的哦！',
          type: 'warning'
        });
        //console.log('检测到非人为操作的哦！');
      },

      handleCommand(value) {
        this.language = value;
        this.$i18n.locale = value;
        window.localStorage.setItem("lang", this.language);
        setCookie("lang",value,15);
      },
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            // let isSupport = getSupport();
            // if(isSupport===undefined||isSupport==null){
            //   this.dialogVisible =true;
            //   return;
            // }
            this.loading = true;
            this.$store.dispatch('Login', this.loginForm).then(() => {
              this.loading = false;
              setCookie("username",this.loginForm.username,15);
              setCookie("password",this.loginForm.password,15);
              window.localStorage.setItem("lang", this.language);
              setCookie("lang",this.language,15);
              this.$router.push({path: '/'})
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('参数验证不合法！');
            return false
          }
        })
      },
      handleTry(){
        this.dialogVisible =true
      },
      dialogConfirm(){
        this.dialogVisible =false;
        setSupport(true);
      },
      dialogCancel(){
        this.dialogVisible = false;
        setSupport(false);
      },


    }

  }
</script>

<style scoped>
  .login-form-layout {
    position: absolute;
    left: 0;
    right: 0;
    width: 390px;
    margin: 140px auto;
    border-top: 10px solid #409EFF;
  }

  .login-title {
    text-align: center;
  }

  .login-center-layout {
    background: #409EFF;
    width: 100%;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    margin-top: 200px;
  }
</style>

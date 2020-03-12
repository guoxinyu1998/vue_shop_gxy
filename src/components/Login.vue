<template>
    <div class="login_container">
        <!-- 登录盒子 -->
       <div class="login_box">
           <!-- 头像框 -->
           <div class="avatar_box">
              <img src="../assets/logo.png">
           </div>
           <!-- 登录表单区域 ，需要在plugins下的elements.js引入使用到的elements元素-->
                <!-- ref="loginFormRef"是为了取到表单的实例对象  loginFormRef为引用对象 -->
                <!-- :rules="loginFormRules"是表单的验证规则对象 -->
           <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
               <!-- 用户名 -->
               <!-- prop="username"是验证规则属性，username是在loginFormRules下定义的，而loginFormRules又要写在整个表单上 -->
            <el-form-item prop="username">
                <!-- 引用阿里巴巴图标库，把font文件夹复制到assets下，同时在main.js中引入font下的iconfont.css，然后在输入框中用prefix-icon="iconfont icon-user"来引入具体图标。其中iconfont是必须的，后面则是要引入图标的名字 -->
               <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
                <!-- type="password"隐藏密码 -->
               <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
            </el-form-item>
            <!-- 按钮区域 -->
            <el-form-item class="btns">
                <!-- type="primary"是蓝色按钮 -->
               <el-button type="primary" @click="login">登录</el-button>
               <!-- type="info"是灰色按钮 -->
               <!-- @click="resetLoginForm"定义点击事件，事件在methods中定义 -->
               <el-button type="info" @click="resetLoginForm">重置</el-button>
            </el-form-item>
           </el-form>
       </div>

    </div>
</template>

<script>
export default {
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
          username: '郭新宇',
          password: 'a8811302'
      },

    //   这是表单的验证规则对象
    loginFormRules: {
        // 验证用户名是否合法 
        username: [
            // required:true表示必填项，trigger: "blur"表示失去焦点的时候触发
            {required:true,message:"请输入用户名", trigger: "blur"},
            {min: 3,max: 10,message:"长度在3到10个字符",trigger:"blur"}
        ],
        // 验证密码是否合法
        password: [
            {required:true,message:"请输密码", trigger: "blur"},
            {min: 6,max: 15,message:"长度在6到15个字符",trigger:"blur"}
        ]
    }
    }
  },
  methods:{
    // 重置功能resetFields
      resetLoginForm(){
          this.$refs.loginFormRef.resetFields();
      },
    //   登录功能的验证,当输入的用户名和密码不符合规定时，验证为false，合法时，为true
      login(){
        //   validate（）中接收一个回调函数，第一个形参为验证的结果，是一个布尔值
          this.$refs.loginFormRef.validate(async valid => {
              if(!valid) return;
            //   发起登录请求，必须在main.js配置案axios
            // 打开数据库，并配置api（步骤在文件夹中）
            // post操作是一次promise，为了简化操作，在前面加上 await【注意，await只能用在被async修饰的方法中】
            // 解构赋值data，并命名为res对象，根据res的meta属性。判断数据库中是否有该数据
            const {data: res} =await this.$http.post('login',this.loginForm);
            if(res.meta.status !==200) 
            // $message是在elements下挂载的Message全局弹框组件，error和success分别对应错误和成功提示框
            return this.$message.error('登录失败');
            this.$message.success('登录成功');

            // 1.将登录成功后的 token 保存到客户端的 sessionStorage中
                //   1.1项目中除了登录之外的其他api接口，必须在登录之后才能访问
                // 1.2token中只有在当前网站打开期间生效，所以将token保存在 sessionStorage中
            window.sessionStorage.setItem("token",res.data.token);

            // 2.通过编程式导航跳转到后台主页，路由地址是/home ,路由地址在router下的index.js中
            this.$router.push('/home')

          });
      }
  }
};
</script>

<style lang="less" scoped>
// 注意使用带有less的style，需要安装开发依赖less-loader  以及less
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: white;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    //注意：left：50%和top：50%指的是盒子左上角在正中心，所有还要移动translate
    transform: translate(-50%,-50%);

    .avatar_box{
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        // 边框
        border-radius: 50%;
        // 圆角
        padding: 10px;
        // 内边距
        box-shadow:0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #fff;
        img{
            height: 100%;
            width: 100%;
            // 宽高适应区域
            border-radius: 50%;
            background-color: #eee;
        }
    }
}
.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.btns{
    display: flex;
    justify-content: flex-end;
    // 尾部对齐
}
</style>

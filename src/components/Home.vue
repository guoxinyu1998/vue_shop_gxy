<template>
  <!-- 布局用的是elements下的container布局，需要导入到elements.js中 -->
    <el-container class="el-container">
        <!-- 头部区域 -->
       <el-header class="el-header">
           <div>
               <img src="../assets/heima.png" alt="">
               <span>电商后台管理系统</span>
           </div>
           <el-button type="info" @click="logout">退出</el-button>
       </el-header>
       <!-- 页面主体区域 -->
       <el-container>
           <!-- 左侧区域-->
           <!-- :width="isCollapse? '64px' : '200px'"  折叠的时候，侧边栏为64px。不折叠的时候，侧边栏为200px -->
          <el-aside :width="isCollapse? '64px' : '200px'" class="el-aside">
              <!-- 折叠功能 -->
              <div class="toggle-button" @click="toggleCollapse">|||</div>
              <!-- 侧边栏菜单区域  使用的是element-ui提供的菜单栏组件    background-color="#333744"为背景色   active-text-color="#ffd04b"为激活后的颜色-->
                <!-- unique-opened默认为true，不可以同时打开多个一级菜单 element组件提供的方法 -->
                <!-- :collapse="isCollapse" 动态添加折叠效果 -->
                <!-- :collapse-transition="false" 取消折叠动画 -->
                <!-- router为侧边栏开启路由 -->
                <!-- :default-active="activePath" 动态数据绑定（用于二级菜单高亮）
                    左侧菜单高亮保持步骤：给二级菜单添加点击事件，点击二级菜单的时候，把index值保存到sessionStorage中
                                        home页面刷新创建时，立即把sessionStorage中的值取出来，赋值给左侧菜单激活
                                        每次点击时，给activePath重新赋值
                 -->
              <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
                    <!-- 一级菜单 -->
                       <!-- v-for 遍历 存到menulist中的数据，同时设置key值，每一项id是唯一的，故设置成item.id -->
                       <!-- 每个一级导航栏都应该有自己唯一的index，这里用动态数据绑定为每一项对应的id，同时要通过拼接的方式把数字改为字符串，因为:index只接受字符串 -->
                       <!-- 若每个导航栏index值相同，则点击一个导航栏，所有导航栏都会有相同的操作 -->
                    <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
                        <!-- 一级菜单的模板区域 -->
                        <template slot="title">
                            <!-- 图标 动态绑定-->
                            <i :class="iconsObj[item.id]"></i>
                                <!-- 文本 -->
                                <!-- 把每一项的authName展示在一级导航栏中 -->
                            <span>{{item.authName}}</span>
                        </template>

                      <!-- 二级菜单 -->
                      <!-- "'/' + subItem.path" 作为路由的跳转地址 -->
                      <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
                          <!-- 二级菜单模板区域 -->
                          <template slot="title">
                            <!-- 图标 -->
                            <i class="el-icon-menu"></i>
                                <!-- 文本 -->
                            <span>{{subItem.authName}}</span>
                        </template>
                      </el-menu-item>
                    </el-submenu>
              </el-menu>
          </el-aside>
          <!-- 右侧内容区域 -->
          <el-main class="el-main">
              <!-- 路由占位符 ,登录后显示Welcome组件-->
              <router-view></router-view>
          </el-main>
       </el-container>
    </el-container>
</template>

<script>
export default {
    data(){
        return {
            // 左侧菜单数据 
            menulist:[],

            // 实现动态修改一级菜单栏的图标
            iconsObj:{
                // 这些数字为每一个菜单的id（把一级菜单栏的id和显示的图标代码绑定，通过唯一的ID号来进行动态图标绑定）
                '125': 'iconfont icon-user',
                '103': 'iconfont icon-tijikongjian',
                '101': 'iconfont icon-shangpin',
                '102': 'iconfont icon-danju',
                '145':'iconfont icon-baobiao'
            },
            // 是否折叠，false不折叠
            isCollapse:false,
            // 被激活的链接地址（用于二级菜单高亮）
            activePath: ''
        }
    },
    // 页面刷新时调用created函数 
    created(){
    // 调用左侧菜单栏数据
        this.getMenuList()
        // 二级菜单高亮
        this.activePath = window.sessionStorage.getItem('activePath')
    },


    methods:{
        // 退出功能，销毁token值，通过编程式this.$router.push('/login')导航跳转至login页面
        logout(){
            window.sessionStorage.clear()
            this.$router.push('/login')
        },

        // 获取所有的菜单
        async getMenuList(){
           const {data:res} = await this.$http.get('menus')
        //    获取数据失败  用$message.error()把错误消息打印出来
           if(res.meta.status !==200) return this.$message.error(res.meta.msg)
        // 获取数据成功， 把获取到的数据保存到memulist数组中
           this.menulist= res.data
           console.log(res)
        },
        // 点击按钮切换菜单的折叠与展开
      toggleCollapse(){
          this.isCollapse = !this.isCollapse
      },

    //   保存链接的激活状态 （用于二级菜单高亮）
      saveNavState(activePath){
          window.sessionStorage.setItem('activePath',activePath)
          this.activePath = activePath
      }
    }
}
</script>

<style lang="less" scoped>
.el-container{
    height: 100%;
}
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    // 设置或检索弹性盒子元素在主轴方向上的对齐方式  space-between	第一个、最后一个对齐弹性容器的边缘，其余均匀分布
    padding-left: 0;
    align-items: center;
    // 说明:设置或者检索弹性盒子元素在侧轴方向上的对齐方式   center	居中对齐，如果该行的尺寸小于弹性盒子元素的尺寸，则会向两个方向溢出相同的长度
    color:#ffffff;
    font-size: 20px;
    div {
        display: flex;
        align-items: center;
        span{
            margin-left: 15px;
        }
    }
}

.el-aside{
    background-color:#333744;

    // 解决边框问题
    .el-menu{
        border-right: none;
    }
}
.el-main{
    background-color: #EAEDF1;
}
// 设置图标和文字之间的间距
.iconfont{
    margin-right: 10px;
}

.toggle-button{
    background-color: #4A5064;
    color: white;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    // 字符间距
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>
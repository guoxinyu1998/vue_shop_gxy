<template>
    <div>
        <!-- 面包屑导航区域  element组件提供 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
           <!-- :to="{ path: '/home' }" 是点击首页跳转的位置 -->
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>


    <!-- 卡片视图区域 -->
        <el-card>
            <!-- 2.为Echarts准备一个具备大小（宽高）的Dom -->
            <div id="main" style="width:600px;height:400px;"></div>
        </el-card>
    </div>
</template>
<script>
// 1.导入echarts  需要安装依赖
import echarts from 'echarts';

export default {
    data(){
        return {}
    },
    created(){
    },

    //此时页面上元素被渲染完毕了！！！ 在mounted声明周期中初始化   mounted()在页面初始化完成之后执行
    async mounted(){
        // 3.基于准备好的Don，初始化echarts实例
        var mychart = echarts.init(document.getElementById('main'))


        const{data:res} = await this.$http.get('reports/type/1')
        if(res.meta.status !==200){
            return this.$message.error('获取折线图数据失败')
        }

        // 4.准备数据和配置项
        


        // 5.展示数据
        mychart.setOption(res.data)
    },
    methods:{
        
    }
}
</script>
<style lang="less" scoped>

</style>
// 权限列表界面
<template>
    <div>
       <!-- 面包屑导航 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
           <!-- :to="{ path: '/home' }" 是点击首页跳转的位置 -->
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
           <el-table :data="rightsList" border stripe>
               <!-- 索引列 -->
               <el-table-column type="index" label="序号"></el-table-column>
               <el-table-column label="权限名称" prop="authName"></el-table-column>
               <el-table-column label="路径" prop="path"></el-table-column>
               <el-table-column label="权限等级" prop="level">
                   <template slot-scope="scope">
                       <!-- 按需渲染，一级渲染成蓝色，二级展示成绿色success，三级展示成黄色warning  第三方组件库element -->
                       <el-tag v-if="scope.row.level =='0'">一级</el-tag>
                       <el-tag type="success" v-else-if="scope.row.level =='1'">二级</el-tag>
                       <el-tag type="warning" v-else-if="scope.row.level =='2'">三级</el-tag>
                   </template>
               </el-table-column>
           </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return {
            // 权限列表 
            rightsList: []
        }
    },
    created(){
        // 获取所有的权限
        this.getRightsList()
    },
    methods:{
        // 获取权限列表 
        async getRightsList(){
            const {data:res} = await this.$http.get('rights/list')
            if(res.meta.status !==200){
                return this.$message.error('获取权限列表失败')
            }
            // 获取列表权限成功
            this.rightsList = res.data
        }
    }
}
</script>

<style lang="less" scoped>

</style>

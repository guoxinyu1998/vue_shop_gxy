<template>
    <div>
       <!-- 面包屑导航区域  element组件提供 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
           <!-- :to="{ path: '/home' }" 是点击首页跳转的位置 -->
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>



        <!-- 卡片视图区域 -->
        <el-card>
            <el-row>
                <el-col :span="24" class="el_col">
                    <!-- v-model="queryInfo.query"实现数据绑定 用来搜素 -->
                    <!-- @clear="getGoodsList" clear之后，显示所有商品项 -->
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
            </el-row>


            <!-- tabe表格区域 -->
            <el-table :data="goodslist" border stripe>
                <!-- 索引列 -->
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
                <el-table-column label="创建时间" prop="add_time">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
            </el-table>


            <!-- 分页 element组件提供-->
            <!-- @size-change切换每页显示多少条记录 -->
            <!-- @current-change页码值发生切换的事件 -->
            <!-- :current-page当前显示的页数 -->
            <!-- :page-sizes="[1, 3, 5, 10]"为每页显示的具体数目 -->
             <!-- background添加背景 -->
            <el-pagination 
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange" 
                :current-page="queryInfo.pagenum"
                :page-sizes="[10, 15, 20, 30]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                background>
            </el-pagination>

        </el-card>
    </div>
</template>
<script>
export default {
    data(){
        return {
            // 查询参数对象 
            queryInfo:{
                query: '',
                pagenum: 1,
                pagesize: 10
            },
            // 商品列表
            goodslist:[],
            // 总数据条数
            total:0

        }
    },
    created(){
        this.getGoodsList()
    },
    methods:{
        // 根据分页获取对应的商品列表
        async getGoodsList(){
            const{data:res} = await this.$http.get('goods',{params:this.queryInfo})
            if(res.meta.status !==200){
                return this.$message.error('获取商品列表失败')
            }
            this.goodslist = res.data.goods
            this.total = res.data.total
            this.$message.success('获取商品列表成功')
        },
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getGoodsList()
        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getGoodsList()
        }
    }
}
</script>
<style lang="less" scoped>

</style>
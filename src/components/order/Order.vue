<template>
    <div>
         <!-- 面包屑导航区域  element组件提供 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
           <!-- :to="{ path: '/home' }" 是点击首页跳转的位置 -->
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
                <!-- 搜素框区域 -->
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>

            </el-row>


            <!-- 订单列表数据 -->
            <el-table :data="orderlist" border stripe>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price"></el-table-column>
                <el-table-column label="是否付款" prop="pay_status">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.pay_status ==='1'">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send"></el-table-column>
                <el-table-column label="下单时间" prop="create_time">
                    <template slot-scope="scope">
                        <!-- 用|调用dateFormat过滤器 -->
                        {{scope.row.create_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template>
                        <!-- 修改地址按钮 -->
                        <el-button size="mini" type="primary" icon="el-icon-edit"  @click="showBox"></el-button>
                        <!-- 查看进度按钮 -->
                        <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 element组件提供-->
            <!-- @size-change切换每页显示多少条记录 -->
            <!-- @current-change页码值发生切换的事件 -->
            <!-- :current-page当前显示的页数 -->
            <!-- :page-sizes="[1, 3, 5, 10]"为每页显示的具体数目 -->
            <el-pagination 
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange" 
                :current-page="queryInfo.pagenum"
                :page-sizes="[10, 15, 20, 30]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>

        </el-card>

        <!-- 修改地址的对话框 -->
        <el-dialog title="修改地址" :visible.sync = "addressVisible" width="50%" @close="addressDialogClosed">
            <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
                <el-form-item label="省市区/县" prop="address1">
                <!-- 级联选择器 -->
                   <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer">
                <el-button @click="addressVisible = false">取消</el-button>
                <el-button type="primary" @click="addressVisible = false">确定</el-button>
            </span>
        </el-dialog>




        <!-- 查看物流进度的对话框 -->
        <el-dialog title="物流进度" :visible.sync = "progressVisible" width="50%">
            <!-- Timeline时间线 -->
            <el-timeline>
                <el-timeline-item v-for="(activity,index) in progressInfo" :key="index" :timestamp="activity.time">
                    {{activity.context}}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
// 引入地区信息
import cityData from './citydata.js'
export default {
    data(){
        return  {
            queryInfo:{
                query: '',
                pagenum: 1,
                pagesize: 10
            },
            total: 0,
            orderlist: [],
            // 控制修改地址的对话框的显示与隐藏 
            addressVisible:false,
            addressForm:{
                address1: [],
                address2: ''
            },
            addressFormRules:{
                address1:[
                    {required:true, message:'请选择省市区/县',trigger:"blur"}
                ],
                address2:[
                    {required:true, message:'请填写详细地址',trigger:"blur"}
                ]
            },
            // 显示地区信息
            cityData,
            // 控制物流对话框的显示与隐藏 
            progressVisible:false,
            // 物流信息
            progressInfo:[]
        }
    },
    created(){
        this.getOrderList()
    },
    methods:{
        async getOrderList(){
            const{data:res} = await this.$http.get('orders',{params:this.queryInfo})
            if(res.meta.status !==200){
                return this.$message.error('获取订单失败')
            }
            this.total=res.data.total
            this.orderlist = res.data.goods
        },
        // pagesize发生变化，会立即调用handleSizeChange
        handleSizeChange(newSize){
            this.queryInfo.pagesize=newSize
            this.getOrderList()

        },
        // 页码值发生变化 
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getOrderList()
        },
        // 这是展示修改地址的对话框 点击按钮，调用函数
        showBox(){
            this.addressVisible = true
        },
        // 关闭修改对话框调用，重置
        addressDialogClosed(){
            this.$refs.addressFormRef.resetFields()
        },
        // 这是展示物流对话框的函数 
        async showProgressBox(){
            const{data:res} = await this.$http.get('/kuaidi/804909574412544580')
            if(res.meta.status !==200){
                return this.$message.error('获取物流进度失败')
            }
            this.progressInfo = res.data
            this.progressVisible = true
        }
    }
}
</script>
<style lang="less" scoped>
.el-cascader{
    width: 100%;
}
</style>
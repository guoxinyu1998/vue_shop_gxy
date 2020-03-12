<template>
    <div>
     <!-- 面包屑导航 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
           <!-- :to="{ path: '/home' }" 是点击首页跳转的位置 -->
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDailog">添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 表格 用的是Vue插件 vue-with-tree-... -->
            <!-- selection-type="false" 是否为多选型表格 -->
            <!-- expend-type是否为展开行类型表格  -->
            <!-- show-index索引列 -->
            <!-- index-text 数据索引名称 -->
            <!-- border纵向分隔线 -->
            <!-- show-row-hover 是否有鼠标悬停效果 -->
            <tree-table class="treeTable" :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
                <!-- 定义一个插槽，名字为isok，将来会被 label:'是否有效'，type: 'template',template: 'isok'所引用 -->
                <!-- slot-scope="scope"用来接收数据 -->
                <template slot="isok" slot-scope="scope">
                    <!-- style="color: lightgreen"渲染成绿色对勾 -->
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
                    <i class="el-icon-error" v-else style="color: red"></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="min" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else>三级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="opt" slot-scope="scope">
                    <!-- scope.row.cat_id  注意获取id时一定要看api接口，对应这一行的id属性的名字名字一定不要错，否则得不到该项数据，也就无法根据id来进行删除 -->
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCate(scope.row.cat_id)">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页 element组件提供-->
            <!-- @size-change切换每页显示多少条记录 -->
            <!-- @current-change页码值发生切换的事件 -->
            <!-- :current-page当前显示的页数 -->
            <!-- :page-sizes="[1, 3, 5, 10]"为每页显示的具体数目 -->
            <el-pagination 
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange" 
                :current-page="querInfo.pagenum"
                :page-sizes="[5, 10, 15, 30]"
                :page-size="querInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
       
        </el-card>

       <!-- 添加角色的对话框  引用element组件el-dialog -->
        <!-- :visible.sync="setAddDialogVisible"控制对话框的显示与隐藏 -->
         <!-- @close="adddialogClosed"是关闭后重置 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">

            <!-- 对话框内容主体区域 -->
            <!-- :model="addRoleForm"数据绑定对象 -->
            <!-- :rules="addFormrules"数据规则对象 -->
             <!-- ref="addResetRolesRef"引用对象  相当于给表单起一个名字，方便找到 -->
            <el-form :model="addCateForm" ref="addCateFormRef" :rules="adCateFormrules" label-width="100px">
                <!-- prop="cat_name"验证对象属性 -->
                <el-form-item label="分类名称:" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <!-- 级联选择器  默认只能选中最后一级-->
                    <!-- :options=""数据源 -->
                    <!-- :props用来指定配置对象 -->
                    <!-- clearable支持清空 -->
                    <el-cascader   :options="parentCateList" :props="cascaderProps"
                    v-model="selectedKeys" @change="parentCateChange" clearable>

                    </el-cascader>
                </el-form-item>
            </el-form>
            
             <!-- @click="Addroles"点击进行表单的预验证 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible= false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    data(){
        return {
            // 查询条件
            querInfo:{
                type: 3,
                pagenum :1,
                pagesize: 5
            },
            // 商品分类的数据列表，默认为空
            catelist:[],
            // 总数据 条数
            total: 0,
            // 为table-tree指定列的定义
            columns:[{
                // label属性指定标题
                label:'分类名称',
                // 对应列的属性名称
                prop:'cat_name'
            },
            {
                label:'是否有效',
                // 表示将当前列定义为模板列
                type: 'template',
                // 表示当前这一列使用模板名称 
                template: 'isok'
            },
            {
                label:'排序',
                type: 'template',
                template: 'order'
            },
            {
                label: '操作',
                type: 'template',
                template: 'opt'
            }
            ],
            // 控制添加分类对话框的显示与隐藏
            addCateDialogVisible:false,

            // 添加分类的表单数据对象 
            addCateForm:{
                // 将要添加分类的名称
                cat_name: '',
                // 父级分类的id
                cat_pid: 0,
                // 默认当前添加的分类是一级分类
                cat_level:0

            },
            // 添加分类表单的规则对象
            adCateFormrules:{
                cat_name:[
                    {required:true,message: '请输入分类名称',trigger:'blur'}
                ]
            },
            // 父级分类的列表 
            parentCateList:[],
            // 级联选择器的配置对象
            cascaderProps:{
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                checkStrictly: 'true'
            },
            // 选中的父级分类的id数组
            selectedKeys:[],
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        // 获取商品分类数据 
        async getCateList(){
            const{data:res} = await this.$http.get('categories',{params: this.querInfo})
            if(res.meta.status !==200 ){
                return this.$message.error('获取商品分类失败')
            }
            // 把数据列表赋值给catelist
            this.catelist= res.data.result
            // 为总数据条数赋值
            this.total = res.data.total
        },
        // 监听pagesize改变
        handleSizeChange(newsize){
            this.querInfo.pagesize = newsize
            this.getCateList()
        },
        // 监听 pagename改变
       handleCurrentChange(newpage){
           this.querInfo.pagenum=newpage
           this.getCateList()
       },
        // 点击按钮，展示添加分类的对话框
       showAddCateDailog(){
        //    先获取父级分类数据列表，再展示对话框
           this.getParentCateList()
           this.addCateDialogVisible=true
       },
    //    获取父级分类的列表 
    async getParentCateList(){
        const{data:res} = await this.$http.get('categories',{
            // 只能返回前两级的表单
           params:{type:2}

        })
        if(res.meta.status !==200){
            this.$message.error('获取父级分类数据失败')
        }
        this.parentCateList = res.data
        
    },
    // 选择项发生变化触发这个函数 
    parentCateChange(){
        console.log(this.selectedKeys)
        // 如果selectedKeys数组中的length大于0  证明选择了父级分类
        // 反之就没有选择任何父级分类
        if(this.selectedKeys.length > 0){
            // 父级分类的id
            this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
            // 为当前分类的等级赋值
            this.addCateForm.cat_level=this.selectedKeys.length
            return
        }else{
              // 父级分类的id
            this.addCateForm.cat_pid = 0
            // 为当前分类的等级赋值
            this.addCateForm.cat_level=0
        }
    },
    // 点击确定 ，添加新的分类
    addCate(){
    //   预校验
    this.$refs.addCateFormRef.validate(async valid =>{
        if(!valid) return
        // 校验通过
        const{data:res} = await this.$http.post('categories',this.addCateForm)
    if(res.meta.status !==201){
        this.$message.error('添加分类失败')
    }
    this.$message.success('添加分类成功')
    this.addCateDialogVisible = false
    this.getCateList()
    })
    },
    // 监听对话框的关闭时间，重置表单的额数据
    addCateDialogClosed(){
        // 表单重置
        this.$refs.addCateFormRef.resetFields()
        // 将数组清空
        this.selectedKeys = []
        this.addCateForm.cat_level=0
        this.addCateForm.cat_pid = 0
    },


    
    // 根据id删除记录
       async removeCate(id){
        //    弹框询问用户是否删除数据  从element弹窗组件中复制
        const confirmResult = await this.$confirm('此操作将永久删除该商品分类，是否继续？', '提示', 
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
        // 若用户取消删除，则会产生错误，用catch捕获错误消息，并返回给confirmResult
        ).catch(err => {
            return err
        })
        // 如果用户确认删除。返回的是字符串confirm
        // 如果用户取消删除，用catch捕获后，返回的是字符串 cancel
        if(confirmResult !== 'confirm'){
            // 取消删除
            return this.$message.info('已经取消删除')
        }
            // 确认删除，调用api删除单个账户
            const {data:res} = await this.$http.delete('categories/' + id)
            if(res.meta.status !==200 ){
               
                return this.$message.error('删除该类商品失败！')
            }
            this.$message.success('删除该类商品成功!')
            this.getCateList()
       },

    }
}
</script>

<style lang="less" scoped>
.treeTable{
    margin-top: 15px;
}
.el-cascader{
    width: 100%;
}
</style>
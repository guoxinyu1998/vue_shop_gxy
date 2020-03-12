<template>
<div>
    <!-- 面包屑导航 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
           <!-- :to="{ path: '/home' }" 是点击首页跳转的位置 -->
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>


        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 头部的警告区域 -->
            <!-- :closable="false"去掉× -->
            <!-- show-icon渲染出一个感叹号 -->
            <el-alert title="注意:只允许为第三级分类设置相关参数" type="warning" show-icon :closable="false"></el-alert>


            <!-- 选择商品分类区域 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 选择商品分类的级联选择框 -->
                    <el-cascader :options="catelist" :props="cateProps" v-model="selectedCateKeys" @change="handleChange"></el-cascader>
                </el-col>
            </el-row>


            <!-- tab页签区域   可以切换-->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!-- 添加动态参数的面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <!-- 添加参数的按钮  没有选择三级分类的时候，需要被锁定，通过计算属性computed实现-->
                   <el-button type="primary" size="mini" :disabled="isBtnDisabled"  @click="addDialogVisible=true">添加参数</el-button>
                   <!-- 动态参数表格 -->
                   <el-table :data="manyTableData" border stripe>
                       <!-- 这是展开行 -->
                       <el-table-column type="expand">
                         <template slot-scope="scope">
                             <!-- 循环渲染tag标签 -->
                             <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
                             <!-- 输入的文本框 -->
                             <!-- v-if="scope.row.inputVisible"  v-model="scope.row.inputValue"  为每一个参数中的按钮与文本框赋不同的值，避免参数之间发生联动 inputVisible 和inputVlaue 在getParmasData中获取到 -->
                             <el-input class="input-new-tag" v-if="scope.row.inputVisible"  v-model="scope.row.inputValue" ref="saveTagInput"  size="small"  @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                            </el-input>
                            <!-- 添加的按钮  -->
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                         </template>
                       </el-table-column>
                       <!-- 索引列 -->
                       <el-table-column type="index"></el-table-column>
                       <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                       <el-table-column label="操作">
                           <template slot-scope="scope">
                           <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">修改</el-button>
                           <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParmas(scope.row.attr_id)">删除</el-button>
                           </template>
                       </el-table-column>
                       
                   </el-table>
                </el-tab-pane>


                <!-- 添加静态属性的面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <!-- 添加属性的按钮 -->
                   <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>

                    <!-- 静态数据表格 -->
                   <el-table :data="onlyTableData" border stripe>
                       <!-- 这是展开行 -->
                       <el-table-column type="expand">
                         <template slot-scope="scope">
                             <!-- 循环渲染tag标签 -->
                             <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
                             <!-- 输入的文本框 -->
                             <!-- v-if="scope.row.inputVisible"  v-model="scope.row.inputValue"  为每一个参数中的按钮与文本框赋不同的值，避免参数之间发生联动 inputVisible 和inputVlaue 在getParmasData中获取到 -->
                             <el-input class="input-new-tag" v-if="scope.row.inputVisible"  v-model="scope.row.inputValue" ref="saveTagInput"  size="small"  @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                            </el-input>
                            <!-- 添加的按钮  -->
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                         </template>
                       </el-table-column>
                       <!-- 索引列 -->
                       <el-table-column type="index"></el-table-column>
                       <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                       <el-table-column label="操作">
                           <template slot-scope="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">修改</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParmas(scope.row.attr_id)">删除</el-button>
                           </template>
                       </el-table-column>
                       </el-table>
                  
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 添加参数对话框 -->
        <el-dialog :title="'添加' + titleText"  :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">

            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer">
                <el-button @click="addDialogVisible=false">取消</el-button>
                <el-button type="primary" @click="addParams">确定</el-button>
            </span>
        </el-dialog>


        <!-- 修改参数对话框 -->
        <el-dialog :title="'修改' + titleText"  :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">

            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer">
                <el-button @click="editDialogVisible=false">取消</el-button>
                <el-button type="primary" @click="editParmas">确定</el-button>
            </span>
        </el-dialog>
</div>
</template>

<script>
export default {
   data(){
       return {
        //    商品分类列表 
           catelist: [],
        //    这是级联选择框的配置对象
           cateProps:{
               value: 'cat_id',
               label: 'cat_name',
               children: 'children',
               expandTrigger:"hover"
           },
        //    级联选择框双向绑定到的数组
           selectedCateKeys:[],
        // 被激活的页签的名称
           activeName: 'many',
        //  动态参数的数据
           manyTableData: [],
        //    静态属性的数据
           onlyTableData: [],
        // 控制添加对话框的显示与隐藏 
           addDialogVisible:false,
        // 添加参数的表单数据对象
           addForm: {},
           addFormRules:{
               attr_name: [
                   {required:true,message:'请输入参数名称',trigger:'blur'},
                    ]
           },
        //    控制修改对话框的隐藏与显示
           editDialogVisible:false,
        //    修改的表单数据对象
           editForm:{},
        //    修改表单的验证规则对象 
           editFormRules:{
               attr_name: [
                   {required:true,message:'请输入参数名称',trigger:'blur'},
                    ]
           },
       }
   },
   created(){
       this.getCateList()
   },
   methods:{
        //    获取所有商品分类列表
        async getCateList(){
            const{data:res} = await this.$http.get('categories')
            if(res.meta.status !==200){
                return this.$message.error('获取商品列表失败')
            }
            this.catelist = res.data
            console.log(this.catelist)
        },
        // 级联选择框发生变化，会触发这个函数 
        handleChange(){
            this.getParamsDate()
       
        },
        // tab标签点击事件的处理函数
        handleTabClick(){
            console.log(this.activeName)
            this.getParamsDate()
        },
        // 获取参数的列表数据 
        async getParamsDate(){
             //    选择的不是三级分类,this.manyTableData = [] 清空动态参数      this.onlyTableData= [] 清空静态属性
            if(this.selectedCateKeys.length !==3){
                this.selectedCateKeys=[]
                this.manyTableData = []
                this.onlyTableData= []
                return
            }
            // 选择的是三级分类
            // 根据所选分类的id，和当前所处的面板，获取对应的参数
            const{data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
                params:{sel:this.activeName}
            })
            if(res.meta.status !==200){
                return this.$message.error('获取参数失败')
            }
            // 将字符串变为数组
           res.data.forEach(item =>{
               item.attr_vals =item.attr_vals ? item.attr_vals.split(' ') : []
            //    控制文本框的显示与隐藏
            item.inputVisible= false
            // 文本框中输入的值 
            item.inputValue = ''
           })
           
            // 判断数据到底属于哪个表格
            if(this.activeName ==='many'){
                this.manyTableData= res.data
               
            }else{
                this.onlyTableData=res.data
              
            }

        },
        // 监听添加对话框的关闭事件
        addDialogClosed(){
            this.$refs.addFormRef.resetFields()
        },
        addParams(){
            this.$refs.addFormRef.validate(async valid =>
            {
                if(!valid) return
                const{data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
                    attr_name: this.addForm.attr_name,
                    attr_sel: this.activeName
                })
                if(res.meta.status !==201){
                    return this.$message.error('添加参数失败')
                }
                this.$message.success('添加参数成功')
                this.addDialogVisible= false
                this.getParamsDate()
            })
        },
        // 点击按钮展示修改对话框 
        async showEditDialog(attr_id){
            // 查询当前参数的信息
            const{data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{
                parmas:{attr_sel:this.activeName}
            })
            if(res.meta.status !==200){
                return this.$message.error('获取参数信息失败')
            }
            this.editForm = res.data
            this.editDialogVisible=true

        },
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
        },
        // 点击按钮，修改参数信息
        editParmas(){
            this.$refs.editFormRef.validate(async valid =>{
                if(!valid) return 
                const{data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
                   {
                    attr_name:this.editForm.attr_name,
                    attr_sel:this.activeName
                    }
                )
                if(res.meta.status!==200){
                    return this.$message.error('修改参数失败')
                }
                this.$message.success('修改参数成功')
                this.getParamsDate()
                this.editDialogVisible = false
            })
        },
        // 根据id删除 
      async removeParmas(attr_id){
        //    弹框询问用户是否删除数据  从element弹窗组件中复制
        const confirmResult = await this.$confirm('此操作将永久删除该参数，是否继续？', '提示', 
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
            const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
            if(res.meta.status !==200 ){
               
                return this.$message.error('删除失败！')
            }
            this.$message.success('删除成功!')
            this.getParamsDate()
       },
    //    文本框失去焦点，或按下了enter键都会触发
    // 文本框失去焦点后，文本框切换回按钮 
    handleInputConfirm(row){
        // 判断输入的内容是否为空  
        // trim()是去掉字符串两端的空格
        if(row.inputValue.trim().length ===0){
            row.inputValue = ''
           row.inputVisible = false
           return
        }
        // 如果没有return，则证明输入的内容需要做后续处理
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue =''
        row.inputVisible = false
        // 需要发起请求，保存这次操作
        this.saveAttrVlas(row)
       
    },
    // 点击按钮，显示文本框
    showInput(row){
        row.inputVisible = true
        
        // 让文本框自动获得焦点  第三方组件库element
        // $nextTickd方法作用，当页面上元素被重新渲染后，才会指定回调函数中的代码
        this.$nextTick(_ =>{
            this.$refs.saveTagInput.$refs.input.focus()
        })

    },
    // 将对attr_vals的操作保存到数据库
    async saveAttrVlas(row){
         const{data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`
        ,{
            attr_name:row.attr_name,
            attr_sel :row.attr_sel,
            // 服务器只接收字符串，用join做一下拼接
            attr_vals: row.attr_vals.join(' ')
        })

        if(res.meta.status !==200){
            return this.$message.error('修改参数失败')
        }
        this.$message.success('修改参数成功')
    },
    // 删除对应的参数可选项 
    handleClose(i,row){
        row.attr_vals.splice(i,1)
        this.saveAttrVlas(row)
    }

   },
//    计算属性  要进行属性绑定
computed:{
    // 如果按钮需要被禁用，返回true，否则返回false
    isBtnDisabled(){
        // 没有选择三级分类，禁用，返回true
        if(this.selectedCateKeys.length!==3){
            return true
        }
        return false
    },
    // 当前选中的三级分类的id
    cateId(){
        if(this.selectedCateKeys.length == 3){
            return this.selectedCateKeys[2]
        }
        return null
    },
    // // 动态计算标题的文本 
    titleText(){
        // 激活的是动态属性
        if(this.activeName ==='many'){
            return '动态参数'
        }
        return '静态属性'
    },
    // 点击按钮，修改参数信息
    
}

}
</script>

<style lang="less" scoped>
.cat_opt{
    margin:15px 0;
}
.el-tag{
    margin: 10px;
}
.input-new-tag{
    width: 120px;
}
</style>
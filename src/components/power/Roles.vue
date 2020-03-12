<template>
    <div>
         <!-- 面包屑导航 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
           <!-- :to="{ path: '/home' }" 是点击首页跳转的位置 -->
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="setAddDialogVisible=true">添加角色</el-button>
                </el-col>
            </el-row>


            <!-- 角色列表区域 -->
            <el-table :data="rolelist" border stripe>
                <!-- 展开列 type="expand-->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <!-- scope.row.children包含的是一级权限 -->
                        <!-- :class="['bdbottom',i1 ===0 ? 'bdtop' : '']"  动态添加边框线 -->
                        <el-row :class="['bdbottom',i1 ===0 ? 'bdtop' : '' ,'vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                            <!-- 渲染一级权限 span为宽，一行总共24-->
                            <el-col :span="5">
                                <!-- tag标签用于美化 -->
                               <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                               <!-- 一级权限后面的箭头小图标  第三方组件库element-->
                               <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和三级权限 -->
                            <el-col :span="19">
                                <!-- 通过for循环 嵌套渲染二级权限 -->
                                <el-row :class="[i2===0? '' : 'bdtop' ,'vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                                    <!-- el-row一行宽度为24 在el-col中用:span="..."即可占据..宽度-->
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                          <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <!-- closable 是添加删除小图标 -->
                                        <el-tag v-for="(item3) in item2.children" :key="item3.id" type="warning" closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引和其他列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showRolesDialog(scope.row.id)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRolesId(scope.row.id)">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 分配权限的对话框 -->
        <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%">
            <!-- 主体区域 -->
           <!-- 树形空间  第三方组件element -->
           <!-- :props="treeProps"树形控件的属性绑定对象 treeProps在data中定义，里面具体内容要看api文档 -->
           <!-- show-checkbox是加上复选框 -->
           <!-- node-key="id"表示复选框选中的是id值，而不是文本 -->
           <!-- defalut-expand-all是默认展开属性结构 -->
           <!-- :default-checked-keys="defKeys"  默认勾选的节点的 key 的数组（在树形结构展开时把已有的权限勾选上） -->
           <el-tree :data="rightlist" :props="treeProps" ref="treeRef" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>



        <!-- 添加角色的对话框  引用element组件el-dialog -->
        <!-- :visible.sync="setAddDialogVisible"控制对话框的显示与隐藏 -->
         <!-- @close="adddialogClosed"是关闭后重置 -->
        <el-dialog title="添加用户" :visible.sync="setAddDialogVisible" width="50%"  @close="addDialogClosed">

            <!-- 对话框内容主体区域 -->
            <!-- :model="addRoleForm"数据绑定对象 -->
            <!-- :rules="addFormrules"数据规则对象 -->
             <!-- ref="addResetRolesRef"引用对象  相当于给表单起一个名字，方便找到 -->
            <el-form :model="addRoleForm" ref="addResetRolesRef" :rules="addFormrules" label-width="80px">
                <!-- prop="roleName"验证对象属性 -->
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            
            <!-- @click="adddialogVisible = false"点击隐藏对话框 -->
             <!-- @click="Addroles"点击进行表单的预验证 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="setAddDialogVisible= false">取 消</el-button>
                <el-button type="primary" @click="Addroles">确 定</el-button>
            </span>
        </el-dialog>



        <!-- 修改角色信息的对话框 -->
        <el-dialog title="修改角色信息" :visible.sync="editRolesDialogVisible" width="50%" @close="editRolesDialogClosed">
            <!-- 主体区域 -->
            <el-form :model="editRolesForm" ref="editRolesRef" label-width="70px">
                <el-form-item label="角色名称">
                    <el-input v-model="editRolesForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="editRolesForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRolesDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRolesInfo">确 定</el-button>
            </span>
        </el-dialog>



    </div>
</template>

<script>
export default {
    data(){
        return {
            // 所有角色数据列表
            rolelist : [],
            // 控制分配权限对话框的显示与隐藏
            setRightDialogVisible:false,
            // 所有权限的数据 
            rightlist:[],
            // 树形控件的属性绑定对象 
            treeProps:{
                label: 'authName',
                children: 'children'
            },
            // 默认选中的节点id值数组(三级权限id) （在树形结构展开时把已有的权限默认勾选上）
            defKeys:[],
            // 当前即将分配权限的角色id
            roleId:'',

            // 控制添加角色对话框的显示与隐藏
            setAddDialogVisible:false,
            // 添加角色的表单数据
            addRoleForm: {
               roleName: '',
                roleDesc: ''
            },
            
            // 添加角色表单的验证规则对象
            addFormrules: {
                roleName:[
                    {required:true,message: '请输入角色名称', trigger:'blur'},
                    {min:2,max:10,message: '角色名称的长度应该在2到10之间',trigger:'blur'}
                ],
                roleDesc:[
                    {required:true,message: '请输入角色描述', trigger:'blur'},
                    {min:10,max:30,message: '角色描述的长度应该在10到30之间',trigger:'blur'}
                ],
            },

            // 查询到的角色信息对象 
            editRolesForm:{},
            // 控制修改角色信息对话框的隐藏与显示 
            editRolesDialogVisible:false,
            // 修改角色信息的验证规则对象
            editRolesFormRules:{
                roleName:[
                    {required:true,message: '请输入角色名称', trigger:'blur'},
                    {min:2,max:10,message: '角色名称的长度应该在2到10之间',trigger:'blur'}
                ],
                roleDesc:[
                    {required:true,message: '请输入角色描述', trigger:'blur'},
                    {min:10,max:30,message: '角色描述的长度应该在10到30之间',trigger:'blur'}
                ],
            }
        }
    },
    created(){
        this.getRolesList()
    },
    methods:{
        // 获取所有角色的列表 
        async getRolesList(){
            const {data:res} = await this.$http.get('roles')
            if(res.meta.status !==200){
                return this.$message.error('获取数据失败')
            }
            // 获取成功，将数据保存到rolelist中
            this.rolelist = res.data
        },

        // 根据id删除对应的权限
        async removeRightById(role,rightId){
          //    弹框询问用户是否删除数据  从element弹窗组件中复制
        const confirmResult = await this.$confirm('此操作将永久删除用户该权限，是否继续？', '提示', 
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
            // 确认删除，调用api删除权限,  delete和路径都是从api文档中获取
            const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            if(res.meta.status !==200 ){
                return this.$message.error('删除权限失败！')
            }
            this.$message.success('删除权限成功!')
            // 删除权限后，this.getRolesList()重新调用一次数据，表格会重新被渲染，所以会出现删除后，下拉表格隐藏的结果，所以一般不用this.getRolesList()
            // 重新赋值一下数据即可（把服务器返回的最新数据直接赋值给role的children属性）
            role.children = res.data
           
       
        },

        // 这是展示分配权限的对话框 
        async showSetRightDialog(role){
            // 取到id（用于分配权限） roleId 在allotRights()中调用
            this.roleId= role.id
            // 获取所有权限的数据
            const {data:res} = await this.$http.get('rights/tree')
            if(res.meta.status!==200){
                // 获取失败
                return this.$message.error('获取权限数据失败')
            }
            // 获取成功，获取到的数据保存到data中
            this.rightlist= res.data

           
            // 递归获取三级节点的id(函数调用时必须用this。否则 无法识别methods中的函数)
            this.getleafKeys(role,this.defKeys)
           
            // 展示属性结构
            this.setRightDialogVisible=true
        },

        // 通过递归的方式获取角色下所有三级权限的id，并保存 到defKeys数组中
        // node节点用于判断是不是三级节点,arr数组进行保存
        getleafKeys(node,arr){
            // 三级节点没有children属性
            if(!node.children){
                return arr.push(node.id)
                // console.log(arr)
            }
            // 若node节点有children属性，则调用递归函数，直到找到三级节点
            node.children.forEach(item => 
            this.getleafKeys(item,arr))
        },

        // 添加角色对话框关闭后重置
        addDialogClosed(){
            this.$refs.addResetRolesRef.resetFields()
        },

         // 点击添加角色对话框的确定按钮，实现预验证，并在后台同步添加数据
        Addroles(){
            // 通过.$refs.addResetRolesRef找到ref名为addResetRolesRef的表单,调用validate函数，valid是校验的结果
            this.$refs.addResetRolesRef.validate(async valid => {
                // 验证失败
                if(!valid) return
                // 验证成功，可以发起添加用户的网络要求
                const {data:res} = await this.$http.post('roles',this.addRoleForm)
                if(res.meta.status!==201){
                    this.$message.error('添加失败')
                }
                this.$message.success('添加成功')
                // 隐藏添加对话框
                this.setAddDialogVisible= false
                // 添加后重新获取用户列表数据
                this.getRolesList()
            })
        },

         // 根据id删除记录
       async removeRolesId(id){
          
        //    弹框询问用户是否删除数据  从element弹窗组件中复制
        const confirmResult = await this.$confirm('此操作将永久删除该用户，是否继续？', '提示', 
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
            const {data:res} = await this.$http.delete('roles/' + id)
            if(res.meta.status !==200 ){
                return this.$message.error('删除角色失败！')
            }
            this.$message.success('删除角色成功!')
            this.getRolesList()
       },


        // 展示编辑用户的对话框 
        async showRolesDialog(id){
            const{data:res} = await this.$http.get('roles/' + id)
            if(res.meta.status !==200){
                // 查询失败
                return this.$message.error('查询角色信息失败')
            }
            // 查询成功
            this.editRolesForm= res.data
            // 点击修改后，显示对话框
            this.editRolesDialogVisible= true
        },
        // 取消或关闭修改角色信息后，重置
       editRolesDialogClosed(){
           this.$refs.editRolesRef.resetFields()
       },
       // 修改角色信息对话框的确定按钮，实现预验证，并在后台同步添加数据
        editRolesInfo(){
            this.$refs.editRolesRef.validate(async valid =>{
                
                if(!valid) return
                //预验证通过 发起用户信息修改的数据请求
                // editForm为查询到的用户信息对象
                // roleId为api文档中的属性【注意：传数据时一定要看接口文档中定义的方式】
                const {data:res} = await this.$http.put('roles/' + this.editRolesForm.roleId, {
                   roleName:this.editRolesForm.roleName,
                    roleDesc:this.editRolesForm.roleDesc
                })
                if(res.meta.status !==200){
                    // 失败
                    return this.$message.error('更新角色信息失败')
                    console.log(res.meta.status)
                }

                // 成功的话，关闭对话框
                this.editRolesDialogVisible = false
                // 刷新数据列表
                this.getRolesList()
                // 提示用户
                this.$message.success('更新角色信息成功')

            })
        },

        // 点击为角色分配权限 
        async allotRights(){
            // 要先拿到所有的key
            const keys = [
                // getCheckedKeys返回目前被选中的节点的key所组成的数组
                ...this.$refs.treeRef.
                getCheckedKeys(),
                ...this.$refs.treeRef.
                getHalfCheckedKeys()
            ]
            // 拼接
            const idStr = keys.join(',')
            // roleId 在showRightsDialog（）函数中取到,是对应用户的roleId
            const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
            if(res.meta.status !== 200) {
                return this.$message.error('分配权限失败')
            }
            // 分配成功后，弹框提示，刷新用户角色列表，将分配对话框隐藏
            this.$message.success('分配权限成功')
            this.getRolesList()
            this.setRightDialogVisible=false
        }
    }
}
</script>
<style lang="less" scoped>
.el-tag{
    margin: 7px;
}
.bdtop{
    border-top: 1px solid #eee;
}
.bdbottom{
    border-bottom: 1px solid #eee;
}
.vcenter{
    display: flex;
    align-items: center;
}
</style>
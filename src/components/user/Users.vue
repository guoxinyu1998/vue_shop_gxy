<template>
    <div>
        <!-- 面包屑导航区域  element组件提供 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
           <!-- :to="{ path: '/home' }" 是点击首页跳转的位置 -->
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域   用的是element组件提供的Card卡片功能-->
        <el-card >
            <!-- 搜素与添加区域 -->
                <!-- el-row实现删格布局 -->
                <!-- :gutter="20" 是给输入框和按钮添加间距 -->
            <el-row  :gutter="20">
                <!-- 第一列   :span="15"表示宽度-->
                <el-col :span="15">
                    <!-- 实现搜素功能
                    1. 给文本框绑定数据
                    2.为按钮绑定点击事件，在事件中直接调用getUserinfo（）
                     -->
                     <!-- clearable是清除输入框功能 -->
                     <!-- @clear="getUserlist" 是点击清除后，数据恢复为原来的样子 -->
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable  @clear="getUserlist">
                    <el-button slot="append" icon="el-icon-search" @click="getUserlist"></el-button>
                    </el-input>
                </el-col>
                <!-- 第二列 -->
                <el-col :span="4">
                    <!-- type="primary"是蓝色按钮 -->
                    <!-- @click="adddialogVisible=true" 添加用户的对话框显示出来 -->
                    <el-button type="primary" @click="adddialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>

            
            <!-- 用户列表区域 -->
                <!-- :data="userlist"指定数据源   border加边界  stripe隔行变色 -->
            <el-table :data="userlist" border stripe>
                <!-- 添加索引列 -->
                <el-table-column type="index" label="序号"></el-table-column>
                <!-- 每一列 -->
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <!-- slot-scope="scope"作用域插槽 渲染一个开关 -->
                    <!-- 指定作用域插槽的时候，插槽会覆盖prop，所以可以删掉prop -->
                     <template slot-scope="scope">
                        <!-- 开关，绑定v-model到一个Boolean类型的变量。可以使用active-color属性与inactive-color属性来设置开关的背景色。 -->
                        <!-- v-model="scope.row.mg_state"把开关和mg_state数据相关联 -->
                        <!-- @change="userStateChanged(scope.row)"用于同步状态后台数据
                             步骤：监听switch开关的change事件
                                   拿到最新的状态后，进行Ajax请求，调用接口，把状态同步到服务器中
                         -->
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>

                <!-- 操作栏进行修改 -->
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
                            <!-- 修改按钮  type="primary"蓝色按钮（具体颜色可以到element组件中查看）-->
                            <!-- @click="showEditDialog(scope.row.id)"点击修改按钮，得到id -->
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                           <!-- 删除按钮  type="danger"红色按钮-->
                           <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeuserId(scope.row.id)"></el-button>
                        </el-tooltip>
                        <!-- 添加按钮提示文字 具体样式在element组件中查看-->
                        <!-- enterable	鼠标是否可进入到 tooltip 中 -->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <!-- 分配角色按钮 type="warning"橘黄色按钮-->
                            <!-- scope.row当前行的用户信息 -->
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
                        </el-tooltip>
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
                :page-sizes="[1, 2, 3, 4]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>


        <!-- 添加用户的对话框  引用element组件el-dialog -->
        <!-- :visible.sync="adddialogVisible"控制对话框的显示与隐藏 -->
        <el-dialog title="添加用户" :visible.sync="adddialogVisible" width="50%" @close="adddialogClosed">

            <!-- 对话框内容主体区域 -->
            <!-- :model="addForm"数据绑定对象 -->
            <!-- :rules="addFormrules"数据规则对象 -->
             <!-- ref="addFormRef"引用对象 -->
            <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="70px">
                <!-- prop="username"验证对象属性 -->
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>

            <!-- 对话框底部区域 -->
            <!-- @click="adddialogVisible = false"点击隐藏对话框 -->
             <!-- @click="addUser"点击进行表单的预验证 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="adddialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改用户信息的对话框 -->
        <el-dialog title="修改用户信息" :visible.sync="editdialogVisible" width="50%" @close="editdialogClosed">
            <!-- 主体区域 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editRef" label-width="70px">
                <!-- 用户名不用校验 -->
                <el-form-item label="用户名">
                    <!-- disabled禁用 -->
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="edituserInfo">确 定</el-button>
            </span>
        </el-dialog>


        <!-- 分配角色的对话框 -->
        <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%">
            <div>
                <p>当前的用户:{{userInfo.username}}</p>
                <p>当前的角色:{{userInfo.role_name}}</p>
                <p>
                    分配新角色：
                    <el-select v-model="selectRoleId" placeholder="请选择">
                        <el-option v-for="item in roleslist" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
                    </el-select>
                </p>
            </div>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    data(){
        // 验证邮箱的规则
        // rule是规则，value是要检测的值，cb是回调函数
        var checkEmail = (rule,value,cb) =>{
            // 验证邮箱的正则表达式
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if(regEmail.test(value)){
                // 合法邮箱
                return cb()
            }
            // 如果是非法邮箱，调用回调函数，提供一个错误对象
            cb(new Error('请输入合法邮箱'))
        }

        // 验证手机的规则
        var checkMobile = (rule,value,cb) =>{
            // 验证手机号的正则表达式
            const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

            if(regMobile.test(value)){
                return cb()
            }
            cb(new Error('请输入合法的手机号'))
        }

        return {
            // 获取用户列表的参数
            queryInfo:{
                // 用于实现搜索框功能 
                query: '',
                // 当前的页数 
                pagenum: 1,
                // 当前每页显示多少条数据 
                pagesize:1
            },
            userlist: [],
            total: 0,

            // 控制添加用户对话框的显示与隐藏
            adddialogVisible:false,

            // 添加用户的表单数据
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            // 添加表单的验证规则对象
            addFormrules: {
                username:[
                    {required:true,message: '请输入用户名', trigger:'blur'},
                    {min:3,max:10,message: '用户名的长度应该在3到10之间',trigger:'blur'}
                ],
                password:[
                    {required:true,message: '请输入密码', trigger:'blur'},
                    {min:6,max:15,message: '密码的长度应该在3到10之间',trigger:'blur'}
                ],
                // 邮箱和手机号自定义校验规则 
                email:[
                    {required:true,message: '请输入邮箱', trigger:'blur'},
                    {validator:checkEmail,trigger:'blur'}
                ],
                mobile:[
                    {required:true,message: '请输入手机', trigger:'blur'},
                    {validator:checkMobile,trigger:'blur'}
                    
                ]
            },

            // 控制修改用户对话框的显示与隐藏 
            editdialogVisible:false,

            // 查询到的用户信息对象
            editForm:{},

            // 修改表单的验证规则对象
            editFormRules :{
                 email:[
                    {required:true,message: '请修改用户邮箱', trigger:'blur'},
                    {validator:checkEmail,trigger:'blur'}
                ],
                mobile:[
                    {required:true,message: '请修改用户手机', trigger:'blur'},
                    {validator:checkMobile,trigger:'blur'}
                    
                ]
            },

        // 控制分配角色对话框的弹出和隐藏 
            setRoleDialogVisible:false,
        // 需要被分配角色的用户信息 
            userInfo:{},

        // 所有角色的数据列表，把他在页面上渲染成一个下拉菜单
            roleslist:[],
        // 已选择的角色id值 
            selectRoleId:''
            
        }
    },
    // 在页面创建期间，就会调用created生命周期
    created(){
        this.getUserlist()
    },
    methods:{
        // 在页面创建的时候，就会调用getUserlist(),发起一次Ajax请求
        // 用await简化promise操作
        // const{data:res} 解构赋值得到一个data属性，重命名为res
        async getUserlist(){
            const {data:res} =await this.$http.get('users',{params: this.queryInfo})
            if(res.meta.status !==200){
                return this.$message.error('获取用户列表失败')
            }
            // 传递用户列表数据
            this.userlist = res.data.users
            this.total = res.data.total
            
        },

        // 监听pageSize改变 事件(用于分页)
        handleSizeChange(newSize){
            this.queryInfo.pagesize= newSize
            // 重新发起数据请求
            this.getUserlist()
        },
        // 监听页码值改变的事件（用于分页）
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getUserlist()
        },


        // 监听switch开关状态的改变（用于同步后台数据）
        async userStateChanged(userinfo){
            const {data:res}= await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            if(res.meta.status!==200){
                // 如果操作失败，提示用户，并将用户的状态取反。保证页面上的状态没有任何改变
                userinfo.mg_state = !userinfo.mg_state
                return this.$message.error('更新用户状态失败')
            }
            this.$message.success('更新用户状态成功')
        },

        // 监听添加用户的对话框关闭事件 
        adddialogClosed(){
            // 通过$.refs.addFormRef找到ref名为addFormRef的表单，将其重置即可
            this.$refs.addFormRef.resetFields()
        },

        // 点击添加用户对话框的确定按钮，实现预验证，并在后台同步添加数据
        addUser(){
            // 通过$.refs.addFormRef找到ref名为addFormRef的表单,调用validate函数，valid是校验的结果
            this.$refs.addFormRef.validate(async valid => {
                // 验证失败
                if(!valid) return
                // 验证成功，可以发起添加用户的网络要求
                const {data:res} = await this.$http.post('users',this.addForm)
                if(res.meta.status!==201){
                    this.$message.error('添加失败')
                }
                this.$message.success('添加成功')
                // 隐藏添加对话框
                this.adddialogVisible= false
                // 添加后重新获取用户列表数据
                this.getUserlist()
            })
        },
        // 展示编辑用户的对话框 
        async showEditDialog(id){
            const{data:res} = await this.$http.get('users/' + id)
            if(res.meta.status !==200){
                // 查询失败
                return this.$message.error('查询用户信息失败')
            }
            // 查询成功
            this.editForm= res.data
            // 点击修改后，显示对话框
            this.editdialogVisible= true
        },

        // 监听用户数据修改，修改取消后，重置数据 
        editdialogClosed(){
        // 通过$.refs.editRef找到ref名为editRef的表单，将其重置即可
            this.$refs.editRef.resetFields()
        },

        // // 修改用户信息对话框的确定按钮，实现预验证，并在后台同步添加数据
        edituserInfo(){
            this.$refs.editRef.validate(async valid =>{
                if(!valid) return
                //预验证通过 发起用户信息修改的数据请求
                // editForm为查询到的用户信息对象
                const {data:res} = await this.$http.put('users/' + this.editForm.id, {
                    email:this.editForm.email,
                    mobile:this.editForm.mobile
                })
                if(res.meta.status !==200){
                    // 失败
                    return this.$message.error('更新用户信息失败')
                }

                // 成功的话，关闭对话框
                this.editdialogVisible = false
                // 刷新数据列表
                this.getUserlist()
                // 提示用户
                this.$message.success('更新用户信息成功')

            })
        },

        // 根据id删除记录
       async removeuserId(id){
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
            const {data:res} = await this.$http.delete('users/' + id)
            if(res.meta.status !==200 ){
                return this.$message.error('删除用户失败！')
            }
            this.$message.success('删除用户成功!')
            this.getUserlist()
       },

        // 展示分配角色的对话框
       async setRole(userInfo){
           this.userInfo = userInfo
        //    在展示对话框之前获取所有角色的列表
        const{data:res} = await this.$http.get('roles')
        if(res.meta.status !==200){
            return this.$message.error('获取角色列表失败')
        }
        this.roleslist = res.data
        // 展开对话框
           this.setRoleDialogVisible = true
       },

        // 点击确定按钮完成分配角色
       async saveRoleInfo(){
        //    判断是否选择新的角色
           if(!this.selectRoleId){
              return  this.$message.error('请选择新的角色')
           }
           const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{
               rid: this.selectRoleId
           })
           
           if(res.meta.status!==200){
               return this.$message.error('分角色配失败')
           }
           this.$message.success('分配角色成功')
           this.getUserlist()
           this.setRoleDialogVisible = false
       }
    }
}
</script>

<style lang="less" scoped>

</style>
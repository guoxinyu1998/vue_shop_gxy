import Vue from 'vue'
import { 
    Button,
    Form, 
    FormItem ,
    Input,
    Container,
    Header,
    Main,
    Aside,
    Menu,
    Submenu,
    MenuItemGroup,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox,
   Tag,
   Tree,
   Select,
   Option,
   Cascader,
   Alert,
   Tabs,
   TabPane,
   Timeline,
   TimelineItem
} from 'element-ui'

// import Timeline from './timeline/index.js'
// import TimelineItem from './timeline-item/index.js'

// 导入弹框提示组件
import {Message} from 'element-ui'





// 注册到全局组件中
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Timeline)
Vue.use(TimelineItem)
// 把弹窗组件挂载到Vue的原型对象上，这样每个组件都可以直接通过this来访问到$message
Vue.prototype.$message = Message

Vue.prototype.$confirm = MessageBox.confirm

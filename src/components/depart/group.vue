<template>
  <el-container>
    <el-header class="cate_mana_header">
      <el-input
        placeholder="请输入集团名称"
        v-model="inputDepartName" style="width: 230px;">
      </el-input>
     
      <el-button type="primary" icon="el-icon-search" size="medium" style="margin-left: 10px" @click="handleCreate">搜索集团</el-button>
      <el-button type="success" size="medium" style="margin-left: 20px" @click="handleCreate">添加集团</el-button>
    </el-header>
    <el-main class="cate_mana_main">
      <el-table
        ref="multipleTable"
        :data="departs"
        style="width: 100%"
        max-height="600"
        border>
         <el-table-column
          label="序号"
          type = "index"
          width="130" align="left">
        </el-table-column>
        <el-table-column
          label="集团名称"
          prop="departName"
          width="250" align="left">
          <template v-slot="scope">
            <a link href="javascript:void(0);" class="groupRef"  @click="go2company(scope.row)">{{scope.row.departName}}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="启用时间" align="left">
        </el-table-column>
        <el-table-column
          label="备注"
          prop="memo"
          width="300" align="left">
        </el-table-column>
        <el-table-column label="分配账号">
           <template v-slot="scope">
            <el-button
              size="mini"
              type="success"
              @click="handleAccount(scope.row)">账户
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="left">
          <template v-slot="scope">
            <el-button
              size="mini"
              @click="handleUpdate(scope.row,scope.$index)">修改
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row,scope.$index)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="520px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" size="mini" label-width="100px" style="width: 100%">
       
       
        <el-form-item label="所属城市" prop="parentId">
          <el-select v-model="temp.parentId" placeholder="请选择城市">
            <el-option
              v-for="item in citys"
              :key="item.id"
              :label="item.departName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="集团名称" prop="departName">
          <el-input v-model="temp.departName" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.memo" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
    </el-main>
    <div style="height: 20px"></div>
   
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="20"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
      align="left">
    </el-pagination>
   
    
  </el-container>
  
</template>
<script>
  import request from '@/utils/request'
  import { mapGetters } from 'vuex'
  export default{
    computed: {
      ...mapGetters(['name','depart','departTree'])
    },
    methods: {
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        });

        this.citys.length=0;
        let tmpCity = this.treeFilter(this.departTree,node=>node.orgCategory==1) ;//过滤出所有城市
        tmpCity.map(((item, index)=> {
          this.citys.push({id:item.key,departName:item.value});
        }))
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            request({
              url: '/sys/depart/add',
              method: 'post',
              data:  {
                parentId:tempData.parentId,
                departName:tempData.departName,
                memo:tempData.memo
              } 
            }).then(resp => {
              
              this.refresh();
              this.dialogFormVisible = false
              this.$message({
                message: resp.message,
                type: 'success',
                duration: 2000
              })
            }).catch(()=>{
               this.dialogFormVisible = false
               this.$message({
                  message: "提交失败",
                  type: 'error',
                  duration: 2000
                })
            })
          }
        })
      },
      handleUpdate(row,index) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.index = index
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })

        this.citys.length=0;
        let tmpCity = this.treeFilter(this.departTree,node=>node.orgCategory==1) ;//过滤出所有城市
        tmpCity.map(((item, index)=> {
          this.citys.push({id:item.key,departName:item.value});
        }))
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            //tempData.updateTime = +new Date(tempData.date) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            request({
              url: '/sys/depart/edit',
              method: 'put',
              data:  tempData 
            }).then(resp => {
              const index = this.temp.index
              this.temp.updateTime=new Date().format("yyyy-MM-dd hh:mm:ss");//生成个最新时间
              this.departs.splice(index, 1, this.temp) //添加新元素
              this.dialogFormVisible = false
              this.refresh();
              this.$message({
                message: resp.result,
                type: 'success',
                duration: 2000
              })
            }).catch(()=>{
               this.dialogFormVisible = false
               this.$message({
                  message: "提交失败",
                  type: 'error',
                  duration: 5000
                })
            })
          }
        })
      },    
      handleDelete(row,index){
        let _this = this;
        this.$confirm('确认删除 ' + row.departName + ' ?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.deleteDepart(index,row.id);
        });
      },
      deleteDepart(index,ids){
        var _this = this;
        request({
          url: '/sys/depart/delete',
          method: 'delete',
          params:{id: ids}
        }).then(resp=> {
          _this.$message({
            type: 'success',
            message: resp.result
          });
        this.refresh();

        })
      },
      handleAccount(row){
        var _this = this;
        this.$router.push({
          path: 'groupAccount',
          query: {
            id: row.id,
            depart:"group",
            departName:row.departName
          }
        })
      },
      go2company(row){
        var _this = this;
        this.$router.push({
          path: 'company',
          query: {
            id: row.id
          }
        })
      },
      refresh(){
        let _this = this;
        this.$store.dispatch('user/getDepartTree').then(()=> { 
          _this.$message({
            type: 'success',
            message: '加载机构树成功'
          });
        });
        request({
          url: '/sys/depart/list',
          method: 'get',
          params: {
            orgCategory:2,
            cityId:this.$route.query.id
          }
        }).then(resp=> {
          _this.departs = resp.result;
        }).catch(()=>{
          _this.$message({
            type: 'error',
            message: '加载失败'
          });
        });
         request({
          url: '/sys/depart/list',
          method: 'get',
          params: {
            orgCategory:1,
            
          }
        }).then(resp=> {
          _this.parentDeparts = resp.result;
        }).catch(()=>{
          _this.$message({
            type: 'error',
            message: '加载失败'
          });
        });
      },
      resetTemp() {
        this.temp = {
          index:-1,
          id:'0',
          departName: undefined,
          parentId: undefined,
          updateTime: new Date(),
          memo: ''
        }
      },
       treeFindPath (tree, func,path=[]) {
        if (!tree) return []
        for (const node of tree) {
          path.push(node.key)
          if (func(node)) return path
          if (node.children) {
            const findChildren = this.treeFindPath(node.children,func, path)
            if (findChildren.length) return findChildren
          }
          path.pop()
        }
        return []
      },
      treeFilter (tree, func) {
        // 使用map复制一下节点，避免修改到原树
        return tree.map(node => ({ ...node })).filter(node => {
          node.children = node.children && this.treeFilter(node.children, func)
          return func(node) || (node.children && node.children.length)
        })
      },
      treeForeach (tree, func) {
        let node, list = [...tree]
        while (node = list.shift()) {
          func(node)
          node.children && list.push(...node.children)
        }
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
    },

    mounted: function () {
      this.refresh();
    },
    data(){
      return {
        inputDepartName:"",
        departs: [],
        parentDeparts: [],
        citys:[],
        temp: "",
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '修改',
          create: '新建'
        },
        writableMap: {
          update: true,
          create: false
        },
        rules: {
          parentId: [{ required: true, message: '选择集团', trigger: 'change ' }],
          departName: [{ required: true, message: '输入名称', trigger: 'blur' }]
        }
      }
    }
  }

  Date.prototype.format = function(fmt) { 
     var o = { 
        "M+" : this.getMonth()+1,                 //月份 
        "d+" : this.getDate(),                    //日 
        "h+" : this.getHours(),                   //小时 
        "m+" : this.getMinutes(),                 //分 
        "s+" : this.getSeconds(),                 //秒 
        "q+" : Math.floor((this.getMonth()+3)/3), //季度 
        "S"  : this.getMilliseconds()             //毫秒 
    }; 
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
     for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
         }
     }
    return fmt; 
}        
</script>
<style>
  .cate_mana_header {
    background-color: #ececec;
    margin-top: 20px;
    padding-left: 5px;
    display: flex;
    justify-content: flex-start;
  }

  .cate_mana_main {
    /*justify-content: flex-start;*/
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    background-color: #ececec;
    margin-top: 20px;
    padding-top: 10px;
  }
  .groupRef{
    text-decoration: none;
  }
</style>

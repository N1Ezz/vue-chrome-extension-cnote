<template>
  <div class="main_app">
    <h5>Cnote by N1Ez</h5>
    <div class="content">
      <el-row v-for="(item, index) in list" :key="index">
        <el-col>
          <span>{{ item.address }}</span>
        </el-col>
        <el-col :span="8">
          账号：{{ item.username }}
        </el-col>
        <el-col :span="12">
          密码：{{ item.password }}
        </el-col>
        <el-col :span="4">
          <el-button size="mini" type="text" @click="copy(item)">
            <i class="el-icon-document-copy"></i>
          </el-button>
          <el-button size="mini" type="text" @click="modify(item)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button size="mini" type="text" @click="deleteItem(item)">
            <i class="el-icon-scissors"></i>
          </el-button>
        </el-col>
      </el-row>
    </div>
    <el-button
      v-if="this.type === 'close'"
      style="width:100%"
      size="mini"
      type="plian"
      @click="() => {this.type = 'add'}">
        <i class="el-icon-circle-plus"></i>
    </el-button>
    <div v-else>
      <div>
        <div style="width: 48%;float: left;margin-right: 4%;">
          账号：<el-input size="mini" v-model="form.username"></el-input>
        </div>
        <div style="width: 48%;float: left;">
          密码：<el-input size="mini" v-model="form.password"></el-input>
        </div>
      </div>
      <div>
        描述：<el-input size="mini" v-model="form.address"></el-input>
      </div>
      <div style="float: right">
        <el-button size="mini" type="plian" @click="save">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      form: {
        id: '',
        address: '',
        username: '',
        password: ''
      },
      type: 'close',
      list: []
    }
  },
  methods: {
    save() {
      if (this.type === 'modify') {
        this.list = this.list.map((i) => {
          return i.id === this.form.id ? this.form : i
        })
      } else {
        let id = this.list.length !== 0 ? this.list[this.list.length - 1].id + 1 : 1
        this.form.id = id
        this.list = this.list.length !== 0 ? [...this.list, this.form] : [this.form]
      }
      this.type = 'close'
      this.form = {
        id: '',
        address: '',
        username: '',
        password: ''
      }
      localStorage.setItem('cnote_list', JSON.stringify(this.list))
    },
    modify(item) {
      this.form.id = item.id
      this.form.username = item.username
      this.form.password = item.password
      this.form.address = item.address
      this.type = 'modify'
    },
    copy(item) {
      let pwd = item.password;//拿到想要复制的值
      let copyInput = document.createElement('input');//创建input元素
      document.body.appendChild(copyInput);//向页面底部追加输入框
      copyInput.setAttribute('value', pwd);//添加属性，将url赋值给input元素的value属性
      copyInput.select();//选择元素
      document.execCommand("Copy");//执行复制命令
      // 复制之后再删除元素，否则无法成功赋值
      copyInput.remove();//删除动态创建的节点
      this.$message.success("链接已复制！")
    },
    deleteItem(item) {
      this.list = this.list.filter((i) => {
        return i.id !== item.id
      })
      localStorage.setItem('cnote_list', JSON.stringify(this.list))
    }
  },
  created() {
    this.list = JSON.parse(localStorage.getItem('cnote_list'))
  }
}
</script>

<style scoped>
.main_app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 20px;
  width: 450px;
  font-size: 15px;
}
.content {
  max-height: 380px;
  overflow:auto;
}
</style>

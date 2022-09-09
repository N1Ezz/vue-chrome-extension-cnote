<template>
  <div class="main_app">
    <h5>Cnote by N1Ez</h5>
    <div class="content">
      <el-row v-for="(item, index) in list" :key="index">
        <el-col>
          <el-link
            v-if="isLink(item.address)"
            :underline="false"
            @click="link(item.address)">
            <span>{{ item.address }}</span>
          </el-link>
          <span v-else>{{ item.address }}</span>
        </el-col>
        <el-col :span="7">
          账号：{{ item.username }}
        </el-col>
        <el-col :span="12">
          <el-link :underline="false" @click="() => {item.pwd_show = !item.pwd_show}">密码</el-link>
          ：{{ item.pwd_show ? item.password : '  *******' }}
        </el-col>
        <el-col :span="5">
          <el-button size="mini" type="text" @click="copy(item, true)">
            <i class="el-icon-link"></i>
          </el-button>
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
      <div v-if="type === 'add'">
        解析信息：
        <el-input
          size="mini"
          v-model="form.all"
          placeholder="可将信息按照备注、账号、密码顺序按空格分隔进行解析">
        </el-input>
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
        password: '',
        all: ''
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
        if (this.form.all) {
          let arr = this.form.all.split(/\s+/)// 根据空格分隔字符串
          if (arr.length < 3) {
            this.$message.error('解析信息不完整，少于三个字段')
            return
          }
          this.form.address = arr[0]
          this.form.username = arr[1]
          this.form.password = arr[2]
        }
        this.form.pwd_show = false
        this.list = this.list.length !== 0 ? [...this.list, this.form] : [this.form]
      }
      this.close()
      localStorage.setItem('cnote_list', JSON.stringify(this.list))
    },
    modify(item) {
      this.form.id = item.id
      this.form.username = item.username
      this.form.password = item.password
      this.form.address = item.address
      this.type = 'modify'
    },
    copy(item, type = false) {// type为true时代表复制全部值
      const pwd = item.password;//拿到想要复制的值
      const address = item.address;//拿到想要复制的值
      const username = item.username;//拿到想要复制的值
      let val = ''
      val = type ? address + ' ' + username + ' ' + pwd : pwd
      let copyInput = document.createElement('input');//创建input元素
      document.body.appendChild(copyInput);//向页面底部追加输入框
      copyInput.setAttribute('value', val);//添加属性，将url赋值给input元素的value属性
      copyInput.select();//选择元素
      document.execCommand("Copy");//执行复制命令
      // 复制之后再删除元素，否则无法成功赋值
      copyInput.remove();//删除动态创建的节点
      type ? this.$message.success("复制成功！") : this.$message.success("密码复制成功！")
    },
    deleteItem(item) {
      this.list = this.list.filter((i) => {
        return i.id !== item.id
      })
      localStorage.setItem('cnote_list', JSON.stringify(this.list))
      this.close()
    },
    link(url) {
      window.location.href = url
      window.open(url)
    },
    isLink(url) {
      // eslint-disable-next-line
      let reg = new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)
      return reg.test(url)
    },
    close() {
      this.type = 'close'
      this.form = {
        id: '',
        address: '',
        username: '',
        password: ''
      }
    }
  },
  created() {
    if (JSON.parse(localStorage.getItem('cnote_list'))) {
      this.list = JSON.parse(localStorage.getItem('cnote_list'))
      this.list = this.list.map((i) => {
        return {
          ...i,
          pwd_show: false
        }
      })
    }
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
  width: 460px;
  font-size: 15px;
}
.content {
  max-height: 360px;
  overflow:auto;
}
</style>

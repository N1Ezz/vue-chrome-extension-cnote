<template>
  <div class="main_app">
    <h5>{{ cnote_title }}</h5>
    <div>
      <el-button size="mini" type="text" icon="el-icon-upload" @click="fileUploadClick">
        导入
      </el-button>
      <el-button size="mini" type="text" icon="el-icon-download" @click="fileDownloadClick">
        导出
      </el-button>
    </div>
    <div class="content">
      <el-row v-for="(item, index) in list" :key="index">
        <el-col>
          {{ emojis[index > 9 ? parseInt(index / 10) % 10 : 0] + emojis[index % 10] }}
          <el-link v-if="isLink(item.address)" :underline="false" @click="link(item.address)">
            <span>{{ item.address }}</span>
          </el-link>
          <span v-else>{{ item.address }}</span>
        </el-col>
        <el-col :span="7">账号：{{ item.username }}</el-col>
        <el-col :span="12">
          <el-link
            :underline="false"
            @click="
              () => {
                item.pwd_show = !item.pwd_show
              }
            "
          >
            密码
          </el-link>
          ：{{ item.pwd_show ? item.password : '  ******' }}
        </el-col>
        <el-col :span="5">
          <el-button title="复制全部" size="mini" type="text" @click="copy(item, true)">
            <i class="el-icon-link"></i>
          </el-button>
          <el-button title="复制密码" size="mini" type="text" @click="copy(item)">
            <i class="el-icon-document-copy"></i>
          </el-button>
          <el-button title="编辑" size="mini" type="text" @click="modify(item)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button title="删除" size="mini" type="text" @click="deleteItem(item)">
            <i class="el-icon-scissors"></i>
          </el-button>
        </el-col>
      </el-row>
    </div>
    <el-button
      v-if="this.type === 'close'"
      style="width: 100%"
      size="mini"
      type="plian"
      @click="
        () => {
          this.type = 'add'
        }
      "
    >
      <i class="el-icon-circle-plus"></i>
    </el-button>
    <div v-else>
      <div>
        <div style="width: 48%; float: left; margin-right: 4%">
          账号：
          <el-input size="mini" v-model="form.username"></el-input>
        </div>
        <div style="width: 48%; float: left">
          密码：
          <el-input size="mini" v-model="form.password"></el-input>
        </div>
      </div>
      <div>
        描述：
        <el-input size="mini" v-model="form.address"></el-input>
      </div>
      <div v-if="type === 'add'">
        解析信息：
        <el-input
          size="mini"
          v-model="form.all"
          placeholder="可将信息按照备注、账号、密码顺序按空格分隔进行解析"
        ></el-input>
      </div>
      <div style="float: right">
        <el-button size="mini" type="plian" @click="save">保存</el-button>
      </div>
    </div>
    <el-upload
      ref="fileUpload"
      action=""
      :show-file-list="false"
      :multiple="false"
      :http-request="fileUpload"
    ></el-upload>
  </div>
</template>

<script>
import setting from '@/setting.js'
import FileSaver from 'file-saver'
export default {
  name: 'app',
  data() {
    const emojis = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']
    return {
      emojis,
      cnote_title: setting.cnote_title,
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
    // TODO 下一步做下1.国际化 2.添加一个搜索框 3.看下存储方式是否改变一下
    isJsonString(str) {
      try {
        if (typeof JSON.parse(str) == 'object') {
          return true
        }
      } catch (e) {}
      return false
    },
    save() {
      if (this.type === 'modify') {
        this.list = this.list.map((i) => {
          return i.id === this.form.id ? this.form : i
        })
      } else {
        let id = this.list.length !== 0 ? this.list[this.list.length - 1].id + 1 : 1
        this.form.id = id
        if (this.form.all) {
          let arr = this.form.all.split(/\s+/) // 根据空格分隔字符串
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
    copy(item, type = false) {
      // type为true时代表复制全部值
      const pwd = item.password // 拿到想要复制的值
      const address = item.address // 拿到想要复制的值
      const username = item.username // 拿到想要复制的值
      let val = ''
      val = type ? address + ' ' + username + ' ' + pwd : pwd
      let copyInput = document.createElement('input') // 创建input元素
      document.body.appendChild(copyInput) // 向页面底部追加输入框
      copyInput.setAttribute('value', val) // 添加属性，将url赋值给input元素的value属性
      copyInput.select() // 选择元素
      document.execCommand('Copy') // 执行复制命令
      // 复制之后再删除元素，否则无法成功赋值
      copyInput.remove() // 删除动态创建的节点
      type
        ? this.$message.success('已将全文复制至粘贴板！')
        : this.$message.success('密码复制成功！')
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
      let reg = new RegExp(
        /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/
      )
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
    },
    // 上传账号密码文件
    fileUploadClick() {
      this.$refs.fileUpload.$el.children[0].click()
    },
    // 解析账号密码文件
    async fileUpload({ file }) {
      let blob = new Blob([file])
      let reader = new FileReader()
      reader.readAsText(blob, 'utf-8')
      reader.onload = () => {
        console.log()
        if (this.isJsonString(reader.result)) {
          let data = JSON.parse(reader.result)
          data.forEach((d) => {
            let id = this.list.length !== 0 ? this.list[this.list.length - 1].id + 1 : 1
            let item = {
              id,
              username: d.username,
              password: d.password,
              address: d.address,
              all: d.all
            }
            this.list.push(item)
          })
          localStorage.setItem('cnote_list', JSON.stringify(this.list))
        }
      }
    },
    // 下载保存保存的账号密码
    fileDownloadClick() {
      const jsonStr = JSON.stringify(this.list)
      const blob = new Blob([jsonStr], { type: 'text/json' })
      FileSaver.saveAs(blob, 'cnoteConfig.json')
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
  overflow: auto;
}
</style>

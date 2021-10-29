<template>
  <div class="multipartUpload">
    <!--
      上传
      action           - 上传地址
      multiple         - 是否支持多选文件
      file-list        - 上传的文件列表【数组】
      limit            - 最大允许上传个数
      auto-upload      - 选择视频后是否立即上传
      show-file-list   - 是否显示已上传文件列表【默认上传列表】
      data             - 上传时附带的额外参数
      with-credentials - 支持发送cookie凭证信息
      http-request     - 【方法】自定义上传方法
      on-change        - 【方法】文件改变时（添加文件、上传成功和上传失败时调用）
      before-upload    - 【方法】上传文件之前
      on-preview       - 【方法】点击列表中已上传的文件时
      on-remove        - 【方法】移除列表中的文件时
      on-success       - 【方法】上传成功时
      on-error         - 【方法】上传失败时
      on-progress      - 【方法】上传中时
      on-exceed        - 【方法】文件个数超出上限时
    -->
    <el-upload
      ref="upload"
      :multiple="true"
      :file-list="fileList"
      :limit="limit"
      :auto-upload="true"
      :show-file-list="false"
      :data="{ a: 123456789 }"
      :with-credentials="true"
      :on-change="onChange"
      :before-upload="beforeUpload"
      :on-exceed="onExceed"
      action=""
    >
      <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
      <el-button size="small" type="success">上传服务器</el-button>
    </el-upload>
    <!-- 上传列表 -->
    <div class="listBox">
      <el-row
        v-for="(item, index) in fileList"
        :key="index"
        type="flex"
        align="middle"
      >
        <el-col :lg="5" :md="6" :sm="8" :xs="24">
          {{ item.name }}
        </el-col>
        <el-col :lg="5" :md="6" :sm="8" :xs="24">
          <el-progress
            :text-inside="true"
            :stroke-width="15"
            :percentage="item.progress"
          ></el-progress>
        </el-col>
        <el-col :lg="4" :md="6" :sm="8" :xs="24">
          {{ item.size }}
        </el-col>
        <el-col :lg="10" :md="6" :sm="8" :xs="24">
          <div v-if="item.checked">
            <el-button @click="httpRequest(item)" type="success" size="mini"
              >上传</el-button
            >
            <el-button type="info" size="mini">暂停</el-button>
            <el-button type="primary" size="mini">继续</el-button>
            <el-button type="danger" size="mini">删除</el-button>
          </div>
          <div v-else>文件检查中</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
/**
 * 导入
 * @requires [element-ui]      - 导入elementui相关组件
 * @requires [apiUploadBefore] - api上传之前的验证(是否已上传，未上传时已存在多少分片)
 */
import {
  Row,
  Col,
  Upload,
  Button,
  Table,
  TableColumn,
  Progress,
  Message
} from 'element-ui'
import BMF from 'browser-md5-file' // 先安装，再引用
import { apiUploadBefore } from '@/api/upload'
export default {
  name: 'MultipartUpload',
  components: {
    elRow: Row,
    elCol: Col,
    elUpload: Upload,
    elButton: Button,
    elTable: Table,
    elTableColumn: TableColumn,
    elProgress: Progress
  },
  data() {
    return {
      /**
       * 上传
       * @param {array}   [fileList]           - 上传文件列表
       * @param {number}  [fileList.id]        - 上传文件列表【文件id】
       * @param {string}  [fileList.name]      - 上传文件列表【文件名称】
       * @param {number}  [fileList.size]      - 上传文件列表【文件大小】
       * @param {number}  [fileList.progress]  - 上传文件列表【文件识别/文件上传进度】
       * @param {boolean} [temporary.uploaded] - 临时变量【文件是否已上传（在获取到md5之后进行验证）】
       * @param {array}   [temporary.part]     - 临时变量【如果文件未上传，后端返回的哪些分片未上传】
       * @param {boolean} [fileList.checked]   - 上传文件列表【文件是否已检查(检查的作用是用来生成md5)】
       * @param {array}   [fileList.file]      - 上传文件列表【文件（用来分片上传的文件）】
       * @param {number}  [limit]              - 最大允许上传个数
       * @param {string}  [url]                - 上传地址
       */
      fileList: [],
      limit: 3,
      url: ''
    }
  },
  methods: {
    /**
     * 自定义上传【选择文件文件改变时（添加文件、上传成功和上传失败时会调用）】
     * @param {file}    [file]               - 文件
     * @param {array}   [fileList]           - 自定义的展示列表
     * @param {boolean} [temporaryAdded]     - 内部变量【根据当前file的uid判定当前file是否已经添加到列表中】
     * @param {object}  [temporary]          - 临时变量
     * @param {number}  [temporary.uid]      - 临时变量【文件的uid】
     * @param {string}  [temporary.name]     - 临时变量【文件的名称】
     * @param {number}  [temporary.size]     - 临时变量【文件的大小（elementui生成的文件的bytes，这里使用的是M）】
     * @param {number}  [temporary.progress] - 临时变量【文件识别进度/上传进度】
     * @param {boolean} [temporary.uploaded] - 临时变量【文件是否已上传（在获取到md5之后进行验证）】
     * @param {array}   [temporary.part]     - 临时变量【如果文件未上传，后端返回的哪些分片未上传】
     * @param {boolean} [temporary.checked]  - 临时变量【文件是否已检查(检查的作用是用来生成md5)】
     * @param {object}  [temporary.file]     - 临时变量【文件】
     */
    onChange(file, fileList) {
      // 判断fileList内是否已经有当前数据
      let temporaryAdded = false
      for (const iterator of this.fileList) {
        if (iterator.uid === file.uid) {
          temporaryAdded = true
        }
      }
      if (!temporaryAdded) {
        const temporary = {
          uid: file.uid,
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + 'M',
          progress: 0,
          uploaded: false,
          part: [],
          checked: false,
          file
        }
        this.fileList.push(temporary)
      }
    },
    /**
     * 自定义上传【上传之前】文件size大小比例【1:1024*1024】
     * @param {file}    [file]              - 文件
     * @requires [BMF] - 生成md5的中间件
     * @param {object}  [fileList]          - 自定义的展示列表
     * @param {number}  [fileList.uid]      - uid【elementui的upload内置生成的id】
     * @param {string}  [fileList.md5]      - md5值
     * @param {number}  [fileList.progress] - 进度条
     * @param {boolean} [fileList.checked]  - 文件是否已检查(检查的作用是用来生成md5)
     */
    beforeUpload(file) {
      const bmf = new BMF()
      bmf.md5(
        file,
        async (err, md5) => {
          for (const [index, iterator] of this.fileList.entries()) {
            if (iterator.uid === file.uid) {
              iterator.md5 = md5
              iterator.checked = true
              /**
               * 验证是否已经上传（如果未上传，获取存在多少片）
               */
              const postApiUploadBefore = await apiUploadBefore({ md5 })
              if (postApiUploadBefore.data) {
                if (postApiUploadBefore.data.uploaded) {
                  this.fileList.splice(index, 1)
                  Message.error('文件已存在')
                  return
                }
                iterator.uploaded = postApiUploadBefore.data.uploaded
                iterator.part = postApiUploadBefore.data.part
              }
            }
          }
        },
        (progress) => {
          this.fileList.map((element) => {
            if (element.uid === file.uid) {
              element.progress = Number(Math.floor(progress * 100))
              element.checked = false
            }
          })
        }
      )
    },
    // 自定义上传
    httpRequest(item) {
      console.log('item', item)
      const upload = (file, num) => {
        const formData = new FormData()
        const blockSize = 1024 * 1000
        const blockNum = Math.ceil(file.size / blockSize)
        const nextSize = Math.min(num * blockSize, file.size)
        const fileData = file.slice((num - 1) * blockSize, nextSize)
        formData.append('file', fileData)
        formData.append('fileName', file.name + time)
        $.ajax({
          url: '/admin/op/seoAsk?action=fileUpload',
          type: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          success(responseText) {
            element.progress('demo', (num * 100) / blockNum + '%')
            if (file.size <= nextSize) {
              layer.msg('上传成功')
              return
            }
            upload(file, ++num) // 递归调用
          }
        })
      }
      if (Array.isArray(item.part) && item.part.length) {
      }
    },
    // 自定义上传【移除列表中文件时】
    onRemove(file, fileList) {
      console.log('删除?', file, fileList)
    },
    // 自定义上传【上传成功时】
    onSuccess(response, file, fileList) {
      console.log('成功', response, file, fileList)
    },
    // 自定义上传【上传失败时】
    onError(err, file, fileList) {
      console.log('失败', err, file, fileList)
    },
    // 自定义上传【文件个数超出上限时】
    onExceed(files, fileList) {
      Message.error('最多只能同时上传' + this.limit + '个')
    }
  }
}
</script>

<style lang="scss" scoped>
// 一行文字超出显示省略号
%ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.multipartUpload {
  // 列表盒子
  .listBox {
    .el-col {
      @extend %ellipsis;
      text-align: center;
    }
  }
}
</style>

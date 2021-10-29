<template>
  <div class="uploadVideo">
    <div class="active">
      <div class="btn" @click="onUpload()"><i class="icon-add"></i>上传</div>
    </div>
    <div class="progress">{{ progress.text }}{{ progress.val }}%</div>
    <div class="content">
      <div v-if="status.val != 1" class="loading">
        {{ status.text }}
      </div>
      <div v-else class="inputBox">
        <i class="icon icon-add"/>
        <p class="text">点击选择文件</p>
        <input
          class="inputFile"
          type="file"
          name="uploadVideo"
          @change="onTirggerFile($event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SparkMd5 from 'spark-md5'
import emitter from '@/utils/mitt.js'
import { reactive } from '@vue/reactivity';
import { apiUploadVideoBefore, apiUploadVideo } from '@/api/upload'
import { removeSuffix, percentage } from '@/utils/tools.js'
export default {
  name: 'VideoUpload',
  setup() {
    /**
     * 定义
     * [videoFile]                视频文件参数
     * [videoFile.file]           视频文件
     * [videoFile.size]           视频总大小
     * [videoFile.chunkSize]      切片大小 （2097152 为 2M）
     * [videoFile.chunkTotal]     切片总数
     * [videoFile.currentChunk]   当前切片序号
     * [videoFile.md5]            视频 md5 值
     * [videoFile.notUploadArray] 待上传的视频分片
     * [status]                   上传状态
     * [status.val]               上传状态-值 {1: 选择中,2: md5生成中,3: 待上传,4: 上传中,5: 上传成功,6: 上传失败}
     * [status.text]              上传状态-提示文字(参考 value 对应的值)
     * [percent]                  百分比
     * [percent.val]              百分比-值
     * [percent.text]             百分比-提示文字
     * [fileReader]               web 异步读取文件方法
     */
    let videoFile = reactive({
      file: '',
      size: 0,
      chunkSize: 2097152,
      chunkTotal: 0,
      currentChunk: 1,
      md5: '',
      notUploadArray: [],
    })
    let status = reactive({
      val: 1,
      text: '文件处理中'
    })
    let percent = reactive({
      val: 0,
      text: '已上传'
    })
    const progress = reactive({
      val: 0,
      text: '上传进度'
    })
    // 计算文件的 md5
    function onMd5Calculate(file) {
      return new Promise((resolve, reject) => {
        status.val = 2,
        status.text = '文件处理中'
        let spark = new SparkMd5.ArrayBuffer()
        let fileReader = new FileReader();
        fileReader.onload = function(e) {
          percent.val = 90
          spark.append(e.target.result)
          videoFile.currentChunk++
          if (videoFile.currentChunk < videoFile.chunkTotal) {
            loadNext()
          } else {
            status.val = 3
            status.text = '文件验证成功，点击上传按钮上传'
            emitter.emit('toast', {show: true, title: '文件验证成功',});
            resolve(spark.end())
          }
        }
        fileReader.onerror = function (e) {
          emitter.emit('toast', {show: true, title: '文件验证失败',});
          reject(e)
        };
        function loadNext() {
          let start = videoFile.currentChunk * videoFile.chunkSize;
          let end = ((start + videoFile.chunkSize) >= videoFile.size)?videoFile.size : start + videoFile.chunkSize
          fileReader.readAsArrayBuffer(file.slice(start, end))
        }
        loadNext();
      }).catch(function() {
        emitter.emit('toast', {show: true, title: 'md5生成失败',});
      })
    }
    /**
     * 选择文件
     * @param [event] 文件信息
     */
    const onTirggerFile = async (event) => {
      let selfFile = event.target.files[0];
      videoFile.file = selfFile
      videoFile.size = selfFile.size
      videoFile.chunkTotal = Math.ceil(selfFile.size / videoFile.chunkSize)
      if (selfFile.size <= 0) {
        emitter.emit('toast', {show: true, title: '视频不能为空',});
      }
      // 生成视频切片序列号
      for(let i = 1;i <= videoFile.chunkTotal; i++) {
        videoFile.notUploadArray.push(i)
      }
      if (selfFile.type === 'video/mp4') {
        videoFile.md5 = await onMd5Calculate(selfFile)
        try {
          const postApiUploadBefore = await apiUploadVideoBefore(videoFile)
          if (postApiUploadBefore.data.isUpload) {
            return emitter.emit('toast', {show: true, title: '文件已存在',});
          }
          if (postApiUploadBefore.data.notUploadArray.length) {
            videoFile.notUploadArray = postApiUploadBefore.data.notUploadArray
          }
          emitter.emit('toast', {show: true, title: '视频验证成功',});
        } catch (error) {
          emitter.emit('toast', {show: true, title: '上传视频只识别mp4格式的视频',});
        }
      } else {
        emitter.emit('toast', {show: true, title: '上传视频只识别mp4格式的视频',});
      }
    }
    // 上传点击事件
    const onUpload = () => {
      if (status.val == 1) {
        emitter.emit('toast', {show: true, title: '请选择文件',});
      } else if (status.val == 2) {
        emitter.emit('toast', {show: true, title: '文件检查中',});
      } else if (status.val == 3) {
        emitter.emit('toast', {show: true, title: '上传中',});
        onUploadChunk()
      } else if (status.val == 4) {
        emitter.emit('toast', {show: true, title: '已上传成功',});
      } else {
        emitter.emit('toast', {show: true, title: '已上传失败',});
      }
    }
    // 上传分片
    const onUploadChunk = () => {
      try {
        if (!videoFile?.notUploadArray?.length) {
          emitter.emit('toast', {show: true, title: '请选择视频',});
          return
        }
        uploadChunk(
          videoFile.file,
          videoFile.chunkSize,
          videoFile.notUploadArray,
          videoFile.md5
        )
      } catch (error) {
        emitter.emit('toast', {show: true, title: '上传失败',});
      }
    }
    // 分片上传
    const uploadChunk = (file, oneChunkSize, arr, md5) => {
      arr.map(async item => {
        if (item === 1) {
          let tempChunk = file.slice(
            item * oneChunkSize,
            (item + 1) * oneChunkSize
          )
          let tempFormData = new FormData()
          let tempFileName = removeSuffix(file.name)
          tempFormData.append('md5', md5)
          tempFormData.append('filename', tempFileName)
          tempFormData.append('index', 1)
          tempFormData.append('total', arr.length)
          tempFormData.append('file', tempChunk)
          let postApiUploadVideo = await apiUploadVideo(tempFormData)
          console.log('postApiUploadVideo', postApiUploadVideo)
          if (postApiUploadVideo.status === 200) {
            progress.val = percentage(videoFile.chunkTotal, item)
          } else {
            emitter.emit('toast', {show: true, title: `第${item}片上传失败`,});
          }
        }
      })
    }
    return {
      status,
      percent,
      progress,
      onTirggerFile,
      onUpload,
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
.uploadVideo {
  width: 100%;
  .active {
    display: flex;
    .btn {
      margin-right: 10px;
    }
  }
  .content {
    margin: 10px 0;
    padding: 30px;
    text-align: center;
    border: 2px dotted red;
    position: relative;
    .progress {
      width: 100%;
      height: 30px;
      font-size: 12px;
      text-align: center;
    }
    .loading {
      width: 100%;
      height: 100%;
      background: rgba($color: #ccc, $alpha: 0.75);
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
    }
    .inputBox {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      .icon {
        font-size: 16px;
      }
      .text {
        margin-top: 5px;
        font-size: 14px;
      }
      .inputFile {
        width: 100%;
        height: 100%;
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
      }
    }
  }
}
</style>
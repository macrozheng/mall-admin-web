<script setup lang="ts">
import { ref, watch } from 'vue'
import { ossPolicyAPI } from '@/apis/oss' // 假设这是API文件的正确路径
import { ElMessage, type UploadProps, type UploadUserFile } from 'element-plus'

// 定义属性
const props = defineProps({
  // 上传图片路径（Vue 3中v-model对应的属性值为modelValue）
  modelValue: {
    type: String,
    default: ''
  }
})

// 定义事件
const emit = defineEmits(['update:modelValue'])

// 定义OSS上传所需信息
const dataObj = ref({
  policy: '',
  signature: '',
  key: '',
  ossaccessKeyId: '',
  dir: '',
  host: '',
})
// 控制图片预览框的显示隐藏
const dialogVisible = ref(false)
// 是否使用OSS上传
const useOss = import.meta.env.VITE_USE_OSS === 'true'
// oss上传路径
const ossUploadUrl = import.meta.env.VITE_OSS_UPLOAD_URL
// minio上传路径
const minioUploadUrl = import.meta.env.VITE_BASE_SERVER_URL + import.meta.env.VITE_MINIO_UPLOAD_URL
// 上传文件列表
const fileList = ref<UploadUserFile[]>([])

// 由于图片url是动态加载的，所以需要使用watch来监听
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    const fileName = newVal.substring(newVal.lastIndexOf("/") + 1)
    fileList.value = [{
      name: fileName,
      url: newVal
    }]
  } else {
    fileList.value = []
  }
}, { immediate: true })

// 处理input事件
const emitInput = (val: string) => {
  emit('update:modelValue', val)
}

// 处理图片删除
const handleRemove: UploadProps['onRemove'] = () => {
  emitInput('')
}

// 处理图片预览
const handlePreview: UploadProps['onPreview'] = () => {
  dialogVisible.value = true
}

// 在图片上传前处理，用于获取OSS请求参数
const beforeUpload: UploadProps['beforeUpload'] = async () => {
  if (!useOss) {
    return true
  }
  try {
    const res = await ossPolicyAPI()
    dataObj.value.policy = res.data.policy
    dataObj.value.signature = res.data.signature
    dataObj.value.ossaccessKeyId = res.data.accessKeyId
    dataObj.value.key = res.data.dir + '/${filename}'
    dataObj.value.dir = res.data.dir
    dataObj.value.host = res.data.host
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

// 处理图片上传成功
const handleUploadSuccess: UploadProps['onSuccess'] = (res, file) => {
  if (!useOss && res.code === 500) {
    // MinIO文件上传失败处理
    ElMessage({
      message: '文件上传失败！',
      type: 'error',
      duration: 3 * 1000,
    })
    return
  }
  let url = ''
  if (useOss) {
    // OSS上传需要拼接路径
    url = dataObj.value.host + '/' + dataObj.value.dir + '/' + file.name
  } else {
    url = res.data?.url
  }
  fileList.value.pop()
  fileList.value.push({ name: file.name, url: url })
  emitInput(url)
}
</script>

<template>
  <div>
    <el-upload :action="useOss ? ossUploadUrl : minioUploadUrl" list-type="picture" :multiple="false"
      :show-file-list="props.modelValue ? true : false" :file-list="fileList" :before-upload="beforeUpload"
      :on-remove="handleRemove" :on-success="handleUploadSuccess" :on-preview="handlePreview">
      <el-button size="small" type="primary">点击上传</el-button>
      <template #tip>
        <div class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
      </template>
    </el-upload>
    <el-dialog v-model="dialogVisible">
      <img width="100%" :src="fileList[0]?.url" alt="">
    </el-dialog>
  </div>
</template>

<style></style>

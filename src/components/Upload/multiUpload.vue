<script setup lang="ts">
import { ref, watch } from 'vue'
import { ossPolicyAPI } from '@/apis/oss' // 假设这是API文件的正确路径
import { Plus, } from '@element-plus/icons-vue'
import { ElMessage, type UploadProps, type UploadUserFile } from 'element-plus'

// 定义属性
const props = defineProps({
  // 上传图片路径（Vue 3中v-model对应的属性值为modelValue）
  modelValue: {
    type: Array<string>,
    default: []
  },
  //最大上传图片数量
  maxCount: {
    type: Number,
    default: 5
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
// 弹框中的图片路径
const dialogImageUrl = ref('')

// 由于图片url是动态加载的，所以需要使用watch来监听
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    fileList.value = newVal.map(item => {
      const fileName = item.substring(item.lastIndexOf("/") + 1)
      return {
        name: fileName,
        url: item
      }
    })
  } else {
    fileList.value = []
  }
}, { immediate: true })

// 处理input事件
const emitInput = (val: string[]) => {
  emit('update:modelValue', val)
}

// 处理图片删除
const handleRemove: UploadProps['onRemove'] = (file, fileList) => {
  // 从fileList中过滤掉被删除的文件，只保留剩余的文件
  const remainingFiles = fileList.filter(item => item.uid !== file.uid)
  // 更新fileList
  fileList = remainingFiles
  // 将剩余文件的URL数组传递给父组件
  const urls = remainingFiles.map(item => item.url || '')
  emitInput(urls)
}

// 处理图片预览
const handlePreview: UploadProps['onPreview'] = (file) => {
  dialogVisible.value = true
  dialogImageUrl.value = file.url!
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
  fileList.value.push({ name: file.name, url: url })
  const urls = fileList.value.map(item => item.url || '')
  emitInput(urls)
}
</script>

<template>
  <div>
    <el-upload :action="useOss ? ossUploadUrl : minioUploadUrl" list-type="picture-card" :file-list="fileList"
      :limit="maxCount" :before-upload="beforeUpload" :on-remove="handleRemove" :on-success="handleUploadSuccess"
      :on-preview="handlePreview">
      <el-icon>
        <Plus />
      </el-icon>
    </el-upload>
    <el-dialog v-model="dialogVisible">
      <img :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<style></style>

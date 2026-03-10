<script lang="ts" setup>
import { getAdminInfoAPI, adminLoginAPI } from '@/apis/admin';
import { ref } from 'vue'

defineOptions({
  name: 'TestAxios'
})

const loginData = ref()
const infoData = ref()

const onLogin = async () => {
  const res = await adminLoginAPI({
    username: 'test',
    password: '123456'
  })
  loginData.value = res.data
}

const getInfo = async () => {
  const res = await getAdminInfoAPI()
  infoData.value = res.data
}

</script>

<template>
  <button @click="onLogin">登陆</button>
  <div>
    接口返回结果：{{ loginData }}
  </div>
  <button @click="getInfo">获取用户信息</button>
  <div>
    接口返回结果：{{ infoData }}
  </div>
</template>

<style scoped></style>

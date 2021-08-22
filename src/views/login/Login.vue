<template>
  <div class="index">
    <div class="login-container">
      <div class="form-container">
        <div style="text-align:center;">
          <h1>知盾</h1>
        </div>
        <a-form
          :model="form"
          :labelCol="{ span: 6 }"
          :wrapperCol="{ span: 14 }"
          layout="horizontal"
          :colon="false"
        >
          <a-form-item label="用户名">
            <a-input v-model:value="form.username">
              <template v-slot:prefix>
                <user-outlined />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item label="密码">
            <a-input-password v-model:value="form.password">
              <template v-slot:prefix>
                <lock-outlined />
              </template>
            </a-input-password>
          </a-form-item>
        </a-form>
        <div style="margin-top: 40px;" align="center">
          <a-button type="primary" @click="login">登录</a-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRouter, Router } from 'vue-router'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'

export default {
  name: 'login',
  components: {
    UserOutlined,
    LockOutlined,
  },
  setup() {
    const router: Router = useRouter()
    const form: Record<string, any> = ref({
      username: 'admin',
      password: '123123',
    })

    const login: any = () => {
      router.push('/')
    }

    onMounted(() => {
      console.log(1)
    })

    watch(
      form,
      () => {
        console.log(form.value)
      },
      { deep: true },
    )

    return {
      form,
      login,
    }
  },
}
</script>
<style lang="less" scoped>
.index {
  padding: 130px;
  background-color: rgb(102, 102, 172);
  height: 100%;
}
.login-container {
  background-color: #ffffff;
  width: 300px;
  height: 350px;
  margin: 50px auto;
}
.form-container {
  padding-top: 40px;
}
</style>

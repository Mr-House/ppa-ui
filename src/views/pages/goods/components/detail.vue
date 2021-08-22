<template>
  <div>
    <a-form ref="ruleForm" :model="form" :rules="rules">
      <a-row>
        <a-col v-for="item in fields" :key="item.field" :span="item.span || 12">
          <a-form-item
            :label="item.label"
            :label-col="{ span: 10 }"
            :name="item.field"
            :wrapper-col="{ span: 14 }"
          >
            <a-input
              v-if="item.type === 'input'"
              style="width: 250px"
              :disabled="formStatus === 'view'"
              v-model:value="form[item.field]"
            ></a-input>
            <a-input-number
              v-if="item.type === 'number'"
              style="width: 250px"
              :disabled="formStatus === 'view'"
              v-model:value="form[item.field]"
              :min="item.min"
              :precision="item.precision"
            />
            <a-select
              v-if="item.type === 'select' && item.dictType"
              v-model:value="form[item.field]"
              style="width: 250px"
              :disabled="formStatus === 'view'"
              show-search
              allow-clear
            >
              <a-select-option
                v-for="opt in dicts[item.dictType]"
                :key="opt.value"
                :value="opt.value"
              >{{ opt.label }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div style="text-align: center;margin-top: 20px;">
      <a-button style="margin-right:5px" @click="cancel">取消</a-button>
      <a-button type="primary" @click="save">保存</a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { saveGoods, updateGoods, getGoods } from '../api'
import { message } from 'ant-design-vue'
import type { Field } from '@/interface/index'

const props = defineProps({
  id: String,
  formStatus: String,
})

const emit = defineEmits(['refresh', 'cancel'])

const fields = ref<Field[]>([
  {
    type: 'input',
    field: 'code',
    label: '商品编码',
  },
  {
    type: 'input',
    field: 'name',
    label: '商品名称',
  },
  {
    type: 'select',
    field: 'type',
    label: '商品类型',
    dictType: 'goodsType',
  },
  {
    type: 'input',
    field: 'description',
    label: '商品描述',
  },
  {
    type: 'number',
    field: 'price',
    label: '基准价格',
    min: 0,
    precision: 2,
  },
  {
    type: 'input',
    field: 'remark',
    label: '备注',
  },
])

const ruleForm = ref()

const rules = {
  name: [
    {
      required: true,
      message: '请输入商品名称',
      trigger: ['blur', 'change'],
    },
  ],
  type: [
    {
      required: true,
      message: '请选择商品类型',
      trigger: 'change',
    },
  ],
  price: [
    {
      type: 'number',
      required: true,
      message: '请输入基准价格',
      trigger: ['blur', 'change'],
    },
  ],
}

const form = ref({})

const store = useStore()

const dicts: any = reactive({})

const goodsType = computed(() => store.getters.dicts.goods_type)
dicts.goodsType = goodsType.value

const save = () => {
  ruleForm.value.validate().then((nameList: any) => {
    if (!nameList) return
    const data: any = { ...form.value }
    data.price = data.price * 100
    if (data.id) {
      updateGoods(data).then((response: any) => {
        if (response && response.status === 200) {
          message.success('保存成功')
          emit('refresh')
          cancel()
        }
      })
    } else {
      saveGoods(data).then((response: any) => {
        if (response && response.status === 200) {
          message.success('保存成功')
          emit('refresh')
          cancel()
        }
      })
    }
  })
}

const cancel = () => {
  emit('cancel')
}

onMounted(() => {
  if (props.id) {
    getGoods(props.id).then(response => {
      if (response && response.data) {
        form.value = { ...response.data, value: response.data.price / 100 }
      }
    })
  }
})
</script>

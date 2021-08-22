<template>
  <div>
    <a-form ref="ruleForm" :model="form" :rules="rules">
      <a-row>
        <a-col v-for="item in fields" :key="item.field" :span="item.span || 12">
          <a-form-item
            :label="item.label"
            :label-col="{ span: 8 }"
            :name="item.field"
            :wrapper-col="{ span: 16 }"
          >
            <a-input
              v-if="item.type === 'input'"
              style="width: 320px"
              :disabled="formStatus === 'view'"
              v-model:value="form[item.field]"
            ></a-input>
            <a-date-picker
              v-if="item.type === 'date'"
              style="width: 320px"
              :disabled="formStatus === 'view'"
              v-model:value="form[item.field]"
            ></a-date-picker>
            <a-select
              v-if="item.type === 'select' && item.dictType"
              v-model:value="form[item.field]"
              style="width: 320px"
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
    <a-card title="商品信息" :bordered="false" style="margin-top: 10px">
      <div style="margin: 10px 0" v-if="formStatus !== 'view'">
        <a-button type="primary" @click="addRow">添加商品</a-button>
      </div>
      <a-table
        :columns="goodsColumns"
        :rowKey="record => record.id || Math.random()"
        :data-source="goods"
        :scroll="{ x: 100 }"
        bordered
        :pagination="false"
      >
        <template v-for="col in editableCol" :key="col.field" #[col.field]="{ text, index }">
          <div>
            <a-input
              v-if="col.type === 'input'"
              :value="text"
              :disabled="formStatus === 'view'"
              @change="e => handleChange(e.target.value, index, col.field)"
            ></a-input>
            <a-select
              v-if="col.type === 'select' && col.dictType"
              :value="text"
              style="width: 150px"
              :disabled="formStatus === 'view'"
              @change="value => handleChange(value, index, col.field)"
            >
              <a-select-option
                v-for="opt in dicts[col.dictType]"
                :key="opt.value"
                :value="opt.value"
              >{{ opt.label }}</a-select-option>
            </a-select>
            <a-input-number
              v-if="col.type === 'number'"
              :value="text"
              :disabled="formStatus === 'view'"
              @change="value => handleChange(value, index, col.field)"
            ></a-input-number>
          </div>
        </template>
      </a-table>
    </a-card>
    <a-card title="工单列表" :bordered="false" style="margin-top: 10px">
      <a-table
        :columns="workOrderColumns"
        :rowKey="record => record.id || Math.random()"
        :data-source="workOrders"
        :scroll="{ x: 100 }"
        bordered
        :pagination="false"
      ></a-table>
    </a-card>
    <a-card title="过程记录" :bordered="false" style="margin-top: 10px">
      <a-table
        :columns="processRecordColumns"
        :rowKey="record => record.id || Math.random()"
        :data-source="processRecords"
        :scroll="{ x: 100 }"
        bordered
        :pagination="false"
      ></a-table>
    </a-card>
    <div style="text-align: center;margin-top: 20px;">
      <a-button style="margin-right:5px" @click="cancel">取消</a-button>
      <a-button type="primary" @click="save">保存</a-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { saveContract, updateContract, getContract } from '../api'
import { getAllCustomer } from '../../customer/api'
import { getAllGoods } from '../../goods/api'
import { message } from 'ant-design-vue'
import type { Field } from '@/interface/index'

const props = defineProps({
  id: String,
  formStatus: String,
})

const emit = defineEmits(['refresh', 'cancel'])

const fields = ref<Field[]>([
  {
    type: 'select',
    field: 'customerId',
    label: '客户名称',
    dictType: 'customers',
  },
  {
    type: 'select',
    field: 'partyB',
    label: '乙方主体',
    dictType: 'partyB',
  },
  {
    type: 'input',
    field: 'code',
    label: '合同编号',
  },
  {
    type: 'select',
    field: 'type',
    label: '合同类型',
    dictType: 'contractType',
  },
  {
    type: 'input',
    field: 'amount',
    label: '合同金额',
  },
  {
    type: 'input',
    field: 'receivedAmount',
    label: '收款金额',
  },
  {
    type: 'date',
    field: 'receivedTime',
    label: '收款时间',
  },
  {
    type: 'select',
    field: 'invoiceStatus',
    label: '开票情况',
    dictType: 'invoiceStatus',
  },
  {
    type: 'input',
    field: 'trackerName',
    label: '跟进人',
  },
  {
    type: 'date',
    field: 'applyTime',
    label: '申领时间',
  },
  {
    type: 'input',
    field: 'customerContract',
    label: '客户联系人',
  },
  {
    type: 'input',
    field: 'customerTel',
    label: '电话',
  },
  {
    type: 'select',
    field: 'status',
    label: '合同状态',
    dictType: 'contractStatus',
  },
  {
    type: 'date',
    field: 'returnTime',
    label: '归还时间',
  },
])

const ruleForm = ref()

const rules = {
  partyB: [
    {
      required: true,
      message: '请选择乙方主体',
      trigger: 'change',
    },
  ],
  type: [
    {
      required: true,
      message: '请选择业务类型',
      trigger: 'change',
    },
  ],
  trackerName: [
    {
      required: true,
      message: '请选择跟进人',
      trigger: ['blur', 'change'],
    },
  ],
  applyTime: [
    {
      type: 'date',
      required: true,
      message: '请填写申领时间',
      trigger: ['blur', 'change'],
    },
  ],
}

const goodsColumns = ref([
  {
    type: 'select',
    title: '商品名称',
    dataIndex: 'goodsId',
    align: 'center',
    width: 200,
    slots: {},
    dictType: 'goods',
  },
  {
    type: 'number',
    title: '单价',
    dataIndex: 'amount',
    align: 'center',
    width: 100,
    slots: {},
  },
  {
    type: 'number',
    title: '数量',
    dataIndex: 'count',
    align: 'center',
    width: 100,
    slots: {},
  },
  {
    type: 'number',
    title: '总金额',
    dataIndex: 'totalAmount',
    align: 'center',
    width: 100,
    slots: {},
  },
  {
    type: 'number',
    title: '已收款金额',
    dataIndex: 'receivedAmount',
    align: 'center',
    width: 100,
    slots: {},
  },
  {
    type: 'input',
    title: '服务主体',
    dataIndex: 'object',
    align: 'center',
    width: 100,
    slots: {},
  },
  {
    type: 'input',
    title: '服务进度',
    dataIndex: 'status',
    align: 'center',
    width: 100,
    slots: {},
  },
])

goodsColumns.value.forEach(el => {
  el.slots = { customRender: el.dataIndex }
})

const workOrderColumns = ref([
  {
    title: '商品名称',
    dataIndex: 'remark',
    align: 'center',
    width: 100,
  },
  {
    title: '工单编号',
    dataIndex: 'remark',
    align: 'center',
    width: 100,
  },
  {
    title: '详情',
    dataIndex: 'remark',
    align: 'center',
    width: 100,
  },
])

const processRecordColumns = ref([
  {
    title: '时间',
    dataIndex: 'dealTime',
    align: 'center',
    width: 100,
  },
  {
    title: '任务名称',
    dataIndex: 'taskName',
    align: 'center',
    width: 100,
  },
  {
    title: '执行人',
    dataIndex: 'executorName',
    align: 'center',
    width: 100,
  },
  {
    title: '审批意见',
    dataIndex: 'approval',
    align: 'center',
    width: 100,
  },
  {
    title: '审批状态',
    dataIndex: 'status',
    align: 'center',
    width: 100,
  },
])

const editableCol = computed(() =>
  goodsColumns.value.map(el => ({ field: el.dataIndex, type: el.type, dictType: el.dictType })),
)

const goods: any = ref([])

const workOrders: any = ref([])

const processRecords: any = ref([])

const form = ref({})

const store = useStore()

const dicts: any = reactive({})

const contractType = computed(() => store.getters.dicts.contract_type)
dicts.contractType = contractType.value

const contractStatus = computed(() => store.getters.dicts.contract_status)
dicts.contractStatus = contractStatus.value

const invoiceStatus = computed(() => store.getters.dicts.invoice_status)
dicts.invoiceStatus = invoiceStatus.value

const partyB = computed(() => store.getters.dicts.party_b)
dicts.partyB = partyB.value

const save = () => {
  ruleForm.value.validate().then((nameList: any) => {
    if (!nameList) return
    const data: any = { ...form.value, goods: goods.value }
    data.applyTime = undefined
    if (data.id) {
      updateContract(data).then((response: any) => {
        if (response && response.status === 200) {
          message.success('保存成功')
          emit('refresh')
          cancel()
        }
      })
    } else {
      saveContract(data).then((response: any) => {
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

const addRow = () => {
  goods.value.push({})
}

const handleChange = (value: string, index: string, column: string) => {
  goods.value[index][column] = value
}

onMounted(async () => {
  const { data: customerOptions } = await getAllCustomer()
  dicts.customers = customerOptions.map((el: any) => ({ value: el.id, label: el.name }))

  const { data: goodsOptions } = await getAllGoods()
  dicts.goods = goodsOptions.map((el: any) => ({ value: el.id, label: el.name }))

  if (props.id) {
    const { data }: any = await getContract(props.id)
    console.log('contract=', data)
    form.value = { ...data }
    if (data.goods) {
      goods.value = [...data.goods]
    }
    if (data.workOrders) {
      workOrders.value = [...data.workOrders]
    }
    if (data.logs) {
      processRecords.value = [...data.logs]
    }
  }
})
</script>

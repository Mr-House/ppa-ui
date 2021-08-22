<template>
  <div>
    <div style="margin: 10px 0; text-align: left">
      <a-input style="width: 200px"></a-input>
      <a-button type="primary" style="margin-left: 5px" @click="search">查询</a-button>
      <a-button type="primary" style="margin-left: 5px" @click="add">新增</a-button>
    </div>
    <a-table
      :columns="columns"
      rowKey="id"
      :data-source="list"
      :scroll="{ x: 100 }"
      bordered
      :pagination="pagination"
      :loading="loading"
      @change="handlePageChange"
    >
      <template #operation="{ record, index }">
        <div>
          <span style="margin-right: 5px">
            <a-button @click="edit(record)">编辑</a-button>
          </span>
          <span style="margin-right: 5px">
            <a-button @click="view(record)">查看</a-button>
          </span>
          <span>
            <a-popconfirm
              title="确定删除?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="deleteRecord(index)"
            >
              <a-button style="color: red">删除</a-button>
            </a-popconfirm>
          </span>
        </div>
      </template>
    </a-table>
    <a-modal
      title="客户录入"
      v-model:visible="visible"
      width="60%"
      :footer="null"
      centered
      :confirm-loading="loading"
      @ok="handleOk"
    >
      <detail
        v-if="visible"
        :id="rowId"
        :form-status="formStatus"
        @refresh="search"
        @cancel="cancel"
      ></detail>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, computed, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import detail from './components/detail.vue'
import { message } from 'ant-design-vue'
import { page, deleteCustomer } from './api'

const columns = reactive([
  {
    title: '客户名称',
    dataIndex: 'name',
    align: 'center',
    ellipsis: true,
    width: 100,
  },
  {
    title: '办公地/居住地',
    dataIndex: 'officeAddress',
    align: 'center',
    ellipsis: true,
    width: 130,
  },
  {
    title: '注册地/户口所在地',
    dataIndex: 'regAddress',
    align: 'center',
    ellipsis: true,
    width: 150,
  },
  {
    title: '统一社会信用代码/身份证号',
    dataIndex: 'creditCode',
    align: 'center',
    ellipsis: true,
    width: 220,
  },
  {
    title: '跟进人',
    dataIndex: 'transactor',
    align: 'center',
    width: 90,
  },
  {
    title: '主体类型',
    dataIndex: 'type',
    align: 'center',
    width: 100,
  },
  {
    title: '客户属性',
    dataIndex: 'classify',
    align: 'center',
    width: 100,
  },
  {
    title: '创建时间',
    dataIndex: 'crtTime',
    align: 'center',
    width: 100,
  },
  {
    title: '修改记录',
    dataIndex: 'modifyRecord',
    align: 'center',
    width: 100,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    width: 250,
    slots: { customRender: 'operation' },
  },
])

const visible = ref(false)
const add = () => {
  visible.value = true
}

const rowId = ref('')
const formStatus = ref('')

const edit = (record: any) => {
  rowId.value = record.id
  formStatus.value = 'edit'
  visible.value = true
}

const view = (record: any) => {
  rowId.value = record.id
  formStatus.value = 'view'
  visible.value = true
}

const handleOk = () => {
  visible.value = false
}

const cancel = () => {
  visible.value = false
}

const store = useStore()

const customerType = computed(() => store.getters.dicts.customer_type)

const customerClassify = computed(() => store.getters.dicts.customer_classify)

const conditions = reactive({
  current: 1,
  size: 10,
})

const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: 10,
  pageSizeOptions: ['10', '20', '50', '100'],
  showLessItems: true,
  showQuickJumper: true,
  showSizeChanger: true,
})

const list: any = reactive([])

const loading = ref(false)

const search = async () => {
  loading.value = true
  try {
    conditions.current = pagination.current
    conditions.size = pagination.pageSize
    const response = await page(conditions)
    if (response && response.data) {
      pagination.total = response.data.total
      list.push(...response.data.records)
      list.forEach((item: any) => {
        const ctIndex = customerType.value.findIndex((el: any) => el.value === item.type)
        if (ctIndex !== -1) {
          item.type = customerType.value[ctIndex].label
        }
        const ccIndex = customerClassify.value.findIndex((el: any) => el.value === item.type)
        if (ccIndex !== -1) {
          item.classify = customerClassify.value[ccIndex].label
        }
      })
    }
  } finally {
    loading.value = false
  }
}

const handlePageChange = (pageInfo: { current: number; pageSize: number }) => {
  pagination.current = pageInfo.current
  pagination.pageSize = pageInfo.pageSize
  search()
}

const deleteRecord = async (index: any) => {
  loading.value = true
  try {
    const row: any = list[index]
    const response = await deleteCustomer(row.id)
    if (response && response.status === 200) {
      message.success('删除成功')
      list.splice(index, 1)
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  search()
})
</script>

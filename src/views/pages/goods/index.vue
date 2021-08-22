<template>
  <div>
    <div style="margin: 10px 0;text-align: left;">
      <a-input style="width: 200px;"></a-input>
      <a-button type="primary" style="margin-left: 5px;" @click="search">查询</a-button>
      <a-button type="primary" style="margin-left: 5px;" @click="add">新增</a-button>
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
          <span style="margin-right:5px">
            <a-button @click="edit(record)">编辑</a-button>
          </span>
          <span style="margin-right:5px;">
            <a-button @click="view(record)">查看</a-button>
          </span>
          <span>
            <a-popconfirm
              title="确定删除?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="deleteRecord(index)"
            >
              <a-button style="color: red;">删除</a-button>
            </a-popconfirm>
          </span>
        </div>
      </template>
    </a-table>
    <a-modal
      title="商品维护"
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
<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useStore } from 'vuex'
import detail from './components/detail.vue'
import { message } from 'ant-design-vue'
import { page, deleteGoods } from './api'
const columns = ref([
  {
    title: '商品编码',
    dataIndex: 'code',
    align: 'center',
    ellipsis: true,
    width: 130,
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    align: 'center',
    ellipsis: true,
    width: 100,
  },
  {
    title: '商品类型',
    dataIndex: 'type',
    align: 'center',
    ellipsis: true,
    width: 150,
  },
  {
    title: '商品描述',
    dataIndex: 'description',
    align: 'center',
    width: 90,
  },
  {
    title: '基准价格',
    dataIndex: 'price',
    align: 'center',
    ellipsis: true,
    width: 220,
  },
  {
    title: '备注',
    dataIndex: 'remark',
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

const list: any = ref([])

const visible = ref(false)
const loading = ref(false)
const conditions = ref({
  current: 1,
  size: 10,
})

const pagination = {
  total: 0,
  current: 1,
  pageSize: 10,
  pageSizeOptions: ['10', '20', '50', '100'],
  showLessItems: true,
  showQuickJumper: true,
  showSizeChanger: true,
}

const store = useStore()

const goodsType = computed(() => store.getters.dicts.goods_type)

const add = () => {
  visible.value = true
}

const handleOk = () => {
  visible.value = false
}

const search = () => {
  conditions.value.current = pagination.current
  conditions.value.size = pagination.pageSize
  page(conditions.value).then((response: any) => {
    if (response.data) {
      pagination.total = response.data.total
      list.value = response.data.records
      list.value.forEach((item: any) => {
        const ctIndex = goodsType.value.findIndex((el: any) => el.value === item.type)
        if (ctIndex !== -1) {
          item.type = goodsType.value[ctIndex].label
        }
        item.price = item.price / 100
      })
    }
  })
}

const handlePageChange = (pageInfo: { current: number; pageSize: number }) => {
  pagination.current = pageInfo.current
  pagination.pageSize = pageInfo.pageSize
  search()
}

const cancel = () => {
  visible.value = false
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

const deleteRecord = (index: any) => {
  const row: any = list.value[index]
  deleteGoods(row.id).then((response: any) => {
    if (response && response.status === 200) {
      message.success('删除成功')
      list.value.splice(index, 1)
    }
  })
}

onMounted(() => {
  search()
})
</script>

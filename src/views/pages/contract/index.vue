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
      bordered
      :scroll="{ x: 100 }"
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
      title="合同创建"
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
<script lang="ts">
import { onMounted, ref } from 'vue'
import { message } from 'ant-design-vue'
import detail from './components/detail.vue'
import { page, deleteContract } from './api.ts'
export default {
  name: 'contract',
  components: {
    detail,
  },
  setup() {
    const columns = [
      {
        title: '合同号',
        dataIndex: 'code',
        align: 'center',
        width: 100,
      },
      {
        title: '申领时间',
        dataIndex: 'applyTime',
        align: 'center',
        width: 100,
      },
      {
        title: '类型',
        dataIndex: 'type',
        align: 'center',
        width: 80,
      },
      {
        title: '经手人',
        dataIndex: 'email',
        align: 'center',
        width: 80,
      },
      {
        title: '归还状态',
        dataIndex: 'settlement',
        align: 'center',
        ellipsis: true,
        width: 130,
      },
      {
        title: '归还时间',
        dataIndex: 'returnTime',
        align: 'center',
        ellipsis: true,
        width: 150,
      },
      {
        title: '转移记录',
        dataIndex: 'idCard',
        align: 'center',
        ellipsis: true,
        width: 220,
      },
      {
        title: '备注',
        dataIndex: 'follower',
        align: 'center',
        width: 90,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        align: 'center',
        width: 250,
        slots: { customRender: 'operation' },
      },
    ]
    const list = ref([])

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

    const visible = ref(false)

    const search = async () => {
      conditions.value.current = pagination.current
      conditions.value.size = pagination.pageSize
      const response: any = await page(conditions.value)
      if (response.data) {
        pagination.total = response.data.total
        list.value = response.data.records
      }
    }

    const add = () => {
      visible.value = true
    }

    const handleOk = () => {
      visible.value = false
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
      deleteContract(row.id).then((response: any) => {
        if (response && response.status === 200) {
          message.success('删除成功')
          list.value.splice(index, 1)
        }
      })
    }

    onMounted(() => {
      search()
    })

    return {
      columns,
      list,
      visible,
      loading,
      pagination,
      search,
      handlePageChange,
      add,
      handleOk,
      cancel,
      view,
      edit,
      deleteRecord,
      rowId,
      formStatus,
    }
  },
}
</script>

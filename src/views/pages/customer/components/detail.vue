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
    <a-card title="联系人" :bordered="false" style="margin-top: 10px">
      <div style="margin: 10px 0" v-if="formStatus !== 'view'">
        <a-button type="primary" @click="addRow">添加联系人</a-button>
      </div>
      <a-table
        :columns="contactColumns"
        :rowKey="record => record.id || Math.random()"
        :data-source="contacts"
        :scroll="{ x: 100 }"
        bordered
        :pagination="false"
      >
        <template v-for="col in editableCol" :key="col" #[col]="{ text, index }">
          <div>
            <a-input
              :value="text"
              :disabled="formStatus === 'view'"
              @change="e => handleChange(e.target.value, index, col)"
            ></a-input>
          </div>
        </template>
      </a-table>
    </a-card>
    <div style="text-align: center; margin-top: 20px">
      <a-button style="margin-right: 5px" @click="cancel">取消</a-button>
      <a-button type="primary" @click="save">保存</a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import { saveCustomer, updateCustomer, getCustomer } from '../api';
import { message } from 'ant-design-vue';
import type { Field } from '@/interface/index'

const props = defineProps({
  id: String,
  formStatus: String,
});

const emit = defineEmits(['refresh', 'cancel'])

const fields = ref<Field[]>([
  {
    type: 'input',
    field: 'name',
    label: '客户名称',
    span: 12
  },
  {
    type: 'select',
    field: 'type',
    label: '客户类型',
    dictType: 'customerType',
  },
  {
    type: 'input',
    field: 'creditCode',
    label: '统一社会信用代码/身份证号',
  },
  {
    type: 'select',
    field: 'classify',
    label: '客户属性',
    dictType: 'customerClassify',
  },
  {
    type: 'input',
    field: 'regAddress',
    label: '注册地址',
  },
  {
    type: 'input',
    field: 'specialBusiness',
    label: '客户特色业务',
  },
  {
    type: 'input',
    field: 'officeAddress',
    label: '办公地址',
  },
]);

const ruleForm = ref();

const rules = {
  name: [
    {
      required: true,
      message: '请输入客户名称',
      trigger: ['blur', 'change'],
    },
  ],
  type: [
    {
      required: true,
      message: '请选择客户类型',
      trigger: 'change',
    },
  ],
  classify: [
    {
      required: true,
      message: '请选择客户属性',
      trigger: ['blur', 'change'],
    },
  ],
  specialBusiness: [
    {
      required: true,
      message: '请填写客户特色业务',
      trigger: ['blur', 'change'],
    },
  ],
  officeAddress: [
    {
      required: true,
      message: '请填写办公地址',
      trigger: ['blur', 'change'],
    },
  ],
};

const contactColumns = ref([
  {
    title: '姓名',
    dataIndex: 'name',
    align: 'center',
    width: 100,
    slots: {},
  },
  {
    title: '角色/职位',
    dataIndex: 'role',
    align: 'center',
    width: 100,
    slots: {},
  },
  {
    title: '电话',
    dataIndex: 'mobile',
    align: 'center',
    width: 100,
    slots: {},
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    align: 'center',
    width: 100,
    slots: {},
  },
  {
    title: '微信',
    dataIndex: 'wechat',
    align: 'center',
    width: 100,
    slots: {},
  },
  {
    title: '其他',
    dataIndex: 'remark',
    align: 'center',
    width: 100,
    slots: {},
  },
]);

contactColumns.value.forEach((el) => {
  el.slots = { customRender: el.dataIndex };
});

const editableCol = computed(() =>
  contactColumns.value.map((el) => el.dataIndex)
);

const contacts: any = ref([]);

const form = ref({});

const store = useStore();

const dicts: any = reactive({});

const customerType = computed(() => store.getters.dicts.customer_type);
dicts.customerType = customerType.value;

const customerClassify = computed(() => store.getters.dicts.customer_classify);
dicts.customerClassify = customerClassify.value;

const save = () => {
  ruleForm.value.validate().then((nameList: any) => {
    if (!nameList) return;
    const data: any = { ...form.value, contactors: contacts.value };
    if (data.id) {
      saveCustomer(data).then((response: any) => {
        if (response && response.status === 200) {
          message.success('保存成功');
          emit('refresh');
          cancel();
        }
      });
    } else {
      updateCustomer(data).then((response: any) => {
        if (response && response.status === 200) {
          message.success('保存成功');
          emit('refresh');
          cancel();
        }
      });
    }
  });
};

const cancel = () => {
  emit('cancel');
};

const addRow = () => {
  contacts.value.push({});
};

const handleChange = (value: string, index: string, column: string) => {
  contacts.value[index][column] = value;
};

onMounted(() => {
  if (props.id) {
    getCustomer(props.id).then((response: any) => {
      if (response && response.data) {
        form.value = { ...response.data };
        if (response.data.contactors) {
          contacts.value = [...response.data.contactors];
        }
      }
    });
  }
});
</script>

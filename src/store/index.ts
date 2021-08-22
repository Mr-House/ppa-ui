import { createStore } from 'vuex'

export default createStore({
  state: {
    dicts: {
      customer_type: [
        { value: '1', label: '企业' },
        { value: '2', label: '个人' },
        { value: '3', label: '组织' },
        { value: '4', label: '其他' },
      ],
      customer_classify: [
        { value: '1', label: '渠道' },
        { value: '2', label: '直客' },
      ],
      goods_type: [
        { value: 'trademark', label: '商标' },
        { value: 'patent', label: '专利' },
        { value: 'copyright', label: '版权' },
        { value: 'trade', label: '交易' },
        { value: 'project', label: '项目' },
        { value: 'auth', label: '认证' },
        { value: 'other', label: '其他' },
      ],
      contract_type: [
        { value: 'P', label: '纸质' },
        { value: 'E', label: '电子' },
      ],
      contract_status: [
        { value: 0, label: '初始' },
        { value: 1, label: '已领出' },
        { value: 2, label: '已签单' },
        { value: 3, label: '已作废' },
      ],
      invoice_status: [
        { value: '0', label: '未开票' },
        { value: '1', label: '已开票' },
      ],
      party_b: [
        { value: '青岛恒昇众力知识产权代理事务所(普通合伙)', label: '青岛恒昇众力知识产权代理事务所(普通合伙)' },
        { value: '青岛知盾咨询服务有限公司', label: '青岛知盾咨询服务有限公司' },
      ],
    },
  },
  mutations: {},
  actions: {},
  modules: {},
  getters: {
    dicts: state => state.dicts,
  },
})

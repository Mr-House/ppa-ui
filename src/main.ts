import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import store from './store'
import Antd from 'ant-design-vue';
import './index.css';
import 'ant-design-vue/dist/antd.css';

const app = createApp(App);
app.use(store);
app.use(router);
app.use(Antd);
app.mount('#app');
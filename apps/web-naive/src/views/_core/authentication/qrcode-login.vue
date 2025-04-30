<script lang="tsx" setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';

import * as ww from '@wecom/jssdk';

import { getWorkWechatConfigSignature, loginByWorkWechat } from '#/api';
import { useAuthStore } from '#/store';

defineOptions({ name: 'QrCodeLogin' });

const corpId = import.meta.env.VITE_APP_TENCENT_WORK_WECHAT_CORP_ID as string;
const agentId = import.meta.env.VITE_APP_TENCENT_WORK_WECHAT_AGENT_ID as string;
if (!corpId || !agentId) {
  throw new Error('请添加企业微信相关配置！');
} else {
  window.console.table({ corpId, agentId });
}
ww.register({
  corpId,
  jsApiList: ['getExternalContact'],
  getConfigSignature,
});

async function getConfigSignature(url: string) {
  const config = await getWorkWechatConfigSignature(url);
  return { ...config };
}
const workWechatRef = ref<HTMLIFrameElement>();
const auth = useAuthStore();
const router = useRouter();
onMounted(() => {
  // 初始化登录组件
  ww.createWWLoginPanel({
    el: workWechatRef.value,
    params: {
      login_type: ww.WWLoginType.corpApp,
      appid: corpId,
      agentid: agentId,
      redirect_uri: 'http://127.0.0.1',
      state: 'loginState',
      redirect_type: ww.WWLoginRedirectType.callback,
    },
    onCheckWeComLogin() {},
    onLoginSuccess({ code }) {
      loginByWorkWechat(code)
        .then((res) => {
          auth.accessTokenLogin(res.accessToken);
        })
        .catch(() => {
          router.push(LOGIN_PATH);
        });
    },
    onLoginFail(err) {
      window.console.log(err);
    },
  });
});

const render = () => (
  <div class={'h-[416px] w-[480px]'} ref={workWechatRef}></div>
);
</script>

<template>
  <div>
    <component :is="render" />
  </div>
</template>

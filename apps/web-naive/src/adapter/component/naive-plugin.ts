function getEventTarget(event: Event) {
  const target = event.target as HTMLElement | null;
  if (target && (target as any).shadowRoot && event.composed) {
    return (event.composedPath()[0] as HTMLElement) || target;
  }
  return target;
}

/**
 * 检查触发源是否属于目标节点
 */
function getEventTargetNode(
  event: any,
  container: HTMLElement,
  className: string,
) {
  let targetElem;
  let target = getEventTarget(event);
  const rootEl = document.documentElement || document.querySelector('html');
  while (target && target.nodeType && target !== rootEl) {
    if (
      className &&
      target.className &&
      target.className.split &&
      target.className.split(' ').includes(className)
    ) {
      targetElem = target;
    } else if (target === container) {
      return {
        flag: className ? !!targetElem : true,
        container,
        targetElem,
      };
    }
    target = target.parentElement;
  }
  return { flag: false };
}

/**
 * 事件兼容性处理
 */
function handleClearEvent(params: any) {
  const { $event } = params;
  const bodyElem = document.body;
  if (
    // 下拉框、日期
    getEventTargetNode($event, bodyElem, 'v-binder-follower-content').flag
  ) {
    return false;
  }
}

export function installNaivePluginRenderNaive(VxeUI: any) {
  VxeUI.interceptor.add('event.clearFilter', handleClearEvent);
  VxeUI.interceptor.add('event.clearEdit', handleClearEvent);
  VxeUI.interceptor.add('event.clearAreas', handleClearEvent);
  // 兼容老版本
  VxeUI.interceptor.add('event.clearActived', handleClearEvent);
}

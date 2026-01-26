import clsx from 'clsx';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useTheme } from '__/hooks';
import css from './Safari.module.scss';

type Tab = {
  id: string;
  url: string;
  title: string;
};

const Safari = () => {
  // 初始化默认标签页
  const [tabs, setTabs] = useState<Tab[]>([
    { id: Date.now().toString(), url: '/resume.html', title: '我的简历' },
    { id: (Date.now() + 1).toString(), url: 'coming-soon', title: '我的网站' },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0].id); // 默认激活"我的简历"
  const [theme] = useTheme();
  const iframeRefs = useRef<Map<string, HTMLIFrameElement>>(new Map());

  // 获取当前激活的标签页
  const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0];

  // 通知iframe主题变化的函数
  const notifyIframeTheme = useCallback((iframe: HTMLIFrameElement | null) => {
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        { type: 'theme-change', theme },
        '*'
      );
    }
  }, [theme]);

  // 当主题变化时，通知所有iframe
  useEffect(() => {
    iframeRefs.current.forEach((iframe) => {
      notifyIframeTheme(iframe);
    });
  }, [theme, notifyIframeTheme]);

  // 切换标签页
  const switchTab = useCallback((tabId: string, e?: any) => {
    if (e) {
      // 如果点击的是关闭按钮或其子元素，不切换标签页
      const target = e.target as HTMLElement;
      if (target.closest('button[aria-label="关闭标签页"]')) {
        return;
      }
      e.stopPropagation(); // 阻止事件冒泡，避免触发窗口拖拽
    }
    setActiveTabId(tabId);
  }, []);

  // 关闭标签页
  const closeTab = useCallback(
    (tabId: string, e: any) => {
      e.preventDefault(); // 阻止默认行为
      e.stopPropagation(); // 阻止事件冒泡，避免触发标签页切换和窗口拖拽

      const tabIndex = tabs.findIndex((tab) => tab.id === tabId);
      if (tabIndex === -1) return;

      // 如果只剩一个标签页，关闭后创建新的默认标签页
      if (tabs.length === 1) {
        const newTab: Tab = {
          id: Date.now().toString(),
          url: '/resume.html',
          title: '我的简历',
        };
        setTabs([newTab]);
        setActiveTabId(newTab.id);
        return;
      }

      // 移除标签页
      const newTabs = tabs.filter((tab) => tab.id !== tabId);

      // 如果关闭的是当前激活的标签页，切换到其他标签页
      if (tabId === activeTabId) {
        // 优先切换到右侧标签页，如果没有则切换到左侧
        const nextTab = newTabs[tabIndex] || newTabs[tabIndex - 1];
        if (nextTab) {
          setActiveTabId(nextTab.id);
        }
      }

      setTabs(newTabs);
    },
    [tabs, activeTabId],
  );

  // 获取标签页显示标题
  const getTabTitle = (tab: Tab) => {
    if (tab.title) return tab.title;
    // 从 URL 提取文件名
    const urlParts = tab.url.split('/');
    const fileName = urlParts[urlParts.length - 1] || '新标签页';
    return fileName.replace('.html', '');
  };

  return (
    <section className={css.container}>
      <div className={clsx('app-window-drag-handle', css.tabsBar)}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={clsx(css.tab, tab.id === activeTabId && css.activeTab)}
            onClick={(e) => switchTab(tab.id, e)}
          >
            <span className={css.tabTitle}>{getTabTitle(tab)}</span>
            <button
              className={css.closeButton}
              onClick={(e) => closeTab(tab.id, e)}
              aria-label="关闭标签页"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className={css.content}>
        <div className={css.placeholderText}>Coming Soon！</div>
        {tabs.map((tab) => (
          tab.url === 'coming-soon' ? (
            <div
              key={tab.id}
              className={clsx(css.comingSoon, tab.id === activeTabId && css.activeIframe)}
            >
              <div className={css.comingSoonContent}>
                <h1 className={css.comingSoonTitle}>Coming Soon!</h1>
                <p className={css.comingSoonText}>网站正在建设中...</p>
              </div>
            </div>
          ) : (
            <iframe
              key={tab.id}
              ref={(el) => {
                if (el) {
                  iframeRefs.current.set(tab.id, el);
                  // iframe加载完成后立即发送主题信息
                  el.onload = () => {
                    notifyIframeTheme(el);
                  };
                } else {
                  iframeRefs.current.delete(tab.id);
                }
              }}
              src={`${tab.url}${tab.url.includes('?') ? '&' : '?'}theme=${theme}`}
              className={clsx(css.iframe, tab.id === activeTabId && css.activeIframe)}
              title={getTabTitle(tab)}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            />
          )
        ))}
      </div>
    </section>
  );
};

export default Safari;

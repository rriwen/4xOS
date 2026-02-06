import clsx from 'clsx';
import { useState, useCallback, useEffect, useRef } from 'react';
import { mdiBookmarkOutline } from '@mdi/js';
import { AppIcon } from '__/components/utils/AppIcon';
import { useTheme } from '__/hooks';
import css from './Safari.module.scss';

type Tab = {
  id: string;
  url: string;
  title: string;
  history: string[];
  historyIndex: number;
};

// URL 映射函数：将内部 URL 映射为显示 URL
const getDisplayUrl = (url: string): string => {
  if (url === '/resume.html') {
    return 'https://rriwen.me/aboutme';
  }
  if (url === '/project/index.html') {
    return 'https://rriwen.me/project-chatbi';
  }
  return url;
};

// 书签列表
const bookmarks = [
  { url: '/resume.html', title: '关于我', displayUrl: 'https://rriwen.me/aboutme' },
  { url: '/project/index.html', title: 'ChatBI 项目', displayUrl: 'https://rriwen.me/project-chatbi' },
];

const Safari = () => {
  // 初始化默认标签页
  const initialTab: Tab = {
    id: Date.now().toString(),
    url: '/resume.html',
    title: '关于我',
    history: ['/resume.html'],
    historyIndex: 0,
  };
  const [tabs, setTabs] = useState<Tab[]>([initialTab]);
  const [activeTabId, setActiveTabId] = useState<string>(initialTab.id); // 默认激活"关于我"
  const [theme] = useTheme();
  const iframeRefs = useRef<Map<string, HTMLIFrameElement>>(new Map());
  const [showBookmarksMenu, setShowBookmarksMenu] = useState(false);

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

  // 打开或切换到指定URL的标签页
  const openOrSwitchToTab = useCallback((url: string, title?: string) => {
    setTabs((currentTabs) => {
      // 检查是否已存在该URL的标签页
      const existingTab = currentTabs.find((tab) => tab.url === url);
      if (existingTab) {
        // 如果存在，切换到该标签页
        setActiveTabId(existingTab.id);
        return currentTabs;
      }
      // 如果不存在，创建新标签页
      const newTab: Tab = {
        id: Date.now().toString(),
        url,
        title: title || '',
        history: [url],
        historyIndex: 0,
      };
      setActiveTabId(newTab.id);
      return [...currentTabs, newTab];
    });
  }, []);

  // 更新标签页历史记录
  const updateTabHistory = useCallback((tabId: string, newUrl: string) => {
    setTabs((currentTabs) => {
      return currentTabs.map((tab) => {
        if (tab.id === tabId) {
          // 如果新 URL 与当前 URL 相同，不更新历史
          if (tab.url === newUrl) {
            return tab;
          }
          // 移除当前索引之后的历史记录（如果有）
          const newHistory = tab.history.slice(0, tab.historyIndex + 1);
          // 添加新 URL
          newHistory.push(newUrl);
          return {
            ...tab,
            url: newUrl,
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        }
        return tab;
      });
    });
  }, []);

  // 前进
  const goForward = useCallback(() => {
    const activeTab = tabs.find((tab) => tab.id === activeTabId);
    if (activeTab && activeTab.historyIndex < activeTab.history.length - 1) {
      const newIndex = activeTab.historyIndex + 1;
      const newUrl = activeTab.history[newIndex];
      setTabs((currentTabs) =>
        currentTabs.map((tab) =>
          tab.id === activeTabId
            ? { ...tab, url: newUrl, historyIndex: newIndex }
            : tab
        )
      );
      // 刷新 iframe
      const iframe = iframeRefs.current.get(activeTabId);
      if (iframe) {
        iframe.src = `${newUrl}${newUrl.includes('?') ? '&' : '?'}theme=${theme}`;
      }
    }
  }, [tabs, activeTabId, theme]);

  // 后退
  const goBack = useCallback(() => {
    const activeTab = tabs.find((tab) => tab.id === activeTabId);
    if (activeTab && activeTab.historyIndex > 0) {
      const newIndex = activeTab.historyIndex - 1;
      const newUrl = activeTab.history[newIndex];
      setTabs((currentTabs) =>
        currentTabs.map((tab) =>
          tab.id === activeTabId
            ? { ...tab, url: newUrl, historyIndex: newIndex }
            : tab
        )
      );
      // 刷新 iframe
      const iframe = iframeRefs.current.get(activeTabId);
      if (iframe) {
        iframe.src = `${newUrl}${newUrl.includes('?') ? '&' : '?'}theme=${theme}`;
      }
    }
  }, [tabs, activeTabId, theme]);

  // 刷新
  const refresh = useCallback(() => {
    const iframe = iframeRefs.current.get(activeTabId);
    if (iframe) {
      iframe.src = iframe.src; // 重新加载
    }
  }, [activeTabId]);

  // 监听来自iframe的消息（用于打开新标签页）
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'open-tab') {
        const { url, title } = event.data;
        if (url) {
          openOrSwitchToTab(url, title);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [openOrSwitchToTab]);

  // 点击外部关闭书签菜单
  useEffect(() => {
    if (!showBookmarksMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${css.bookmarkContainer}`)) {
        setShowBookmarksMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showBookmarksMenu]);

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
          title: '关于我',
          history: ['/resume.html'],
          historyIndex: 0,
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

  const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0];
  const canGoBack = activeTab.historyIndex > 0;
  const canGoForward = activeTab.historyIndex < activeTab.history.length - 1;

  return (
    <section className={css.container}>
      {/* 标签页栏 - 位于窗口顶部 */}
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
      {/* 地址栏 */}
      <div className={css.addressBar}>
        <div className={css.navButtons}>
          <button
            className={css.navButton}
            onClick={goBack}
            disabled={!canGoBack}
            aria-label="后退"
            title="后退"
          >
            ←
          </button>
          <button
            className={css.navButton}
            onClick={goForward}
            disabled={!canGoForward}
            aria-label="前进"
            title="前进"
          >
            →
          </button>
          <button
            className={css.navButton}
            onClick={refresh}
            aria-label="刷新"
            title="刷新"
          >
            ↻
          </button>
        </div>
        <div className={css.addressInputContainer}>
          <input
            type="text"
            className={css.addressInput}
            value={getDisplayUrl(activeTab.url)}
            readOnly
            aria-label="地址栏"
          />
        </div>
        <div className={css.bookmarkContainer}>
          <button
            className={css.bookmarkButton}
            onClick={() => setShowBookmarksMenu(!showBookmarksMenu)}
            aria-label="书签"
            title="书签"
          >
            <AppIcon path={mdiBookmarkOutline} size={16} />
          </button>
          {showBookmarksMenu && (
            <div className={css.bookmarkMenu}>
              {bookmarks.map((bookmark) => (
                <button
                  key={bookmark.url}
                  className={css.bookmarkItem}
                  onClick={() => {
                    openOrSwitchToTab(bookmark.url, bookmark.title);
                    setShowBookmarksMenu(false);
                  }}
                >
                  <span className={css.bookmarkTitle}>{bookmark.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>
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

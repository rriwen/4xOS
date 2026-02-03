// Theme Toggle Functionality
// 匹配项目的主题切换系统，支持 iframe 嵌入和独立使用
(function() {
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  const body = document.body;

  // 检查已保存的主题偏好或使用系统偏好
  function getInitialTheme() {
    // 优先检查 URL 参数（Safari 组件传递的）
    const urlParams = new URLSearchParams(window.location.search);
    const urlTheme = urlParams.get('theme');
    if (urlTheme === 'dark' || urlTheme === 'light') {
      return urlTheme;
    }

    // 在 iframe 中时，优先使用系统主题（不读取 localStorage）
    // 使用系统偏好作为默认值
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // 应用主题
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    body.classList.remove('light', 'dark');
    body.classList.add(theme);
    // 不在 localStorage 中保存主题，始终跟随系统或 URL 参数
    updateThemeIcon(theme);
  }

  // 更新主题图标
  function updateThemeIcon(theme) {
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? '◑ 切换主题' : '◐ 切换主题';
    }
  }

  // 初始化主题
  const initialTheme = getInitialTheme();
  applyTheme(initialTheme);

  // 监听来自父窗口的主题变化消息（Safari 组件发送的）
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'theme-change') {
      applyTheme(event.data.theme);
    }
  });

  // 监听系统主题变化
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      // 始终跟随系统主题变化（除非 URL 参数中有指定主题）
      const urlParams = new URLSearchParams(window.location.search);
      if (!urlParams.get('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // 主题切换按钮点击事件
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = body.classList.contains('dark') ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);

      // 通知父窗口更新主题（如果在 iframe 中）
      try {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'theme-change', theme: newTheme }, '*');
        }
      } catch (e) {
        // 跨域限制，忽略
      }
    });
  }

  // 和我聊聊按钮
  const chatButton = document.getElementById('chatButton');
  if (chatButton) {
    chatButton.addEventListener('click', function() {
      window.open('https://rriwen4x.me', '_blank');
    });
  }

  // 项目成果卡片点击切换图片
  const resultCards = document.querySelectorAll('.result-card[data-card-index]');
  const resultImages = document.querySelectorAll('.result-image-container .image-placeholder[data-image-index]');

  if (resultCards.length > 0 && resultImages.length > 0) {
    // 默认激活第一个卡片
    resultCards[0].classList.add('active');

    resultCards.forEach((card, index) => {
      card.addEventListener('click', function() {
        // 移除所有卡片的激活状态
        resultCards.forEach(c => c.classList.remove('active'));
        // 激活当前卡片
        card.classList.add('active');

        // 移除所有图片的激活状态
        resultImages.forEach(img => {
          img.classList.remove('active');
        });

        // 激活对应的图片
        const targetImage = document.querySelector(
          `.result-image-container .image-placeholder[data-image-index="${index}"]`
        );
        if (targetImage) {
          targetImage.classList.add('active');
        }
      });
    });
  }
})();
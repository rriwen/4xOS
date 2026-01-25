import { useAtom } from 'jotai';
import { useEffect } from 'preact/hooks';
import { themeAtom } from '__/stores/theme.store';

/**
 * Sitewide theme
 */
export function useTheme() {
  const [theme, setTheme] = useAtom(themeAtom);

  useEffect(() => {
    // 检查当前 body 是否已经有正确的主题类
    const currentTheme = document.body.classList.contains('dark') ? 'dark' : 
                        document.body.classList.contains('light') ? 'light' : null;
    
    // 只有当主题类不匹配时才更新，避免重复操作
    if (currentTheme !== theme) {
      document.documentElement.classList.remove('light', 'dark');
      document.body.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
      document.body.classList.add(theme);
    }
  }, [theme]);

  return [theme, setTheme] as const;
}

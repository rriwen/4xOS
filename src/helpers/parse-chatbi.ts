/**
 * 从 Markdown 文件加载 ChatBI 项目内容
 */
export const fetchAndParseChatBI = async (): Promise<string> => {
  try {
    // 优先尝试从 chatbi.md 读取
    const response = await fetch('/project/chatbi.md');
    if (!response.ok) {
      throw new Error(`无法加载 ChatBI 文件: ${response.status}`);
    }
    const markdownContent = await response.text();
    
    // 移除 Markdown 格式标记，保留纯文本内容
    let text = markdownContent;
    
    // 移除标题标记（#），但保留标题文本
    text = text.replace(/^#{1,6}\s+(.+)$/gm, '$1');
    
    // 移除粗体标记（**），保留文本
    text = text.replace(/\*\*(.*?)\*\*/g, '$1');
    
    // 移除列表标记（-），但保留列表项内容
    text = text.replace(/^-\s+/gm, '');
    
    // 移除分隔线（---）
    text = text.replace(/^---+$/gm, '');
    
    // 移除代码块标记（```）
    text = text.replace(/```[\s\S]*?```/g, '');
    
    // 移除行内代码标记（`）
    text = text.replace(/`([^`]+)`/g, '$1');
    
    // 清理多余的空白行，但保留段落分隔
    text = text.replace(/\n{3,}/g, '\n\n');
    
    return text.trim();
  } catch (error) {
    console.error('加载 ChatBI 文件失败:', error);
    // 如果加载失败，返回空字符串，不影响应用运行
    return '';
  }
};

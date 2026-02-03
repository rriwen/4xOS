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
    
    // 移除 Markdown 格式标记，保留纯文本内容，同时保持结构清晰
    let text = markdownContent;
    
    // 移除"作品集呈现建议"部分（对 AI 问答不太有用）
    text = text.replace(/###\s*\*\*四、作品集呈现建议[\s\S]*?###\s*\*\*这份作品集凸显的您的双重优势[\s\S]*?您可以用此框架准备面试叙述.*$/s, '');
    
    // 移除标题标记（#），但保留标题文本
    text = text.replace(/^#{1,6}\s+(.+)$/gm, '$1');
    
    // 移除粗体标记（**），保留文本（粗体内容通常是重点）
    text = text.replace(/\*\*(.*?)\*\*/g, '$1');
    
    // 移除列表标记（-），但保留列表项内容（包括缩进的子列表）
    text = text.replace(/^(\s*)-\s+/gm, '$1');
    
    // 移除有序列表标记（数字.），但保留内容
    text = text.replace(/^(\s*)\d+\.\s+/gm, '$1');
    
    // 移除分隔线（---）
    text = text.replace(/^---+$/gm, '');
    
    // 移除代码块标记（```）
    text = text.replace(/```[\s\S]*?```/g, '');
    
    // 移除行内代码标记（`），保留内容
    text = text.replace(/`([^`]+)`/g, '$1');
    
    // 清理多余的空白行，但保留段落分隔（最多两个连续换行）
    text = text.replace(/\n{3,}/g, '\n\n');
    
    // 移除每行首尾的空白，但保留缩进（用于子列表）
    const lines = text.split('\n');
    text = lines.map(line => {
      // 如果行是空的或只有空白，返回空字符串
      if (!line.trim()) return '';
      // 否则移除行首尾空白，但保留行内的缩进结构
      return line.trim();
    }).join('\n');
    
    // 再次清理多余的空白行
    text = text.replace(/\n{3,}/g, '\n\n');
    
    return text.trim();
  } catch (error) {
    console.error('加载 ChatBI 文件失败:', error);
    // 如果加载失败，返回空字符串，不影响应用运行
    return '';
  }
};

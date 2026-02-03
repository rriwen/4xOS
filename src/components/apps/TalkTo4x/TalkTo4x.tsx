import clsx from 'clsx';
import { useAtom } from 'jotai';
import { useImmerAtom } from 'jotai-immer';
import { useState, useRef, useEffect } from 'react';
import { fetchAndParseResume } from '__/helpers/parse-resume';
import type { ResumeData } from '__/helpers/parse-resume';
import { fetchAndParseChatBI } from '__/helpers/parse-chatbi';
import {
  activeAppStore,
  globalZIndexCounterStore,
  minimizedAppsStore,
  openAppsStore,
  windowZIndexStore,
} from '__/stores/apps.store';
import css from './TalkTo4x.module.scss';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  hasResumeLink?: boolean;
}

/**
 * 判断回答内容是否与简历相关
 */
const isResumeRelated = (content: string): boolean => {
  // 如果内容太短，不判断为简历相关
  if (!content || content.trim().length < 10) {
    return false;
  }
  
  const resumeKeywords = [
    // 工作相关
    '工作经历',
    '工作经验',
    '工作',
    '公司',
    '职位',
    '职责',
    '成就',
    '成果',
    // 项目相关
    '项目经验',
    '项目',
    'chatbi',
    'text2sql',
    '数据开发',
    '数据库管控',
    '数字征迁',
    // 技能相关
    '技能',
    '专业技能',
    '擅长',
    '精通',
    '熟悉',
    // 教育相关
    '教育经历',
    '教育',
    '大学',
    '学历',
    // 个人相关
    '个人简介',
    '简介',
    '简历',
    '经历',
    '背景',
    // 具体公司和项目
    '蚂蚁集团',
    'oceanbase',
    '华东勘测',
    '浦槐科技',
    '南京邮电',
  ];
  
  const lowerContent = content.toLowerCase();
  // 检查是否包含关键词，但排除一些常见但无关的词
  const hasKeyword = resumeKeywords.some((keyword) => lowerContent.includes(keyword.toLowerCase()));
  
  // 额外检查：如果内容包含"我"且包含工作/项目/技能相关词汇，也认为是简历相关
  const hasPersonalReference = lowerContent.includes('我') && (
    lowerContent.includes('工作') ||
    lowerContent.includes('项目') ||
    lowerContent.includes('技能') ||
    lowerContent.includes('经历')
  );
  
  return hasKeyword || hasPersonalReference;
};

const buildSystemPrompt = (resumeData: ResumeData | null, chatBIContent: string | null): string => {
  let prompt = `你是 4x（任文倩，泗澄）。请基于以下信息回答关于自己的问题，回答要自然、友好，就像在和朋友聊天一样。

`;

  if (resumeData) {
    prompt += `## 个人简介
${resumeData.intro}

## 工作经历
${resumeData.experience}

## 教育经历
${resumeData.education}

## 项目经历
${resumeData.projects}

## 专业技能
${resumeData.skills}

## 联系方式
- 职位：${resumeData.contact.role}
- 位置：${resumeData.contact.location}
- 手机：${resumeData.contact.phone}
- 邮箱：${resumeData.contact.email}

`;
  }

  if (chatBIContent) {
    prompt += `## ChatBI 项目详情
${chatBIContent}

`;
  }

  prompt += `## 关于这个系统
你现在所在的"Talk to 4x"应用是一个基于 Web 技术构建的 macOS 桌面环境模拟器中的一个应用，使用 Preact + Vite + TypeScript 开发。这个 AI 对话功能通过集成 DeepSeek API 实现，能够基于 4x 的个人经历、项目经验和技能信息进行对话。系统支持深色/浅色主题切换，采用现代化的 UI 设计，参考了 Gemini 的对话界面风格。

请用第一人称回答，语气要自然、专业但友好。每次回复的开头都要加上"嘿！"。如果被问到不确定的信息，可以诚实地说"我不太确定"或"让我想想"。`;

  return prompt;
};

const quickQuestions = [
  '介绍一下你自己',
  '怎么联系你？',
  '你的工作经历有哪些？',
  '你擅长的领域是什么？',
  '这个系统是怎么实现的？'

];

const TalkTo4x = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '嘿！你好，我是 4x。有什么想了解的吗？',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [chatBIContent, setChatBIContent] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // 用于打开 Safari 的 stores
  const [, setOpenApps] = useImmerAtom(openAppsStore);
  const [, setActiveApp] = useAtom(activeAppStore);
  const [, setMinimizedApps] = useImmerAtom(minimizedAppsStore);
  const [windowZIndices, setWindowZIndices] = useAtom(windowZIndexStore);
  const [globalZIndexCounter, setGlobalZIndexCounter] = useAtom(globalZIndexCounterStore);
  
  /**
   * 打开 Safari 应用
   */
  const openSafari = () => {
    // 恢复最小化的 Safari（如果已最小化）
    setMinimizedApps((minimized) => {
      if (minimized['safari']) {
        minimized['safari'] = false;
      }
      return minimized;
    });
    
    // 先分配最高的z-index（在打开窗口之前）
    const newZIndex = globalZIndexCounter + 1;
    setGlobalZIndexCounter(newZIndex);
    setWindowZIndices((prev) => ({
      ...prev,
      'safari': newZIndex,
    }));
    
    // 打开应用
    setOpenApps((apps) => {
      apps['safari'] = true;
      return apps;
    });

    // 延迟激活应用，确保窗口已经渲染
    // 使用 setTimeout 确保 Window 组件已经挂载并读取了预设的 z-index
    setTimeout(() => {
      setActiveApp('safari');
      // 再次确保 z-index 是最高的（防止 Window 组件的初始化逻辑覆盖）
      setGlobalZIndexCounter((current) => {
        const finalZIndex = Math.max(current + 1, newZIndex + 1);
        setWindowZIndices((prev) => ({
          ...prev,
          'safari': finalZIndex,
        }));
        // 使用 requestAnimationFrame 确保在下一帧更新 DOM
        // 这对于 React 19 的自动批处理很重要
        requestAnimationFrame(() => {
          // 查找 Safari 窗口的 DOM 元素（通过 data-app-id 属性）
          const safariWindow = document.querySelector(`[data-app-id="safari"]`) as HTMLElement;
          if (safariWindow) {
            safariWindow.style.zIndex = `${finalZIndex}`;
          }
        });
        return finalZIndex;
      });
    }, 300); // 增加延迟时间，确保窗口已经完全渲染和初始化
  };

  // 在组件挂载时加载简历数据和 ChatBI 内容
  useEffect(() => {
    const loadData = async () => {
      // 加载简历数据
      try {
        const data = await fetchAndParseResume();
        setResumeData(data);
      } catch (err) {
        console.error('加载简历数据失败:', err);
        // 不设置错误状态，允许应用继续运行，只是没有简历数据
      }

      // 加载 ChatBI 内容
      try {
        const chatBI = await fetchAndParseChatBI();
        setChatBIContent(chatBI);
      } catch (err) {
        console.error('加载 ChatBI 内容失败:', err);
        // 不设置错误状态，允许应用继续运行，只是没有 ChatBI 内容
      }
    };
    loadData();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuickQuestion = async (question: string) => {
    if (isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
      if (!apiKey) {
        throw new Error('未配置 DeepSeek API Key，请在 .env 文件中设置 VITE_DEEPSEEK_API_KEY，并重启开发服务器');
      }

      const systemPrompt = buildSystemPrompt(resumeData, chatBIContent);
      const conversationHistory = [
        { role: 'system', content: systemPrompt },
        ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: question },
      ];

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: conversationHistory,
          temperature: 0.7,
          max_tokens: 2000,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || `API 请求失败: ${response.status}`;
        
        let friendlyMessage = errorMessage;
        if (errorMessage.toLowerCase().includes('insufficient balance') || 
            errorMessage.toLowerCase().includes('余额不足')) {
          friendlyMessage = 'API 余额不足，请充值后重试。如需帮助，请联系管理员。';
        } else if (errorMessage.toLowerCase().includes('invalid api key') ||
                   errorMessage.toLowerCase().includes('unauthorized')) {
          friendlyMessage = 'API Key 无效或已过期，请检查配置。';
        } else if (errorMessage.toLowerCase().includes('rate limit')) {
          friendlyMessage = '请求过于频繁，请稍后再试。';
        }
        
        throw new Error(friendlyMessage);
      }

      // 创建临时消息用于流式更新
      const tempMessage: Message = {
        role: 'assistant',
        content: '',
      };
      setMessages((prev) => [...prev, tempMessage]);

      // 处理流式响应
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      if (!reader) {
        throw new Error('无法读取响应流');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          // 流式输出完成后，检查是否需要添加简历链接
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage && lastMessage.role === 'assistant' && isResumeRelated(lastMessage.content)) {
              lastMessage.content += '\n\n你也可以在 Safari 中查看我的完整简历。';
              lastMessage.hasResumeLink = true;
            }
            return newMessages;
          });
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const json = JSON.parse(data);
              const delta = json.choices[0]?.delta?.content || '';
              
              if (delta) {
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage && lastMessage.role === 'assistant') {
                    lastMessage.content += delta;
                  }
                  return newMessages;
                });
                // 流式输出时自动滚动到底部
                setTimeout(() => scrollToBottom(), 0);
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '发送消息时出错';
      setError(errorMessage);
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
      if (!apiKey) {
        console.error('环境变量读取失败:', {
          env: import.meta.env,
          mode: import.meta.env.MODE,
          dev: import.meta.env.DEV,
          prod: import.meta.env.PROD,
        });
        throw new Error('未配置 DeepSeek API Key，请在 .env 文件中设置 VITE_DEEPSEEK_API_KEY，并重启开发服务器');
      }

      const systemPrompt = buildSystemPrompt(resumeData, chatBIContent);
      const conversationHistory = [
        { role: 'system', content: systemPrompt },
        ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: userMessage.content },
      ];

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: conversationHistory,
          temperature: 0.7,
          max_tokens: 2000,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || `API 请求失败: ${response.status}`;
        
        // 处理常见的 API 错误，提供更友好的中文提示
        let friendlyMessage = errorMessage;
        if (errorMessage.toLowerCase().includes('insufficient balance') || 
            errorMessage.toLowerCase().includes('余额不足')) {
          friendlyMessage = 'API 余额不足，请充值后重试。如需帮助，请联系管理员。';
        } else if (errorMessage.toLowerCase().includes('invalid api key') ||
                   errorMessage.toLowerCase().includes('unauthorized')) {
          friendlyMessage = 'API Key 无效或已过期，请检查配置。';
        } else if (errorMessage.toLowerCase().includes('rate limit')) {
          friendlyMessage = '请求过于频繁，请稍后再试。';
        }
        
        throw new Error(friendlyMessage);
      }

      // 创建临时消息用于流式更新
      const tempMessage: Message = {
        role: 'assistant',
        content: '',
      };
      setMessages((prev) => [...prev, tempMessage]);

      // 处理流式响应
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      if (!reader) {
        throw new Error('无法读取响应流');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          // 流式输出完成后，检查是否需要添加简历链接
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage && lastMessage.role === 'assistant' && isResumeRelated(lastMessage.content)) {
              lastMessage.content += '\n\n你也可以在 Safari 中查看我的完整简历。';
              lastMessage.hasResumeLink = true;
            }
            return newMessages;
          });
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const json = JSON.parse(data);
              const delta = json.choices[0]?.delta?.content || '';
              
              if (delta) {
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage && lastMessage.role === 'assistant') {
                    lastMessage.content += delta;
                  }
                  return newMessages;
                });
                // 流式输出时自动滚动到底部
                setTimeout(() => scrollToBottom(), 0);
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '发送消息时出错';
      setError(errorMessage);
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={css.content}>
      {/* 可拖拽的标题栏区域 */}
      <header className={clsx('app-window-drag-handle', css.titleBar)} />
      <div className={css.messagesContainer}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={clsx(css.messageWrapper, message.role === 'user' ? css.userWrapper : css.assistantWrapper)}
          >
            <div className={clsx(css.message, message.role === 'user' ? css.userMessage : css.assistantMessage)}>
              <div className={css.messageContent}>
                <span className={css.messageText}>{message.content}</span>
                {message.role === 'assistant' && message.hasResumeLink && (
                  <button className={css.resumeLinkButton} onClick={openSafari}>
                    查看 4x 的简历
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className={clsx(css.messageWrapper, css.assistantWrapper)}>
            <div className={clsx(css.message, css.assistantMessage)}>
              <div className={css.messageContent}>
                <div className={css.loadingAnimation}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className={css.errorMessage}>
            <span>⚠️ {error}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className={css.inputContainer}>
        <div className={css.quickQuestions}>
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              className={css.quickQuestionButton}
              onClick={() => handleQuickQuestion(question)}
              disabled={isLoading}
            >
              {question}
            </button>
          ))}
        </div>
        <div className={css.inputWrapper}>
          <textarea
            ref={inputRef}
            className={css.input}
            value={inputValue}
            onInput={(e) => setInputValue((e.target as HTMLTextAreaElement).value)}
            onKeyDown={handleKeyPress}
            placeholder="输入消息..."
            disabled={isLoading}
            rows={1}
          />
          <button
            className={clsx(css.sendButton, isLoading && css.sendButtonDisabled)}
            onClick={sendMessage}
            disabled={isLoading || !inputValue.trim()}
            aria-label="发送消息"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TalkTo4x;

export interface ResumeData {
  intro: string;
  experience: string;
  education: string;
  projects: string;
  skills: string;
  contact: {
    role: string;
    location: string;
    phone: string;
    email: string;
  };
}

/**
 * 从 HTML 字符串中提取纯文本内容
 */
const extractText = (html: string): string => {
  // 创建一个临时 DOM 元素来解析 HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // 移除 script 和 style 标签
  const scripts = tempDiv.querySelectorAll('script, style');
  scripts.forEach((el) => el.remove());
  
  // 获取纯文本，保留换行
  let text = tempDiv.textContent || tempDiv.innerText || '';
  
  // 清理多余的空白字符，但保留换行
  text = text
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim();
  
  return text;
};

/**
 * 解析 resume.html 文件内容，提取简历信息
 */
export const parseResume = (htmlContent: string): ResumeData => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  // 提取联系方式
  const contactInfo = doc.querySelector('.contact-info');
  const contactSpans = contactInfo?.querySelectorAll('span') || [];
  const contactValues = Array.from(contactSpans).map((span) => span.textContent?.trim() || '');
  
  // 解析联系方式（按顺序：职位、位置、手机、邮箱）
  const contact = {
    role: contactValues[0] || '产品设计师',
    location: contactValues[1] || '浙江杭州',
    phone: contactValues[2] || '18362976211',
    email: contactValues[3] || 'rriwen@gmail.com',
  };
  
  // 提取个人简介
  const introEl = doc.querySelector('.intro');
  const intro = introEl ? extractText(introEl.innerHTML) : '';
  
  // 提取工作经历
  const experienceSection = Array.from(doc.querySelectorAll('.section')).find(
    (section) => section.querySelector('.section-title')?.textContent?.includes('工作经历')
  );
  
  let experience = '';
  if (experienceSection) {
    const jobItems = experienceSection.querySelectorAll('.job-item');
    experience = Array.from(jobItems)
      .map((item) => {
        const title = item.querySelector('.job-title')?.textContent?.trim() || '';
        const company = item.querySelector('.company')?.textContent?.trim() || '';
        const period = item.querySelector('.period')?.textContent?.trim() || '';
        const description = item.querySelector('.description')?.textContent?.trim() || '';
        const listItems = item.querySelectorAll('li');
        const items = Array.from(listItems).map((li) => extractText(li.innerHTML)).join('\n  ');
        
        return `${title} - ${company} (${period})\n${description ? description + '\n' : ''}${items ? '  ' + items : ''}`;
      })
      .join('\n\n');
  }
  
  // 提取教育经历
  const educationSection = Array.from(doc.querySelectorAll('.section')).find(
    (section) => section.querySelector('.section-title')?.textContent?.includes('教育经历')
  );
  
  let education = '';
  if (educationSection) {
    const educationEl = educationSection.querySelector('.education');
    if (educationEl) {
      const title = educationEl.querySelector('.education-title')?.textContent?.trim() || '';
      const detail = educationEl.querySelector('.education-detail')?.textContent?.trim() || '';
      education = `${title}\n${detail}`;
    }
  }
  
  // 提取项目经历
  const projectsSection = Array.from(doc.querySelectorAll('.section')).find(
    (section) => section.querySelector('.section-title')?.textContent?.includes('项目经历')
  );
  
  let projects = '';
  if (projectsSection) {
    const projectItems = projectsSection.querySelectorAll('.project-item');
    projects = Array.from(projectItems)
      .map((item) => {
        const title = item.querySelector('.job-title')?.textContent?.trim() || '';
        const period = item.querySelector('.period')?.textContent?.trim() || '';
        const listItems = item.querySelectorAll('li');
        const items = Array.from(listItems).map((li) => extractText(li.innerHTML)).join('\n  ');
        
        return `${title}\n背景：${period}\n${items ? '  ' + items : ''}`;
      })
      .join('\n\n');
  }
  
  // 提取专业技能
  const skillsSection = Array.from(doc.querySelectorAll('.section')).find(
    (section) => section.querySelector('.section-title')?.textContent?.includes('专业技能')
  );
  
  let skills = '';
  if (skillsSection) {
    const skillItems = skillsSection.querySelectorAll('.skill-item');
    skills = Array.from(skillItems)
      .map((item) => {
        const title = item.querySelector('.skill-title')?.textContent?.trim() || '';
        const listItems = item.querySelectorAll('li');
        const items = Array.from(listItems).map((li) => extractText(li.innerHTML)).join('\n  ');
        
        return `${title}：\n  ${items}`;
      })
      .join('\n\n');
  }
  
  return {
    intro,
    experience,
    education,
    projects,
    skills,
    contact,
  };
};

/**
 * 从 URL 获取并解析 resume.html
 */
export const fetchAndParseResume = async (): Promise<ResumeData> => {
  try {
    const response = await fetch('/resume.html');
    if (!response.ok) {
      throw new Error(`无法加载简历文件: ${response.status}`);
    }
    const htmlContent = await response.text();
    return parseResume(htmlContent);
  } catch (error) {
    console.error('加载简历文件失败:', error);
    throw error;
  }
};

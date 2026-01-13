export interface WorkExperience {
  company: string;
  role: string;
  period: string;
  description: string[];
  achievements?: string[];
}

export interface ProjectDetail {
  background: string;
  challenge: string;
  solution: string;
  process: string[];
  result: string[];
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  role: string;
  description: string;
  tags: string[];
  metrics: string[];
  imageUrl: string;
  detail: ProjectDetail;
}

export interface SkillCategory {
  title: string;
  items: string[];
}

export interface ContactInfo {
  phone: string;
  email: string;
  location: string;
}
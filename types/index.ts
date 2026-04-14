export interface Project {
  id: string;
  title: string;
  tagline: string;
  stack: string[];
  bullets: string[];
  liveUrl: string;
  githubUrl: string;
  screenshot: string;
  nodePosition: [number, number, number];
}

export interface Skill {
  name: string;
  context: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  nodePosition: [number, number, number];
  skills: Skill[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  dates: string;
  nodePosition: [number, number, number];
  bullets: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  nodePosition: [number, number, number];
}

export interface AboutContact {
  email: string;
  github: string;
  linkedin: string;
}

export interface AboutData {
  intro: string;
  gamingCommunity: string;
  availability: string;
  contact: AboutContact;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  status?: "in-progress" | "shipped";
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

export type GraphNodeKind = "central" | "category" | "leaf";

export type GraphSection =
  | "projects"
  | "skills"
  | "experience"
  | "certifications"
  | "about";

export interface GraphNode {
  id: string;
  label: string;
  displayLabel?: string;
  kind: GraphNodeKind;
  section: GraphSection;
  position: [number, number, number];
  color: string;
  description?: string;
  parentId?: string;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  color: string;
}

"use client";

import { useMemo, useState } from "react";
import about from "../data/about.json";
import certifications from "../data/certifications.json";
import experience from "../data/experience.json";
import projects from "../data/projects.json";
import skills from "../data/skills.json";
import type { GraphEdge, GraphNode } from "@/types";
import type { AboutData, CertificationItem, ExperienceItem, Project, SkillCategory } from "@/types";

export interface NodeGraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  activeNodeId: string | null;
  hoveredNodeId: string | null;
  activeNode: GraphNode | null;
  hoveredNode: GraphNode | null;
  setActiveNodeId: (nodeId: string | null) => void;
  setHoveredNodeId: (nodeId: string | null) => void;
}

const centralColor = "#7f77dd";
const branchColors = {
  projects: "#1d9e75",
  skills: "#378add",
  experience: "#d85a30",
  certifications: "#c8a85d",
  about: "#888780",
};

const branchAnchors: Record<GraphNode["section"], [number, number, number]> = {
  projects: [3.8, 1.0, 0.4],
  skills: [0.4, 3.6, -0.1],
  experience: [-3.8, 0.7, 0.2],
  certifications: [0.8, -3.4, 0.25],
  about: [0.0, -0.5, -3.7],
};

function ringPositions(
  center: [number, number, number],
  count: number,
  radius: number,
  angleOffset = 0,
): Array<[number, number, number]> {
  if (count === 0) {
    return [];
  }

  return Array.from({ length: count }, (_, index) => {
    const angle = angleOffset + (Math.PI * 2 * index) / count;
    const x = center[0] + Math.cos(angle) * radius;
    const y = center[1] + Math.sin(angle) * radius * 0.72;
    const z = center[2] + Math.sin(angle * 1.3) * radius * 0.18;
    return [x, y, z];
  });
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildGraphNodes() {
  const graphNodes: GraphNode[] = [
    {
      id: "central-you",
      label: "YOU",
      kind: "central",
      section: "about",
      position: [0, 0, 0],
      color: centralColor,
      description: "Central identity node",
    },
  ];

  const graphEdges: GraphEdge[] = [];

  const branchNodes: GraphNode[] = [
    {
      id: "branch-projects",
      label: "Projects",
      kind: "category",
      section: "projects",
      position: branchAnchors.projects,
      color: branchColors.projects,
      description: `${projects.length} shipped projects`,
    },
    {
      id: "branch-skills",
      label: "Skills",
      kind: "category",
      section: "skills",
      position: branchAnchors.skills,
      color: branchColors.skills,
      description: `${skills.length} skill categories`,
    },
    {
      id: "branch-experience",
      label: "Experience",
      kind: "category",
      section: "experience",
      position: branchAnchors.experience,
      color: branchColors.experience,
      description: `${experience.length} roles`,
    },
    {
      id: "branch-certifications",
      label: "Certifications",
      kind: "category",
      section: "certifications",
      position: branchAnchors.certifications,
      color: branchColors.certifications,
      description: `${certifications.length} credentials`,
    },
    {
      id: "branch-about",
      label: "About",
      kind: "category",
      section: "about",
      position: branchAnchors.about,
      color: branchColors.about,
      description: "Background, community, and contact",
    },
  ];

  for (const branchNode of branchNodes) {
    graphNodes.push(branchNode);
    graphEdges.push({
      id: `edge-central-${branchNode.id}`,
      from: "central-you",
      to: branchNode.id,
      color: branchNode.color,
    });
  }

  for (const project of projects as Project[]) {
    const projectNode: GraphNode = {
      id: `project-${project.id}`,
      label: project.title,
      kind: "leaf",
      section: "projects",
      position: project.nodePosition,
      color: branchColors.projects,
      description: project.tagline,
      parentId: "branch-projects",
    };

    graphNodes.push(projectNode);
    graphEdges.push({
      id: `edge-projects-${project.id}`,
      from: "branch-projects",
      to: projectNode.id,
      color: branchColors.projects,
    });
  }

  for (const skillGroup of skills as SkillCategory[]) {
    const skillGroupNode: GraphNode = {
      id: `skill-group-${skillGroup.id}`,
      label: skillGroup.category,
      kind: "category",
      section: "skills",
      position: skillGroup.nodePosition,
      color: branchColors.skills,
      description: `${skillGroup.skills.length} skills`,
      parentId: "branch-skills",
    };

    graphNodes.push(skillGroupNode);
    graphEdges.push({
      id: `edge-skills-${skillGroup.id}`,
      from: "branch-skills",
      to: skillGroupNode.id,
      color: branchColors.skills,
    });

    const groupPositions = ringPositions(skillGroup.nodePosition, skillGroup.skills.length, 1.2, Math.PI / 5);

    skillGroup.skills.forEach((skill, index) => {
      const position = groupPositions[index] ?? skillGroup.nodePosition;
      const skillNode: GraphNode = {
        id: `skill-${skillGroup.id}-${slugify(skill.name)}`,
        label: skill.name,
        kind: "leaf",
        section: "skills",
        position,
        color: branchColors.skills,
        description: skill.context,
        parentId: skillGroupNode.id,
      };

      graphNodes.push(skillNode);
      graphEdges.push({
        id: `edge-${skillGroupNode.id}-${skillNode.id}`,
        from: skillGroupNode.id,
        to: skillNode.id,
        color: branchColors.skills,
      });
    });
  }

  for (const item of experience as ExperienceItem[]) {
    const experienceNode: GraphNode = {
      id: `experience-${item.id}`,
      label: item.role,
      kind: "leaf",
      section: "experience",
      position: item.nodePosition,
      color: branchColors.experience,
      description: `${item.company} · ${item.dates}`,
      parentId: "branch-experience",
    };

    graphNodes.push(experienceNode);
    graphEdges.push({
      id: `edge-experience-${item.id}`,
      from: "branch-experience",
      to: experienceNode.id,
      color: branchColors.experience,
    });
  }

  for (const item of certifications as CertificationItem[]) {
    const certificationNode: GraphNode = {
      id: `certification-${item.id}`,
      label: item.name,
      kind: "leaf",
      section: "certifications",
      position: item.nodePosition,
      color: branchColors.certifications,
      description: item.issuer,
      parentId: "branch-certifications",
    };

    graphNodes.push(certificationNode);
    graphEdges.push({
      id: `edge-certification-${item.id}`,
      from: "branch-certifications",
      to: certificationNode.id,
      color: branchColors.certifications,
    });
  }

  const aboutContent: Array<{ id: string; label: string; description: string }> = [
    {
      id: "background",
      label: "Background",
      description: (about as AboutData).intro,
    },
    {
      id: "community",
      label: "Gaming / Community",
      description: (about as AboutData).gamingCommunity,
    },
    {
      id: "contact",
      label: "Contact",
      description: `${(about as AboutData).contact.email} · GitHub · LinkedIn`,
    },
  ];

  const aboutPositions = ringPositions(branchAnchors.about, aboutContent.length, 1.2, Math.PI / 3);

  aboutContent.forEach((item, index) => {
    const position = aboutPositions[index] ?? branchAnchors.about;
    const aboutNode: GraphNode = {
      id: `about-${item.id}`,
      label: item.label,
      kind: "leaf",
      section: "about",
      position,
      color: branchColors.about,
      description: item.description,
      parentId: "branch-about",
    };

    graphNodes.push(aboutNode);
    graphEdges.push({
      id: `edge-about-${item.id}`,
      from: "branch-about",
      to: aboutNode.id,
      color: branchColors.about,
    });
  });

  return { nodes: graphNodes, edges: graphEdges };
}

export function useNodeGraph(): NodeGraphState {
  const [activeNodeId, setActiveNodeId] = useState<string | null>("central-you");
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const { nodes, edges } = useMemo(() => buildGraphNodes(), []);

  const activeNode = nodes.find((node) => node.id === activeNodeId) ?? null;
  const hoveredNode = nodes.find((node) => node.id === hoveredNodeId) ?? null;

  return {
    nodes,
    edges,
    activeNodeId,
    hoveredNodeId,
    activeNode,
    hoveredNode,
    setActiveNodeId,
    setHoveredNodeId,
  };
}

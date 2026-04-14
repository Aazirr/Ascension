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
  canGoBack: boolean;
  setActiveNodeId: (nodeId: string | null) => void;
  setHoveredNodeId: (nodeId: string | null) => void;
  selectNode: (nodeId: string) => void;
  goBack: () => boolean;
}

const centralColor = "#7f77dd";
const branchColors = {
  projects: "#1d9e75",
  skills: "#378add",
  experience: "#d85a30",
  certifications: "#c8a85d",
  about: "#888780",
};

const center: [number, number, number] = [0, 0, 0];

const sectionOrder: GraphNode["section"][] = [
  "projects",
  "skills",
  "experience",
  "certifications",
  "about",
];

function makeBranchAnchors(
  sections: GraphNode["section"][],
  radius: number,
): Record<GraphNode["section"], [number, number, number]> {
  const anchors = {} as Record<GraphNode["section"], [number, number, number]>;
  const startAngle = -Math.PI / 2;
  const step = (Math.PI * 2) / sections.length;

  sections.forEach((section, index) => {
    const angle = startAngle + step * index;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const z = Math.sin(angle * 1.1) * 0.45;
    anchors[section] = [x, y, z];
  });

  return anchors;
}

const branchAnchors = makeBranchAnchors(sectionOrder, 4.6);

function makeChildClusterPositions(
  parent: [number, number, number],
  count: number,
  radius: number,
): Array<[number, number, number]> {
  if (count <= 0) {
    return [];
  }

  const outwardAngle = Math.atan2(parent[1] - center[1], parent[0] - center[0]);

  if (count === 1) {
    return [
      [
        parent[0] + Math.cos(outwardAngle) * radius,
        parent[1] + Math.sin(outwardAngle) * radius,
        parent[2],
      ],
    ];
  }

  const span = Math.min(1.45, 0.34 * (count - 1) + 0.36);

  return Array.from({ length: count }, (_, index) => {
    const t = count === 1 ? 0 : index / (count - 1);
    const angle = outwardAngle - span / 2 + span * t;
    const x = parent[0] + Math.cos(angle) * radius;
    const y = parent[1] + Math.sin(angle) * radius;
    const z = parent[2] + Math.sin(angle * 1.3) * 0.22;
    return [x, y, z];
  });
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
    const projectPositions = makeChildClusterPositions(
      branchAnchors.projects,
      (projects as Project[]).length,
      2.35,
    );

    const projectIndex = (projects as Project[]).findIndex((item) => item.id === project.id);
    const projectNode: GraphNode = {
      id: `project-${project.id}`,
      label: project.title,
      kind: "leaf",
      section: "projects",
      position: projectPositions[projectIndex] ?? project.nodePosition,
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
    const skillCategoryPositions = makeChildClusterPositions(
      branchAnchors.skills,
      (skills as SkillCategory[]).length,
      2.15,
    );

    const categoryIndex = (skills as SkillCategory[]).findIndex(
      (item) => item.id === skillGroup.id,
    );

    const skillGroupNode: GraphNode = {
      id: `skill-group-${skillGroup.id}`,
      label: skillGroup.category,
      kind: "leaf",
      section: "skills",
      position: skillCategoryPositions[categoryIndex] ?? skillGroup.nodePosition,
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
  }

  const experiencePositions = makeChildClusterPositions(
    branchAnchors.experience,
    (experience as ExperienceItem[]).length,
    2.3,
  );

  (experience as ExperienceItem[]).forEach((item, index) => {
    const experienceNode: GraphNode = {
      id: `experience-${item.id}`,
      label: item.role,
      kind: "leaf",
      section: "experience",
      position: experiencePositions[index] ?? item.nodePosition,
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
  });

  const certificationPositions = makeChildClusterPositions(
    branchAnchors.certifications,
    (certifications as CertificationItem[]).length,
    2.25,
  );

  (certifications as CertificationItem[]).forEach((item, index) => {
    const certificationNode: GraphNode = {
      id: `certification-${item.id}`,
      label: item.name,
      kind: "leaf",
      section: "certifications",
      position: certificationPositions[index] ?? item.nodePosition,
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
  });

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

  const aboutPositions = makeChildClusterPositions(
    branchAnchors.about,
    aboutContent.length,
    2.1,
  );

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

  const canGoBack = Boolean(activeNode && activeNode.id !== "central-you");

  const selectNode = (nodeId: string) => {
    setActiveNodeId(nodeId);
  };

  const goBack = (): boolean => {
    if (!activeNode) {
      return false;
    }

    if (activeNode.parentId) {
      setActiveNodeId(activeNode.parentId);
      return true;
    }

    if (activeNode.id !== "central-you") {
      setActiveNodeId("central-you");
      return true;
    }

    return false;
  };

  return {
    nodes,
    edges,
    activeNodeId,
    hoveredNodeId,
    activeNode,
    hoveredNode,
    canGoBack,
    setActiveNodeId,
    setHoveredNodeId,
    selectNode,
    goBack,
  };
}

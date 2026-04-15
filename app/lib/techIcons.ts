const techIconMap: Record<string, string> = {
  react: "/icons/tech/react.svg",
  nextjs: "/icons/tech/nextdotjs.svg",
  typescript: "/icons/tech/typescript.svg",
  tailwindcss: "/icons/tech/tailwindcss.svg",
  nodejs: "/icons/tech/nodedotjs.svg",
  express: "/icons/tech/express.svg",
  postgresql: "/icons/tech/postgresql.svg",
  telegram: "/icons/tech/telegram.svg",
  discord: "/icons/tech/discord.svg",
  railway: "/icons/tech/railway.svg",
  vercel: "/icons/tech/vercel.svg",
  github: "/icons/tech/github.svg",
  googleappsscript: "/icons/tech/googleappsscript.svg",
  anthropic: "/icons/tech/anthropic.svg",
  framermotion: "/icons/tech/framer.svg",
  framer: "/icons/tech/framer.svg",
  pokeapi: "/icons/tech/pokeapi.svg",
  restapi: "/icons/tech/restapi.svg",
  pdfkit: "/icons/tech/pdfkit.svg",
};

const aliases: Record<string, string> = {
  "next.js": "nextjs",
  next: "nextjs",
  "tailwind css": "tailwindcss",
  "node.js": "nodejs",
  "telegram api": "telegram",
  "discord.js": "discord",
  "anthropic api": "anthropic",
  "rest apis": "restapi",
  "google apps script": "googleappsscript",
  "framer motion": "framermotion",
};

const skillGroupIconMap: Record<string, string> = {
  "skill-group-frontend": "/icons/tech/react.svg",
  "skill-group-backend": "/icons/tech/nodedotjs.svg",
  "skill-group-integrations": "/icons/tech/discord.svg",
  "skill-group-tooling": "/icons/tech/github.svg",
};

function normalizeKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function getTechIconPath(label: string): string | null {
  const normalized = normalizeKey(label);
  const canonical = aliases[normalized] ?? normalized;
  const compact = canonical.replace(/[^a-z0-9]/g, "");
  return techIconMap[canonical] ?? techIconMap[compact] ?? null;
}

export function getSkillGroupIconPath(nodeId: string): string | null {
  return skillGroupIconMap[nodeId] ?? null;
}

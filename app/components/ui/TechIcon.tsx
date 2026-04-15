import Image from "next/image";
import { getTechIconPath } from "@/app/lib/techIcons";

interface TechIconProps {
  name: string;
  size?: number;
  className?: string;
}

export default function TechIcon({
  name,
  size = 16,
  className = "",
}: TechIconProps) {
  const iconPath = getTechIconPath(name);

  if (!iconPath) {
    return null;
  }

  return (
    <Image
      src={iconPath}
      alt={`${name} icon`}
      width={size}
      height={size}
      className={className}
    />
  );
}

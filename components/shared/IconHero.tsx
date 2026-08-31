import type { IconName } from "@/lib/icons";
import { iconMap } from "@/lib/icons";

export interface IconHeroProps {
  icon: IconName;
  title: string;
  subtitle?: string;
}

export default function IconHero({ icon, title, subtitle }: IconHeroProps) {
  const Icon = iconMap[icon];
  return (
    <div className="text-center mb-12 animate-fade-in">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-accent rounded-full mb-6">
        <Icon className="w-10 h-10 text-white" />
      </div>
      <h1 className="font-heading font-bold text-4xl md:text-5xl text-primary mb-4">
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}

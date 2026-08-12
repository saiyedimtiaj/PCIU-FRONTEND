import { cn } from "@/lib/utils";
import type { ManagementMember } from "@/types/management";

function roleClasses(role: string) {
  if (role === "Chairman") return "bg-highlight/15 text-highlight";
  if (role === "Member Secretary") return "bg-accent/15 text-accent";
  return "bg-primary/10 text-primary";
}

export default function MemberCard({ member }: { member: ManagementMember }) {
  const initial = member.name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.|Prof\.|Engr\.)\s*/g, "")[0];

  return (
    <div className="relative rounded-xl border border-border bg-card p-5">
      <div className="relative w-14 h-14 mb-4">
        <div className="w-14 h-14 rounded-full bg-primary/10 text-primary font-heading font-bold text-lg flex items-center justify-center">
          {initial}
        </div>
        <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center border-2 border-card">
          {member.serial}
        </span>
      </div>
      <h3 className="font-semibold text-foreground text-sm mb-1">{member.name}</h3>
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{member.designation}</p>
      <span
        className={cn(
          "inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium",
          roleClasses(member.role)
        )}
      >
        {member.role}
      </span>
    </div>
  );
}

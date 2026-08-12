import { cn } from "@/lib/utils";
import type { ManagementMember } from "@/types/management";

function roleClasses(role: string) {
  if (role === "Chairman") return "bg-highlight/15 text-highlight";
  if (role === "Member Secretary") return "bg-accent/15 text-accent";
  return "bg-primary/10 text-primary";
}

export default function MemberTable({ members }: { members: ManagementMember[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="w-12 px-4 py-3">SL</th>
            <th className="px-4 py-3">Member</th>
            <th className="hidden md:table-cell px-4 py-3">Designation</th>
            <th className="px-4 py-3">Role</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, idx) => (
            <tr
              key={member.serial}
              className={cn("border-t border-border", idx % 2 === 0 && "bg-muted/20")}
            >
              <td className="px-4 py-3 text-muted-foreground">{member.serial}</td>
              <td className="px-4 py-3 font-medium text-foreground">{member.name}</td>
              <td className="hidden md:table-cell px-4 py-3 text-muted-foreground">
                {member.designation}
              </td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                    roleClasses(member.role)
                  )}
                >
                  {member.role}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { Globe } from "lucide-react";
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaXTwitter, FaYoutube } from "react-icons/fa6";
import type { ClubSocialLink } from "@/types/clubs";

const ICONS: { match: RegExp; Icon: typeof Globe }[] = [
  { match: /facebook|fb\.com/i, Icon: FaFacebook as unknown as typeof Globe },
  { match: /linkedin/i, Icon: FaLinkedin as unknown as typeof Globe },
  { match: /instagram/i, Icon: FaInstagram as unknown as typeof Globe },
  { match: /youtube|youtu\.be/i, Icon: FaYoutube as unknown as typeof Globe },
  { match: /twitter|x\.com|^x$/i, Icon: FaXTwitter as unknown as typeof Globe },
  { match: /github/i, Icon: FaGithub as unknown as typeof Globe },
];

/** Picks a brand icon from the link's title or URL; a globe otherwise. */
function iconFor(link: ClubSocialLink) {
  return ICONS.find(({ match }) => match.test(link.title) || match.test(link.url))?.Icon ?? Globe;
}

export default function SocialLinks({ links }: { links: ClubSocialLink[] }) {
  if (links.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => {
        const Icon = iconFor(link);
        return (
          <a
            key={`${link.title}-${link.url}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.title}
            title={link.title}
            className="flex size-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white hover:text-primary"
          >
            <Icon className="size-4" />
          </a>
        );
      })}
    </div>
  );
}

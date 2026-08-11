import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import vcMessageData from "@/content/home/vc-message.json";
import type { VCMessageContent } from "@/types/home";

const vc = vcMessageData as VCMessageContent;

export default function VCMessage() {
  return (
    <section
      className="py-16 md:py-20"
      style={{
        background:
          "linear-gradient(135deg, hsl(340 80% 95%), hsl(210 60% 92%), hsl(200 70% 90%))",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Left: VC Photo */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="relative w-44 h-52 md:w-52 md:h-60 rounded-xl overflow-hidden border-4 border-white/25 shadow-lg">
              <Image
                src={vc.photo}
                alt="Vice Chancellor, Port City International University"
                fill
                sizes="(min-width: 768px) 208px, 176px"
                className="object-cover object-top"
              />
            </div>
            <h3 className="font-heading font-semibold text-base text-foreground mt-4 text-center">
              {vc.name}
            </h3>
            <p className="text-muted-foreground text-sm text-center">{vc.title}</p>
          </div>

          {/* Right: Message */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-1 tracking-wide uppercase text-foreground">
              Vice Chancellor&apos;s Message
            </h2>
            <div className="w-16 h-1 bg-highlight mb-5 rounded-full mx-auto md:mx-0" />
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6">
              {vc.message}
            </p>
            <Button
              variant="highlight"
              size="cta"
              nativeButton={false}
              render={<Link href="/vice-chancellors-message" />}
            >
              Read More <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

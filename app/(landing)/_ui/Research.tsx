import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { iconMap } from "@/lib/icons";
import researchData from "@/content/home/research.json";
import type { ResearchContent } from "@/types/home";

const research = researchData as ResearchContent;

export default function Research() {
  return (
    <section
      className="py-20 bg-linear-to-br from-accent/5 via-secondary/10 to-primary/5"
      id="research"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-primary mb-4">
            Research Excellence
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advancing innovation from coast to campus
          </p>
        </div>

        {/* Research Image & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="relative rounded-2xl overflow-hidden shadow-lg min-h-80">
            <Image
              src={research.image}
              alt="Students and professors conducting research in modern laboratory"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-primary/80 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h3 className="font-heading font-bold text-2xl mb-2">
                State-of-the-Art Facilities
              </h3>
              <p className="text-white/90">
                Equipped with cutting-edge technology for groundbreaking research
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {research.stats.map((stat) => {
              const Icon = iconMap[stat.icon];
              return (
                <Card
                  key={stat.label}
                  className="text-center hover:shadow-lg transition-all duration-300 border border-white/30 bg-white/20 backdrop-blur-md shadow-lg hover:border-accent hover:bg-white/30"
                >
                  <CardContent className="p-6">
                    <Icon className="w-10 h-10 text-accent mx-auto mb-4" />
                    <div className="font-heading font-bold text-4xl text-primary mb-2">
                      {stat.value}
                    </div>
                    <div className="text-muted-foreground font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Research Highlights */}
        <div className="mb-12">
          <h3 className="font-heading font-bold text-3xl text-primary mb-8 text-center">
            Featured Research Centers
          </h3>
          <div className="max-w-md mx-auto">
            {research.highlights.map((highlight) => (
              <Card
                key={highlight.title}
                className="hover:shadow-xl transition-all duration-300 border border-white/30 bg-white/20 backdrop-blur-md shadow-lg hover:border-secondary hover:bg-white/30"
              >
                <CardContent className="p-6">
                  <h4 className="font-heading font-semibold text-xl text-primary mb-3">
                    {highlight.title}
                  </h4>
                  <p className="text-muted-foreground mb-4">{highlight.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {highlight.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-accent-light text-accent px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button variant="secondary" size="cta">
            Explore Research
          </Button>
        </div>
      </div>
    </section>
  );
}

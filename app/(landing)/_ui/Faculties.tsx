import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { iconMap } from "@/lib/icons";
import facultiesData from "@/content/home/faculties.json";
import type { Faculty } from "@/types/home";

const faculties = facultiesData as Faculty[];

export default function Faculties() {
  return (
    <section
      className="py-20 bg-linear-to-br from-primary/5 via-secondary/10 to-accent/5"
      id="faculties"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-primary mb-4">
            Our Faculties
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore academic excellence across diverse disciplines
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {faculties.map((faculty) => {
            const Icon = iconMap[faculty.icon];
            return (
              <Card
                key={faculty.id}
                className="group hover:shadow-xl transition-all duration-300 border border-white/20 shadow-lg hover:border-secondary overflow-hidden relative flex flex-col"
              >
                {/* Background image */}
                <Image
                  src={faculty.bg}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Light overlay for text readability */}
                <div className="absolute inset-0 bg-white/40 group-hover:bg-white/30 transition-all duration-300" />

                <CardContent className="p-5 relative z-10 flex flex-col flex-1">
                  <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-primary mb-2">
                    {faculty.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">{faculty.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {faculty.departments.map((dept) => (
                      <span
                        key={dept}
                        className="text-[11px] bg-secondary-light text-secondary px-2 py-0.5 rounded-full"
                      >
                        {dept}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto">
                    <Button
                      variant="outlineSecondary"
                      size="sm"
                      className="w-full"
                      nativeButton={false}
                      render={<Link href={`/faculties?faculty=${faculty.id}`} />}
                    >
                      Explore Faculty
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

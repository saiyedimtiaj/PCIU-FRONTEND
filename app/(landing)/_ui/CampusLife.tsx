import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { iconMap } from "@/lib/icons";
import campusLifeData from "@/content/home/campus-life.json";
import type { CampusLifeContent } from "@/types/home";

const campusLife = campusLifeData as CampusLifeContent;

export default function CampusLife() {
  return (
    <section
      className="py-20 bg-linear-to-br from-primary/5 via-accent/10 to-secondary/5"
      id="campus-life"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-primary mb-4">
            Campus Life
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Grow, explore, and lead beyond the classroom
          </p>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="relative rounded-2xl overflow-hidden shadow-lg group h-96">
            <Image
              src={campusLife.libraryImage}
              alt="Students collaborating in university library"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-6 left-6 right-6 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <h3 className="font-heading font-bold text-xl">Academic Excellence</h3>
              <p className="text-white/90">World-class learning environments</p>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-lg group h-96">
            <Image
              src={campusLife.sportsImage}
              alt="Students playing football on modern sports field"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-accent/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-6 left-6 right-6 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <h3 className="font-heading font-bold text-xl">Athletic Excellence</h3>
              <p className="text-white/90">State-of-the-art sports facilities</p>
            </div>
          </div>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
          {campusLife.activities.map((activity) => {
            const Icon = iconMap[activity.icon];
            return (
              <Card
                key={activity.title}
                className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-white/30 bg-white/20 backdrop-blur-md shadow-lg hover:border-accent hover:bg-white/30"
              >
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-primary mb-2">{activity.title}</h3>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Video Section */}
        <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-8 shadow-lg text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="font-heading font-bold text-2xl text-primary mb-4">
              Experience PCIU Life
            </h3>
            <p className="text-muted-foreground mb-6">
              Watch our campus tour to see what makes Port City International University a
              vibrant community
            </p>
            <Button variant="highlight" size="cta">
              Watch Campus Tour
            </Button>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button variant="outlineSecondary" size="cta">
            Explore Student Life
          </Button>
        </div>
      </div>
    </section>
  );
}

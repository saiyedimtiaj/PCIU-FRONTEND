import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { iconMap } from "@/lib/icons";
import admissionsData from "@/content/home/admissions.json";
import type { AdmissionsContent } from "@/types/home";

const admissions = admissionsData as AdmissionsContent;

export default function Admissions() {
  return (
    <section
      className="py-20 bg-linear-to-br from-[hsl(210,70%,45%)] via-[hsl(200,65%,48%)] to-[hsl(185,75%,45%)] text-white relative overflow-hidden"
      id="admissions"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block bg-highlight text-highlight-foreground px-6 py-2 rounded-full font-semibold mb-4">
            {admissions.badge}
          </div>
          <h2 className="font-heading font-bold text-4xl md:text-5xl mb-4">
            {admissions.heading}
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">{admissions.subheading}</p>
        </div>

        {/* Two Column Layout for Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {admissions.cards.map((card) => {
            const Icon = iconMap[card.icon];
            return (
              <Card
                key={card.title}
                className="bg-white/25 backdrop-blur-md border-white/40 hover:bg-white/35 transition-all shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Icon className="w-12 h-12 text-accent shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-heading font-bold text-xl mb-2 text-white">
                        {card.title}
                      </h3>
                      <p className="text-white/90 text-sm mb-4">{card.description}</p>
                      <Button variant={card.buttonVariant}>
                        {card.buttonText}
                        {card.buttonVariant === "highlight" && (
                          <ArrowRight className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Tuition Info */}
          <div className="bg-white/25 backdrop-blur-md rounded-lg p-6 border border-white/40 flex flex-col justify-center shadow-lg">
            <p className="text-white font-medium mb-4">{admissions.tuitionNote}</p>
            <Button variant="accent" className="w-fit">
              {admissions.tuitionButtonText}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import {
  ScrollText,
  Hash,
  AlignLeft,
  BookOpen,
  Image as ImageIcon,
  Quote,
  FileText,
  Globe,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SECTIONS = [
  {
    icon: Hash,
    title: "Title",
    body: "It should be brief and very specific.",
  },
  {
    icon: AlignLeft,
    title: "Abstract",
    body: "Each full paper should have an Abstract containing concisely the principal findings and should not exceed 150 words.",
  },
  {
    icon: BookOpen,
    title: "Key Words",
    body: "There should be a maximum of five key words placed after the Abstract section.",
  },
  {
    icon: AlignLeft,
    title: "Body of the Text",
    body: "The text of the paper should be clear and précised. It should include Introduction, Materials and Methods, Results and Discussion. The Results and Discussion should not be separated. Taxonomic papers (where descriptive accounts are provided) must be written in a concise telegraphic style. Only scientific names (Generic and Specific) must be italicized when computer composed or single underlined when typed.",
  },
  {
    icon: ImageIcon,
    title: "Tables, Graphs, Photographs, Line Drawings, Figures",
    body: "Number of tables, graphs, photographs, line drawings and figures should be minimum. The same data should not be used in both tables and graphs. Tables should be typed on separate pages. Figures and graphs should be drawn with Indian ink on tracing paper and properly labelled with bold solid lines so they can be reduced to half or less than half of their original size. The scale of a figure (when required) must be indicated by a scale line on the drawing itself. Legends for plates (if any) should be typed on a separate page. Photographs should be submitted on glossy paper or JPEG format. Black-and-white photographs are acceptable. Color photographs may be submitted for black-and-white printing; for color printing the author(s) will bear the expenses for color reproduction.",
  },
  {
    icon: Quote,
    title: "References",
    body: "In the text, references should be given within brackets with a comma between the author(s) name and the year; two or more references should be separated by a semicolon. References at the end of the text should be arranged alphabetically beginning with the author(s) name(s) followed by the year of publication, title of the paper, abbreviated name of the journal, volume, part/issue number in parentheses and page numbers. For books, the publisher's name should be given. Book titles must be italicized (or single underlined when typed). Two papers published by the same author in one year must be cited as Hinton (1967a) and Hinton (1967b). Journal titles must be abbreviated and italicized. The volume number of the journal must be bold (computer composed) or double underlined (typed).",
  },
];

const REFERENCE_EXAMPLES = [
  {
    label: "Journal",
    items: [
      "Siddique, R. 2004. Another Assumed Ideal from the West? The Dhaka University Studies, 61(1): 15-26.",
      "Breen, M. and Caudlin, C.N. 1980. The essentials of communicative curriculum in language teaching. Applied Linguistics, 1(2): 89-112.",
      "Lindsay, W.L., Frazier, A.W. and Stephenson, A. 1962. Identification of reaction products from phosphate fertilizers in soils. Soil Sci. Soc Am. Proc. 26: 446-452.",
      "Anwar, M.N., Manchur M.A. and Hossain M.T. 2002. Cellulose degrading Actinomycetes. J. Microbiol, 8(1): 72.",
    ],
  },
  {
    label: "Edited Books",
    items: [
      "Gilmour, J.S.L. 1940. Taxonomy and Philosophy. In: The New Systematics (J.S. Huxley ed.). Clarendon Press, Oxford, pp. 461-474.",
    ],
  },
  {
    label: "Website",
    items: ["http://www.dfid.gov.uk"],
  },
];

export const metadata: Metadata = {
  title: "Call For Paper — Guidelines | Port City International University",
  description: "Manuscript preparation and submission guidelines for the Port City Journal.",
};

export default function CallForPaperGuidelinesPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative h-[280px] flex items-center justify-center overflow-hidden bg-linear-to-br from-primary to-secondary">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
            <ScrollText className="size-8 text-white" />
          </div>
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-white mb-2">
            Call For Paper — Guidelines
          </h1>
          <p className="text-white/80">Manuscript preparation &amp; submission rules</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-6">
        <Card>
          <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              The Port City Journal accepts original manuscripts across Science, Arts, Social
              Science, Law and Business Administration. Authors are requested to follow the
              formatting rules below closely to avoid delays in the review process.
            </p>
            <p>
              Manuscripts should be typed in double space with adequate margins on standard page
              dimensions, and should not exceed ten pages including tables, figures and
              references. Submissions should be made in triplicate; upon acceptance, authors will
              be asked to provide a final copy on CD or via email.
            </p>
            <p>
              The first page should contain the title, author name(s), affiliation, and
              correspondence details. The second page should repeat the title followed by the
              Abstract and Key Words. Subsequent pages should contain the main body of the text,
              followed by Acknowledgements (if any) and References.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-5">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.title} className="hover:shadow-md transition-shadow">
                <CardContent>
                  <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-3">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{section.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{section.body}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardContent>
            <h2 className="font-heading font-bold text-xl text-foreground mb-2 flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              Reference Style Examples
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Format references according to the following examples based on source type:
            </p>
            <div className="space-y-5">
              {REFERENCE_EXAMPLES.map((example) => {
                const Icon = example.label === "Website" ? Globe : BookOpen;
                return (
                  <div key={example.label}>
                    <p className="font-semibold text-foreground flex items-center gap-2 mb-2">
                      <Icon className="size-4 text-primary" />
                      {example.label}
                    </p>
                    <ul className="space-y-1.5">
                      {example.items.map((item) => (
                        <li
                          key={item}
                          className="text-sm text-muted-foreground border-l-2 border-border pl-3"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="font-heading font-bold text-xl text-foreground mb-2 flex items-center gap-2">
              <MessageSquare className="size-5 text-primary" />
              Short Communication
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Short communications should not exceed four pages including tables and figures, and
              should be written as continuous prose without subheadings. They should present
              focused, preliminary, or novel findings that merit rapid publication.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground">
          <CardContent>
            <h2 className="font-heading font-bold text-xl mb-2 flex items-center gap-2">
              <ShieldCheck className="size-5" />
              Declaration
            </h2>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Authors must certify that the submitted manuscript is original, has not been
              published elsewhere, and is not under consideration by any other journal. The
              journal reserves the right to reprint published articles for academic purposes.
              The editorial board&apos;s decision on acceptance is final, and the board is not
              responsible for the views expressed by individual authors.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

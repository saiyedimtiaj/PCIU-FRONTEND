import { AlertTriangle, CheckCircle } from "lucide-react";
import InfoCard from "@/components/shared/InfoCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AcademicsPageContent } from "@/types/academics";

export default function ResultGradingSection({
  content,
}: {
  content: AcademicsPageContent["resultGrading"];
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-bold text-2xl text-foreground mb-1">
          Rules &amp; Grading System
        </h2>
        <p className="text-sm text-muted-foreground">
          Academic rules, discipline policy, and the evaluation &amp; grading system.
        </p>
      </div>

      <InfoCard className="border-l-4 border-l-primary">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Non-Smoking &amp; Non-Political Institution —</strong>{" "}
          Port City International University attaches top priority to maintain a healthy academic
          environment in the campus. Students are expected to cooperate in achieving this goal.
        </p>
      </InfoCard>

      <InfoCard title="Class Attendance">
        <p className="text-sm text-muted-foreground">
          A student is expected to attend all the classes in each course. Maximum 30% absence in a
          course in one trimester may be exempted under emergency situation. It is the
          responsibility of the student to keep the course teacher informed regarding absence from
          classes. A student may be dropped from a course for absence from three consecutive
          classes without sufficient reasons.
        </p>
      </InfoCard>

      <InfoCard title="Dress Code for Students">
        <p className="text-sm text-muted-foreground mb-3">
          Students are advised not to enter the university campus or classroom in the following
          attire:
        </p>
        <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-5">
          {content.dressCodeViolations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </InfoCard>

      <InfoCard title="Library Code">
        <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-5">
          {content.libraryCode.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </InfoCard>

      <InfoCard title="Violation of Discipline">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <p className="font-medium text-destructive text-sm mb-2">Major Offenses</p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {content.majorOffenses.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="size-1.5 rounded-full bg-destructive shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium text-highlight text-sm mb-2">Minor Offenses</p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {content.minorOffenses.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="size-1.5 rounded-full bg-highlight shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-destructive/10 text-destructive text-sm p-4">
          <strong>Disciplinary Actions: </strong>
          Cancellation of a trimester; Temporary suspension from the university; Expulsion from
          the university.
        </div>
      </InfoCard>

      <div className="border-t-4 border-accent pt-6">
        <h2 className="font-heading font-bold text-xl text-foreground mb-1">
          Evaluation &amp; Grading System
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Evaluation procedures, marks distribution, and grading scale.
        </p>
      </div>

      <InfoCard title="Evaluation – Theory Courses (All Programs)">
        <p className="text-sm text-muted-foreground mb-4">
          Marks are distributed across two parts of the trimester as follows:
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Component</TableHead>
              <TableHead>1st Part</TableHead>
              <TableHead>2nd Part</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Case/Assignment</TableCell>
              <TableCell>5%</TableCell>
              <TableCell>5%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Class Test</TableCell>
              <TableCell>5%</TableCell>
              <TableCell>5%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Midterm</TableCell>
              <TableCell>30%</TableCell>
              <TableCell>—</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Trimester Final</TableCell>
              <TableCell>—</TableCell>
              <TableCell>40%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Attendance</TableCell>
              <TableCell colSpan={2}>10%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <CheckCircle className="size-4 text-primary shrink-0 mt-0.5" />
            For a 3 credit hours course, minimum four class tests are taken and best three
            considered.
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="size-4 text-primary shrink-0 mt-0.5" />
            For 1/2 credit hours course, minimum three class tests are taken and best two
            considered.
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="size-4 text-primary shrink-0 mt-0.5" />
            After midterm, the 1st part is considered completed and not carried for trimester
            final.
          </li>
        </ul>
      </InfoCard>

      <InfoCard title="Grading Scale">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Marks Range</TableHead>
              <TableHead>Letter Grade</TableHead>
              <TableHead>Grade Point</TableHead>
              <TableHead>Interpretation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {content.grades.map((g) => (
              <TableRow key={g.letter}>
                <TableCell>{g.range}</TableCell>
                <TableCell className="font-semibold text-foreground">{g.letter}</TableCell>
                <TableCell>{g.point}</TableCell>
                <TableCell className="text-muted-foreground">{g.meaning}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </InfoCard>

      <InfoCard title="Marks of Class Attendance">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {content.attendanceMarks.map((a) => (
            <div key={a.range} className="text-center rounded-lg bg-muted p-3">
              <p className="font-heading font-bold text-foreground">{a.marks}</p>
              <p className="text-xs text-muted-foreground">{a.range}</p>
            </div>
          ))}
        </div>
      </InfoCard>

      <InfoCard title="GPA / CGPA Calculation">
        <p className="text-sm text-muted-foreground mb-3">
          Grade Point Average (GPA) is calculated as the credit-weighted average of grade points
          earned across courses in a trimester. Cumulative GPA (CGPA) applies the same formula
          across all completed trimesters.
        </p>
        <div className="rounded-lg bg-muted px-4 py-3 font-mono text-sm text-foreground mb-3">
          GPA = Σ(Credit × Grade Point) / Σ(Credit)
        </div>
        <p className="text-sm text-muted-foreground">
          Example: Grade point 4.0 in a 3 credit course + 3.0 in 1.5 credit course: GPA = (3×4.0 +
          1.5×3.0) / (3+1.5) = 16.5/4.5 = 3.67
        </p>
      </InfoCard>

      <InfoCard title="Earned Credit & Probation">
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <CheckCircle className="size-4 text-primary shrink-0 mt-0.5" />
            Courses with grade &quot;D&quot; or higher count as earned credits.
          </li>
          <li className="flex items-start gap-2">
            <AlertTriangle className="size-4 text-destructive shrink-0 mt-0.5" />
            &quot;F&quot; grade courses must be repeated and are not counted for GPA.
          </li>
          <li className="flex items-start gap-2">
            <AlertTriangle className="size-4 text-destructive shrink-0 mt-0.5" />
            Academic Probation: Students with GPA less than 2.50 are placed under probation for
            one trimester.
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="size-4 text-primary shrink-0 mt-0.5" />
            No student is allowed to repeat/retake a course more than three times.
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="size-4 text-primary shrink-0 mt-0.5" />
            Repeating a course requires full course fee and attendance as a regular student.
          </li>
        </ul>
      </InfoCard>

      <InfoCard title="Course Monitoring">
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>All courses assigned by Academic Committee of the respective department.</li>
          <li>
            Course teacher provides a course outline with textbook list and probable test dates.
          </li>
          <li>Academic Committee monitors progress by meeting at least once a month.</li>
          <li>Results published within 1 week of last examination.</li>
        </ul>
      </InfoCard>

      <InfoCard title="Specialization & Internship/Thesis">
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            Specialization: Provides in-depth understanding on a specialized subject area.
          </li>
          <li>
            All foundation and core courses must be completed before taking specialization
            courses.
          </li>
          <li>
            Internship/Thesis: Provides adequate training for students pursuing a career in
            specialized areas.
          </li>
        </ul>
      </InfoCard>
    </div>
  );
}

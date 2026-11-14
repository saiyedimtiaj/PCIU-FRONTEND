import { createElement } from "react";
import {
  Bike,
  ChessKnight,
  Dumbbell,
  Goal,
  Swords,
  Target,
  Trophy,
  Volleyball,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

/** Icon per team `sport` enum; unknown sports get a trophy. */
const SPORT_ICONS: Record<string, LucideIcon> = {
  CHESS: ChessKnight,
  FOOTBALL: Goal,
  SOCCER: Goal,
  HANDBALL: Goal,
  VOLLEYBALL: Volleyball,
  CYCLING: Bike,
  ARCHERY: Target,
  SHOOTING: Target,
  DARTS: Target,
  FENCING: Swords,
  WEIGHTLIFTING: Dumbbell,
  BODYBUILDING: Dumbbell,
};

export default function SportIcon({ sport, ...props }: LucideProps & { sport: string }) {
  return createElement(SPORT_ICONS[sport] ?? Trophy, { "aria-hidden": true, ...props });
}

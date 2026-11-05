/** A PCIU sports team as the public /sports page renders it. */
export interface SportsTeam {
  id: number;
  name: string;
  slug: string;
  /** Free-form team type ("Men's", "Women's", ...) — null when unset. */
  type: string | null;
  /** Raw API enum ("CHESS", "TABLE_TENNIS") — used for icon lookup. */
  sport: string;
  /** Display label derived from `sport` ("Table Tennis"). */
  sportLabel: string;
  logo: string | null;
  banner: string | null;
  description: string;
}

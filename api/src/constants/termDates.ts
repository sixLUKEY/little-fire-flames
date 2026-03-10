/**
 * South African public school term dates (four terms per year).
 * Structure is consistent; exact dates may be updated annually by the education department.
 */

export const TERM_NUMBERS = [1, 2, 3, 4] as const;
export type TermNumber = (typeof TERM_NUMBERS)[number];

export interface TermDateRange {
  term: TermNumber;
  year: number;
  startDate: string; // ISO date
  endDate: string;
  label: string;    // e.g. "15 Jan – 28 Mar"
}

/** SA term date ranges for a given year (public schools). */
export const SA_TERM_DATES: Record<TermNumber, { startMonth: number; startDay: number; endMonth: number; endDay: number }> = {
  1: { startMonth: 1, startDay: 15, endMonth: 3, endDay: 28 },
  2: { startMonth: 4, startDay: 8, endMonth: 6, endDay: 27 },
  3: { startMonth: 7, startDay: 22, endMonth: 10, endDay: 3 },
  4: { startMonth: 10, startDay: 13, endMonth: 12, endDay: 12 },
};

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function getTermDateRange(term: TermNumber, year: number): TermDateRange {
  const config = SA_TERM_DATES[term];
  const startDate = `${year}-${pad(config.startMonth)}-${pad(config.startDay)}`;
  const endDate = `${year}-${pad(config.endMonth)}-${pad(config.endDay)}`;
  const label = `${config.startDay} ${monthName(config.startMonth)} – ${config.endDay} ${monthName(config.endMonth)} ${year}`;
  return { term, year, startDate, endDate, label };
}

function monthName(month: number): string {
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return names[month - 1] ?? '';
}

export function getAllTermDateRanges(year: number): TermDateRange[] {
  return TERM_NUMBERS.map((t) => getTermDateRange(t, year));
}

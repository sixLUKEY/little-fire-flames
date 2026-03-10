/**
 * Hardcoded term periods (South African school terms). Adjust dates here as needed.
 * Term numbers are 1–4; year is the calendar year.
 */
export interface TermPeriod {
  term: number;
  year: number;
  label: string;
}

const PERIODS_BY_YEAR: Record<number, Record<number, string>> = {
  2024: {
    1: '15 Jan – 28 Mar 2024',
    2: '8 Apr – 27 Jun 2024',
    3: '22 Jul – 3 Oct 2024',
    4: '13 Oct – 12 Dec 2024',
  },
  2025: {
    1: '15 Jan – 28 Mar 2025',
    2: '8 Apr – 27 Jun 2025',
    3: '22 Jul – 3 Oct 2025',
    4: '13 Oct – 12 Dec 2025',
  },
  2026: {
    1: '15 Jan – 28 Mar 2026',
    2: '8 Apr – 27 Jun 2026',
    3: '22 Jul – 3 Oct 2026',
    4: '13 Oct – 12 Dec 2026',
  },
};

export function getTermLabel(term: number, year: number): string {
  return PERIODS_BY_YEAR[year]?.[term] ?? `Term ${term} ${year}`;
}

export function getYearsAvailable(): number[] {
  return Object.keys(PERIODS_BY_YEAR)
    .map(Number)
    .sort((a, b) => b - a);
}

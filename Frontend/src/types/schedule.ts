export interface SlotInfo {
  subject: string;
  teacher: string;
  room: string;
  is_flow: boolean;
  shift: number;
}

export interface PairData {
  pair: number;
  slots: Record<string, SlotInfo | null>;
}

export interface DayData {
  day_name: string;
  pairs: PairData[];
}

export interface WeekData {
  week_number: number;
  days: DayData[];
}

export interface SemesterData {
  groups: string[];
  teachers: string[];
  weeks: WeekData[];
}

export interface ScheduleData {
  semesters: Record<string, SemesterData>;
}

export interface ValidationError {
  sheet: string;
  excel_row: number | null;
  column: string | null;
  code: string;
  message: string;
  evidence: string;
}

export interface ValidationReport {
  summary: {
    errors: number;
    warnings: number;
    notes: number;
  };
  errors: ValidationError[];
  warnings: ValidationError[];
  notes: string[];
  rules_feedback: {
    params: string[];
    hard: string[];
    soft: string[];
    issues: string[];
    suggestions: string[];
  };
}

export interface ProcessResponse {
  ok: boolean;
  stage: string;
  data?: ScheduleData;
  report?: ValidationReport;
  warnings?: Record<string, string[]>;
}

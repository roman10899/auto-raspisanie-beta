import { ChevronLeft, ChevronRight, Users, GraduationCap, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ScheduleFiltersProps {
  semesters: string[];
  selectedSemester: string;
  onSemesterChange: (semester: string) => void;
  weeks: number[];
  selectedWeek: number;
  onWeekChange: (week: number) => void;
  groups: string[];
  selectedGroup: string;
  onGroupChange: (group: string) => void;
  teachers: string[];
  selectedTeacher: string;
  onTeacherChange: (teacher: string) => void;
}

export function ScheduleFilters({
  semesters,
  selectedSemester,
  onSemesterChange,
  weeks,
  selectedWeek,
  onWeekChange,
  groups,
  selectedGroup,
  onGroupChange,
  teachers,
  selectedTeacher,
  onTeacherChange,
}: ScheduleFiltersProps) {
  const handlePrevWeek = () => {
    const idx = weeks.indexOf(selectedWeek);
    if (idx > 0) onWeekChange(weeks[idx - 1]);
  };

  const handleNextWeek = () => {
    const idx = weeks.indexOf(selectedWeek);
    if (idx < weeks.length - 1) onWeekChange(weeks[idx + 1]);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-xl border border-border">
      {/* Semester */}
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <Select value={selectedSemester} onValueChange={onSemesterChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Семестр" />
          </SelectTrigger>
          <SelectContent>
            {semesters.map((sem) => (
              <SelectItem key={sem} value={sem}>
                {sem} семестр
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Week navigation */}
      <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handlePrevWeek}
          disabled={weeks.indexOf(selectedWeek) === 0}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Select value={String(selectedWeek)} onValueChange={(v) => onWeekChange(Number(v))}>
          <SelectTrigger className="w-[120px] border-0 bg-transparent">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {weeks.map((week) => (
              <SelectItem key={week} value={String(week)}>
                Неделя {week}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleNextWeek}
          disabled={weeks.indexOf(selectedWeek) === weeks.length - 1}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="h-8 w-px bg-border hidden sm:block" />

      {/* Group filter */}
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-muted-foreground" />
        <Select value={selectedGroup} onValueChange={onGroupChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Все группы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все группы</SelectItem>
            {groups.map((group) => (
              <SelectItem key={group} value={group}>
                {group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Teacher filter */}
      <div className="flex items-center gap-2">
        <GraduationCap className="w-4 h-4 text-muted-foreground" />
        <Select value={selectedTeacher} onValueChange={onTeacherChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Все преподаватели" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все преподаватели</SelectItem>
            {teachers.map((teacher) => (
              <SelectItem key={teacher} value={teacher}>
                {teacher}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

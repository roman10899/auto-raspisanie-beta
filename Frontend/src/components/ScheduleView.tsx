import { useState, useMemo } from 'react';
import { ScheduleData } from '@/types/schedule';
import { ScheduleFilters } from './ScheduleFilters';
import { ScheduleTable } from './ScheduleTable';
import { AlertTriangle, CheckCircle2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScheduleViewProps {
  data: ScheduleData;
  warnings: Record<string, string[]>;
}

export function ScheduleView({ data, warnings }: ScheduleViewProps) {
  const semesters = Object.keys(data.semesters).sort();
  const [selectedSemester, setSelectedSemester] = useState(semesters[0] || '1');

  const semesterData = data.semesters[selectedSemester];
  const weeks = semesterData?.weeks.map(w => w.week_number) || [];
  const [selectedWeek, setSelectedWeek] = useState(weeks[0] || 1);

  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState('all');

  const currentWeekData = useMemo(() => {
    return semesterData?.weeks.find(w => w.week_number === selectedWeek);
  }, [semesterData, selectedWeek]);

  const totalWarnings = useMemo(() => {
    return Object.values(warnings).flat().length;
  }, [warnings]);

  const handleSemesterChange = (sem: string) => {
    setSelectedSemester(sem);
    const newSemData = data.semesters[sem];
    if (newSemData?.weeks.length) {
      setSelectedWeek(newSemData.weeks[0].week_number);
    }
    setSelectedGroup('all');
    setSelectedTeacher('all');
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schedule_semester_${selectedSemester}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!semesterData) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Нет данных для отображения
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header with status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Расписание успешно сгенерировано</span>
          </div>
          {totalWarnings > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-warning/10 text-warning rounded-lg">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">{totalWarnings} предупреждений</span>
            </div>
          )}
        </div>
        <Button onClick={handleExportJSON} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Экспорт JSON
        </Button>
      </div>

      {/* Warnings accordion */}
      {totalWarnings > 0 && (
        <details className="bg-warning/5 border border-warning/20 rounded-xl">
          <summary className="p-4 cursor-pointer text-sm font-medium text-warning hover:bg-warning/10 rounded-xl transition-colors">
            Показать все предупреждения ({totalWarnings})
          </summary>
          <div className="p-4 pt-0 space-y-2 max-h-60 overflow-y-auto">
            {Object.entries(warnings).map(([sem, warns]) => (
              warns.map((w, i) => (
                <p key={`${sem}-${i}`} className="text-sm text-muted-foreground">
                  • {w}
                </p>
              ))
            ))}
          </div>
        </details>
      )}

      {/* Filters */}
      <ScheduleFilters
        semesters={semesters}
        selectedSemester={selectedSemester}
        onSemesterChange={handleSemesterChange}
        weeks={weeks}
        selectedWeek={selectedWeek}
        onWeekChange={setSelectedWeek}
        groups={semesterData.groups}
        selectedGroup={selectedGroup}
        onGroupChange={setSelectedGroup}
        teachers={semesterData.teachers}
        selectedTeacher={selectedTeacher}
        onTeacherChange={setSelectedTeacher}
      />

      {/* Schedule Table */}
      {currentWeekData && (
        <ScheduleTable
          weekData={currentWeekData}
          groups={semesterData.groups}
          filterGroup={selectedGroup}
          filterTeacher={selectedTeacher}
        />
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-card rounded-xl border border-border">
          <p className="text-sm text-muted-foreground">Групп</p>
          <p className="text-2xl font-bold text-foreground">{semesterData.groups.length}</p>
        </div>
        <div className="p-4 bg-card rounded-xl border border-border">
          <p className="text-sm text-muted-foreground">Преподавателей</p>
          <p className="text-2xl font-bold text-foreground">{semesterData.teachers.length}</p>
        </div>
        <div className="p-4 bg-card rounded-xl border border-border">
          <p className="text-sm text-muted-foreground">Недель</p>
          <p className="text-2xl font-bold text-foreground">{weeks.length}</p>
        </div>
        <div className="p-4 bg-card rounded-xl border border-border">
          <p className="text-sm text-muted-foreground">Семестров</p>
          <p className="text-2xl font-bold text-foreground">{semesters.length}</p>
        </div>
      </div>
    </div>
  );
}

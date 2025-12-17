import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ValidationErrors } from '@/components/ValidationErrors';
import { ScheduleView } from '@/components/ScheduleView';
import { ProcessResponse, ScheduleData, ValidationReport } from '@/types/schedule';
import { Button } from '@/components/ui/button';
import { CalendarDays, RefreshCw, Sparkles, FileCheck, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const API_URL = 'http://localhost:8000';

export default function Index() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [warnings, setWarnings] = useState<Record<string, string[]>>({});
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setValidationReport(null);
    setScheduleData(null);
    setWarnings({});
  };

  const handleClear = () => {
    setSelectedFile(null);
    setValidationReport(null);
    setScheduleData(null);
    setWarnings({});
  };

  const handleProcess = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setValidationReport(null);
    setScheduleData(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${API_URL}/process`, {
        method: 'POST',
        body: formData,
      });

      const result: ProcessResponse = await response.json();

      if (!result.ok) {
        setValidationReport(result.report || null);
        toast({
          title: 'Ошибка валидации',
          description: `Найдено ${result.report?.summary.errors || 0} ошибок`,
          variant: 'destructive',
        });
      } else {
        setScheduleData(result.data || null);
        setWarnings(result.warnings || {});
        toast({
          title: 'Успешно!',
          description: 'Расписание успешно сгенерировано',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка соединения',
        description: 'Не удалось подключиться к серверу. Убедитесь, что бэкенд запущен.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Schedule Generator</h1>
                <p className="text-xs text-muted-foreground">Генератор расписания колледжа</p>
              </div>
            </div>
            {scheduleData && (
              <Button variant="outline" onClick={handleClear} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Новый файл
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8">
        {!scheduleData ? (
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Hero section */}
            <div className="text-center space-y-4 animate-fade-in">
              <h2 className="text-3xl font-bold text-foreground">
                Загрузите Excel файл
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Система проверит данные и автоматически сгенерирует оптимальное расписание занятий
              </p>
            </div>

            {/* Upload area */}
            <FileUpload
              onFileSelect={handleFileSelect}
              isLoading={isLoading}
              selectedFile={selectedFile}
              onClear={handleClear}
            />

            {/* Process button */}
            {selectedFile && !validationReport && (
              <div className="animate-slide-up">
                <Button
                  onClick={handleProcess}
                  disabled={isLoading}
                  className="w-full h-14 text-lg gap-3"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Обработка...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Сгенерировать расписание
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Validation errors */}
            {validationReport && (
              <div className="space-y-4">
                <ValidationErrors report={validationReport} />
                <Button onClick={handleClear} variant="outline" className="w-full gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Загрузить другой файл
                </Button>
              </div>
            )}

            {/* Required sheets info */}
            {!selectedFile && (
              <div className="p-6 bg-card rounded-xl border border-border animate-fade-in">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-primary" />
                  Требуемые листы в Excel файле
                </h3>
                <div className="grid gap-3">
                  {[
                    { name: 'РУП', desc: 'Рабочий учебный план' },
                    { name: 'Нагруженность преподователей', desc: 'Распределение нагрузки' },
                    { name: 'Группы и направления', desc: 'Список групп с размерами' },
                    { name: 'Аудитории', desc: 'Доступные помещения' },
                    { name: 'Правила составления', desc: 'Параметры генерации' },
                  ].map((sheet) => (
                    <div
                      key={sheet.name}
                      className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <div>
                        <p className="font-medium text-sm text-foreground">{sheet.name}</p>
                        <p className="text-xs text-muted-foreground">{sheet.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {!selectedFile && (
              <div className="grid sm:grid-cols-3 gap-4 animate-fade-in">
                <div className="p-4 bg-card rounded-xl border border-border text-center">
                  <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-medium text-foreground mb-1">AI Валидация</h4>
                  <p className="text-xs text-muted-foreground">Автоматическая проверка данных</p>
                </div>
                <div className="p-4 bg-card rounded-xl border border-border text-center">
                  <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-accent" />
                  </div>
                  <h4 className="font-medium text-foreground mb-1">Оптимизация</h4>
                  <p className="text-xs text-muted-foreground">Умное распределение нагрузки</p>
                </div>
                <div className="p-4 bg-card rounded-xl border border-border text-center">
                  <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-success/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-success" />
                  </div>
                  <h4 className="font-medium text-foreground mb-1">Быстро</h4>
                  <p className="text-xs text-muted-foreground">Генерация за секунды</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <ScheduleView data={scheduleData} warnings={warnings} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <p className="text-sm text-muted-foreground text-center">
            Schedule Generator © 2024 • Автоматическая генерация расписания
          </p>
        </div>
      </footer>
    </div>
  );
}

import { AlertCircle, AlertTriangle, Info, FileX } from 'lucide-react';
import { ValidationReport } from '@/types/schedule';
import { cn } from '@/lib/utils';

interface ValidationErrorsProps {
  report: ValidationReport;
}

export function ValidationErrors({ report }: ValidationErrorsProps) {
  const { summary, errors, warnings, notes, rules_feedback } = report;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className={cn(
          "p-4 rounded-xl border",
          summary.errors > 0 
            ? "bg-destructive/10 border-destructive/30" 
            : "bg-success/10 border-success/30"
        )}>
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className={cn(
              "w-4 h-4",
              summary.errors > 0 ? "text-destructive" : "text-success"
            )} />
            <span className="text-sm font-medium text-muted-foreground">Ошибки</span>
          </div>
          <p className={cn(
            "text-2xl font-bold",
            summary.errors > 0 ? "text-destructive" : "text-success"
          )}>
            {summary.errors}
          </p>
        </div>

        <div className={cn(
          "p-4 rounded-xl border",
          summary.warnings > 0 
            ? "bg-warning/10 border-warning/30" 
            : "bg-muted border-border"
        )}>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className={cn(
              "w-4 h-4",
              summary.warnings > 0 ? "text-warning" : "text-muted-foreground"
            )} />
            <span className="text-sm font-medium text-muted-foreground">Предупреждения</span>
          </div>
          <p className={cn(
            "text-2xl font-bold",
            summary.warnings > 0 ? "text-warning" : "text-muted-foreground"
          )}>
            {summary.warnings}
          </p>
        </div>

        <div className="p-4 rounded-xl border bg-muted border-border">
          <div className="flex items-center gap-2 mb-1">
            <Info className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Заметки</span>
          </div>
          <p className="text-2xl font-bold text-muted-foreground">{summary.notes}</p>
        </div>
      </div>

      {/* Errors List */}
      {errors.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-destructive flex items-center gap-2">
            <FileX className="w-5 h-5" />
            Критические ошибки
          </h3>
          <div className="space-y-2">
            {errors.map((error, index) => (
              <div
                key={index}
                className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="px-2 py-0.5 text-xs font-medium bg-destructive/20 text-destructive rounded">
                        {error.code}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Лист: {error.sheet}
                        {error.excel_row && `, строка ${error.excel_row}`}
                        {error.column && `, колонка "${error.column}"`}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{error.message}</p>
                    {error.evidence && (
                      <p className="text-xs text-muted-foreground mt-1 font-mono bg-muted/50 px-2 py-1 rounded">
                        {error.evidence}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings List */}
      {warnings.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-warning flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Предупреждения
          </h3>
          <div className="space-y-2">
            {warnings.map((warning, index) => (
              <div
                key={index}
                className="p-4 bg-warning/5 border border-warning/20 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="px-2 py-0.5 text-xs font-medium bg-warning/20 text-warning rounded">
                        {warning.code}
                      </span>
                      {warning.sheet && (
                        <span className="text-sm text-muted-foreground">
                          Лист: {warning.sheet}
                          {warning.excel_row && `, строка ${warning.excel_row}`}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-foreground">{warning.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rules Feedback */}
      {(rules_feedback.issues.length > 0 || rules_feedback.suggestions.length > 0) && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Обратная связь по правилам</h3>
          {rules_feedback.issues.map((issue, i) => (
            <p key={i} className="text-sm text-destructive">• {issue}</p>
          ))}
          {rules_feedback.suggestions.map((suggestion, i) => (
            <p key={i} className="text-sm text-muted-foreground">💡 {suggestion}</p>
          ))}
        </div>
      )}

      {/* Notes */}
      {notes.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">Заметки</h3>
          {notes.map((note, i) => (
            <p key={i} className="text-sm text-muted-foreground">• {note}</p>
          ))}
        </div>
      )}
    </div>
  );
}

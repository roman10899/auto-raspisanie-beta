import { WeekData, SlotInfo } from '@/types/schedule';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface ScheduleTableProps {
  weekData: WeekData;
  groups: string[];
  filterGroup: string;
  filterTeacher: string;
}

function SlotCell({ slot, isFiltered }: { slot: SlotInfo | null; isFiltered: boolean }) {
  if (!slot) {
    return <div className="schedule-cell bg-muted/30" />;
  }

  return (
    <div
      className={cn(
        "schedule-cell",
        slot.is_flow && "schedule-flow",
        !isFiltered && "opacity-40"
      )}
    >
      <div className="space-y-1">
        <p className="font-medium text-foreground line-clamp-2">{slot.subject}</p>
        <p className="text-muted-foreground text-[10px]">{slot.teacher}</p>
        <p className="text-primary font-medium text-[10px]">{slot.room}</p>
      </div>
    </div>
  );
}

export function ScheduleTable({ weekData, groups, filterGroup, filterTeacher }: ScheduleTableProps) {
  const displayGroups = filterGroup === 'all' ? groups : groups.filter(g => g === filterGroup);

  const isSlotFiltered = (slot: SlotInfo | null): boolean => {
    if (!slot) return true;
    if (filterTeacher !== 'all' && slot.teacher !== filterTeacher) return false;
    return true;
  };

  const pairTimes = [
    '8:00 - 9:30',
    '9:45 - 11:15',
    '11:30 - 13:00',
    '13:30 - 15:00',
    '15:15 - 16:45',
  ];

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in">
      <ScrollArea className="w-full">
        <div className="min-w-[800px]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-schedule-header text-primary-foreground">
                <th className="p-3 text-left text-sm font-semibold border-r border-primary-foreground/20 w-24">
                  День
                </th>
                <th className="p-3 text-center text-sm font-semibold border-r border-primary-foreground/20 w-16">
                  №
                </th>
                <th className="p-3 text-center text-sm font-semibold border-r border-primary-foreground/20 w-24">
                  Время
                </th>
                {displayGroups.map((group) => (
                  <th
                    key={group}
                    className="p-3 text-center text-sm font-semibold border-r border-primary-foreground/20 min-w-[150px]"
                  >
                    {group}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weekData.days.map((day, dayIndex) => (
                day.pairs.map((pair, pairIndex) => (
                  <tr
                    key={`${dayIndex}-${pairIndex}`}
                    className={cn(
                      pairIndex % 2 === 0 ? "bg-schedule-pair-1" : "bg-schedule-pair-2"
                    )}
                  >
                    {pairIndex === 0 && (
                      <td
                        rowSpan={day.pairs.length}
                        className="p-3 font-semibold text-sm border-r border-border bg-card align-middle"
                      >
                        <div className="writing-mode-vertical">
                          {day.day_name}
                        </div>
                      </td>
                    )}
                    <td className="p-2 text-center font-medium text-sm border-r border-border">
                      {pair.pair}
                    </td>
                    <td className="p-2 text-center text-xs text-muted-foreground border-r border-border whitespace-nowrap">
                      {pairTimes[pair.pair - 1] || ''}
                    </td>
                    {displayGroups.map((group) => (
                      <td key={group} className="p-0 border-r border-border">
                        <SlotCell
                          slot={pair.slots[group]}
                          isFiltered={isSlotFiltered(pair.slots[group])}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

import { weekendItems } from "@/lib/data/weekend-items";
import type { DateRange, WeekendCategory, WeekendItem, WeekendRepository } from "@/lib/types";

function withinDateRange(item: WeekendItem, dateRange?: DateRange): boolean {
  if (!dateRange) return true;
  const date = new Date(item.date).getTime();
  const from = new Date(dateRange.from).getTime();
  const to = new Date(dateRange.to).getTime();
  return date >= from && date <= to;
}

export class InMemoryWeekendRepository implements WeekendRepository {
  private items = weekendItems;

  listWeekendItems(dateRange?: DateRange, category?: WeekendCategory): WeekendItem[] {
    return this.items
      .filter((item) => withinDateRange(item, dateRange))
      .filter((item) => (category ? item.category === category : true))
      .sort((first, second) => new Date(first.date).getTime() - new Date(second.date).getTime());
  }
}

export const weekendRepository = new InMemoryWeekendRepository();

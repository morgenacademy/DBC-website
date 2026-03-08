import { weekendItems } from "@/lib/data/weekend-items";
import { weekendGuideEdition } from "@/lib/data/weekend-guide-edition";
import type {
  DateRange,
  WeekendCategory,
  WeekendGuideDay,
  WeekendGuideEdition,
  WeekendGuideEvent,
  WeekendItem,
  WeekendRepository
} from "@/lib/types";

function withinDateRange(item: WeekendItem, dateRange?: DateRange): boolean {
  if (!dateRange) return true;
  const date = new Date(item.date).getTime();
  const from = new Date(dateRange.from).getTime();
  const to = new Date(dateRange.to).getTime();
  return date >= from && date <= to;
}

export class InMemoryWeekendRepository implements WeekendRepository {
  private items = weekendItems;
  private guide = weekendGuideEdition;

  listWeekendItems(dateRange?: DateRange, category?: WeekendCategory): WeekendItem[] {
    return this.items
      .filter((item) => withinDateRange(item, dateRange))
      .filter((item) => (category ? item.category === category : true))
      .sort((first, second) => new Date(first.date).getTime() - new Date(second.date).getTime());
  }

  getCurrentGuide(): WeekendGuideEdition {
    return this.guide;
  }

  listGuideSections(editionSlug?: string): { day: WeekendGuideDay; label: string; events: WeekendGuideEvent[] }[] {
    const edition = editionSlug && editionSlug !== this.guide.slug ? this.guide : this.guide;
    const dayOrder: WeekendGuideDay[] = ["hele-weekend", "donderdag", "vrijdag", "zaterdag", "zondag", "maandag"];
    const dayLabels: Record<WeekendGuideDay, string> = {
      "hele-weekend": "Hele weekend",
      donderdag: "Donderdag",
      vrijdag: "Vrijdag",
      zaterdag: "Zaterdag",
      zondag: "Zondag",
      maandag: "Maandag"
    };

    return dayOrder
      .map((day) => ({
        day,
        label: dayLabels[day],
        events: edition.events.filter((event) => event.day === day)
      }))
      .filter((section) => section.events.length > 0);
  }
}

export const weekendRepository = new InMemoryWeekendRepository();

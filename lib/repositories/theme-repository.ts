import { themes } from "@/lib/data/themes";
import type { Theme, ThemeRepository } from "@/lib/types";

export class InMemoryThemeRepository implements ThemeRepository {
  private items = themes;

  listThemes(kind?: Theme["kind"]): Theme[] {
    if (!kind) return this.items;
    return this.items.filter((item) => item.kind === kind);
  }

  getThemeBySlug(slug: string): Theme | undefined {
    return this.items.find((item) => item.slug === slug);
  }
}

export const themeRepository = new InMemoryThemeRepository();

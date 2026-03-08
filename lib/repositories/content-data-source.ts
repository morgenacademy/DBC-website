import { mapSupabaseContentRowToContentItem } from "@/lib/adapters/instagram";
import { contentItems } from "@/lib/data/content-items";
import type { ContentItem } from "@/lib/types";
import type { SupabaseContentRow } from "@/lib/adapters/instagram";

export interface ContentDataSource {
  listContentItems(): ContentItem[];
}

export class InMemoryContentDataSource implements ContentDataSource {
  listContentItems(): ContentItem[] {
    return contentItems;
  }
}

export class SupabaseRecordContentDataSource implements ContentDataSource {
  constructor(private readonly rows: SupabaseContentRow[]) {}

  listContentItems(): ContentItem[] {
    return this.rows.map((row) => mapSupabaseContentRowToContentItem(row));
  }
}

interface SupabaseContentDataSourceOptions {
  fallbackDataSource: ContentDataSource;
  rows?: SupabaseContentRow[] | null;
  sourceLabel?: "json" | "live";
}

// Supabase datasource met veilige fallback naar mock wanneer rows ontbreken.
export class SupabaseContentDataSource implements ContentDataSource {
  constructor(private readonly options: SupabaseContentDataSourceOptions) {}

  listContentItems(): ContentItem[] {
    const rows = this.options.rows;

    if (rows && rows.length > 0) {
      return rows.map((row) => mapSupabaseContentRowToContentItem(row));
    }

    return this.options.fallbackDataSource.listContentItems();
  }
}

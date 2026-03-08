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
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  rowsJson?: string;
}

// Stage-2 stub: fallback blijft mock, maar de boundary voor Supabase staat al klaar.
export class SupabaseContentDataSource implements ContentDataSource {
  private parsedRowsCache: SupabaseContentRow[] | null | undefined;

  constructor(private readonly options: SupabaseContentDataSourceOptions) {}

  private get parsedRows(): SupabaseContentRow[] | null {
    if (this.parsedRowsCache !== undefined) return this.parsedRowsCache;

    if (!this.options.rowsJson) {
      this.parsedRowsCache = null;
      return this.parsedRowsCache;
    }

    try {
      const parsed = JSON.parse(this.options.rowsJson) as unknown;
      this.parsedRowsCache = Array.isArray(parsed) ? (parsed as SupabaseContentRow[]) : null;
    } catch {
      this.parsedRowsCache = null;
    }

    return this.parsedRowsCache;
  }

  private get isSupabaseConfigured(): boolean {
    return Boolean(this.options.supabaseUrl && this.options.supabaseAnonKey);
  }

  listContentItems(): ContentItem[] {
    const rows = this.parsedRows;

    if (this.isSupabaseConfigured && rows && rows.length > 0) {
      return rows.map((row) => mapSupabaseContentRowToContentItem(row));
    }

    return this.options.fallbackDataSource.listContentItems();
  }
}

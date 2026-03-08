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

// Stage 2 ready: zodra Supabase records worden opgehaald kan deze source direct worden gebruikt.
export class SupabaseRecordContentDataSource implements ContentDataSource {
  constructor(private readonly rows: SupabaseContentRow[]) {}

  listContentItems(): ContentItem[] {
    return this.rows.map((row) => mapSupabaseContentRowToContentItem(row));
  }
}

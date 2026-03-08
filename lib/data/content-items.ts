import { editorialContentItems } from "@/lib/data/editorial-content-items";
import { ingestMockInstagramContent } from "@/lib/ingestion/instagram-mock-ingestion";
import type { ContentItem } from "@/lib/types";

export const contentItems: ContentItem[] = [...ingestMockInstagramContent(), ...editorialContentItems];

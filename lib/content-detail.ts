interface ContentDetailCopyInput {
  title: string;
  excerpt: string;
  body: string[];
}

interface ContentDetailCopyResult {
  showExcerpt: boolean;
  bodyParagraphs: string[];
}

function normalizeDetailText(value: string): string {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

function splitLeadSentence(value: string): { lead: string; rest: string } {
  const trimmed = value.trim();
  const match = trimmed.match(/^(.+?[.!?])(\s+.*)?$/s);

  if (!match) {
    return { lead: trimmed, rest: "" };
  }

  return {
    lead: match[1].trim(),
    rest: (match[2] ?? "").trim()
  };
}

function trimLeadingDuplicateSentence(paragraph: string, duplicateTexts: string[]): string | null {
  let current = paragraph.trim();

  for (const duplicateText of duplicateTexts) {
    if (!duplicateText.trim() || !current) continue;

    const normalizedDuplicate = normalizeDetailText(duplicateText);
    const { lead, rest } = splitLeadSentence(current);
    const normalizedLead = normalizeDetailText(lead);

    if (
      normalizedLead === normalizedDuplicate ||
      normalizedLead.startsWith(normalizedDuplicate) ||
      normalizedDuplicate.startsWith(normalizedLead)
    ) {
      current = rest;
    }
  }

  return current.trim() || null;
}

export function buildContentDetailCopy({ title, excerpt, body }: ContentDetailCopyInput): ContentDetailCopyResult {
  const normalizedTitle = normalizeDetailText(title);
  const normalizedExcerpt = normalizeDetailText(excerpt);
  const excerptRepeatsTitle =
    normalizedExcerpt.length > 0 && (normalizedExcerpt === normalizedTitle || normalizedExcerpt.startsWith(normalizedTitle));

  const showExcerpt = excerpt.trim().length > 0 && !excerptRepeatsTitle;
  const duplicateTexts = [title, showExcerpt ? excerpt : ""];

  const bodyParagraphs = body
    .map((paragraph) => trimLeadingDuplicateSentence(paragraph, duplicateTexts))
    .filter((paragraph): paragraph is string => Boolean(paragraph))
    .filter((paragraph) => {
      const normalizedParagraph = normalizeDetailText(paragraph);

      if (!normalizedParagraph) return false;
      if (normalizedParagraph === normalizedTitle) return false;
      if (showExcerpt && normalizedParagraph === normalizedExcerpt) return false;

      return true;
    });

  return {
    showExcerpt,
    bodyParagraphs: bodyParagraphs.length > 0 ? bodyParagraphs : body.map((paragraph) => paragraph.trim()).filter(Boolean)
  };
}

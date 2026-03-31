import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContentCard } from "@/components/cards/content-card";
import { contentItems } from "@/lib/data/content-items";

describe("ContentCard", () => {
  it("toont titel en editorial label", () => {
    render(<ContentCard item={contentItems[0]} />);

    expect(screen.getByText(contentItems[0].title)).toBeInTheDocument();
    expect(screen.getByText(contentItems[0].editorialLabel as string)).toBeInTheDocument();
  });

  it("toont geen automatische nieuw-badge zonder editorial label", () => {
    render(<ContentCard item={{ ...contentItems[0], editorialLabel: undefined, contentLayer: "fast" }} />);

    expect(screen.queryByText("Nieuw")).not.toBeInTheDocument();
  });
});

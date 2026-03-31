import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContentMediaCarousel } from "@/components/media/content-media-carousel";

describe("ContentMediaCarousel", () => {
  it("rendert opgeslagen carousel-afbeeldingen als redactionele galerij", () => {
    render(<ContentMediaCarousel title="Carousel post" mediaUrls={["one.jpg", "two.jpg", "three.jpg"]} />);

    expect(screen.getByAltText("Carousel post foto 1")).toBeInTheDocument();
    expect(screen.getByAltText("Carousel post foto 2")).toBeInTheDocument();
    expect(screen.getByAltText("Carousel post foto 3")).toBeInTheDocument();
    expect(screen.getByText("Meer beelden")).toBeInTheDocument();
    expect(screen.getByText("3 beelden")).toBeInTheDocument();
  });
});

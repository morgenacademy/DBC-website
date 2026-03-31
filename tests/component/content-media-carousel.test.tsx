import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContentMediaCarousel } from "@/components/media/content-media-carousel";

describe("ContentMediaCarousel", () => {
  it("rendert opgeslagen carousel-afbeeldingen als redactionele galerij", () => {
    render(
      <ContentMediaCarousel
        title="Carousel post"
        mediaItems={[
          { type: "image", url: "one.jpg" },
          { type: "image", url: "two.jpg" },
          { type: "image", url: "three.jpg" }
        ]}
      />
    );

    expect(screen.getByAltText("Carousel post foto 1")).toBeInTheDocument();
    expect(screen.getByAltText("Carousel post foto 2")).toBeInTheDocument();
    expect(screen.getByAltText("Carousel post foto 3")).toBeInTheDocument();
    expect(screen.getByText("Meer beelden")).toBeInTheDocument();
    expect(screen.getByText("3 beelden")).toBeInTheDocument();
  });

  it("ondersteunt videoblokken in de galerij", () => {
    render(
      <ContentMediaCarousel
        title="Mixed post"
        mediaItems={[
          { type: "video", url: "clip.mp4", poster: "poster.jpg" },
          { type: "image", url: "still.jpg" }
        ]}
      />
    );

    expect(screen.getByText("2 beelden")).toBeInTheDocument();
    expect(screen.getByText("Meer beelden")).toBeInTheDocument();
    expect(document.querySelector("video")).not.toBeNull();
  });
});

import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

type NextImageLikeProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean;
  priority?: boolean;
};

vi.mock("next/image", () => ({
  default: ({ fill: _fill, priority: _priority, ...props }: NextImageLikeProps) => React.createElement("img", props)
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...rest }: { children: React.ReactNode; href: string }) =>
    React.createElement("a", { href, ...rest }, children)
}));

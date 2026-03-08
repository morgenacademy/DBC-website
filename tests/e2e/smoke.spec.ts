import { expect, test } from "@playwright/test";

test("home -> ontdek detail", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /naar ontdek/i }).first().click();
  await expect(page).toHaveURL(/\/discover/);

  await page.getByRole("link", { name: /11 vegetarische restaurants in den bosch/i }).first().click();
  await expect(page).toHaveURL(/\/discover\/11-vegetarian-restaurants-den-bosch/);
});

test("ontdek search vegetarian", async ({ page }) => {
  await page.goto("/discover");
  await page.getByRole("searchbox", { name: /zoeken/i }).fill("vegetarian");
  await page.getByRole("button", { name: /zoek in ontdek/i }).click();
  await expect(page.getByText(/11 vegetarische restaurants/i)).toBeVisible();
});

test("weekend guide dagnavigatie", async ({ page }) => {
  await page.goto("/weekend-guide");
  await page.getByRole("link", { name: "Vrijdag" }).click();
  await expect(page).toHaveURL(/#vrijdag$/);
  await expect(page.getByRole("heading", { name: "Vrijdag" })).toBeVisible();
});

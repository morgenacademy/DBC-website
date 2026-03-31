import { expect, test } from "@playwright/test";

test("home -> ontdek detail", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /naar ontdek/i }).first().click();
  await expect(page).toHaveURL(/\/ontdek/);

  await page.getByRole("link", { name: /11 vegetarische restaurants in den bosch/i }).first().click();
  await expect(page).toHaveURL(/\/ontdek\/11-vegetarian-restaurants-den-bosch/);
});

test("ontdek search vegetarian", async ({ page }) => {
  await page.goto("/ontdek");
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

test("newsletter submit toont succes en reset formulier zonder runtime error", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  await page.route("**/api/newsletter-subscribe", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        message: "Gelukt! Je bent ingeschreven voor de nieuwsbrief."
      })
    });
  });

  await page.goto("/");

  const footer = page.locator("footer");
  const nameInput = footer.getByPlaceholder("Je naam");
  const emailInput = footer.getByPlaceholder("Je e-mailadres");
  const submitButton = footer.getByRole("button", { name: /inschrijven nieuwsbrief/i });

  await nameInput.fill("Morgen Academy");
  await emailInput.fill("totmorgen@morgenacademy.nl");
  await submitButton.click();

  await expect(footer.getByText("Gelukt! Je bent ingeschreven voor de nieuwsbrief.")).toBeVisible();
  await expect(nameInput).toHaveValue("");
  await expect(emailInput).toHaveValue("");
  expect(pageErrors).toEqual([]);
});

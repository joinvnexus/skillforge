import { test, expect } from "@playwright/test";

test.describe("Smoke", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByAltText("Skillshare")).toBeVisible();
  });

  test("login page renders form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /log in/i })).toBeVisible();
    await expect(page.locator("#login-email")).toBeVisible();
    await expect(page.locator("#login-password")).toBeVisible();
  });

  test("dashboard requires auth and redirects to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});

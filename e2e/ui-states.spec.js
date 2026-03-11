import { test, expect } from "@playwright/test";

test.describe("UI states", () => {
  test("shows loading state on courses page", async ({ page }) => {
    let resolveResponse;
    const responseReady = new Promise((resolve) => {
      resolveResponse = resolve;
    });

    await page.route("**/api/v1/courses", async (route) => {
      await responseReady;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: [] })
      });
    });

    await page.goto("/courses");
    await expect(page.getByText("Loading...")).toBeVisible();
    resolveResponse();
  });

  test("shows empty state when no courses", async ({ page }) => {
    await page.route("**/api/v1/courses", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: [] })
      });
    });

    await page.goto("/courses");
    await expect(page.getByText("No courses match your filters.")).toBeVisible();
  });

  test("shows error state on API failure", async ({ page }) => {
    await page.route("**/api/v1/courses", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: { message: "Server error" } })
      });
    });

    await page.goto("/courses");
    await expect(page.getByText("Something went wrong")).toBeVisible();
  });
});

import { test, expect } from "@playwright/test";

test.describe("Auth UI", () => {
  test("login redirects student to dashboard", async ({ page }) => {
    await page.route("**/api/v1/auth/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            user: {
              id: "student-1",
              name: "Student",
              email: "student@example.com",
              role: "STUDENT",
              status: "ACTIVE"
            },
            accessToken: "access-token",
            refreshToken: "refresh-token"
          }
        })
      });
    });

    await page.route("**/api/v1/auth/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            id: "student-1",
            name: "Student",
            email: "student@example.com",
            role: "STUDENT",
            status: "ACTIVE",
            createdAt: new Date().toISOString()
          }
        })
      });
    });

    await page.goto("/login");
    await page.fill("#login-email", "student@example.com");
    await page.fill("#login-password", "password123");
    await page.getByRole("button", { name: /log in/i }).click();

    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("logout returns to login", async ({ page }) => {
    await page.route("**/api/v1/auth/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            id: "student-1",
            name: "Student",
            email: "student@example.com",
            role: "STUDENT",
            status: "ACTIVE",
            createdAt: new Date().toISOString()
          }
        })
      });
    });

    await page.route("**/api/v1/auth/logout", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: { success: true } })
      });
    });

    await page.addInitScript(() => {
      localStorage.setItem("skillshare_access_token", "access-token");
      localStorage.setItem("skillshare_refresh_token", "refresh-token");
    });

    await page.goto("/dashboard");
    await page.getByRole("button", { name: /open profile menu/i }).click();
    await page.getByRole("button", { name: /logout/i }).click();

    await expect(page).toHaveURL(/\/login/);
  });
});

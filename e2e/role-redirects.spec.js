import { test, expect } from "@playwright/test";

const makeToken = (payload) => {
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.`;
};

const setSession = async (page, role) => {
  await page.addInitScript(({ token, refresh }) => {
    localStorage.setItem("skillshare_access_token", token);
    localStorage.setItem("skillshare_refresh_token", refresh);
  }, {
    token: makeToken({ userId: "user-1", role, email: `${role.toLowerCase()}@example.com` }),
    refresh: "refresh-token"
  });
};

test.describe("Role redirects (client)", () => {
  test("admin role goes to admin panel", async ({ page }) => {
    await page.route("**/api/v1/auth/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            id: "user-1",
            name: "Admin",
            email: "admin@example.com",
            role: "ADMIN",
            status: "ACTIVE",
            createdAt: new Date().toISOString()
          }
        })
      });
    });
    await setSession(page, "ADMIN");
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/dashboard\/admin-panel/);
  });

  test("instructor role goes to instructor panel", async ({ page }) => {
    await page.route("**/api/v1/auth/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            id: "user-1",
            name: "Instructor",
            email: "instructor@example.com",
            role: "INSTRUCTOR",
            status: "ACTIVE",
            createdAt: new Date().toISOString()
          }
        })
      });
    });
    await setSession(page, "INSTRUCTOR");
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/dashboard\/instructor-panel/);
  });
});

import { test, expect } from "@playwright/test";

const mockCourses = [
  {
    id: "course-1",
    slug: "course-1",
    title: "Course One",
    shortDescription: "Learn the basics",
    price: 10,
    averageRating: 4.5,
    studentCount: 120,
    instructor: {
      user: { name: "Instructor One" }
    },
    category: { name: "Design", slug: "design" },
    sections: []
  }
];

test.describe("Public routes", () => {
  test("course list loads and shows courses", async ({ page }) => {
    await page.route("**/api/v1/courses", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: mockCourses })
      });
    });

    await page.goto("/courses");
    await expect(page.getByRole("heading", { name: /explore our courses/i })).toBeVisible();
    await expect(page.getByText("Course One")).toBeVisible();
  });

  test("course detail loads and shows hero title", async ({ page }) => {
    await page.route("**/api/v1/courses/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: mockCourses[0],
          relatedCourses: []
        })
      });
    });

    await page.goto("/courses/course-1");
    await expect(page.getByRole("heading", { name: "Course One" })).toBeVisible();
  });
});

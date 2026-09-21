export default async function run(page, ui) {
  const results = {};

  async function loginAs(rolePath, email, password) {
    await page.goto(`http://127.0.0.1:5173/login/${rolePath}`);
    await page.waitForTimeout(900);
    const inputs = await page.locator("input").all();
    await inputs[0].fill(email);
    await inputs[1].fill(password);
    const select = page.locator("select").first();
    if (await select.count()) {
      const values = await select
        .locator("option")
        .evaluateAll((os) => os.map((o) => o.value).filter(Boolean));
      if (values.length) await select.selectOption(values[0]);
    }
    const btn = page.locator("button.btn-primary").first();
    if (await btn.count()) await btn.click();
    await page.waitForTimeout(2200);
    return page.evaluate(() => ({
      path: location.pathname,
      role: JSON.parse(localStorage.getItem("user") || "{}").role,
    }));
  }

  // Student
  results.studentLogin = await loginAs(
    "student",
    "student@myuct.ac.za",
    "student123",
  );
  // Check the bottom nav (SideNav) has tabs
  results.studentNav = await page
    .locator("#site-bottom-nav .tab")
    .allInnerTexts();

  // Admin — check for the duplicate side nav (the unapproved extras)
  await page.evaluate(() => localStorage.clear());
  results.adminLogin = await loginAs(
    "admin",
    "admin@campusswap.co.za",
    "admin123",
  );
  results.adminPath = await page.evaluate(() => location.pathname);

  // Count side-navs and top-bars on the admin page (should be 1 nav from AdminLayout, no duplicate admin top-bar)
  results.adminCounts = await page.evaluate(() => ({
    sideNavs: document.querySelectorAll(".side-nav").length,
    adminTopBars: document.querySelectorAll(".admin-dash .top-bar").length,
    bottomNavs: document.querySelectorAll("#site-bottom-nav").length,
  }));

  return results;
}

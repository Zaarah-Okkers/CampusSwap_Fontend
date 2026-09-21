export default async function run(page, ui) {
  const out = {};

  // 1. Logged-out home must not be a student.
  await page.goto("http://127.0.0.1:5173/");
  await page.waitForTimeout(1500);
  out.guestTopRight = (
    await page
      .locator(".top-right, .top-left + *")
      .first()
      .innerText()
      .catch(() => "")
  )
    .trim()
    .slice(0, 80);
  out.guestBody = (await page.locator("body").innerText()).slice(0, 120);

  // 2. Student login
  await page.goto("http://127.0.0.1:5173/login/student");
  await page.waitForTimeout(1000);
  const inputs = await page.locator("input").all();
  await inputs[0].fill("student@myuct.ac.za");
  await inputs[1].fill("student123");
  const sel = page.locator("select").first();
  if (await sel.count()) {
    const v = await sel
      .locator("option")
      .evaluateAll((os) => os.map((o) => o.value).filter(Boolean));
    if (v.length) await sel.selectOption(v[0]);
  }
  await page.locator("button.btn-primary").first().click();
  await page.waitForTimeout(2200);
  out.studentLoginPath = await page.evaluate(() => location.pathname);

  // 3. Student profile (the reported bug)
  await page.goto("http://127.0.0.1:5173/student-profile");
  await page.waitForTimeout(1200);
  out.profilePath = await page.evaluate(() => location.pathname);
  out.profileHeading = (
    await page
      .locator("h1, h2")
      .first()
      .innerText()
      .catch(() => "")
  ).trim();

  // 4. Student nav
  await page.goto("http://127.0.0.1:5173/student-dashboard");
  await page.waitForTimeout(1000);
  out.studentNav = await page
    .locator("#site-bottom-nav .tab span")
    .allInnerTexts();

  // 5. SafeHome loads live service types
  await page.goto("http://127.0.0.1:5173/safehome");
  await page.waitForTimeout(2000);
  out.safeHomeOptions = await page.locator("select option").allInnerTexts();
  out.safeHomeOfflineBanner = await page.locator(".offline-banner").count();

  // 6. Admin: no duplicate sidebars / unapproved extras
  await page.evaluate(() => localStorage.clear());
  await page.goto("http://127.0.0.1:5173/login/admin");
  await page.waitForTimeout(1000);
  const ai = await page.locator("input").all();
  await ai[0].fill("admin@campusswap.co.za");
  await ai[1].fill("admin123");
  await page.locator("button.btn-primary").first().click();
  await page.waitForTimeout(2200);
  out.adminPath = await page.evaluate(() => location.pathname);
  out.adminCounts = await page.evaluate(() => ({
    duplicateSideNavs: document.querySelectorAll(".admin-dash .side-nav")
      .length,
    duplicateAdminTopBars: document.querySelectorAll(".admin-dash .top-bar")
      .length,
    siteNavs: document.querySelectorAll("#site-bottom-nav").length,
  }));

  // 7. Logout from student side
  await page.evaluate(() => localStorage.clear());
  await page.goto("http://127.0.0.1:5173/login/student");
  await page.waitForTimeout(900);
  const si = await page.locator("input").all();
  await si[0].fill("student@myuct.ac.za");
  await si[1].fill("student123");
  const s2 = page.locator("select").first();
  if (await s2.count()) {
    const v = await s2
      .locator("option")
      .evaluateAll((os) => os.map((o) => o.value).filter(Boolean));
    if (v.length) await s2.selectOption(v[0]);
  }
  await page.locator("button.btn-primary").first().click();
  await page.waitForTimeout(2200);

  // Click Logout in the bottom nav
  await page.locator("#site-bottom-nav .tab", { hasText: "Logout" }).click();
  await page.waitForTimeout(700);
  const confirmBtn = page.locator(".swal2-confirm");
  if (await confirmBtn.count()) await confirmBtn.click();
  await page.waitForTimeout(2200);
  out.afterLogout = await page.evaluate(() => ({
    path: location.pathname,
    isLoggedIn: localStorage.getItem("isLoggedIn"),
    user: localStorage.getItem("user"),
  }));

  return out;
}

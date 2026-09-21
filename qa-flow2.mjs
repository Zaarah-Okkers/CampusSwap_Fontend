export default async function run(page, ui) {
  await page.goto("http://127.0.0.1:5173/login/student");
  await page.waitForTimeout(1200);

  const inputs = await page.locator("input").all();
  await inputs[0].fill("student@myuct.ac.za");
  await inputs[1].fill("student123");

  // Select the first real institution option (field is required for students).
  const select = page.locator("select").first();
  if (await select.count()) {
    const values = await select
      .locator("option")
      .evaluateAll((os) => os.map((o) => o.value).filter(Boolean));
    if (values.length) await select.selectOption(values[0]);
  }

  await page
    .getByRole("button", { name: /Verify & Enter CampusSwap/i })
    .click();
  await page.waitForTimeout(2500);

  const stateAfterLogin = await page.evaluate(() => ({
    path: location.pathname,
    isLoggedIn: localStorage.getItem("isLoggedIn"),
    user: localStorage.getItem("user"),
  }));

  // Now hit the student profile (the reported bug).
  await page.goto("http://127.0.0.1:5173/student-profile");
  await page.waitForTimeout(1500);

  return {
    stateAfterLogin,
    profilePath: await page.evaluate(() => location.pathname),
    profileBody: (await page.locator("body").innerText()).slice(0, 400),
  };
}

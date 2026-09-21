export default async function run(page, ui) {
  // Login as student via the standard form.
  await page.goto("http://127.0.0.1:5173/login/student");
  await page.waitForTimeout(1500);
  await ui.fill("@e3", "student@myuct.ac.za");
  await ui.fill("@e5", "student123");
  let s = await ui.snapshot();
  const selectRef = s.match(/@(e\d+) combobox/)?.[1];
  if (selectRef) await page.locator("select").selectOption({ index: 1 });
  s = await ui.snapshot();
  const submit = s.match(/@(e\d+) button "Verify/)?.[1];
  if (submit) await ui.click(submit);
  await page.waitForTimeout(2500);
  const afterLogin = page.url();
  // Dismiss any Swal dialog.
  await page.keyboard.press("Escape").catch(() => {});
  return { afterLogin, href: await page.evaluate(() => location.pathname) };
}

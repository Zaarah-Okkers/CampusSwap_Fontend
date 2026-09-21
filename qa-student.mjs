export default async function run(page, ui) {
  // Go to login and use the demo student login.
  await page.goto("http://127.0.0.1:5173/login/student");
  await page.waitForTimeout(600);

  let snap = await ui.snapshot();
  const email = snap.match(/@(e\d+) textbox/)?.[1];
  const pass = snap.match(/@(e\d+) textbox[^\n]*Password/)?.[1];

  // Fill the deterministic demo credentials the app documents.
  const boxes = await page.locator("input").all();
  await boxes[0].fill("student@myuct.ac.za");
  await boxes[1].fill("student123");

  // Submit
  const submitRef =
    snap.match(/@(e\d+) button "Verify & Enter CampusSwap"/)?.[1] ||
    snap.match(/@(e\d+) button "[^"]*Enter CampusSwap[^"]*"/)?.[1];
  if (submitRef) await ui.click(submitRef);
  await page.waitForTimeout(1800);

  const afterLogin = {
    url: page.url(),
    snap: (await ui.snapshot()).slice(0, 1200),
  };

  // Now navigate to the student profile — the reported bug.
  await page.goto("http://127.0.0.1:5173/student-profile");
  await page.waitForTimeout(1200);

  return {
    afterLogin,
    profileUrl: page.url(),
    profileText: (await page.locator("body").innerText()).slice(0, 600),
  };
}

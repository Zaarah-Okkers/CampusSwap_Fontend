export default async function run(page, ui) {
  await page.goto("http://127.0.0.1:5173/");
  await page.waitForTimeout(600);

  const boxes = await page.locator("input").all();
  await boxes[0].fill("student@myuct.ac.za");
  await boxes[1].fill("student123");

  const snap = await ui.snapshot();
  const submitRef = snap.match(
    /@(e\d+) button "Verify & Enter CampusSwap"/,
  )?.[1];
  await ui.click(submitRef);
  await page.waitForTimeout(2500);

  // Read whatever modal appeared.
  const modalText = await page
    .locator(".swal2-popup")
    .innerText()
    .catch(() => "(no modal)");

  return {
    url: page.url(),
    modalText,
    localStorage: await page.evaluate(() => ({
      isLoggedIn: localStorage.getItem("isLoggedIn"),
      user: localStorage.getItem("user"),
    })),
  };
}

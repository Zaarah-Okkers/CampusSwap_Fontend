export default async function run(page) {
  const errors = []
  page.on('pageerror', error => errors.push(String(error)))
  await page.waitForTimeout(5000)
  return await page.evaluate(() => ({html: document.querySelector('#app')?.innerHTML, body: document.body.innerText, vue: document.querySelector('#app')?.__vue_app__ ? true : false}))
}

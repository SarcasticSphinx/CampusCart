import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { By, until, type WebDriver } from "selenium-webdriver";
import { BASE_URL, addProductToBag, byText, click, openCheckout, startBrowser, visible } from "./driver";

// Scoped to the form: the toast region also has alert semantics and may still be open.
const CHECKOUT_ERROR = "form [role='alert']";

async function fillCheckout(driver: WebDriver, details: { promoCode?: string; payment?: "CASH_ON_DELIVERY" | "CAMPUS_WALLET" } = {}) {
  await openCheckout(driver);
  await driver.findElement(By.name("name")).sendKeys("Selenium Student");
  await driver.findElement(By.name("email")).sendKeys("selenium@student.ruet.ac.bd");
  await driver.findElement(By.name("address")).sendKeys("Hall 3, RUET, Rajshahi 6204");
  if (details.promoCode) await driver.findElement(By.name("promoCode")).sendKeys(details.promoCode);
  await click(driver, By.css(`input[name='paymentMethod'][value='${details.payment ?? "CASH_ON_DELIVERY"}']`));
  await click(driver, By.xpath("//button[normalize-space(.)='Place order']"));
}

describe("checkout (Selenium)", () => {
  let driver: WebDriver;

  beforeAll(async () => { driver = await startBrowser(); });
  afterAll(async () => { await driver?.quit(); });
  // A fresh page load empties the in-memory bag, so each test starts clean.
  beforeEach(async () => { await driver.get(BASE_URL); });

  it("places a cash-on-delivery order with the STUDENT10 discount", async () => {
    await addProductToBag(driver, "notebook", 2);
    await fillCheckout(driver, { promoCode: "STUDENT10" });

    await driver.wait(until.urlMatches(/\/orders\/[a-z0-9]+$/), 15_000);
    expect(await (await visible(driver, By.css("[data-testid='order-total']"))).getText()).toBe("BDT 216.00");
    expect(await driver.findElement(By.css("[data-testid='order-discount']")).getText()).toContain("BDT 24.00");
    expect(await driver.findElement(By.css("[data-testid='order-status']")).getText()).toBe("CONFIRMED");
    expect(await driver.findElement(By.css("button[aria-label='Open bag, 0 items']")).isDisplayed()).toBe(true);
  });

  it("shows an error for an unknown promo code and keeps the bag", async () => {
    await addProductToBag(driver, "pens");
    await fillCheckout(driver, { promoCode: "FREESTUFF" });

    expect(await (await visible(driver, By.css(CHECKOUT_ERROR))).getText()).toContain("Promo code not recognised");
    expect(await driver.getCurrentUrl()).toBe(`${BASE_URL}/checkout`);
  });

  it("shows the decline message when the simulated wallet refuses a large order", async () => {
    await addProductToBag(driver, "bottle", 10);
    await addProductToBag(driver, "tote", 10); // BDT 3,500 + BDT 2,500 is above the BDT 5,000 wallet limit
    await fillCheckout(driver, { payment: "CAMPUS_WALLET" });

    expect(await (await visible(driver, By.css(CHECKOUT_ERROR))).getText()).toContain("Insufficient wallet balance");
  });

  it("explains that checkout needs items when the bag is empty", async () => {
    await driver.get(`${BASE_URL}/checkout`);
    await visible(driver, byText("*", "Your bag is empty"));
  });
});

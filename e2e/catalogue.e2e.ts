import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { By, type WebDriver } from "selenium-webdriver";
import { BASE_URL, addProductToBag, byText, click, startBrowser, visible } from "./driver";

describe("catalogue and bag (Selenium)", () => {
  let driver: WebDriver;

  beforeAll(async () => { driver = await startBrowser(); });
  afterAll(async () => { await driver?.quit(); });

  it("lists the seeded products on the home page", async () => {
    await driver.get(BASE_URL);
    await visible(driver, byText("h2", "Your everyday lineup."));
    const links = await driver.findElements(By.css("#collection a[href^='/products/']"));
    expect(links.length).toBeGreaterThanOrEqual(6);
  });

  it("filters by search and shows an empty state for no matches", async () => {
    await driver.get(BASE_URL);
    const search = await visible(driver, By.css("input[aria-label='Search products']"));
    await search.sendKeys("notebook");
    await visible(driver, byText("p", "1 essential"));
    await search.clear();
    await search.sendKeys("zzzz");
    await visible(driver, byText("*", "0 essentials"));
  });

  it("adds a product, shows a toast and keeps the bag count across pages", async () => {
    await driver.get(BASE_URL);
    await addProductToBag(driver, "notebook", 2);
    await visible(driver, byText("*", "Added to your bag"));
    await click(driver, By.css("a[aria-label='CampusCart home']"));
    await click(driver, By.css("button[aria-label='Open bag, 2 items']"));
    // getText() normalises the non-breaking space that Intl.NumberFormat puts after "BDT".
    expect(await (await visible(driver, By.css("[data-slot='sheet-content']"))).getText()).toContain("BDT 240.00");
  });
});

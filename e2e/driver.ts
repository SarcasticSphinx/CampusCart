import { Builder, By, until, type WebDriver, type WebElement } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";

export const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3000";

/** Starts headless Chrome. Selenium Manager downloads a matching driver when none is installed. */
export async function startBrowser(): Promise<WebDriver> {
  const options = new chrome.Options();
  options.addArguments("--headless=new", "--window-size=1280,900", "--no-sandbox", "--disable-dev-shm-usage");
  return new Builder().forBrowser("chrome").setChromeOptions(options).build();
}

/**
 * Polls with a fresh lookup each time. Holding on to one element breaks after client-side navigation,
 * because React replaces the node and the old reference goes stale.
 */
export async function visible(driver: WebDriver, locator: By, timeout = 10_000): Promise<WebElement> {
  return driver.wait(async () => {
    try {
      const element = await driver.findElement(locator);
      return (await element.isDisplayed()) ? element : null;
    } catch (error) {
      if (error instanceof Error && ["NoSuchElementError", "StaleElementReferenceError"].includes(error.name)) return null;
      throw error;
    }
  }, timeout, `Waiting for ${locator} to be visible`) as Promise<WebElement>;
}

export function byText(tag: string, text: string): By {
  return By.xpath(`//${tag}[contains(normalize-space(.), ${JSON.stringify(text)})]`);
}

/**
 * Finds the element again, scrolls it to the middle of the viewport (clear of the sticky header) and clicks it.
 * Re-locating on every attempt avoids stale references when React re-renders after client-side navigation.
 */
export async function click(driver: WebDriver, locator: By, attempts = 3): Promise<void> {
  try {
    const element = await visible(driver, locator);
    await driver.executeScript("arguments[0].scrollIntoView({ block: 'center', behavior: 'instant' })", element);
    await element.click();
  } catch (error) {
    const name = error instanceof Error ? error.name : "";
    if (attempts <= 1 || !["StaleElementReferenceError", "ElementClickInterceptedError"].includes(name)) throw error;
    await driver.sleep(250);
    return click(driver, locator, attempts - 1);
  }
}

export async function bagCount(driver: WebDriver): Promise<number> {
  const label = await driver.findElement(By.css("button[aria-label^='Open bag']")).getAttribute("aria-label");
  return Number((label ?? "").match(/(\d+) items/)?.[1] ?? 0);
}

/**
 * The bag lives in React state, so a full page load would empty it. Navigation therefore goes through
 * the site's own links (client-side routing), the same way a visitor moves around.
 */
export async function addProductToBag(driver: WebDriver, productId: string, times = 1) {
  await click(driver, By.css("a[aria-label='CampusCart home']"));
  await click(driver, By.css(`#collection a[href='/products/${productId}']`));
  // Client-side navigation: wait until the product page has replaced the catalogue before using its button.
  await driver.wait(until.urlContains(`/products/${productId}`), 10_000);
  const addButton = By.xpath("//button[normalize-space(.)='Add to bag']");
  for (let i = 0; i < times; i++) {
    const before = await bagCount(driver);
    await click(driver, addButton);
    await driver.wait(until.elementLocated(By.css(`button[aria-label='Open bag, ${before + 1} items']`)), 10_000);
  }
}

export async function openCheckout(driver: WebDriver) {
  await click(driver, By.css("button[aria-label^='Open bag']"));
  await click(driver, By.xpath("//a[normalize-space(.)='Checkout']"));
  await visible(driver, By.name("name"));
}

const puppeteer = require("puppeteer");

describe("Тестирование интерфейса", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: "new" });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test("Проверка отображения заголовка на главной странице", async () => {
    await page.goto("https://dip-frontend.onrender.com/");
    const title = await page.$eval("h1", (el) =>
      el.innerText.trim().toLowerCase()
    );
    expect(title).toBe("добро пожаловать на территорию красивого тела");
  });

  test("Проверка работы формы", async () => {
    await page.goto("https://dip-frontend.onrender.com/");

    await page.type("#name", "Иван Иванов");
    await page.type("#phone", "+77001112233");
    await page.select("#service", "Тайский массаж 1");

    await page.click(".btn-submit");

    // Ждем, пока модальное окно станет видимым
    await page.waitForSelector("#modal-message", { visible: true });

    // Добавляем дополнительную проверку текста
    const modalText = await page.$eval("#modal-message", (el) =>
      el.innerText.trim()
    );
    expect(modalText).toBe("Поздравляем, вы успешно записались на сеанс!");
  }, 10000);

  test("Проверка работы бургер-меню", async () => {
    await page.goto("https://dip-frontend.onrender.com/");

    // Ждем, пока элемент бургер-меню появится
    await page.waitForSelector(".burger-menu", { visible: true });

    // Кликаем на бургер-меню
    await page.evaluate(() => {
      document.querySelector(".burger-menu").click();
    });

    // Ждем, пока меню отобразится
    await page.waitForTimeout(1000);

    const menuVisible = await page.$eval(
      "nav ul",
      (el) => window.getComputedStyle(el).display !== "none"
    );
    expect(menuVisible).toBe(true);
  }, 10000);
});

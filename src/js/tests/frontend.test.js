const puppeteer = require("puppeteer");

describe("Тестирование интерфейса", () => {
  let browser;
  let page;
  const BASE_URL = "https://dip-frontend.onrender.com";

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: "new",
      slowMo: 50,
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test("Проверка работы бургер-меню", async () => {
    // Уменьшаем размер экрана, чтобы появился бургер-меню
    await page.setViewport({ width: 360, height: 800 });

    await page.goto(BASE_URL, { waitUntil: "networkidle2" });

    // Ждем, пока бургер-меню станет видимым
    await page.waitForSelector(".burger-menu", { visible: true });

    // Проверяем, виден ли бургер-меню
    const isBurgerVisible = await page.$eval(
      ".burger-menu",
      (el) => window.getComputedStyle(el).display !== "none"
    );
    expect(isBurgerVisible).toBe(true);

    // Кликаем по бургер-меню
    await page.click(".burger-menu");

    // Ждем, пока меню развернется
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Проверяем, открылось ли меню
    const menuVisible = await page.evaluate(() => {
      const nav = document.querySelector("nav ul");
      return window.getComputedStyle(nav).display !== "none";
    });
    expect(menuVisible).toBe(true);

    // Закрываем меню
    await page.click(".burger-menu");

    // Ждем, пока меню скроется
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const menuHidden = await page.evaluate(() => {
      const nav = document.querySelector("nav ul");
      return window.getComputedStyle(nav).display === "none";
    });
    expect(menuHidden).toBe(true);
  }, 15000); // Увеличиваем таймаут

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
});

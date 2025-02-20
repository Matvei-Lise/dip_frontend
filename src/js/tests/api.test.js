const request = require("supertest");

const BASE_URL = "https://dip-backend.onrender.com"; // Убедитесь, что ваш сервер запущен

describe("Тест API", () => {
  let testBooking = {
    name: "Тестовый клиент",
    phone: "+79991234567",
    service: "Тайский массаж",
    message: "Это тестовая заявка",
  };
  let bookingDate = "";

  // Тест POST-запроса (создание заявки)
  test("POST /api/contact - отправка формы", async () => {
    const response = await request(BASE_URL)
      .post("/api/contact")
      .send(testBooking)
      .set("Accept", "application/json");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Заявка принята!");

    // Сохраняем дату заявки для дальнейших тестов
    const bookings = await request(BASE_URL).get("/api/bookings");
    bookingDate = bookings.body.find(
      (b) => b.phone === testBooking.phone
    )?.date;
    expect(bookingDate).toBeDefined();
  });

  // Тест GET-запроса (проверка заявок)
  test("GET /api/bookings - получение всех заявок", async () => {
    const response = await request(BASE_URL).get("/api/bookings");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.some((b) => b.phone === testBooking.phone)).toBe(true);
  });

  // Тест PUT-запроса (изменение статуса заявки)
  test("PUT /api/bookings/:date - обновление статуса заявки", async () => {
    const response = await request(BASE_URL)
      .put(`/api/bookings/${bookingDate}`)
      .send({ status: "Обработано" });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

    // Проверяем, что статус действительно обновился
    const updatedBookings = await request(BASE_URL).get("/api/bookings");
    const updatedBooking = updatedBookings.body.find(
      (b) => b.date === bookingDate
    );
    expect(updatedBooking.status).toBe("Обработано");
  });

  // Тест DELETE-запроса (удаление заявки)
  test("DELETE /api/bookings/:date - удаление заявки", async () => {
    const response = await request(BASE_URL).delete(
      `/api/bookings/${bookingDate}`
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

    // Проверяем, что заявка удалена
    const bookingsAfterDelete = await request(BASE_URL).get("/api/bookings");
    expect(bookingsAfterDelete.body.some((b) => b.date === bookingDate)).toBe(
      false
    );
  });
});

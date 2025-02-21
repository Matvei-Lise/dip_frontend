document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const adminPassword = document.getElementById("admin-password");
  const adminContent = document.getElementById("admin-content");
  const bookingsTable = document.getElementById("bookings-table");

  const testSection = document.createElement("div");
  testSection.id = "test-section";
  testSection.style.display = "none"; // Скрываем изначально
  testSection.innerHTML = `
    <button id="run-tests">Запустить тесты</button>
    <div id="test-results"></div>
  `;

  document.querySelector(".title").after(testSection);

  const ADMIN_PASS = "nova1566"; // Укажи свой пароль

  loginBtn.addEventListener("click", () => {
    if (adminPassword.value === ADMIN_PASS) {
      document.getElementById("admin-login").style.display = "none";

      // Показываем секцию тестов и админ-контент
      testSection.style.display = "block";
      adminContent.style.display = "block";

      // Загружаем заявки
      loadBookings();
    } else {
      alert("Неверный пароль!");
    }
  });

  document.getElementById("run-tests").addEventListener("click", async () => {
    const testResults = document.getElementById("test-results");
    testResults.innerHTML = "<p>Запуск тестов...</p>";

    const tests = [
      { name: "API Доступность", result: await testApi() },
      { name: "Загрузка главной страницы", result: await testHomePage() },
      { name: "Проверка формы", result: await testForm() },
    ];

    testResults.innerHTML = `
      <table>
        <tr><th>Тест</th><th>Результат</th></tr>
        ${tests
          .map(
            (test) =>
              `<tr><td>${test.name}</td><td style="color: ${
                test.result ? "green" : "red"
              }">${test.result ? "✔ Успех" : "✖ Ошибка"}</td></tr>`
          )
          .join("")}
      </table>
    `;
  });

  async function testApi() {
    try {
      const response = await fetch(
        "https://dip-backend.onrender.com/api/bookings"
      );
      return response.ok;
    } catch {
      return false;
    }
  }

  async function testHomePage() {
    try {
      const response = await fetch("https://dip-frontend.onrender.com/");
      return response.ok;
    } catch {
      return false;
    }
  }

  async function testForm() {
    try {
      const response = await fetch("https://dip-frontend.onrender.com/");
      const text = await response.text();
      return text.includes('<form id="booking-form"');
    } catch {
      return false;
    }
  }

  async function loadBookings() {
    try {
      const response = await fetch(
        "https://dip-backend.onrender.com/api/bookings"
      );
      const bookings = await response.json();

      const rows = bookingsTable.querySelectorAll("tr:not(:first-child)");
      rows.forEach((row) => row.remove());

      bookings.forEach((booking) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${booking.name}</td>
            <td>${booking.phone}</td>
            <td>${booking.service}</td>
            <td>${booking.message || "—"}</td>
            <td>${new Date(booking.date).toLocaleString()}</td>
            <td class="status">${booking.status || "Новая"}</td>
            <td>
              <button class="mark-done">✓</button>
              <button class="delete">✗</button>
            </td>
          `;

        row.querySelector(".mark-done").addEventListener("click", async () => {
          await updateBookingStatus(booking.date, "Обработано");
          row.querySelector(".status").textContent = "Обработано";
        });

        row.querySelector(".delete").addEventListener("click", async () => {
          if (confirm("Удалить заявку?")) {
            await deleteBooking(booking.date);
            row.remove();
          }
        });

        bookingsTable.appendChild(row);
      });
    } catch (error) {
      console.error("Ошибка при загрузке заявок:", error);
    }
  }

  async function updateBookingStatus(date, status) {
    try {
      const response = await fetch(
        `https://dip-backend.onrender.com/api/bookings/${date}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка обновления статуса");
      }

      console.log("Статус заявки обновлен");
    } catch (error) {
      console.error("Ошибка при обновлении статуса заявки:", error);
    }
  }

  async function deleteBooking(date) {
    try {
      const response = await fetch(
        `https://dip-backend.onrender.com/api/bookings/${date}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка удаления заявки");
      }

      console.log("Заявка удалена");
    } catch (error) {
      console.error("Ошибка при удалении заявки:", error);
    }
  }
});

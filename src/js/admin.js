document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const adminPassword = document.getElementById("admin-password");
  const adminContent = document.getElementById("admin-content");
  const bookingsTable = document.getElementById("bookings-table");

  const ADMIN_PASS = "nova1566"; // Укажи свой пароль

  loginBtn.addEventListener("click", () => {
    if (adminPassword.value === ADMIN_PASS) {
      // Скрываем блок логина
      document.getElementById("admin-login").style.display = "none";

      // Показываем контент админки
      adminContent.style.display = "block";

      // Загружаем заявки
      loadBookings();
    } else {
      alert("Неверный пароль!");
    }
  });

  async function loadBookings() {
    try {
      const response = await fetch(
        "https://dip-backend.onrender.com/api/bookings"
      );
      const bookings = await response.json();

      // Удаляем все строки кроме первой (заголовки)
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

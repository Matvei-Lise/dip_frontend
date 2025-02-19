document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const adminPassword = document.getElementById("admin-password");
  const adminContent = document.getElementById("admin-content");
  const bookingsTable = document.getElementById("bookings-table");

  const ADMIN_PASS = "nova1566"; // Задай свой пароль

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

      bookings.forEach((booking) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${booking.name}</td>
            <td>${booking.phone}</td>
            <td>${booking.service}</td>
            <td>${booking.message}</td>
            <td>${new Date(booking.date).toLocaleString()}</td>
            <td>${booking.status || "Новая"}</td>
            <td>
              <button class="mark-done">✓</button>
              <button class="delete">✗</button>
            </td>
          `;

        row.querySelector(".mark-done").addEventListener("click", async () => {
          await updateBookingStatus(booking, "Обработано");
          row.cells[5].textContent = "Обработано";
        });

        row.querySelector(".delete").addEventListener("click", async () => {
          if (confirm("Удалить заявку?")) {
            await deleteBooking(booking);
            row.remove();
          }
        });

        bookingsTable.appendChild(row);
      });
    } catch (error) {
      console.error("Ошибка при загрузке заявок:", error);
    }
  }

  async function updateBookingStatus(booking, status) {
    await fetch("/api/bookings/" + booking.date, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function deleteBooking(booking) {
    await fetch("/api/bookings/" + booking.date, { method: "DELETE" });
  }
});

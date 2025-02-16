document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.querySelector("#booking form");
  if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = bookingForm.name.value.trim();
      const phone = bookingForm.phone.value.trim();
      const service = bookingForm.service.value;
      const phonePattern = /^[+]?[0-9]{10,15}$/;

      if (!name) {
        alert("Пожалуйста, введите ваше имя.");
        return;
      }

      if (!phonePattern.test(phone)) {
        alert("Введите корректный номер телефона (10–15 цифр).");
        return;
      }

      if (!service) {
        alert("Пожалуйста, выберите услугу.");
        return;
      }

      const formData = {
        name,
        phone,
        service,
        message: bookingForm.message.value,
      };

      try {
        const response = await fetch(
          "https://dip-backend.onrender.com/api/contact",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );

        const result = await response.json();

        const modal = document.querySelector("#modal");
        const modalMessage = document.querySelector("#modal-message");
        const closeModal = document.querySelector("#close-modal");

        if (result.success) {
          modalMessage.textContent =
            "Поздравляем, вы успешно записались на сеанс!";
          modal.style.display = "flex";
          bookingForm.reset();
        } else {
          modalMessage.textContent =
            result.message || "Произошла ошибка, попробуйте ещё раз.";
          modal.style.display = "flex";
        }

        closeModal.addEventListener("click", () => {
          modal.style.display = "none";
        });
      } catch (error) {
        console.error("Ошибка отправки формы:", error);
        alert("Ошибка сети, попробуйте ещё раз");
      }
    });
  }
  /* меню бургер */
  const burger = document.getElementById("burger-menu");
  const navLinks = document.querySelector("header nav ul");

  burger.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });

  // Закрытие меню при клике вне его
  document.addEventListener("click", (e) => {
    if (!burger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove("show");
    }
  });
});

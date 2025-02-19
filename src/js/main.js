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

  /* === Меню-бургер === */
  const burger = document.getElementById("burger-menu");
  const navLinks = document.querySelector("header nav ul");

  burger.addEventListener("click", (event) => {
    event.stopPropagation();
    burger.classList.toggle("active");
    navLinks.classList.toggle("show");
  });

  // Закрытие меню при клике вне его
  document.addEventListener("click", (event) => {
    if (!burger.contains(event.target) && !navLinks.contains(event.target)) {
      burger.classList.remove("active");
      navLinks.classList.remove("show");
    }
  });

  // Исключаем задержку появления меню
  navLinks.addEventListener("transitionend", () => {
    if (!navLinks.classList.contains("show")) {
      navLinks.style.display = "none";
    }
  });

  // При открытии меню сразу включаем display: flex
  burger.addEventListener("click", () => {
    if (navLinks.classList.contains("show")) {
      navLinks.style.display = "flex";
    }
  });
  const bookingBtn = document.getElementById("booking-btn");
  const bookingSection = document.getElementById("booking");

  if (bookingBtn && bookingSection) {
    bookingBtn.addEventListener("click", (event) => {
      event.preventDefault();
      bookingSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
});

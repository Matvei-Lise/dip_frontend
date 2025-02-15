const modal = document.querySelector("#modal");
const modalMessage = document.querySelector("#modal-message");
const closeModal = document.querySelector("#close-modal");

if (modal && modalMessage && closeModal) {
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.querySelector("#booking form");

  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      name: bookingForm.name.value,
      phone: bookingForm.phone.value,
      service: bookingForm.service.value,
      message: bookingForm.message.value,
    };

    try {
      const response = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        document.querySelector("#modal-message").textContent =
          "Поздравляем, вы успешно записались на сеанс!";
        document.querySelector("#modal").style.display = "flex";
        bookingForm.reset();
      } else {
        document.querySelector("#modal-message").textContent =
          "Произошла ошибка, попробуйте ещё раз.";
        document.querySelector("#modal").style.display = "flex";
      }
    } catch (error) {
      console.error("Ошибка отправки формы:", error);
      document.querySelector("#modal-message").textContent =
        "Ошибка сети, попробуйте ещё раз.";
      document.querySelector("#modal").style.display = "flex";
    }
  });

  document.querySelector("#close-modal").addEventListener("click", () => {
    document.querySelector("#modal").style.display = "none";
  });
});

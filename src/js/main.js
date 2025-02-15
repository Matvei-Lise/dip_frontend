document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.querySelector("#booking form");

  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      name: bookingForm.name.value,
      phone: bookingForm.phone.value,
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
        alert("Поздравляем, вы успешно записались на сеанс");
        bookingForm.reset();
      } else {
        alert("Произошла ошибка, попробуйте ещё раз");
      }
    } catch (error) {
      console.error("Ошибка отправки формы:", error);
      alert("Ошибка сети, попробуйте ещё раз");
    }
  });
});

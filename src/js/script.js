console.log("Добро пожаловать на лендинг!");

document.addEventListener("DOMContentLoaded", () => {
  console.log("Страница загружена");

  // Пример простой интерактивности
  const button = document.querySelector("button");
  button.addEventListener("click", () => {
    alert("Спасибо за интерес к нашему сайту!");
  });
});

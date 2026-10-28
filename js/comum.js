"use strict";

// O menu do celular abre pelo botão e fecha ao escolher um link.
const menuBotao = document.querySelector(".menu-botao");
const menu = document.getElementById("menu");

function fecharMenu() {
  menu.classList.remove("aberto");
  menuBotao.setAttribute("aria-expanded", "false");
  menuBotao.setAttribute("aria-label", "Abrir menu");
}

if (menuBotao && menu) {
  menuBotao.addEventListener("click", function () {
    const aberto = menu.classList.toggle("aberto");
    menuBotao.setAttribute("aria-expanded", String(aberto));
    menuBotao.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  });
  menu.addEventListener("click", function (evento) {
    if (evento.target.closest("a")) fecharMenu();
  });
  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape" && menu.classList.contains("aberto")) {
      fecharMenu();
      menuBotao.focus();
    }
  });
  document.addEventListener("click", function (evento) {
    if (!menu.contains(evento.target) && !menuBotao.contains(evento.target)) fecharMenu();
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 900) fecharMenu();
  });
}

// O próprio dialog cuida do foco e da tecla Escape.
const botoesFechar = document.querySelectorAll("[data-fechar]");
for (const botao of botoesFechar) {
  botao.addEventListener("click", function () {
    botao.closest("dialog").close();
  });
}

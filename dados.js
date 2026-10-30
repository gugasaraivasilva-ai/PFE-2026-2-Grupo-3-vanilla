"use strict";

// Funções pequenas usadas pela agenda.
// O prefixo evita misturar os dados deste projeto com os de outros sites.
const prefixo = "grupo-pkz-oto-v1-";

function lerLista(chave) {
  const texto = localStorage.getItem(prefixo + chave);
  if (!texto) return [];
  const lista = JSON.parse(texto);
  if (!Array.isArray(lista)) throw new Error("Formato de dados inválido.");
  return lista;
}

function salvarLista(chave, lista) {
  localStorage.setItem(prefixo + chave, JSON.stringify(lista));
}

function marcaDaPagina() {
  const parametros = new URLSearchParams(window.location.search);
  return parametros.get("marca") === "oto" ? "oto" : "pkz";
}

function nomeDaMarca(marca) {
  return marca === "oto" ? "One to One" : "PKZ";
}

function formatarData(data) {
  return data.toLocaleDateString("pt-BR");
}

// Usamos texto, e não HTML, para exibir nomes e outros campos digitados.
function criarTexto(tag, texto, classe) {
  const elemento = document.createElement(tag);
  elemento.textContent = texto;
  if (classe) elemento.className = classe;
  return elemento;
}

function lerReservas(marca) {
  const reservas = lerLista("reservas-" + marca);
  for (const reserva of reservas) {
    if (
      !reserva ||
      typeof reserva.id !== "string" ||
      !Number.isFinite(reserva.inicio) ||
      typeof reserva.nome !== "string" ||
      typeof reserva.email !== "string" ||
      typeof reserva.telefone !== "string"
    ) {
      throw new Error("Uma reserva está em formato inválido.");
    }
  }
  return reservas;
}

function resumoReserva(reserva) {
  const data = new Date(reserva.inicio);
  return (
    formatarData(data) +
    " às " +
    data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  );
}

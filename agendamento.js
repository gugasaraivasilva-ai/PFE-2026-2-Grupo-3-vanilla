"use strict";

// 1. Cada marca tem sua própria agenda. Mantivemos os horários da atividade.
const marcaAgenda = marcaDaPagina();
const diasAgenda = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const horasAgenda = [7, 8, 9, 10, 11, 17, 18, 19, 20];
let semanaAgenda = 0;
// No celular a tabela mostra um dia por vez. Começamos pelo dia de hoje (domingo vira segunda).
let diaMobile = Math.min((new Date().getDay() + 6) % 7, diasAgenda.length - 1);
let inicioEscolhido = 0;
let exclusaoEscolhida = "";
let focoReserva = null;
let reservasAgenda = [];

const grade = document.getElementById("grade");
const statusAgenda = document.getElementById("status-agenda");
const reservaModal = document.getElementById("reserva-modal");
const reservaForm = document.getElementById("reserva-form");
const erroReserva = document.getElementById("erro-reserva");
const exclusaoModal = document.getElementById("confirmar-exclusao");
const anterior = document.getElementById("anterior");
const proxima = document.getElementById("proxima");
const listaReservas = document.getElementById("lista-reservas");
const dadosJson = document.getElementById("dados-json");
const diasMobile = document.getElementById("dias-mobile");

const nomeMarcaAgenda = nomeDaMarca(marcaAgenda);
document.getElementById("nome-marca").textContent = nomeMarcaAgenda;
document.title = "Agendamento · " + nomeMarcaAgenda;
document.getElementById("voltar-marca").href =
  marcaAgenda === "oto" ? "one-to-one.html" : "pkz.html";
document.getElementById("whatsapp-agenda").href =
  "https://wa.me/" + (marcaAgenda === "oto" ? "5521971067347" : "5521972657266");
if (marcaAgenda === "oto") document.body.classList.add("oto");

// 2. Datas são montadas com números, evitando confusão entre dia e mês.
function dataDaAgenda(posicao, hora) {
  const hoje = new Date();
  const segunda = hoje.getDate() - ((hoje.getDay() + 6) % 7);
  return new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    segunda + semanaAgenda * 7 + posicao,
    hora,
    0,
    0,
    0,
  );
}

function ocupado(inicio) {
  for (const reserva of reservasAgenda) {
    if (reserva.inicio === inicio) return true;
  }
  return false;
}

function abrirReserva(inicio, botao) {
  inicioEscolhido = inicio;
  focoReserva = botao;
  erroReserva.textContent = "";
  reservaForm.reset();
  document.getElementById("resumo-horario").textContent =
    nomeMarcaAgenda + " · " + resumoReserva({ inicio: inicio });
  reservaModal.showModal();
}

// 3. Recriamos a tabela sempre que a semana ou as reservas mudam.
function mostrarAgenda() {
  statusAgenda.classList.remove("erro");
  try {
    reservasAgenda = lerReservas(marcaAgenda);
  } catch (erro) {
    grade.replaceChildren();
    listaReservas.replaceChildren();
    anterior.disabled = true;
    proxima.disabled = true;
    statusAgenda.classList.add("erro");
    statusAgenda.textContent =
      "Não foi possível ler as reservas. O armazenamento pode estar bloqueado ou os dados podem estar inválidos. Nada foi apagado. Para reiniciar os dados de teste desta marca, use a opção abaixo.";
    return;
  }
  anterior.disabled = semanaAgenda === 0;
  proxima.disabled = semanaAgenda === 3;
  document.getElementById("semana-texto").textContent =
    formatarData(dataDaAgenda(0, 0)) + " a " + formatarData(dataDaAgenda(5, 0));
  grade.replaceChildren(
    criarTexto("caption", "Horários da semana · " + nomeMarcaAgenda, "visualmente-oculto"),
  );
  const cabecalho = document.createElement("thead");
  const linhaDias = document.createElement("tr");
  const tituloHora = criarTexto("th", "Horário");
  tituloHora.scope = "col";
  linhaDias.appendChild(tituloHora);
  for (let dia = 0; dia < diasAgenda.length; dia++) {
    const celula = criarTexto("th", diasAgenda[dia]);
    celula.scope = "col";
    celula.appendChild(criarTexto("small", formatarData(dataDaAgenda(dia, 0)).slice(0, 5)));
    linhaDias.appendChild(celula);
  }
  cabecalho.appendChild(linhaDias);
  grade.appendChild(cabecalho);
  const corpo = document.createElement("tbody");
  for (const hora of horasAgenda) {
    const linha = document.createElement("tr");
    const horario = String(hora).padStart(2, "0") + ":00";
    const titulo = criarTexto("th", horario);
    titulo.scope = "row";
    linha.appendChild(titulo);
    for (let dia = 0; dia < diasAgenda.length; dia++) {
      const inicio = dataDaAgenda(dia, hora).getTime();
      const passou = inicio <= Date.now();
      const reservado = ocupado(inicio);
      const situacao = reservado ? "Reservado" : passou ? "Encerrado" : "Livre";
      const botao = criarTexto("button", situacao, "slot");
      botao.type = "button";
      botao.disabled = passou || reservado;
      botao.setAttribute("aria-label", resumoReserva({ inicio: inicio }) + ", " + situacao);
      botao.addEventListener("click", function () {
        abrirReserva(inicio, botao);
      });
      const celula = document.createElement("td");
      celula.appendChild(botao);
      linha.appendChild(celula);
    }
    corpo.appendChild(linha);
  }
  grade.appendChild(corpo);
  mostrarDiasMobile();
  mostrarReservas();
  dadosJson.textContent = JSON.stringify(reservasAgenda, null, 2);
}

function mostrarDiasMobile() {
  grade.dataset.dia = String(diaMobile);
  diasMobile.replaceChildren();
  for (let dia = 0; dia < diasAgenda.length; dia++) {
    const botao = criarTexto("button", diasAgenda[dia]);
    botao.type = "button";
    botao.setAttribute("aria-pressed", String(dia === diaMobile));
    botao.appendChild(criarTexto("small", formatarData(dataDaAgenda(dia, 0)).slice(0, 5)));
    botao.addEventListener("click", function () {
      diaMobile = dia;
      mostrarDiasMobile();
    });
    diasMobile.appendChild(botao);
  }
}

function mostrarReservas() {
  listaReservas.replaceChildren();
  if (reservasAgenda.length === 0) {
    listaReservas.appendChild(
      criarTexto("p", "Você ainda não fez uma reserva nesta marca.", "vazio"),
    );
    return;
  }
  const ordenadas = reservasAgenda.slice().sort(function (a, b) {
    return a.inicio - b.inicio;
  });
  for (const reserva of ordenadas) {
    const linha = document.createElement("article");
    linha.className = "item-lista";
    const texto = document.createElement("div");
    texto.appendChild(criarTexto("strong", resumoReserva(reserva)));
    texto.appendChild(criarTexto("p", reserva.nome));
    texto.appendChild(
      criarTexto(
        "small",
        reserva.inicio <= Date.now()
          ? "Horário passado · registro local"
          : "Reserva local · " + nomeMarcaAgenda,
      ),
    );
    linha.appendChild(texto);
    if (reserva.inicio > Date.now()) {
      const cancelar = criarTexto("button", "Cancelar", "link-botao");
      cancelar.type = "button";
      cancelar.setAttribute("aria-label", "Cancelar reserva de " + resumoReserva(reserva));
      cancelar.addEventListener("click", function () {
        exclusaoEscolhida = reserva.id;
        document.getElementById("exclusao-titulo").textContent = "Cancelar reserva?";
        document.getElementById("exclusao-texto").textContent =
          nomeMarcaAgenda + " · " + resumoReserva(reserva) + ". O horário voltará a ficar livre.";
        exclusaoModal.showModal();
      });
      linha.appendChild(cancelar);
    }
    listaReservas.appendChild(linha);
  }
}

anterior.addEventListener("click", function () {
  if (semanaAgenda > 0) semanaAgenda--;
  diaMobile = 0;
  mostrarAgenda();
});
proxima.addEventListener("click", function () {
  if (semanaAgenda < 3) semanaAgenda++;
  diaMobile = 0;
  mostrarAgenda();
});

// 4. Conferimos os dados e o horário novamente na confirmação.
reservaForm.addEventListener("submit", function (evento) {
  evento.preventDefault();
  erroReserva.textContent = "";
  const nome = reservaForm.nome.value.trim();
  const email = reservaForm.email.value.trim().toLowerCase();
  const telefone = reservaForm.telefone.value.trim();
  const digitos = telefone.replace(/\D/g, "");
  if (nome.length < 2) {
    erroReserva.textContent = "Informe um nome com pelo menos dois caracteres.";
    return;
  }
  if (!/^[0-9 ()+\-]+$/.test(telefone) || digitos.length < 10 || digitos.length > 13) {
    erroReserva.textContent = "Informe um telefone válido com DDD (10 a 13 números).";
    return;
  }
  try {
    reservasAgenda = lerReservas(marcaAgenda);
    if (inicioEscolhido <= Date.now() || ocupado(inicioEscolhido)) {
      erroReserva.textContent = "Este horário não está mais disponível. Volte e escolha outro.";
      return;
    }
    const reserva = {
      id: String(inicioEscolhido),
      inicio: inicioEscolhido,
      nome: nome,
      email: email,
      telefone: telefone,
    };
    reservasAgenda.push(reserva);
    salvarLista("reservas-" + marcaAgenda, reservasAgenda);
    reservaModal.close();
    reservaForm.reset();
    mostrarAgenda();
    statusAgenda.textContent =
      "Reserva salva neste navegador: " + nomeMarcaAgenda + ", " + resumoReserva(reserva) + ".";
    statusAgenda.tabIndex = -1;
    statusAgenda.focus();
  } catch (erro) {
    erroReserva.textContent =
      "Não foi possível salvar a reserva. Verifique o armazenamento do navegador. Nenhuma confirmação foi feita.";
  }
});

reservaModal.addEventListener("close", function () {
  if (focoReserva && focoReserva.isConnected) focoReserva.focus();
});

// 5. Exclusão sempre pede confirmação e afeta somente a marca atual.
document.getElementById("limpar-reservas").addEventListener("click", function () {
  exclusaoEscolhida = "todas";
  document.getElementById("exclusao-titulo").textContent = "Limpar reservas de teste?";
  document.getElementById("exclusao-texto").textContent =
    "Isso apaga todas as reservas locais da " +
    nomeMarcaAgenda +
    ". Os dados da outra marca serão mantidos.";
  exclusaoModal.showModal();
});
document.getElementById("excluir-confirmado").addEventListener("click", function () {
  try {
    if (exclusaoEscolhida === "todas") {
      localStorage.removeItem(prefixo + "reservas-" + marcaAgenda);
    } else {
      const atuais = lerReservas(marcaAgenda);
      const restantes = atuais.filter(function (reserva) {
        return reserva.id !== exclusaoEscolhida;
      });
      salvarLista("reservas-" + marcaAgenda, restantes);
    }
    exclusaoModal.close();
    mostrarAgenda();
    statusAgenda.textContent =
      exclusaoEscolhida === "todas"
        ? "Reservas desta marca apagadas."
        : "Reserva cancelada. O horário está disponível novamente.";
    statusAgenda.tabIndex = -1;
    statusAgenda.focus();
  } catch (erro) {
    document.getElementById("exclusao-texto").textContent =
      "Não foi possível excluir. Verifique o armazenamento do navegador.";
  }
});
document.getElementById("ver-dados").addEventListener("click", function () {
  dadosJson.hidden = !dadosJson.hidden;
  this.textContent = dadosJson.hidden ? "Ver dados salvos" : "Esconder dados salvos";
  this.setAttribute("aria-expanded", String(!dadosJson.hidden));
});

// Outra aba pode reservar um horário enquanto esta está aberta.
window.addEventListener("storage", function (evento) {
  if (evento.key === prefixo + "reservas-" + marcaAgenda || evento.key === null) mostrarAgenda();
});
window.addEventListener("focus", mostrarAgenda);
mostrarAgenda();

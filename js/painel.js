"use strict";

let perfilAluno = lerSessao();
const perfilForm = document.getElementById("perfil-form");

// Sem sessão, mostramos o formulário de acesso. É apenas um fluxo demonstrativo.
if (!perfilAluno) {
  window.location.replace("login.html");
} else {
  atualizarPainel();
}

function atualizarPainel() {
  document.getElementById("saudacao").textContent = "Olá, " + perfilAluno.nome;
  document.getElementById("perfil-nome").textContent = perfilAluno.nome;
  document.getElementById("perfil-inicial").textContent = perfilAluno.nome.charAt(0).toUpperCase();
  document.getElementById("perfil-marca").textContent = nomeDaMarca(perfilAluno.marca);
  document.getElementById("data-painel").textContent =
    new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" }) +
    " · " +
    nomeDaMarca(perfilAluno.marca);
  document.getElementById("novo-agendamento").href = "agendamento.html?marca=" + perfilAluno.marca;
  perfilForm.nome.value = perfilAluno.nome;
  perfilForm.marca.value = perfilAluno.marca;
  mostrarAgendaAluno();
}

function mostrarAgendaAluno() {
  const lista = document.getElementById("agenda-aluno");
  lista.replaceChildren();
  try {
    // Filtramos por marca e e-mail: cada perfil vê seus próprios registros locais.
    const reservas = lerReservas(perfilAluno.marca)
      .filter(function (reserva) {
        return reserva.email === perfilAluno.email && reserva.inicio > Date.now();
      })
      .sort(function (a, b) {
        return a.inicio - b.inicio;
      });
    document.getElementById("proximo-treino").textContent = reservas.length
      ? resumoReserva(reservas[0])
      : "Nenhum agendamento";
    if (!reservas.length)
      lista.appendChild(
        criarTexto(
          "p",
          "Você ainda não tem horários futuros nesta marca. Escolha Agendar aula para começar.",
          "vazio",
        ),
      );
    for (const reserva of reservas) {
      const linha = document.createElement("div");
      linha.className = "item-lista";
      const info = document.createElement("div");
      info.appendChild(criarTexto("small", resumoReserva(reserva)));
      info.appendChild(criarTexto("p", "Aula experimental · " + nomeDaMarca(perfilAluno.marca)));
      linha.appendChild(info);
      linha.appendChild(criarTexto("span", "Salvo neste navegador", "selo"));
      const gerenciar = criarTexto("a", "Gerenciar", "texto-link");
      gerenciar.href = "agendamento.html?marca=" + perfilAluno.marca + "#reservas-titulo";
      linha.appendChild(gerenciar);
      lista.appendChild(linha);
    }
  } catch (erro) {
    document.getElementById("proximo-treino").textContent = "Indisponível";
    lista.appendChild(
      criarTexto(
        "p",
        "Não foi possível carregar os agendamentos locais. Verifique os dados na página da agenda.",
        "erro",
      ),
    );
  }
}
perfilForm.addEventListener("submit", function (evento) {
  evento.preventDefault();
  const nome = perfilForm.nome.value.trim();
  const mensagem = document.getElementById("status-perfil");
  if (nome.length < 2) {
    mensagem.textContent = "Informe um nome com pelo menos dois caracteres.";
    return;
  }
  try {
    const atualizado = {
      nome: nome,
      email: perfilAluno.email,
      marca: perfilForm.marca.value,
      demo: perfilAluno.demo,
    };
    if (!perfilAluno.demo) {
      const contas = lerLista("contas");
      for (const conta of contas) {
        if (conta.email === perfilAluno.email) {
          conta.nome = nome;
          conta.marca = atualizado.marca;
        }
      }
      salvarLista("contas", contas);
    }
    salvarSessao(atualizado);
    perfilAluno = atualizado;
    atualizarPainel();
    mensagem.textContent = "Alterações salvas.";
  } catch (erro) {
    mensagem.textContent =
      "Não foi possível salvar as alterações. Verifique o armazenamento do navegador.";
  }
});

document.getElementById("sair").addEventListener("click", function () {
  try {
    sessionStorage.removeItem(prefixo + "sessao");
  } catch (erro) {
    /* A sessão já pode estar indisponível. */
  }
  window.location.replace("login.html");
});
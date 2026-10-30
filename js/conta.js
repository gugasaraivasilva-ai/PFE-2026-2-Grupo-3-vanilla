"use strict";

const marcaConta = marcaDaPagina();
const erroConta = document.getElementById("erro-conta");
const loginForm = document.getElementById("login-form");

for (const link of document.querySelectorAll("[data-marca-link]")) {
  link.href = link.getAttribute("href") + "?marca=" + marcaConta;
}

// Esta é a única função com a API de criptografia do navegador.
// Ela transforma a senha de TESTE em um resumo para conferir contas de teste já existentes.
// Isso não substitui um servidor nem torna este protótipo uma área segura.
async function resumirSenha(senha) {
  const bytes = new TextEncoder().encode(senha);
  const resultado = await crypto.subtle.digest("SHA-256", bytes);
  let resumo = "";
  for (const numero of new Uint8Array(resultado)) resumo += numero.toString(16).padStart(2, "0");
  return resumo;
}

function entrar(perfil) {
  salvarSessao(perfil);
  window.location.href = "area-aluno.html";
}

if (loginForm) {
  document.getElementById("preencher-demo").addEventListener("click", function () {
    loginForm.email.value = "aluno@demo.com";
    loginForm.senha.value = "demo123";
    loginForm.querySelector('[type="submit"]').focus();
  });
  document.getElementById("recuperar").addEventListener("click", function () {
    document.getElementById("recuperacao").showModal();
  });
  loginForm.addEventListener("submit", async function (evento) {
    evento.preventDefault();
    erroConta.textContent = "";
    const email = loginForm.email.value.trim().toLowerCase();
    const senha = loginForm.senha.value;
    try {
      if (email === "aluno@demo.com" && senha === "demo123") {
        entrar({ nome: "Aluno de demonstração", email: email, marca: marcaConta, demo: true });
        return;
      }
      const contas = lerLista("contas");
      const resumo = await resumirSenha(senha);
      for (const conta of contas) {
        if (conta.email === email && conta.senha === resumo) {
          entrar({ nome: conta.nome, email: conta.email, marca: conta.marca, demo: false });
          return;
        }
      }
      erroConta.textContent = "E-mail ou senha incorretos. Tente novamente.";
    } catch (erro) {
      erroConta.textContent =
        "Não foi possível acessar os dados locais. Use um navegador atualizado com armazenamento habilitado e abra o projeto pelo Live Server ou HTTPS.";
    }
  });
}

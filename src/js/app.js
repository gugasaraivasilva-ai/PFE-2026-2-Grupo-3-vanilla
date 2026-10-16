// ===== Header e footer =====
// Escritos uma vez só aqui e inseridos em todas as páginas.
// Cada página só precisa ter <header></header>, <footer></footer> e carregar este arquivo.
// Os links usam "index.html#..." para funcionar de qualquer página.
const header = document.querySelector("header");
const footer = document.querySelector("footer");

if (header) {
  header.innerHTML = `
    <div class="marcas">
      <a href="index.html#pkz">
        <img src="../../midias/logo-pkz.svg" alt="Logo PKZ">
      </a>
      <span>×</span>
      <a href="index.html#one-to-one">
        <img src="../../midias/logo-one-to-one.svg" alt="Logo One to One">
      </a>
    </div>

    <nav>
      <a href="index.html#pkz">PKZ</a>
      <a href="index.html#one-to-one">One to One</a>
      <a href="agendamento.html" class="botao">Agendar aula</a>
    </nav>
  `;
}

if (footer) {
  footer.innerHTML = `
    <p>&copy; 2026 Grupo PKZ · One to One — protótipo acadêmico (IBMEC)</p>
  `;
}

// ===== Agendamento de aula =====
// Pega os elementos da página pelo id
const form = document.getElementById("form-agendamento");
const campoData = document.getElementById("data");
const mensagem = document.getElementById("mensagem");

// Só roda se a página tiver o formulário (assim o app.js pode ser usado em outras páginas)
if (form) {
  // Data mínima = hoje, no formato AAAA-MM-DD que o input date espera
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  campoData.min = `${ano}-${mes}-${dia}`;

  form.addEventListener("submit", function (evento) {
    // Impede a página de recarregar ao enviar
    evento.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const unidade = document.getElementById("unidade").value;
    const horario = document.getElementById("horario").value;
    const data = campoData.value;

    // Não atende aos domingos (getDay() === 0). O "T00:00" evita erro de fuso horário.
    const diaDaSemana = new Date(`${data}T00:00`).getDay();
    if (diaDaSemana === 0) {
      mensagem.textContent = "Não temos aulas aos domingos. Escolha outro dia.";
      mensagem.className = "erro";
      return;
    }

    // Mostra a data no formato brasileiro (DD/MM/AAAA)
    const dataFormatada = data.split("-").reverse().join("/");

    mensagem.textContent = `Pronto, ${nome}! Aula na ${unidade} agendada para ${dataFormatada} às ${horario}.`;
    mensagem.className = "sucesso";

    form.reset();
  });
}

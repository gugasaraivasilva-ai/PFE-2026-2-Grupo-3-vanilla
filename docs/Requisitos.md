# Requisitos — Portal PKZ / One to One

> Projeto Front-End · IBMEC · 2026.2 · Grupo 3 — sexta-feira
> Revisão: 29/10/2026 · Referência funcional: `pkzfinal4 2.zip`, com correção dos caminhos de arquivos.

## 1. Finalidade e classificação

Este documento descreve comportamentos verificáveis da versão entregue e complementa o [Documento de Visão](<Doc visão.md>). Os identificadores RF01–RF13 retomam os temas da documentação anterior, com escopo atualizado; RF14 em diante detalham as interações implementadas.

**Implementado** significa presente no front-end. **Demonstrativo** indica funcionamento com dados locais ou fictícios. **Futuro** identifica algo que não foi entregue. Nenhum requisito abaixo pressupõe backend.

## 2. Requisitos funcionais

| ID | Requisito e critério de aceitação | Evidência principal |
|---|---|---|
| RF01 | Apresentar PKZ e One to One como partes do mesmo grupo. O hub deve explicar essa relação em texto. | `html/index.html` |
| RF02 | Permitir escolher PKZ ou One to One no hub por links identificáveis. | `html/index.html` |
| RF03 | Abrir a página correspondente à marca escolhida, com identidade e conteúdo próprios. | `html/pkz.html`; `html/one-to-one.html` |
| RF04 | Exibir apresentação, método e serviços de cada marca. Na PKZ, incluir avaliação, planejamento e reavaliação. | Páginas das marcas |
| RF05 | Carregar banner, logos e galerias locais com textos alternativos. O requisito atual contempla imagens, não vídeos. | `assets/`; elementos `img` |
| RF06 | Apresentar funções de acompanhamento e retratos identificados como ilustrativos. Não atribuir nomes ou credenciais profissionais fictícios. | Seções de equipe |
| RF07 | Permitir expandir e recolher respostas do FAQ. As duas páginas devem explicar dúvidas sobre público, método e contato. | Elementos `details` e `summary` |
| RF08 | Abrir WhatsApp correspondente à marca. PKZ e One to One devem manter seus destinos próprios. | Links `wa.me`; `js/agendamento.js` |
| RF09 | Oferecer chamadas para Agendar e contato, sem chamada para criar conta. | Páginas institucionais |
| RF10 | Disponibilizar Área do Atleta para ambas as marcas, usando o formulário de login. Não apresentar cadastro público. | `html/login.html`; menus |
| RF11 | Redirecionar o acesso ao painel para o login quando não houver sessão demonstrativa válida. Este controle não é autenticação segura. | `lerSessao()`; `js/painel.js` |
| RF12 | Mostrar painel com agenda local, indicadores fictícios, frequência semanal de exemplo, observações e histórico. Identificar os dados de exemplo. | `html/area-aluno.html` |
| RF13 | Nos menus das marcas, permitir Início, outra marca, Agendar e Área do Atleta. Os dois últimos links devem transportar a marca selecionada. | Parâmetro `marca=pkz` ou `marca=oto` |
| RF14 | Preencher a conta de demonstração pelo botão próprio e entrar com `aluno@demo.com` / `demo123`. Credenciais incorretas devem gerar mensagem, sem abrir o painel. | `js/conta.js` |
| RF15 | Abrir orientação em “Esqueci minha senha”, informando que não há envio de e-mail. Permitir fechar o diálogo e voltar ao login. | Diálogo `recuperacao` |
| RF16 | Exibir a semana atual e as três seguintes, de segunda a sábado, nos horários 07, 08, 09, 10, 11, 17, 18, 19 e 20 horas. Marcar slots livres, reservados ou encerrados. | `js/agendamento.js` |
| RF17 | Permitir reserva sem login com nome, e-mail e telefone. Exigir nome com ao menos dois caracteres, e-mail válido pelo formulário HTML e telefone com 10–13 dígitos e caracteres aceitos. Revalidar se o horário continua futuro e livre antes de salvar. | `reserva-form`; evento `submit` |
| RF18 | Salvar a reserva localmente por marca, atualizar a grade e listar registros em ordem de data. Ao recarregar no mesmo ambiente, os registros devem permanecer. | `localStorage`; `mostrarReservas()` |
| RF19 | Permitir cancelar reserva futura após confirmação. “Manter” não deve excluir; confirmar deve liberar o slot. Também permitir limpar todos os testes da marca após confirmação. | Diálogo `confirmar-exclusao` |
| RF20 | No painel, listar somente reservas futuras com a marca e o e-mail da sessão. O link Gerenciar deve levar à agenda da mesma marca. | `mostrarAgendaAluno()` |
| RF21 | Abrir os três relatórios fictícios do histórico e acionar a impressão do navegador. Salvar em PDF depende da opção disponibilizada pelo navegador. | `relatorios`; `window.print()` |
| RF22 | Permitir alterar nome e marca no perfil. Rejeitar nome com menos de dois caracteres e atualizar a agenda exibida após salvar. Permitir sair, removendo a sessão. | `perfil-form`; botão `sair` |
| RF23 | Exibir mensagens quando os dados locais não puderem ser lidos ou gravados, sem apresentar confirmação falsa. Oferecer visualização JSON e limpeza dos dados de teste da marca. | `js/agendamento.js`; `js/dados.js` |
| RF24 | Em telas pequenas, permitir abrir o menu, seguir um link e fechar o menu pelo botão ou pela tecla Escape. | `js/comum.js` |

## 3. Regras de funcionamento da demonstração

| ID | Regra |
|---|---|
| RN01 | A agenda é pública na demonstração e não exige criação de conta nem login. O painel usa sessão local. |
| RN02 | Cada marca tem uma lista separada de reservas. O horário reservado fica indisponível naquela lista. |
| RN03 | Uma reserva ocupa o slot inteiro na marca. Não existem seis vagas simultâneas, seleção de professor ou fila de espera no código atual. |
| RN04 | A agenda usa data e hora locais do dispositivo. Seus horários não são uma declaração de funcionamento da empresa. |
| RN05 | Reservas ficam em `localStorage`; a sessão fica em `sessionStorage`. Não há sincronização entre dispositivos. |
| RN06 | A página de agendamento exibe todos os registros locais da marca; somente o painel filtra também por e-mail. Não há isolamento seguro de contas. |
| RN07 | A conta de demonstração é fixa. O código ainda reconhece contas de teste legadas existentes no navegador, mas não oferece criação de contas novas. |
| RN08 | A alteração do perfil demonstrativo permanece na sessão. Um novo login de demonstração pode restaurar o nome padrão. |
| RN09 | Horários passados não podem ser reservados nem cancelados individualmente pela lista; a limpeza geral remove os registros de teste da marca. |
| RN10 | Recuperação de senha é apenas orientação. Dados de frequência, sessões restantes, treinos e relatórios são exemplos, não calculados a partir da agenda. |
| RN11 | Reservar na demonstração não notifica a equipe. Atendimento real depende do WhatsApp. |

## 4. Requisitos não funcionais

| ID | Critério | Situação e limite |
|---|---|---|
| RNF01 — Usabilidade | Rótulos claros, navegação consistente e separação entre conteúdo institucional e demonstração. | Presente no código; avaliação com usuários reais não foi documentada. |
| RNF02 — Responsividade | Base para celular e pontos de quebra em 480, 640, 900 e 1200 px. Sem rolagem horizontal da página; a grade pode rolar dentro do seu contêiner. | Implementado; verificações em Chromium a 375 e 1440 px registradas na correção. |
| RNF03 — Acessibilidade | Rótulos, textos alternativos, foco visível, skip link, teclado e mensagens acessíveis. | Recursos presentes. Auditoria completa e resultado WAVE não estão comprovados nesta revisão. |
| RNF04 — Identidade | Preservar logos e coerência visual entre as marcas, identificando imagens ilustrativas. | Implementado. Validação comercial de mídia ainda é necessária. |
| RNF05 — Desempenho | Utilizar imagens locais em WebP, logos SVG e carregamento adiado quando adequado. | Verificável no código; não se declara nota de Lighthouse ou tempo máximo medido. |
| RNF06 — Compatibilidade | Funcionar em navegadores modernos com suporte a `dialog`, JavaScript e armazenamento local. | Testado em Chromium; Safari e Firefox exigem verificação própria. |
| RNF07 — Privacidade | Usar dados fictícios na apresentação; não tratar armazenamento local como controle de acesso seguro. | Restrição de uso da versão acadêmica. Não constitui certificação de conformidade legal. |
| RNF08 — Organização | Manter HTML, CSS, JavaScript e imagens em pastas separadas, com CSS por página e arquivo comum. | Implementado. Os caminhos devem respeitar a pasta `html/`. |
| RNF09 — Consistência | Mesmos componentes e comportamentos para login, painel e agenda nas duas marcas. | Páginas compartilhadas, adaptadas pela marca. |

## 5. Organização dos arquivos

| Área | Arquivos |
|---|---|
| HTML | `index.html`, `pkz.html`, `one-to-one.html`, `login.html`, `agendamento.html`, `area-aluno.html`, dentro de `html/`. |
| CSS | `comum.css`, `index.css`, `pkz.css`, `one-to-one.css`, `login.css`, `agendamento.css`, `painel.css`. |
| JavaScript | `comum.js`, `dados.js`, `conta.js`, `agendamento.js`, `painel.js`. |
| Mídias do site | Logos SVG e imagens WebP em `assets/`. |
| Entrada adicional | `index.html` da raiz, apenas na versão corrigida, encaminha para `html/index.html`. |

## 6. Verificação da versão de referência

A correção da estrutura de pastas incluiu verificações no navegador Chromium. Esta tabela registra o alcance dessas verificações; não equivale a teste em todos os dispositivos físicos.

| Caso | Resultado registrado |
|---|---|
| Resolver caminhos locais dos HTMLs | Arquivos referenciados encontrados. |
| Abrir entrada da raiz | Encaminhamento para `html/index.html` funcionando. |
| Carregar imagens e estilos das páginas públicas | Sem falhas de carregamento nos testes. |
| Usar páginas a 375 e 1440 px | Sem transbordamento horizontal da página; menu móvel funcionando. |
| Login incorreto, recuperação e demonstração nas duas marcas | Mensagem, diálogo e entrada no painel funcionando. |
| Abrir relatórios do painel | Diálogos de exemplo funcionando. |
| Reservar, recarregar e consultar no painel | Persistência local e filtro da marca funcionando. |
| Cancelar e sair | Reserva removida e retorno ao login funcionando. |
| Erros de JavaScript e respostas HTTP de erro nos fluxos testados | Nenhum identificado. |

**Limites da verificação:** impressão física/PDF, auditoria WAVE, navegadores diferentes, usuários reais, validação comercial e concorrência real entre clientes não foram comprovados por esses testes.

## 7. Itens excluídos e evoluções futuras

| Item | Classificação |
|---|---|
| Cadastro público | Excluído por solicitação; não tratar como próxima entrega automática. |
| Autenticação, permissões e recuperação de senha reais | Evolução com backend. |
| Agenda compartilhada, capacidade por horário, fila e notificações | Evolução futura; exige validação das regras do cliente. |
| Relatórios preenchidos por professores e séries reais de desempenho | Evolução futura; os exemplos do painel não substituem esse sistema. |
| Financeiro, pagamentos e integração com aplicativo interno | Fora do escopo acadêmico atual. |
| Vídeos e equipe com identificação profissional completa | Dependem de conteúdo e autorização do cliente; não estão implementados na versão atual. |
| Ajuste do cartão “sessões um a um” na One to One | Pendência editorial identificada, pois o FAQ não garante atendimento exclusivo. |

## 8. Relação entre requisitos e tarefas

| Tarefas da AHT | Requisitos relacionados |
|---|---|
| 1 e 2 — conhecer o grupo e escolher marca | RF01–RF03 |
| 3 e 4 — explorar as marcas | RF04–RF07, RF09, RF13, RF24 |
| 5 — entrar em contato | RF08 |
| 6 — acessar demonstração | RF10, RF11, RF14, RF15 |
| 7 — consultar painel | RF12, RF20–RF22 |
| 8 — usar agenda local | RF16–RF19, RF23 |

Base: código da versão final, alterações confirmadas do projeto e [transcrição preservada](transcricao.md). As diferenças entre a operação desejada pelo cliente e a demonstração foram mantidas explícitas.

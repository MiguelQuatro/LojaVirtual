// --- Estrutura do carrinho: items com { id, nome, preco, quantidade }
let carrinho = carregarCarrinhoSalvo();
let estoque = carregarEstoqueSalvo();
let promocao = carregarPromocaoSalva();

// =========================================================
// DARK MODE
// =========================================================
function toggleDarkMode() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('boutique-tema', isDark ? 'dark' : 'light');
  document.querySelector('.icon-tema').textContent = isDark ? '☀️' : '🌙';
}

function carregarTema() {
  const tema = localStorage.getItem('boutique-tema');
  if (tema === 'dark') {
    document.body.classList.add('dark');
    const icone = document.querySelector('.icon-tema');
    if (icone) icone.textContent = '☀️';
  }
}

// =========================================================
// LOGIN
// =========================================================
function abrirLogin() {
  document.getElementById('loginOverlay').classList.add('aberto');
}

function fecharLogin() {
  document.getElementById('loginOverlay').classList.remove('aberto');
}

function trocarAba(aba) {
  const formEntrar = document.getElementById('formEntrar');
  const formCadastrar = document.getElementById('formCadastrar');
  const tabs = document.querySelectorAll('.login-tab');

  if (aba === 'entrar') {
    formEntrar.style.display = 'flex';
    formCadastrar.style.display = 'none';
    tabs[0].classList.add('ativo');
    tabs[1].classList.remove('ativo');
  } else {
    formEntrar.style.display = 'none';
    formCadastrar.style.display = 'flex';
    tabs[0].classList.remove('ativo');
    tabs[1].classList.add('ativo');
  }
}

// Fechar login clicando fora
document.getElementById('loginOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('loginOverlay')) fecharLogin();
});

// Form entrar
document.getElementById('formEntrar').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const senha = document.getElementById('loginSenha').value;
  const erro = document.getElementById('erroEntrar');

  if (!email || !senha) { erro.textContent = 'Preencha todos os campos.'; return; }
  if (senha.length < 6) { erro.textContent = 'Senha deve ter pelo menos 6 caracteres.'; return; }

  erro.textContent = '';
  exibirToast(`Bem-vindo! 👋`);
  fecharLogin();

  // Atualiza botão de login
  const btnLogin = document.querySelector('.btn-login');
  btnLogin.innerHTML = `<span>👤</span> ${email.split('@')[0]}`;
});

// Form cadastrar
document.getElementById('formCadastrar').addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = document.getElementById('cadNome').value.trim();
  const email = document.getElementById('cadEmail').value.trim();
  const senha = document.getElementById('cadSenha').value;
  const confirmar = document.getElementById('cadConfirmar').value;
  const erro = document.getElementById('erroCadastrar');

  if (!nome || !email || !senha || !confirmar) { erro.textContent = 'Preencha todos os campos.'; return; }
  if (nome.length < 3) { erro.textContent = 'Nome deve ter pelo menos 3 caracteres.'; return; }
  if (senha.length < 6) { erro.textContent = 'Senha deve ter pelo menos 6 caracteres.'; return; }
  if (senha !== confirmar) { erro.textContent = 'As senhas não coincidem.'; return; }

  erro.textContent = '';
  exibirToast(`Conta criada com sucesso! 🎉`);
  fecharLogin();

  const btnLogin = document.querySelector('.btn-login');
  btnLogin.innerHTML = `<span>👤</span> ${nome.split(' ')[0]}`;
});

// =========================================================
// HELPERS DOM
// =========================================================
function todosOsCards() {
  return Array.from(document.querySelectorAll('.card'));
}
function cardPorId(id) {
  return document.querySelector(`.card[data-id="${id}"]`);
}
function idPorNome(nome) {
  const c = Array.from(document.querySelectorAll('.card')).find(x => x.dataset.nome === nome);
  return c ? c.dataset.id : null;
}

// =========================================================
// ESTOQUE
// =========================================================
function carregarEstoqueSalvo() {
  try {
    const raw = JSON.parse(localStorage.getItem('boutique-estoque')) || {};
    const result = {};
    todosOsCards().forEach(card => {
      const id = card.dataset.id;
      const nome = card.dataset.nome;
      if (raw[id] != null) result[id] = raw[id];
      else if (raw[nome] != null) result[id] = raw[nome];
    });
    return result;
  } catch { return {}; }
}

function salvarEstoque() {
  localStorage.setItem('boutique-estoque', JSON.stringify(estoque));
}

function inicializarEstoque() {
  const cards = todosOsCards();
  let mudou = false;
  cards.forEach(card => {
    const id = card.dataset.id;
    if (estoque[id] == null) {
      estoque[id] = Math.floor(Math.random() * 9);
      mudou = true;
    }
  });
  if (mudou) salvarEstoque();
}

// =========================================================
// PROMOÇÃO
// =========================================================
function carregarPromocaoSalva() {
  try {
    const raw = JSON.parse(localStorage.getItem('boutique-promocao')) || null;
    if (!raw) return null;
    if (raw.id) return raw;
    if (raw.nome) {
      const id = idPorNome(raw.nome);
      return id ? { id, desconto: raw.desconto } : null;
    }
    return null;
  } catch { return null; }
}

function salvarPromocao() {
  localStorage.setItem('boutique-promocao', JSON.stringify(promocao));
}

function inicializarPromocao() {
  const cards = todosOsCards();
  const ids = cards.map(c => c.dataset.id);
  if (promocao && ids.includes(promocao.id)) return;
  if (!ids.length) return;
  const indice = Math.floor(Math.random() * ids.length);
  promocao = { id: ids[indice], desconto: Math.floor(Math.random() * 31) + 10 };
  salvarPromocao();
}

// =========================================================
// CARRINHO
// =========================================================
function carregarCarrinhoSalvo() {
  try {
    const raw = JSON.parse(localStorage.getItem('boutique-carrinho')) || [];
    if (!raw.length) return [];
    if (raw[0] && raw[0].id) return raw;
    if (raw.every(it => it.nome)) {
      const map = new Map();
      raw.forEach(it => {
        const id = idPorNome(it.nome) || it.nome;
        if (!map.has(id)) map.set(id, { id, nome: it.nome, preco: it.preco, quantidade: 0 });
        map.get(id).quantidade += (it.quantidade || 1);
      });
      return Array.from(map.values());
    }
    return [];
  } catch { return []; }
}

function salvarCarrinho() {
  localStorage.setItem('boutique-carrinho', JSON.stringify(carrinho));
}

// =========================================================
// EVENTOS DO CARRINHO E CARDS
// =========================================================
document.addEventListener('click', (evento) => {
  // Botão "Adicionar" do card
  const botao = evento.target.closest('.comprar-btn');
  if (botao && !botao.disabled) {
    const card = botao.closest('.card');
    const id = card.dataset.id;
    const nome = card.dataset.nome;
    const preco = parseFloat(card.dataset.preco);

    const existente = carrinho.find(item => item.id === id);
    const quantidadeNoCarrinho = existente ? existente.quantidade : 0;
    const disponivel = (estoque[id] || 0) - quantidadeNoCarrinho;

    if (disponivel <= 0) { exibirToast(`Estoque insuficiente para ${nome}.`); return; }

    if (existente) existente.quantidade += 1;
    else carrinho.push({ id, nome, preco, quantidade: 1 });

    salvarCarrinho();
    renderCarrinho();
    atualizarCards();
    exibirToast(`${nome} adicionado ao carrinho!`);
    return;
  }

  // Botão + do card
  const cardInc = evento.target.closest('.card-increment');
  if (cardInc) {
    const id = cardInc.dataset.id;
    const item = carrinho.find(i => i.id === id);
    if (!item) return;
    const disponivel = (estoque[id] || 0) - item.quantidade;
    if (disponivel <= 0) { exibirToast('Não há mais unidades disponíveis.'); return; }
    item.quantidade += 1;
    salvarCarrinho(); renderCarrinho(); atualizarCards();
    return;
  }

  // Botão − do card
  const cardDec = evento.target.closest('.card-decrement');
  if (cardDec) {
    const id = cardDec.dataset.id;
    const item = carrinho.find(i => i.id === id);
    if (!item) return;
    item.quantidade -= 1;
    if (item.quantidade <= 0) carrinho = carrinho.filter(i => i.id !== id);
    salvarCarrinho(); renderCarrinho(); atualizarCards();
    return;
  }

  // Botão + do carrinho lateral
  const inc = evento.target.closest('.qty-increment');
  if (inc) {
    const id = inc.dataset.id;
    const item = carrinho.find(i => i.id === id);
    if (!item) return;
    const disponivel = (estoque[id] || 0) - item.quantidade;
    if (disponivel <= 0) { exibirToast('Não há mais unidades disponíveis.'); return; }
    item.quantidade += 1;
    salvarCarrinho(); renderCarrinho(); atualizarCards();
    return;
  }

  // Botão − do carrinho lateral
  const dec = evento.target.closest('.qty-decrement');
  if (dec) {
    const id = dec.dataset.id;
    const item = carrinho.find(i => i.id === id);
    if (!item) return;
    item.quantidade -= 1;
    if (item.quantidade <= 0) carrinho = carrinho.filter(i => i.id !== id);
    salvarCarrinho(); renderCarrinho(); atualizarCards();
    return;
  }

  // Remover item do carrinho
  const remover = evento.target.closest('.remover');
  if (remover) {
    const id = remover.dataset.id;
    carrinho = carrinho.filter(item => item.id !== id);
    salvarCarrinho(); renderCarrinho(); atualizarCards();
    return;
  }
});

// =========================================================
// RENDER CARRINHO
// =========================================================
function renderCarrinho() {
  const lista = document.querySelector('.cart-items');
  const vazioMsg = document.querySelector('.carrinho-vazio-msg');
  const totalEl = document.querySelector('.cart-total');
  const countEl = document.querySelector('.cart-count');

  lista.innerHTML = '';

  if (carrinho.length === 0) {
    vazioMsg.style.display = 'block';
  } else {
    vazioMsg.style.display = 'none';
    carrinho.forEach(item => {
      const linha = document.createElement('div');
      linha.className = 'cart-item';
      const precoUnit = item.preco;
      const ehPromocao = promocao && promocao.id === item.id;
      const precoComDesconto = ehPromocao ? precoUnit * (1 - promocao.desconto / 100) : precoUnit;
      const subtotal = (precoComDesconto * item.quantidade).toFixed(2).replace('.', ',');
      const unitHtml = ehPromocao
        ? `<small class="preco-antes">R$ ${precoUnit.toFixed(2).replace('.', ',')}</small> R$ ${precoComDesconto.toFixed(2).replace('.', ',')}`
        : `R$ ${precoUnit.toFixed(2).replace('.', ',')}`;

      linha.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:6px;">
          <strong>${item.nome}</strong>
          <div style="font-size:0.92rem;opacity:.85">${unitHtml}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">
          <div class="qty-controls">
            <button class="qty-btn qty-decrement" data-id="${item.id}">−</button>
            <span class="qty-value">${item.quantidade}</span>
            <button class="qty-btn qty-increment" data-id="${item.id}">+</button>
          </div>
          <div style="font-weight:700">R$ ${subtotal}</div>
          <button class="remover" data-id="${item.id}" title="Remover">×</button>
        </div>
      `;
      lista.appendChild(linha);
    });
  }

  totalEl.textContent = calcularTotal().toFixed(2).replace('.', ',');
  const totalQuantidade = carrinho.reduce((s, it) => s + (it.quantidade || 0), 0);
  countEl.textContent = totalQuantidade;
}

function calcularTotal() {
  return carrinho.reduce((soma, item) => {
    const ehPromocao = promocao && promocao.id === item.id;
    const descontoMul = ehPromocao ? (1 - promocao.desconto / 100) : 1;
    return soma + item.preco * item.quantidade * descontoMul;
  }, 0);
}

function limparCarrinho() {
  carrinho = [];
  salvarCarrinho();
  renderCarrinho();
  atualizarCards();
}

function toggleCart() {
  document.body.classList.toggle('carrinho-aberto');
}

// =========================================================
// PAGAMENTO
// =========================================================
function abrirPagamento() {
  const totalQuantidade = carrinho.reduce((s, it) => s + (it.quantidade || 0), 0);
  if (totalQuantidade === 0) { exibirToast('Seu carrinho está vazio!'); return; }
  document.body.classList.remove('carrinho-aberto');
  document.getElementById('paymentOverlay').classList.add('aberto');
  document.getElementById('totalPagamento').textContent = calcularTotal().toFixed(2).replace('.', ',');
}

function fecharPagamento() {
  document.getElementById('paymentOverlay').classList.remove('aberto');
}

function fecharRecibo() {
  document.getElementById('reciboOverlay').classList.remove('aberto');
}

// Inputs do cartão
const inputNome = document.getElementById('inputNome');
const inputNumero = document.getElementById('inputNumero');
const inputValidade = document.getElementById('inputValidade');
const inputCvv = document.getElementById('inputCvv');

inputNome && inputNome.addEventListener('input', () => {
  document.getElementById('previewNome').textContent = inputNome.value.trim() ? inputNome.value.toUpperCase() : 'NOME COMPLETO';
});
inputNumero && inputNumero.addEventListener('input', () => {
  let digitos = inputNumero.value.replace(/\D/g, '').slice(0, 16);
  let formatado = digitos.replace(/(.{4})/g, '$1 ').trim();
  inputNumero.value = formatado;
  document.getElementById('previewNumero').textContent = formatado.padEnd(19, '•').slice(0, 19) || '•••• •••• •••• ••••';
});
inputValidade && inputValidade.addEventListener('input', () => {
  let digitos = inputValidade.value.replace(/\D/g, '').slice(0, 4);
  if (digitos.length >= 3) digitos = digitos.slice(0, 2) + '/' + digitos.slice(2);
  inputValidade.value = digitos;
  document.getElementById('previewValidade').textContent = digitos || 'MM/AA';
});
inputCvv && inputCvv.addEventListener('input', () => {
  inputCvv.value = inputCvv.value.replace(/\D/g, '').slice(0, 3);
});

document.getElementById('formPagamento').addEventListener('submit', (evento) => {
  evento.preventDefault();
  const erroEl = document.getElementById('erroPagamento');
  const numeroLimpo = inputNumero.value.replace(/\s/g, '');
  if (inputNome.value.trim().length < 3) { erroEl.textContent = 'Informe o nome como está no cartão.'; return; }
  if (numeroLimpo.length !== 16) { erroEl.textContent = 'Número do cartão precisa ter 16 dígitos.'; return; }
  if (!/^\d{2}\/\d{2}$/.test(inputValidade.value)) { erroEl.textContent = 'Validade inválida. Use MM/AA.'; return; }
  if (inputCvv.value.length !== 3) { erroEl.textContent = 'CVV precisa ter 3 dígitos.'; return; }
  erroEl.textContent = '';
  confirmarPedido();
});

function confirmarPedido() {
  carrinho.forEach(item => {
    if (estoque[item.id] == null) estoque[item.id] = 0;
    estoque[item.id] = Math.max(0, estoque[item.id] - item.quantidade);
  });
  salvarEstoque();

  const reciboItens = document.getElementById('reciboItens');
  reciboItens.innerHTML = carrinho.map(item => {
    const ehPromocao = promocao && promocao.id === item.id;
    const precoUnit = item.preco;
    const precoComDesconto = ehPromocao ? precoUnit * (1 - promocao.desconto / 100) : precoUnit;
    return `<p>${item.nome} (${item.quantidade}) — R$ ${precoComDesconto.toFixed(2).replace('.', ',')} — R$ ${(precoComDesconto * item.quantidade).toFixed(2).replace('.', ',')}</p>`;
  }).join('');
  document.getElementById('reciboTotal').textContent = calcularTotal().toFixed(2).replace('.', ',');

  fecharPagamento();
  document.getElementById('reciboOverlay').classList.add('aberto');
  document.getElementById('formPagamento').reset();
  document.getElementById('previewNome').textContent = 'NOME COMPLETO';
  document.getElementById('previewNumero').textContent = '•••• •••• •••• ••••';
  document.getElementById('previewValidade').textContent = 'MM/AA';

  limparCarrinho();
  atualizarCards();
}

// =========================================================
// ATUALIZAR CARDS (estoque, promoção, controles de qty)
// =========================================================
function atualizarCards() {
  todosOsCards().forEach(card => {
    const id = card.dataset.id;
    const nome = card.dataset.nome;
    const botao = card.querySelector('.comprar-btn');
    const statusEl = card.querySelector('.status');
    const etiqueta = card.querySelector('.etiqueta-preco');
    const qtyControls = card.querySelector('.card-qty-controls');
    const qtyValor = card.querySelector('.card-qty-valor');

    const itemNoCarrinho = carrinho.find(i => i.id === id);
    const quantidadeNoCarrinho = itemNoCarrinho ? itemNoCarrinho.quantidade : 0;
    const disponivel = Math.max(0, (estoque[id] || 0) - quantidadeNoCarrinho);

    // Estoque
    if (disponivel <= 0 && quantidadeNoCarrinho === 0) {
      statusEl.classList.remove('disponivel');
      statusEl.classList.add('indisponivel');
      statusEl.textContent = 'Fora de estoque';
      botao.disabled = true;
      botao.textContent = 'Indisponível';
    } else {
      statusEl.classList.remove('indisponivel');
      statusEl.classList.add('disponivel');
      statusEl.textContent = `Em estoque — ${disponivel} disponíveis`;
      botao.disabled = false;
      botao.textContent = 'Adicionar';
    }

    // Controles de quantidade no card
    if (quantidadeNoCarrinho > 0) {
      qtyControls.style.display = 'flex';
      qtyValor.textContent = quantidadeNoCarrinho;
    } else {
      qtyControls.style.display = 'none';
      qtyValor.textContent = '0';
    }

    // Promoção
    if (promocao && promocao.id === id) {
      let badge = card.querySelector('.badge-promocao');
      if (!badge) { badge = document.createElement('span'); badge.className = 'badge-promocao'; card.appendChild(badge); }
      badge.textContent = `-${promocao.desconto}%`;
      const precoOriginal = parseFloat(card.dataset.preco);
      const precoAgora = precoOriginal * (1 - promocao.desconto / 100);
      etiqueta.innerHTML = `<span class="preco-antes">R$ ${precoOriginal.toFixed(2).replace('.', ',')}</span> <span class="preco-agora">R$ ${precoAgora.toFixed(2).replace('.', ',')}</span>`;
    } else {
      const badge = card.querySelector('.badge-promocao');
      if (badge) badge.remove();
      etiqueta.textContent = `R$ ${parseFloat(card.dataset.preco).toFixed(2).replace('.', ',')}`;
    }
  });
}

// =========================================================
// TOAST
// =========================================================
function exibirToast(mensagem) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = mensagem;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2200);
}

// =========================================================
// INICIALIZAÇÃO
// =========================================================
carregarTema();
inicializarEstoque();
inicializarPromocao();
renderCarrinho();
atualizarCards();

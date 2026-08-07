// --- Estrutura do carrinho: items com { id, nome, preco, quantidade }
let carrinho = carregarCarrinhoSalvo();

// Estoque: mapa { id: quantidadeDisponivel }
let estoque = carregarEstoqueSalvo();
// Promoção: { id, desconto }
let promocao = carregarPromocaoSalva();

// ---------- helpers para DOM de produtos (cards) ----------
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

// ---------- Estoque (migração para usar ids) ----------
function carregarEstoqueSalvo() {
  try {
    const raw = JSON.parse(localStorage.getItem('boutique-estoque')) || {};
    const result = {};
    // mapear valores do objeto salvo que podem estar por nome ou por id
    const cards = todosOsCards();
    cards.forEach(card => {
      const id = card.dataset.id;
      const nome = card.dataset.nome;
      if (raw[id] != null) result[id] = raw[id];
      else if (raw[nome] != null) result[id] = raw[nome];
      // else: deixamos undefined para inicializar depois
    });
    return result;
  } catch {
    return {};
  }
}
function salvarEstoque() {
  localStorage.setItem('boutique-estoque', JSON.stringify(estoque));
}

// Inicialização do estoque (gera aleatoriamente se não houver salvo)
function inicializarEstoque() {
  const cards = todosOsCards();
  let mudou = false;
  cards.forEach(card => {
    const id = card.dataset.id;
    if (estoque[id] == null) {
      // gera quantidade aleatória entre 0 e 8
      estoque[id] = Math.floor(Math.random() * 9);
      mudou = true;
    }
  });
  if (mudou) salvarEstoque();
}

// ---------- Promoção (migração para usar ids) ----------
function carregarPromocaoSalva() {
  try {
    const raw = JSON.parse(localStorage.getItem('boutique-promocao')) || null;
    if (!raw) return null;
    // se já estiver por id, ok; se estiver por nome, converte
    if (raw.id) return raw;
    if (raw.nome) {
      const id = idPorNome(raw.nome);
      return id ? { id, desconto: raw.desconto } : null;
    }
    return null;
  } catch {
    return null;
  }
}
function salvarPromocao() {
  localStorage.setItem('boutique-promocao', JSON.stringify(promocao));
}

function inicializarPromocao() {
  const cards = todosOsCards();
  const ids = cards.map(c => c.dataset.id);
  if (promocao && ids.includes(promocao.id)) return; // manter se válida
  if (!ids.length) return;
  const indice = Math.floor(Math.random() * ids.length);
  const idEscolhido = ids[indice];
  const desconto = Math.floor(Math.random() * 31) + 10; // 10% a 40%
  promocao = { id: idEscolhido, desconto };
  salvarPromocao();
}

// ---------- Carregamento/migração do carrinho (para incluir id) ----------
function carregarCarrinhoSalvo() {
  try {
    const raw = JSON.parse(localStorage.getItem('boutique-carrinho')) || [];
    // caso formato antigo fosse lista com { id, nome, preco } individuais, já migramos antes
    // agora suportamos:
    // - itens com id
    // - itens com nome+quantidade mas sem id -> mapeamos usando os cards

    if (!raw || !raw.length) return [];

    // detecta se já está no novo formato (tem id em cada item)
    const primeiro = raw[0];
    if (primeiro && primeiro.id) return raw;

    // se itens têm 'nome' e 'quantidade' mas sem id, tentamos mapear
    const temNome = raw.every(it => it.nome);
    if (temNome) {
      const map = new Map();
      raw.forEach(it => {
        const id = idPorNome(it.nome) || it.nome; // se não achar, usa o nome como id fallback
        if (!map.has(id)) map.set(id, { id, nome: it.nome, preco: it.preco, quantidade: 0 });
        map.get(id).quantidade += (it.quantidade || 1);
      });
      return Array.from(map.values());
    }

    return [];
  } catch {
    return [];
  }
}

function salvarCarrinho() {
  localStorage.setItem('boutique-carrinho', JSON.stringify(carrinho));
}

// ---------- Manipulação do carrinho (agora por id) ----------

document.addEventListener('click', (evento) => {
  // botão adicionar do card
  const botao = evento.target.closest('.comprar-btn');
  if (botao && !botao.disabled) {
    const card = botao.closest('.card');
    const id = card.dataset.id;
    const nome = card.dataset.nome;
    const preco = parseFloat(card.dataset.preco);

    const existente = carrinho.find(item => item.id === id);
    const quantidadeNoCarrinho = existente ? existente.quantidade : 0;
    const disponivel = (estoque[id] || 0) - quantidadeNoCarrinho;

    if (disponivel <= 0) {
      exibirToast(`Estoque insuficiente para ${nome}.`);
      return;
    }

    if (existente) existente.quantidade += 1;
    else carrinho.push({ id, nome, preco, quantidade: 1 });

    salvarCarrinho();
    renderCarrinho();
    atualizarCards();
    exibirToast(`${nome} adicionado ao carrinho!`);
    return;
  }

  // incremento/decremento via controle no carrinho
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
  const dec = evento.target.closest('.qty-decrement');
  if (dec) {
    const id = dec.dataset.id;
    const item = carrinho.find(i => i.id === id);
    if (!item) return;
    item.quantidade -= 1;
    if (item.quantidade <= 0) {
      carrinho = carrinho.filter(i => i.id !== id);
    }
    salvarCarrinho(); renderCarrinho(); atualizarCards();
    return;
  }

  // remover completo (botão ×) — remove o item do carrinho
  const remover = evento.target.closest('.remover');
  if (remover) {
    const id = remover.dataset.id;
    carrinho = carrinho.filter(item => item.id !== id);
    salvarCarrinho(); renderCarrinho(); atualizarCards();
    return;
  }

  // Interações do brand/menu
  const clickedBrandMenuButton = evento.target.closest('.marca-menu-item');
  if (clickedBrandMenuButton) {
    const id = clickedBrandMenuButton.id;
    if (id === 'btnEntrar') {
      // abrir modal de auth com opções Cadastro / Entrar
      document.getElementById('authOverlay').classList.add('aberto');
      fecharBrandMenu();
      return;
    }
    if (id === 'btnDarkMode') {
      toggleDarkMode();
      fecharBrandMenu();
      return;
    }
  }
});

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
          <div><button class="remover" data-id="${item.id}" title="Remover item">×</button></div>
        </div>
      `;

      lista.appendChild(linha);
    });
  }

  const total = calcularTotal();
  totalEl.textContent = total.toFixed(2).replace('.', ',');

  // contador mostra a soma das quantidades, não o número de linhas
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

function abrirPagamento() {
  const totalQuantidade = carrinho.reduce((s, it) => s + (it.quantidade || 0), 0);
  if (totalQuantidade === 0) {
    exibirToast('Seu carrinho está vazio! Adicione produtos para prosseguir.');
    return;
  }
  document.body.classList.remove('carrinho-aberto');
  document.getElementById('paymentOverlay').classList.add('aberto');
  document.getElementById('totalPagamento').textContent =
    calcularTotal().toFixed(2).replace('.', ',');
}

function fecharPagamento() {
  document.getElementById('paymentOverlay').classList.remove('aberto');
}

function fecharRecibo() {
  document.getElementById('reciboOverlay').classList.remove('aberto');
}

// Form de pagamento (mesmo comportamento)
const inputNome = document.getElementById('inputNome');
const inputNumero = document.getElementById('inputNumero');
const inputValidade = document.getElementById('inputValidade');
const inputCvv = document.getElementById('inputCvv');

inputNome && inputNome.addEventListener('input', () => {
  document.getElementById('previewNome').textContent =
    inputNome.value.trim() ? inputNome.value.toUpperCase() : 'NOME COMPLETO';
});

inputNumero && inputNumero.addEventListener('input', () => {
  let digitos = inputNumero.value.replace(/\D/g, '').slice(0, 16);
  let formatado = digitos.replace(/(.{4})/g, '$1 ').trim();
  inputNumero.value = formatado;
  document.getElementById('previewNumero').textContent =
    formatado.padEnd(19, '•').slice(0, 19) || '•••• •••• •••• ••••';
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
  if (!/^\d{2}\/\d{2}$/.test(inputValidade.value)) { erroEl.textContent = 'Validade inválida. Use o formato MM/AA.'; return; }
  if (inputCvv.value.length !== 3) { erroEl.textContent = 'CVV precisa ter 3 dígitos.'; return; }
  erroEl.textContent = '';
  confirmarPedido();
});

function confirmarPedido() {
  // Atualiza o estoque por id
  carrinho.forEach(item => {
    if (estoque[item.id] == null) estoque[item.id] = 0;
    estoque[item.id] = Math.max(0, estoque[item.id] - item.quantidade);
  });
  salvarEstoque();

  const reciboItens = document.getElementById('reciboItens');
  reciboItens.innerHTML = carrinho
    .map(item => {
      const ehPromocao = promocao && promocao.id === item.id;
      const precoUnit = item.preco;
      const precoComDesconto = ehPromocao ? precoUnit * (1 - promocao.desconto / 100) : precoUnit;
      return `<p>${item.nome} (${item.quantidade}) — R$ ${precoComDesconto.toFixed(2).replace('.', ',')} — R$ ${(precoComDesconto*item.quantidade).toFixed(2).replace('.', ',')}</p>`;
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

function atualizarCards() {
  const cards = todosOsCards();
  cards.forEach(card => {
    const id = card.dataset.id;
    const nome = card.dataset.nome;
    const botao = card.querySelector('.comprar-btn');
    const statusEl = card.querySelector('.status');
    const etiqueta = card.querySelector('.etiqueta-preco');

    const quantidadeNoCarrinho = (carrinho.find(i => i.id === id) || {}).quantidade || 0;
    const disponivel = Math.max(0, (estoque[id] || 0) - quantidadeNoCarrinho);

    if (disponivel <= 0) {
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

    // promoção: badge e preço
    if (promocao && promocao.id === id) {
      let badge = card.querySelector('.badge-promocao');
      if (!badge) { badge = document.createElement('span'); badge.className = 'badge-promocao'; card.appendChild(badge); }
      badge.textContent = `-${promocao.desconto}%`;
      const precoOriginal = parseFloat(card.dataset.preco);
      const precoAgora = precoOriginal * (1 - promocao.desconto / 100);
      etiqueta.innerHTML = `<span class="preco-antes">R$ ${precoOriginal.toFixed(2).replace('.', ',')}</span> <span class="preco-agora">R$ ${precoAgora.toFixed(2).replace('.', ',')}</span>`;
    } else {
      const badge = card.querySelector('.badge-promocao'); if (badge) badge.remove();
      etiqueta.textContent = `R$ ${parseFloat(card.dataset.preco).toFixed(2).replace('.', ',')}`;
    }
  });
}

// ---------- TOAST ----------
function exibirToast(mensagem) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = mensagem;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2200);
}

// ---------- BRAND / AUTH / DARKMODE ----------
function toggleBrandMenu(event) {
  // evita disparar ao clicar no botão dentro do header que não seja a marca
  const menu = document.getElementById('brandMenu');
  const expanded = document.getElementById('brand').getAttribute('aria-expanded') === 'true';
  if (expanded) fecharBrandMenu();
  else abrirBrandMenu();
}

function abrirBrandMenu() {
  const menu = document.getElementById('brandMenu');
  menu.style.display = 'flex';
  menu.setAttribute('aria-hidden', 'false');
  document.getElementById('brand').setAttribute('aria-expanded', 'true');
}

function fecharBrandMenu() {
  const menu = document.getElementById('brandMenu');
  menu.style.display = 'none';
  menu.setAttribute('aria-hidden', 'true');
  document.getElementById('brand').setAttribute('aria-expanded', 'false');
}

// fechar menu se clicar fora
document.addEventListener('click', (e) => {
  const brand = document.getElementById('brand');
  if (!brand) return;
  if (brand.contains(e.target)) return; // clique dentro da marca
  fecharBrandMenu();
});

// Auth modal
function fecharAuth() { document.getElementById('authOverlay').classList.remove('aberto'); }

// forms simples de Entrar / Cadastrar (só UI, sem backend)
document.getElementById('openLoginForm').addEventListener('click', () => {
  const cont = document.getElementById('authFormContainer');
  cont.innerHTML = `
    <form id="loginForm" class="auth-form">
      <label>Email<input type="email" id="loginEmail" required></label>
      <label>Senha<input type="password" id="loginSenha" required></label>
      <button class="btn-primario" type="submit">Entrar</button>
    </form>
  `;
  attachAuthHandlers();
});

document.getElementById('openSignupForm').addEventListener('click', () => {
  const cont = document.getElementById('authFormContainer');
  cont.innerHTML = `
    <form id="signupForm" class="auth-form">
      <label>Nome<input type="text" id="signupNome" required></label>
      <label>Email<input type="email" id="signupEmail" required></label>
      <label>Senha<input type="password" id="signupSenha" required></label>
      <button class="btn-primario" type="submit">Cadastrar</button>
    </form>
  `;
  attachAuthHandlers();
});

function attachAuthHandlers() {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      exibirToast('Simulação de login realizada.');
      fecharAuth();
    });
  }
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      exibirToast('Cadastro simulado com sucesso.');
      fecharAuth();
    });
  }
}

// ---------- DARK MODE (persistente) ----------
function isDarkMode() {
  return localStorage.getItem('boutique-darkmode') === '1';
}

function applyDarkModeClass() {
  if (isDarkMode()) {
    document.body.classList.add('dark');
    const btn = document.getElementById('btnDarkMode'); if (btn) btn.textContent = 'Modo Claro';
  } else {
    document.body.classList.remove('dark');
    const btn = document.getElementById('btnDarkMode'); if (btn) btn.textContent = 'Modo Noturno';
  }
}

function toggleDarkMode() {
  const atual = isDarkMode();
  localStorage.setItem('boutique-darkmode', atual ? '0' : '1');
  applyDarkModeClass();
  exibirToast(atual ? 'Modo claro ativado' : 'Modo noturno ativado');
}

// ---------- INICIALIZAÇÃO ----------
inicializarEstoque();
inicializarPromocao();
renderCarrinho();
atualizarCards();
applyDarkModeClass();

// comportamento: ao abrir auth via marca, garantir que o overlay esteja visível e foco
document.getElementById('btnEntrar').addEventListener('click', (e) => {
  e.stopPropagation();
  document.getElementById('authOverlay').classList.add('aberto');
});

// fechar auth quando clicar fora do modal
document.getElementById('authOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('authOverlay')) fecharAuth();
});

// acessibilidade de teclado para a marca
document.getElementById('brand').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleBrandMenu(); }
});


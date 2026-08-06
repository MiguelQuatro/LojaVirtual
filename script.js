let carrinho = carregarCarrinhoSalvo();

// Estoque: mapa { nome: quantidadeDisponivel }
let estoque = carregarEstoqueSalvo();

// Inicialização do estoque (gera aleatoriamente se não houver salvo)
function inicializarEstoque() {
  const cards = Array.from(document.querySelectorAll('.card'));
  let mudou = false;
  cards.forEach(card => {
    const nome = card.dataset.nome;
    if (estoque[nome] == null) {
      // gera quantidade aleatória entre 0 e 8
      estoque[nome] = Math.floor(Math.random() * 9);
      mudou = true;
    }
  });
  if (mudou) salvarEstoque();
}

function carregarEstoqueSalvo() {
  try {
    return JSON.parse(localStorage.getItem('boutique-estoque')) || {};
  } catch {
    return {};
  }
}
function salvarEstoque() {
  localStorage.setItem('boutique-estoque', JSON.stringify(estoque));
}


document.addEventListener('click', (evento) => {
  const botao = evento.target.closest('.comprar-btn');
  if (!botao || botao.disabled) return;

  const card = botao.closest('.card');
  const nome = card.dataset.nome;
  const preco = parseFloat(card.dataset.preco); // lendo dado estruturado, não texto solto

  const existente = carrinho.find(item => item.nome === nome);
  const quantidadeNoCarrinho = existente ? existente.quantidade : 0;
  const disponivel = (estoque[nome] || 0) - quantidadeNoCarrinho;

  if (disponivel <= 0) {
    exibirToast(`Estoque insuficiente para ${nome}.`);
    return;
  }

  if (existente) {
    existente.quantidade += 1;
  } else {
    carrinho.push({ nome, preco, quantidade: 1 });
  }

  salvarCarrinho();
  renderCarrinho();
  atualizarCards();
  exibirToast(`${nome} adicionado ao carrinho!`);
});

/* Remover um item específico (delegação também, pro botão "×" de cada linha) */
document.addEventListener('click', (evento) => {
  const remover = evento.target.closest('.remover');
  if (!remover) return;

  const nome = remover.dataset.nome;
  const item = carrinho.find(i => i.nome === nome);
  if (!item) return;

  // remove uma unidade; se ficar 0, remove o produto do carrinho
  item.quantidade -= 1;
  if (item.quantidade <= 0) {
    carrinho = carrinho.filter(i => i.nome !== nome);
  }

  salvarCarrinho();
  renderCarrinho();
  atualizarCards();
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
      // mostra quantidade e subtotal
      const subtotal = (item.preco * item.quantidade).toFixed(2).replace('.', ',');
      linha.innerHTML = `
        <span>${item.nome} (${item.quantidade}) — R$ ${item.preco.toFixed(2).replace('.', ',')} <small style="opacity:.8">(R$ ${subtotal})</small></span>
        <span class="remover" data-nome="${item.nome}">&times;</span>
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
  return carrinho.reduce((soma, item) => soma + item.preco * (item.quantidade || 1), 0);
}


function salvarCarrinho() {
  localStorage.setItem('boutique-carrinho', JSON.stringify(carrinho));
}
function carregarCarrinhoSalvo() {
  try {
    const raw = JSON.parse(localStorage.getItem('boutique-carrinho')) || [];
    // MIGRAÇÃO: formato antigo tinha items individuais com 'id' e sem 'quantidade'
    if (raw.length && raw[0].id && raw[0].nome && raw[0].preco && !raw[0].quantidade) {
      const map = new Map();
      raw.forEach(item => {
        if (!map.has(item.nome)) map.set(item.nome, { nome: item.nome, preco: item.preco, quantidade: 0 });
        map.get(item.nome).quantidade += 1;
      });
      return Array.from(map.values());
    }
    return raw;
  } catch {
    return [];
  }
}

function limparCarrinho() {
  carrinho = [];
  salvarCarrinho();
  renderCarrinho();
  atualizarCards();
}


function toggleCart() {
  // a sidebar e o backdrop são controlados só por essa classe no <body>;
  // veja as regras "body.carrinho-aberto ..." no style.css
  document.body.classList.toggle('carrinho-aberto');
}

function abrirPagamento() {
  // agora checamos quantidade total
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


const inputNome = document.getElementById('inputNome');
const inputNumero = document.getElementById('inputNumero');
const inputValidade = document.getElementById('inputValidade');
const inputCvv = document.getElementById('inputCvv');

inputNome.addEventListener('input', () => {
  document.getElementById('previewNome').textContent =
    inputNome.value.trim() ? inputNome.value.toUpperCase() : 'NOME COMPLETO';
});

inputNumero.addEventListener('input', () => {
  // remove tudo que não é dígito, corta em 16, e insere espaço a cada 4
  let digitos = inputNumero.value.replace(/\D/g, '').slice(0, 16);
  let formatado = digitos.replace(/(.{4})/g, '$1 ').trim();
  inputNumero.value = formatado;

  document.getElementById('previewNumero').textContent =
    formatado.padEnd(19, '•').slice(0, 19) || '•••• •••• •••• ••••';
});

inputValidade.addEventListener('input', () => {
  // transforma "1225" em "12/25" automaticamente
  let digitos = inputValidade.value.replace(/\D/g, '').slice(0, 4);
  if (digitos.length >= 3) {
    digitos = digitos.slice(0, 2) + '/' + digitos.slice(2);
  }
  inputValidade.value = digitos;
  document.getElementById('previewValidade').textContent = digitos || 'MM/AA';
});

inputCvv.addEventListener('input', () => {
  inputCvv.value = inputCvv.value.replace(/\D/g, '').slice(0, 3);
});

document.getElementById('formPagamento').addEventListener('submit', (evento) => {
  evento.preventDefault();
  const erroEl = document.getElementById('erroPagamento');

  const numeroLimpo = inputNumero.value.replace(/\s/g, '');
  if (inputNome.value.trim().length < 3) {
    erroEl.textContent = 'Informe o nome como está no cartão.';
    return;
  }
  if (numeroLimpo.length !== 16) {
    erroEl.textContent = 'Número do cartão precisa ter 16 dígitos.';
    return;
  }
  if (!/^\d{2}\/\d{2}$/.test(inputValidade.value)) {
    erroEl.textContent = 'Validade inválida. Use o formato MM/AA.';
    return;
  }
  if (inputCvv.value.length !== 3) {
    erroEl.textContent = 'CVV precisa ter 3 dígitos.';
    return;
  }

  erroEl.textContent = '';
  confirmarPedido();
});

function confirmarPedido() {
  // Ao confirmar, subtrai as quantidades do estoque
  carrinho.forEach(item => {
    if (estoque[item.nome] == null) estoque[item.nome] = 0;
    estoque[item.nome] = Math.max(0, estoque[item.nome] - item.quantidade);
  });
  salvarEstoque();

  const reciboItens = document.getElementById('reciboItens');
  reciboItens.innerHTML = carrinho
    .map(item => `<p>${item.nome} (${item.quantidade}) — R$ ${item.preco.toFixed(2).replace('.', ',')} — R$ ${(item.preco*item.quantidade).toFixed(2).replace('.', ',')}</p>`)
    .join('');
  document.getElementById('reciboTotal').textContent =
    calcularTotal().toFixed(2).replace('.', ',');

  fecharPagamento();
  document.getElementById('reciboOverlay').classList.add('aberto');

  // limpa formulário e carrinho pra próxima compra
  document.getElementById('formPagamento').reset();
  document.getElementById('previewNome').textContent = 'NOME COMPLETO';
  document.getElementById('previewNumero').textContent = '•••• •••• •••• ••••';
  document.getElementById('previewValidade').textContent = 'MM/AA';
  limparCarrinho();
  atualizarCards();
}

/* Atualiza os cards com informação de estoque (disponível) */
function atualizarCards() {
  const cards = Array.from(document.querySelectorAll('.card'));
  cards.forEach(card => {
    const nome = card.dataset.nome;
    const botao = card.querySelector('.comprar-btn');
    const statusEl = card.querySelector('.status');

    const quantidadeNoCarrinho = (carrinho.find(i => i.nome === nome) || {}).quantidade || 0;
    const disponivel = Math.max(0, (estoque[nome] || 0) - quantidadeNoCarrinho);

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
  });
}

/* =========================================================
   TOAST "adicionado ao carrinho"
   ========================================================= */
function exibirToast(mensagem) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = mensagem;
  document.body.appendChild(toast);
  // a animação CSS dura 2.2s; removemos o elemento depois
  setTimeout(() => toast.remove(), 2200);
}

/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */
// garante estoque inicial
inicializarEstoque();
renderCarrinho();
atualizarCards();

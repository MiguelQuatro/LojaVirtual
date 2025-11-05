let total = 0;
let quantidade = 0;

// Seleciona todos os botões de compra
document.querySelectorAll('.btn-success, .comprar-btn').forEach(botao => {
  botao.addEventListener('click', () => {
    const produto = botao.parentElement;
    const nome = produto.querySelector('h3').innerText;
    const precoEl = produto.querySelector('.preco');

    // Abre o modal automaticamente ao adicionar
    toggleCart();

    // Se não tiver classe .preco, pega o texto dentro do <p>
    const preco = precoEl
      ? parseFloat(precoEl.innerText)
      : parseFloat(produto.querySelector('p').innerText.replace('R$', '').replace(',', '.'));

    // Atualiza total e quantidade
    total += preco;
    quantidade++;

    // Mostra mensagem visual
    exibirMensagemAdicionado(nome);

    // Atualiza contador no ícone do carrinho
    document.querySelector('.cart-count').innerText = quantidade;

    // Adiciona item ao modal
    const lista = document.querySelector('.cart-items');
    const item = document.createElement('p');
    item.textContent = `${nome} - R$ ${preco.toFixed(2)}`;
    lista.appendChild(item);

    // Atualiza total no modal
    document.querySelector('.cart-total').innerText = total.toFixed(2);

    // Limita altura do modal e adiciona rolagem
    if (lista.scrollHeight > 250) {
      lista.style.maxHeight = "250px";
      lista.style.overflowY = "auto";
    }
  });
});

// Função: abre/fecha o carrinho
function toggleCart() {
  const overlay = document.getElementById('cartOverlay');
  overlay.style.display = (overlay.style.display === 'flex') ? 'none' : 'flex';
}

// Função: limpar o carrinho
function limparCarrinho() {
  total = 0;
  quantidade = 0;
  document.querySelector('.cart-count').innerText = quantidade;
  document.querySelector('.cart-items').innerHTML = '';
  document.querySelector('.cart-total').innerText = total.toFixed(2);
}

// Função: exibir mensagem “adicionado ao carrinho”
function exibirMensagemAdicionado(nomeProduto) {
  const mensagemDiv = document.createElement('div');
  mensagemDiv.classList.add('mensagem-adicionado');
  mensagemDiv.textContent = `${nomeProduto} adicionado ao carrinho!`;

  // Estilo direto no JS (caso o CSS não tenha)
  Object.assign(mensagemDiv.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    background: 'rgba(40, 167, 69, 0.9)',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '8px',
    fontWeight: 'bold',
    zIndex: '9999',
    boxShadow: '0 3px 8px rgba(0,0,0,0.3)',
    transition: 'opacity 0.5s ease',
  });

  document.body.appendChild(mensagemDiv);

  // Remove a mensagem após 2 segundos
  setTimeout(() => {
    mensagemDiv.style.opacity = '0';
    setTimeout(() => mensagemDiv.remove(), 500);
  }, 2000);
}

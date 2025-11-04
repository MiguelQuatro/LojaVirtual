<script>
let total = 0;
let quantidade = 0;

// Seleciona todos os botões de compra//
document.querySelectorAll('.btn-success, .comprar-btn').forEach(botao => {
  botao.addEventListener('click', () => {
    const produto = botao.parentElement;
    const nome = produto.querySelector('h3').innerText;
    const precoEl = produto.querySelector('.preco');
    toggleCart(); // Abre o modal automaticamente

// Se não tiver classe preco, pega direto o texto do <p>//
    const preco = precoEl ? parseFloat(precoEl.innerText)
                          : parseFloat(produto.querySelector('p').innerText.replace('R$', '').replace(',', '.'));

// Soma total e quantidade//
  total += preco;
  quantidade++;
//Mostra que foi adicionado ao carrinho//
    exibirMensagemAdicionado(nome);

//Atualiza contador no ícone do carrinho//
  document.querySelector('.cart-count').innerText = quantidade;

//Cria o item e adiciona dentro do modal//
    const lista = document.querySelector('.cart-items');
    const item = document.createElement('p');
    item.textContent = `${nome} - R$ ${preco.toFixed(2)}`;
    lista.appendChild(item);

//Atualiza o total no modal//
    document.querySelector('.cart-total').innerText = total.toFixed(2);

  });
});

//Função para abrir/fechar o carrinho//
function toggleCart() {
  const overlay = document.getElementById('cartOverlay');
  overlay.style.display = (overlay.style.display === 'flex') ? 'none' : 'flex';
}

//Exibir mensagem de "Adicionado ao carrinho"//
function exibirMensagemAdicionado(nomeProduto) {
  const mensagemDiv = document.createElement('div');
  mensagemDiv.classList.add('mensagem-adicionado'); //Adicione uma classe para estilização via CSS//
  mensagemDiv.textContent = `${nomeProduto} adicionado ao carrinho!`;
  document.body.appendChild(mensagemDiv); //Adiciona a mensagem ao corpo do documento//

// Remove a mensagem após alguns segundos//
  setTimeout(() => {
    mensagemDiv.remove();
  }, 2000); // Remove após 2 segundos//
}

//Botão Limpar//
function limparCarrinho() {
  total = 0;
  quantidade = 0;

  document.querySelector('.cart-count').innerText = quantidade;
  document.querySelector('.cart-items').innerHTML = '';
  document.querySelector('.cart-total').innerText = total.toFixed(2);
}
</script>

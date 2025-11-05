# LojaVirtual
Petshop:

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Loja Virtual</title>
</head>
<head>
  <style>
    body {
      font-family: Arial, sans-serif; /* Define a fonte da página */
      background-image: url('img/fundoA.jpg'); /* Imagem de fundo */
      background-size: cover; /* Faz a imagem cobrir toda a tela */
      background-position: center; /* Centraliza a imagem */
      background-repeat: no-repeat; /* Evita repetição da imagem */
      text-align: center; /* Centraliza o texto */
      margin: 0; /* Remove margens padrão do body */
      padding: 0; /* Remove padding padrão do body */
    }

    h1 {
    font-family: 'Poppins', sans-serif; /* fonte moderna */
    font-weight: 700;
    font-size: 3rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    background: linear-gradient(90deg, #ecc67fff, #fce879ff); /* degradê bonito */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke: 1px black;
    text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
    }

    .fundo-solido {
      background-color: #ffbb00ff; /* Cor de fundo do elemento */
      color: black; /* Cor do texto */
      padding: 10px 20px; /* Espaçamento interno */
      display: inline-block; /* Faz o elemento se comportar como bloco inline */
      border-radius: 10px; /* Bordas arredondadas */
    }

    /* Cabeçalho e Carrinho */
    header {
      display: flex; /* Flexbox para alinhar itens */
      justify-content: flex-end; /* Alinha itens à direita */
      align-items: center; /* Alinha itens verticalmente */
      padding: 10px 20px; /* Espaçamento interno */
    }

    .cart-icon-container {
      position: relative; /* Permite posicionamento absoluto do contador */
      cursor: pointer; /* Muda cursor para indicar interatividade */
    }
    .cart-icon {
      width: 40px; /* Largura do ícone do carrinho */
      height: auto; /* Mantém proporção */
    }
    .cart-count {
      position: absolute; /* Posiciona em relação ao container */
      top: -8px; /* Ajuste vertical */
      right: -8px; /* Ajuste horizontal */
      background: red; /* Cor de fundo do contador */
      color: white; /* Cor do texto do contador */
      border-radius: 50%; /* Deixa em forma de círculo */
      padding: 2px 6px; /* Espaçamento interno do contador */
      font-size: 12px; /* Tamanho da fonte */
      font-weight: bold; /* Fonte em negrito */
    }
    /* Modal do Carrinho */
    .cart-overlay {
      display: none; /* Inicialmente oculto */
      position: fixed; /* Fixa na tela inteira */
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5); /* Fundo semitransparente */
      justify-content: center; /* Centraliza horizontalmente */
      align-items: center; /* Centraliza verticalmente */
      z-index: 2000; /* Fica acima dos outros elementos */
    }
    .cart-modal {
      background: white; /* Fundo do modal */
      padding: 20px; /* Espaçamento interno */
      border-radius: 10px; /* Bordas arredondadas */
      width: 300px; /* Largura fixa */
      max-width: 90%; /* Responsivo */
      box-shadow: 0 2px 8px rgba(0,0,0,0.3); /* Sombra */
    }
    .cart-header {
      display: flex; /* Flexbox para cabeçalho */
      justify-content: space-between; /* Espaça itens */
      align-items: center; /* Alinha verticalmente */
    }

    .close-cart {
      cursor: pointer; /* Indica que é clicável */
      font-size: 20px; /* Tamanho da fonte */
      font-weight: bold; /* Negrito */
    }

    /* Grid de Produtos */
    .container {
      display: grid; /* Grid para organizar os cards */
      grid-template-columns: repeat(4, 1fr); /* 4 colunas iguais */
      gap: 20px; /* Espaçamento entre cards */
      padding: 20px; /* Espaçamento interno */
      max-width: 1000px; /* Largura máxima da área */
      margin: 0 auto; /* Centraliza horizontalmente */
    }


    .card {
      background: lightblue; /* Fundo do card */
      border-radius: 10px; /* Bordas arredondadas */
      box-shadow: 0 2px 6px rgba(0,0,0,0.2); /* Sombra do card */
      padding: 5px; /* Espaçamento interno */
      display: flex; /* Flexbox para alinhar conteúdo */
      flex-direction: column; /* Itens em coluna */
      align-items: center; /* Centraliza itens */
      transition: transform 0.2s ease-in-out; /* Animação ao passar mouse */
    }
    .card:hover {
      transform: scale(1.05); /* Aumenta levemente ao passar o mouse */
    }
    .card img {
      width: 100%; /* Largura total do card */
      max-width: 150px; /* Limita tamanho da imagem */
      border-radius: 10px; /* Bordas arredondadas */
    }
    .cart-items {
      max-height: 200px; /* limite de altura */
      overflow-y: auto;  /* ativa a barra de rolagem */
       padding-right: 5px;
    }


    button {
      margin-top: 8px; /* Espaço acima do botão */
      padding: 8px 12px; /* Espaçamento interno */
      border: none; /* Remove borda padrão */
      border-radius: 5px; /* Bordas arredondadas */
      background-color: orange; /* Cor do botão */
      color: white; /* Cor do texto */
      font-weight: bold; /* Texto em negrito */
      cursor: pointer; /* Indica que é clicável */
      transition: background 0.3s; /* Animação ao mudar cor */
    }
    button:hover:enabled {
      background-color: darkred; /* Cor ao passar mouse */
    }
    button:disabled {
      background-color: gray; /* Cor botão desabilitado */
      cursor: not-allowed; /* Cursor proibido */
    }

    .mensagem-adicionado {
      position: fixed;
      top: 15%;
      right: 5%;
      background-color: #28a745;
      color: white;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: bold;
      box-shadow: 0 0 10px rgba(0,0,0,0.3);
      z-index: 9999;
      animation: fadeInOut 2s ease;
    }

    @keyframes fadeInOut {
      0% { opacity: 0; transform: translateY(-20px); }
      10%, 90% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-20px); }
    }

    .limpar-carrinho {
      margin-top: 10px;
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      transition: background 0.3s ease;
    }

    .limpar-carrinho:hover {
      background-color: #a71d2a;
    }
  </style>
</head>

<body>
    <title>Mini Petshop Virtual</title>
<body>
  <!-- Cabeçalho com Carrinho -->
  <header>
    <div class="cart-icon-container">
      <img src="img/carrinho.png" alt="Carrinho de Compras" class="cart-icon" onclick="toggleCart()">
      <span class="cart-count">0</span> <!-- Quantidade de produtos no carrinho -->
    </div>
  </header>

  <!-- Título e Descrição -->
  <h1>Boutique Animal Online</h1><br>
  <p class="fundo-solido">Selecione o produto que deseja comprar:</p>  

  <!-- Lista de Produtos -->
  <div class="container">
  
    <!-- Card de Produto -->
    <div class="card">
      <img src="img/produto1.jpg" alt="Produto 1">
      <h3>Ossinho</h3>
      <p>Em estoque</p>
      <p>Preço: R$ <span class="preco">25.90</span></p>
      <button class="btn btn-success comprar-btn">Comprar</button>
    </div>

    <!-- Card de Produto -->
    <div class="card">
      <img src="img/produto2.jpg" alt="Produto 2">
      <h3>Petiscos de Carne</h3>
      <p>Em estoque</p>
      <p>Preço: R$ <span class="preco">5.90</span></p>
      <button class="btn btn-success comprar-btn">Comprar</button>
    </div>

    <!-- Card de Produto -->
    <div class="card">
      <img src="img/produto3.jpg" alt="Produto 3">
      <h3>Mix Saudável</h3>
      <p>Em estoque</p>
      <p>Preço: R$ <span class="preco">6.00</span></p>
      <button class="btn btn-success comprar-btn">Comprar</button>
    </div>

    <!-- Card de Produto Fora de Estoque -->
    <div class="card">
      <img src="img/produto4.jpg" alt="Produto 4">
      <h3>Palitos de Limpeza Dental</h3>
      <p style="color:red;">Fora de estoque</p>
      <p>R$ 4,50</p>
      <button disabled>Indisponível</button> <!-- Botão desabilitado -->
    </div>

    <div class="card">
      <img src="img/produto5.jpg" alt="Produto 5">
      <h3>Degustação de Ração</h3>
      <p>Em estoque</p>
      <p>Preço: R$ <span class="preco">10.00</span></p>
      <button class="btn btn-success comprar-btn">Comprar</button>
    </div>

    <div class="card">
      <img src="img/produto6.jpg" alt="Produto 6">
      <h3>Ração Premier</h3>
      <p>Em estoque</p>
      <p>Preço: R$ <span class="preco">210.00</span></p>
      <button class="btn btn-success comprar-btn">Comprar</button>
    </div>

    <div class="card">
      <img src="img/produto7.jpg" alt="Produto 7">
      <h3>Ração para Idosos</h3>
      <p>Em estoque</p>
      <p>Preço: R$ <span class="preco">131.00</span></p>
      <button class="btn btn-success comprar-btn">Comprar</button>
    </div>

    <div class="card">
      <img src="img/produto8.jpg" alt="Produto 8">
      <h3>Ração para Filhotes</h3>
      <p>Em estoque</p>
      <p>Preço: R$ <span class="preco">124.60</span></p>
      <button class="btn btn-success comprar-btn">Comprar</button>
    </div>

  <!-- Modal do Carrinho -->
  <div class="cart-overlay" id="cartOverlay">
    <div class="cart-modal"> <!-- ordem do modal-->
      <div class="cart-header">
        <h2>Seu Carrinho</h2>
        <span class="close-cart" onclick="toggleCart()">&times;</span>
      </div>
      <div class="cart-items"></div> <!-- Produtos adicionados ao carrinho aparecerão aqui -->
      <div class="cart-footer">
        <h3>Total: R$ <span class="cart-total">0.00</span></h3>
        <button class="limpar-carrinho" onclick="limparCarrinho()">Limpar Carrinho</button>
        <button class="checkout-btn">Finalizar Compra</button>
      </div>
    </div>
  </div>

  <!-- Script JavaScript -->
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
</body>
</html>

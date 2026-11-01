# Boutique Animal

Loja virtual de petshop desenvolvida em HTML, CSS e JavaScript, com foco em uma experiência de e-commerce simples e interativa para venda de produtos para cães e gatos.

## Sobre o projeto

Este projeto simula uma loja online de petshop, com catálogo de produtos, carrinho de compras, promoções, checkout fictício e interface responsiva. A aplicação foi construída como um front-end estático, usando armazenamento local do navegador para manter o carrinho e algumas preferências do usuário.

## Funcionalidades

- Catálogo de produtos com imagens, preços e status de estoque
- Carrinho lateral com adição, remoção e alteração de quantidade
- Persistência de dados no `localStorage`
- Simulação de pagamento com formulário de cartão
- Recibo de pedido após a compra
- Modal de login/cadastro (somente interface visual)
- Modo noturno
- Layout responsivo para desktop e mobile
- Promoções aleatórias em produtos

## Tecnologias

- HTML5
- CSS3
- JavaScript
- LocalStorage para persistência local

## Estrutura do projeto

- `index.html` — estrutura principal da página
- `css/style.css` — estilos e layout do site
- `js/script.js` — lógica da loja, carrinho, estoque e interações
- `img/` — imagens dos produtos e ícones
- `data/` — arquivos auxiliares de dados (se aplicável no projeto)

## Como executar

Você pode abrir o arquivo `index.html` diretamente no navegador, mas para evitar possíveis limitações de navegação e garantir uma melhor experiência, é recomendado usar um servidor local.

### Opção 1: abrir diretamente

- Abra o arquivo `index.html` no navegador de sua preferência.

### Opção 2: servidor local

Com Python:

```bash
python -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000
```

Com Node.js:

```bash
npx serve .
```

## Demonstração

A aplicação está disponível em:

https://miguelquatro.github.io/LojaVirtual/

## Observações

O projeto é um protótipo front-end de loja virtual para petshop, com foco em UI e interatividade. Ele não possui backend real, autenticação completa ou integração com banco de dados.

## Licença

Este projeto não possui uma licença definida no repositório.

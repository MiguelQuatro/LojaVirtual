# LojaVirtual

Petshop online simples — um protótipo de loja virtual criado com HTML, CSS e JavaScript puros.

## Descrição
Este repositório contém a versão front-end de uma loja virtual para petshop. É uma aplicação estática que mostra um catálogo de produtos, permite adicionar itens ao carrinho e salvar o carrinho no armazenamento local (localStorage).

## Tecnologias
- HTML
- CSS
- JavaScript

## Arquivos principais
- `index.html` — página principal da loja
- `style.css` — estilos da aplicação
- `script.js` — lógica do catálogo e do carrinho (usa localStorage)
- `img/` — imagens usadas no projeto

## Como executar
Você pode abrir `index.html` diretamente no navegador, ou executar um servidor HTTP local para evitar limitações de CORS em alguns navegadores:

Método 1 — abrir no navegador:
1. Clique duas vezes em `index.html` ou abra com o navegador de sua preferência.

Método 2 — servidor simples (recomendado):
- Com Python 3:

  ```bash
  python -m http.server 8000
  ```

  Em seguida abra http://localhost:8000 no navegador.

- Com Node.js (serve):

  ```bash
  npx serve .
  ```

## Funcionalidades
- Exibição de produtos (estático)
- Adicionar e remover itens no carrinho
- Persistência do carrinho usando localStorage
- Layout responsivo (para dispositivos móveis)

## Como contribuir
1. Fork deste repositório
2. Crie uma branch com a sua feature: `git checkout -b feature/nome-da-feature`
3. Faça commits claros e descritivos
4. Abra um Pull Request explicando as mudanças

## Melhorias sugeridas
- Separar dados dos produtos em um JSON externo
- Adicionar paginação e filtros avançados
- Integrar com um back-end / API para carrinho e estoque
- Testes automatizados

## Licença
Nenhuma licença definida — adicione um arquivo `LICENSE` se quiser tornar este projeto reutilizável por terceiros.

// Array de produtos com estoque
const produtos = [
  { id: 1, nome: 'Item 1', preco: 49.90, estoque: 5, imagem: 'https://cdn.awsli.com.br/300x300/2314/2314809/produto/216629893/whatsapp-image-2023-05-11-at-14-06-41-comszio9kx.jpeg' },
  { id: 2, nome: 'Item 2', preco: 199.90, estoque: 3, imagem: 'https://leocosmeticos.vteximg.com.br/arquivos/ids/184358-1000-1000/Iluminador-Compacto-Melu-By-Rose-RRF8622--2-.jpg?v=638139040218500000' },
  { id: 3, nome: 'Item 3', preco: 29.90, estoque: 10, imagem: 'https://down-br.img.susercontent.com/file/br-11134201-22120-29gl38zl5skv80' },
  { id: 4, nome: 'Item 4', preco: 149.90, estoque: 2, imagem: 'https://cdn.awsli.com.br/600x1000/1788/1788096/produto/227840187/coco-erpvh05oub.jpg' },
  { id: 5, nome: 'Item 5', preco: 89.90, estoque: 7, imagem: 'https://cdn.awsli.com.br/600x450/1252/1252066/produto/203102790/tonico_facial_melu_ruby_rose_rr_342_virtual_make_500-rwwnil.jpg' },
  { id: 6, nome: 'Item 6', preco: 179.90, estoque: 4, imagem: 'https://www.kimake.com.br/image/cache/data/eftr/Img_ftr_rp_799702-1160x1160.JPG?version=20250124193600' },
  { id: 7, nome: 'Item 7', preco: 59.90, estoque: 6, imagem: 'https://acdn-us.mitiendanube.com/stores/001/920/157/products/img_0854-1aade300e0f36f6faa17081036866586-640-0.jpeg' },
  { id: 8, nome: 'Item 8', preco: 39.90, estoque: 8, imagem: 'https://d5gag3xtge2og.cloudfront.net/producao/32977058/G/po-compacto-melu-by-ruby-rose.webp' },
  { id: 9, nome: 'Item 9', preco: 99.90, estoque: 1, imagem: 'https://images.tcdn.com.br/img/img_prod/1074276/gel_creme_facial_melu_by_ruby_rose_40g_667_3_f37f1f0ba313e1aa1cf5fe63e8fa443a.jpg' },
  { id: 10, nome: 'Item 10', preco: 129.90, estoque: 9, imagem: 'https://down-br.img.susercontent.com/file/br-11134207-7qukw-lk1705qvet1m21' }
];

// Carrinho de compras
const carrinho = [];

const container = document.getElementById('produtos');
const listaCarrinho = document.getElementById('lista-carrinho');
const totalSpan = document.getElementById('total');
const contadorCarrinho = document.getElementById('contador-carrinho');

// Cria o card do produto, incluindo input de quantidade e botão
function criarCardProduto(produto) {
  const div = document.createElement('div');
  div.className = 'produto';
  div.innerHTML = `
    <img src="${produto.imagem}" alt="${produto.nome}">
    <h3>${produto.nome}</h3>
    <p>R$ ${produto.preco.toFixed(2)}</p>
    <p>Estoque disponível: ${produto.estoque}</p>
    <label for="quantidade-${produto.id}">Qtd:</label>
    <input type="number" id="quantidade-${produto.id}" value="1" min="1" max="${produto.estoque}">
    <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar</button>
  `;
  return div;
}

// Renderiza todos os produtos na página
function renderizarProdutos() {
  container.innerHTML = '';
  produtos.forEach(produto => {
    container.appendChild(criarCardProduto(produto));
  });
}

// Atualiza o carrinho visualmente
function atualizarCarrinho() {
  listaCarrinho.innerHTML = '';
  let total = 0;
  carrinho.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)} (Qtd: ${item.quantidade})`;
    listaCarrinho.appendChild(li);
    total += item.preco * item.quantidade;
  });
  totalSpan.textContent = total.toFixed(2);
  contadorCarrinho.textContent = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
}

// Adiciona produto ao carrinho verificando estoque
function adicionarAoCarrinho(idProduto) {
  const produto = produtos.find(p => p.id === idProduto);
  if (!produto) return alert('Produto não encontrado.');

  const inputQuantidade = document.getElementById(`quantidade-${idProduto}`);
  let quantidade = parseInt(inputQuantidade.value);

  if (quantidade <= 0 || isNaN(quantidade)) {
    alert('Digite uma quantidade válida.');
    return;
  }

  if (quantidade > produto.estoque) {
    alert(`Quantidade indisponível. Temos apenas ${produto.estoque} em estoque.`);
    return;
  }

  // Verifica se produto já está no carrinho
  const itemCarrinho = carrinho.find(item => item.id === produto.id);

  if (itemCarrinho) {
    if (itemCarrinho.quantidade + quantidade > produto.estoque) {
      alert(`Você já tem ${itemCarrinho.quantidade} desse produto no carrinho. Estoque insuficiente para adicionar mais ${quantidade}.`);
      return;
    }
    itemCarrinho.quantidade += quantidade;
  } else {
    carrinho.push({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      quantidade: quantidade
    });
  }

  // Atualiza estoque local (simulado)
  produto.estoque -= quantidade;

  // Atualiza interface
  renderizarProdutos();
  atualizarCarrinho();
}

// Função para filtrar produtos pelo nome
function filtrarProdutos() {
  const termo = document.getElementById('campo-busca').value.toLowerCase();
  const cards = container.getElementsByClassName('produto');

  for (let card of cards) {
    const nome = card.querySelector('h3').textContent.toLowerCase();
    card.style.display = nome.includes(termo) ? 'block' : 'none';
  }
}

// Função para finalizar compra, gera mensagem para WhatsApp
function finalizarCompra() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  let mensagem = "Olá! Gostaria de finalizar minha compra com os seguintes itens:%0A%0A";
  let total = 0;

  carrinho.forEach((produto, index) => {
    mensagem += `${index + 1}. ${produto.nome} - R$ ${produto.preco.toFixed(2)} x${produto.quantidade} = R$ ${(produto.preco * produto.quantidade).toFixed(2)}%0A`;
    total += produto.preco * produto.quantidade;
  });

  mensagem += `%0ATotal: R$ ${total.toFixed(2)}`;

  const numeroLoja = "5545998011346";
  const urlWhatsApp = `https://wa.me/${numeroLoja}?text=${mensagem}`;

  window.open(urlWhatsApp, "_blank");
}

// Scroll suave para o carrinho
function scrollToCarrinho() {
  document.querySelector('.carrinho').scrollIntoView({ behavior: 'smooth' });
}

// Inicializa a página
document.addEventListener('DOMContentLoaded', () => {
  renderizarProdutos();
  atualizarCarrinho();
});

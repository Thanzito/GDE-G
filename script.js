document.addEventListener("DOMContentLoaded", () => {
    // --- FUNCIONÁRIOS ---
    const formFuncionario = document.getElementById("form-funcionario");
    const listaFuncionarios = document.getElementById("lista-funcionarios");
  
    if (formFuncionario) {
      formFuncionario.addEventListener("submit", (e) => {
        e.preventDefault();
        const nome = document.getElementById("nome").value.trim();
        const cargo = document.getElementById("cargo").value.trim();
  
        if (nome && cargo) {
          const funcionario = { nome, cargo };
          let funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];
          funcionarios.push(funcionario);
          localStorage.setItem("funcionarios", JSON.stringify(funcionarios));
          formFuncionario.reset();
          renderFuncionarios();
        }
      });
  
      renderFuncionarios();
    }
  
    function renderFuncionarios() {
      const funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];
      listaFuncionarios.innerHTML = "";
      funcionarios.forEach((f, index) => {
        const li = document.createElement("li");
        li.textContent = `${f.nome} - ${f.cargo}`;
        const btnRemover = document.createElement("button");
        btnRemover.textContent = "Remover";
        btnRemover.onclick = () => {
          funcionarios.splice(index, 1);
          localStorage.setItem("funcionarios", JSON.stringify(funcionarios));
  
          // Remover vendas associadas ao funcionário
          let vendas = JSON.parse(localStorage.getItem("vendas")) || [];
          vendas = vendas.filter(v => v.funcionario !== f.nome);
          localStorage.setItem("vendas", JSON.stringify(vendas));
  
          renderFuncionarios();
        };
        li.appendChild(btnRemover);
        listaFuncionarios.appendChild(li);
      });
    }
  
    // --- PRODUTOS ---
    const formProduto = document.getElementById("form-produto");
    const listaProdutos = document.getElementById("lista-produtos");
  
    if (formProduto) {
      formProduto.addEventListener("submit", (e) => {
        e.preventDefault();
        const nome = document.getElementById("nome-produto").value.trim();
        const quantidade = parseInt(document.getElementById("quantidade").value);
        const preco = parseFloat(document.getElementById("preco").value);
  
        if (nome && !isNaN(quantidade) && !isNaN(preco)) {
          const produto = { nome, quantidade, preco };
          let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
          produtos.push(produto);
          localStorage.setItem("produtos", JSON.stringify(produtos));
          formProduto.reset();
          renderProdutos();
        }
      });
  
      renderProdutos();
    }
  
    function renderProdutos() {
      const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
      listaProdutos.innerHTML = "";
      produtos.forEach((p, index) => {
        const li = document.createElement("li");
        li.textContent = `${p.nome} - ${p.quantidade} un. - R$ ${p.preco.toFixed(2)}`;
        const btnRemover = document.createElement("button");
        btnRemover.textContent = "Remover";
        btnRemover.onclick = () => {
          produtos.splice(index, 1);
          localStorage.setItem("produtos", JSON.stringify(produtos));
  
          // Remover vendas associadas ao produto
          let vendas = JSON.parse(localStorage.getItem("vendas")) || [];
          vendas = vendas.filter(v => v.produto !== p.nome);
          localStorage.setItem("vendas", JSON.stringify(vendas));
  
          renderProdutos();
        };
        li.appendChild(btnRemover);
        listaProdutos.appendChild(li);
      });
    }
  
    // --- VENDAS ---
    const formVenda = document.getElementById("form-venda");
    const listaVendas = document.getElementById("lista-vendas");
    const funcionarioSelect = document.getElementById("funcionario");
    const produtoSelect = document.getElementById("produto");
  
    if (formVenda && funcionarioSelect && produtoSelect) {
      carregarSelects();
  
      formVenda.addEventListener("submit", (e) => {
        e.preventDefault();
        const funcionario = funcionarioSelect.value;
        const produto = produtoSelect.value;
        const quantidade = parseInt(document.getElementById("quantidade-venda").value);
  
        if (funcionario && produto && !isNaN(quantidade) && quantidade > 0) {
          const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
          const produtoIndex = produtos.findIndex(p => p.nome === produto);
  
          if (produtoIndex !== -1 && produtos[produtoIndex].quantidade >= quantidade) {
            produtos[produtoIndex].quantidade -= quantidade;
            localStorage.setItem("produtos", JSON.stringify(produtos));
  
            const venda = {
              funcionario,
              produto,
              quantidade,
              data: new Date().toLocaleString()
            };
  
            let vendas = JSON.parse(localStorage.getItem("vendas")) || [];
            vendas.push(venda);
            localStorage.setItem("vendas", JSON.stringify(vendas));
            renderVendas();
            carregarSelects(); // Atualiza opções caso estoque tenha mudado
          } else {
            alert("Quantidade insuficiente no estoque.");
          }
        }
      });
  
      renderVendas();
    }
  
    function renderVendas() {
      const vendas = JSON.parse(localStorage.getItem("vendas")) || [];
      if (listaVendas) listaVendas.innerHTML = "";
  
      vendas.forEach((v, index) => {
        const li = document.createElement("li");
        li.textContent = `${v.funcionario} vendeu ${v.quantidade} un. de ${v.produto} em ${v.data}`;
  
        const btnRemover = document.createElement("button");
        btnRemover.textContent = "Remover";
        btnRemover.onclick = () => {
          vendas.splice(index, 1);
          localStorage.setItem("vendas", JSON.stringify(vendas));
          renderVendas();
        };
  
        li.appendChild(btnRemover);
        if (listaVendas) listaVendas.appendChild(li);
      });
    }
  
    function carregarSelects() {
      if (!funcionarioSelect || !produtoSelect) return;
  
      const funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];
      const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  
      funcionarioSelect.innerHTML = "";
      produtoSelect.innerHTML = "";
  
      funcionarios.forEach(f => {
        const option = document.createElement("option");
        option.value = f.nome;
        option.textContent = f.nome;
        funcionarioSelect.appendChild(option);
      });
  
      produtos.forEach(p => {
        const option = document.createElement("option");
        option.value = p.nome;
        option.textContent = `${p.nome} - R$ ${p.preco.toFixed(2)}`;
        produtoSelect.appendChild(option);
      });
    }
  });
  
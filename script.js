const pesquisa = document.getElementById("pesquisa");
const cards = document.querySelectorAll(".card");
const botoes = document.querySelectorAll(".categorias button");

// Recupera favoritos salvos
let listaFavoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

let categoriaSelecionada = "todos";

// ==========================
// PESQUISA E CATEGORIAS
// ==========================

pesquisa.addEventListener("input", filtrarProdutos);

botoes.forEach(botao => {

    botao.addEventListener("click", () => {

        categoriaSelecionada = botao.dataset.categoria;

        botoes.forEach(btn => btn.classList.remove("ativo"));

        botao.classList.add("ativo");

        filtrarProdutos();

    });

});

function filtrarProdutos() {

    const texto = pesquisa.value.toLowerCase();

    cards.forEach(card => {

        const nome = card.querySelector("h3").textContent.toLowerCase();
        const categoria = card.dataset.categoria;

        const correspondePesquisa = nome.includes(texto);

        let correspondeCategoria;

        if (categoriaSelecionada === "todos") {

            correspondeCategoria = true;

        } else if (categoriaSelecionada === "favoritos") {

            correspondeCategoria = listaFavoritos.includes(card.dataset.id);

        } else {

            correspondeCategoria = categoria === categoriaSelecionada;

        }

        if (correspondePesquisa && correspondeCategoria) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

}

// ==========================
// FAVORITOS
// ==========================

const favoritos = document.querySelectorAll(".favorito");

favoritos.forEach(botao => {

    const card = botao.closest(".card");
    const id = card.dataset.id;

    // Marca os favoritos salvos
    if (listaFavoritos.includes(id)) {

        botao.textContent = "❤️";
        botao.classList.add("ativo");

    }

    botao.addEventListener("click", () => {

        botao.classList.toggle("ativo");

        if (botao.classList.contains("ativo")) {

            botao.textContent = "❤️";

            if (!listaFavoritos.includes(id)) {

                listaFavoritos.push(id);

            }

        } else {

            botao.textContent = "🤍";

            listaFavoritos = listaFavoritos.filter(item => item !== id);

        }

        localStorage.setItem("favoritos", JSON.stringify(listaFavoritos));

        // Atualiza a tela caso esteja na categoria Favoritos
        filtrarProdutos();

    });

});

// Exibe os produtos corretamente ao carregar a página
filtrarProdutos();
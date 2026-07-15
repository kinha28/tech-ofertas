// Elementos de busca e filtros (podem ou não existir no HTML)
const pesquisa = document.getElementById("pesquisa");
const cards = document.querySelectorAll(".card");
const botoes = document.querySelectorAll(".categorias button");

// Recupera favoritos salvos
let listaFavoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
let categoriaSelecionada = "todos";

// ==========================
// PESQUISA E CATEGORIAS (Executa apenas se os elementos existirem)
// ==========================
if (pesquisa) {
    pesquisa.addEventListener("input", filtrarProdutos);
}

if (botoes.length > 0) {
    botoes.forEach(botao => {
        botao.addEventListener("click", () => {
            categoriaSelecionada = botao.dataset.categoria;
            botoes.forEach(btn => btn.classList.remove("ativo"));
            botao.classList.add("ativo");
            filtrarProdutos();
        });
    });
}

function filtrarProdutos() {
    // Se não houver barra de pesquisa ou cards, não faz nada
    if (!pesquisa || cards.length === 0) return;

    const texto = pesquisa.value.toLowerCase();

    cards.forEach(card => {
        const h3Element = card.querySelector("h3");
        const nome = h3Element ? h3Element.textContent.toLowerCase() : "";
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
// FAVORITOS (Executa apenas se houver botões de favorito)
// ==========================
const favoritos = document.querySelectorAll(".favorito");

if (favoritos.length > 0) {
    favoritos.forEach(botao => {
        const card = botao.closest(".card");
        if (!card) return;
        
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
}

// Executa o filtro inicial caso a estrutura de busca exista
if (pesquisa && cards.length > 0) {
    filtrarProdutos();
}

// ==========================
// CARROSSEL (Sempre executado)
// ==========================
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

let index = 0;

function mostrarSlide(i) {
    if (slides.length === 0) return;

    if (i >= slides.length) {
        index = 0;
    } else if (i < 0) {
        index = slides.length - 1;
    } else {
        index = i;
    }

    slides.forEach(slide => slide.classList.remove("active"));
    dots.forEach(dot => dot.classList.remove("active"));

    slides[index].classList.add("active");

    if (dots[index]) {
        dots[index].classList.add("active");
    }
}

// Ouvintes das setas
const btnNext = document.querySelector(".next");
const btnPrev = document.querySelector(".prev");

if (btnNext) {
    btnNext.addEventListener("click", () => mostrarSlide(index + 1));
}
if (btnPrev) {
    btnPrev.addEventListener("click", () => mostrarSlide(index - 1));
}

// NOVO: Adiciona clique funcional nas bolinhas (dots)
dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
        mostrarSlide(i);
    });
});

// Auto-play do carrossel a cada 5 segundos
setInterval(() => {
    mostrarSlide(index + 1);
}, 5000);
/* =========================================================
   ATIVAÇÃO DO JAVASCRIPT

   Adicionamos a classe "js" ao <html> para que o CSS
   só esconda os elementos de animação quando o
   JavaScript está realmente a funcionar.
========================================================= */

document.documentElement.classList.add("js");



/* =========================================================
   ANIMAÇÃO DOS ELEMENTOS AO ENTRAREM NA TELA
========================================================= */

/*
    Selecionamos os elementos que queremos animar.
    Aqui podemos adicionar ou remover elementos.
*/

const elementos = document.querySelectorAll(
    ".section-heading, .about-image, .about-text, .project-card, .skill-card, .contact-section"
);



/*
    Criamos o observador.

    Ele verifica quando um elemento aparece
    dentro da tela do utilizador.
*/

const observador = new IntersectionObserver(

    (entradas) => {

        entradas.forEach((entrada) => {

            /*
                Se o elemento entrou na tela...
            */

            if (entrada.isIntersecting) {

                /*
                    Adicionamos a classe "aparecer"
                */

                entrada.target.classList.add("aparecer");


                /*
                    Quando a animação de entrada termina,
                    removemos o atraso em cascata.

                    Assim, os toques e hovers nos cartões
                    respondem na hora, sem espera.
                */

                const atrasoEntrada =
                    parseFloat(entrada.target.style.transitionDelay) || 0;

                setTimeout(() => {

                    entrada.target.style.transitionDelay = "";

                }, atrasoEntrada + 850);


                /*
                    Depois de aparecer,
                    deixamos de observar o elemento.
                */

                observador.unobserve(entrada.target);

            }

        });

    },

    {
        /*
            15% do elemento precisa estar visível
            para iniciar a animação.
        */

        threshold: 0.15
    }

);



/*
    Adicionamos a classe inicial
    "animar" a todos os elementos.
*/

elementos.forEach((elemento) => {

    elemento.classList.add("animar");


    /*
        Efeito em cascata nos cartões:

        cada cartão entra um pouco depois do anterior,
        criando um efeito mais dinâmico.
    */

    const classeCartao = ["project-card", "skill-card"]
        .find((classe) => elemento.classList.contains(classe));


    if (classeCartao) {

        /*
            Descobrimos a posição do cartão
            entre os seus irmãos da mesma classe.
        */

        const posicao = Array.from(elemento.parentElement.children)
            .filter((irmao) => irmao.classList.contains(classeCartao))
            .indexOf(elemento);


        /*
            Cada cartão espera 120ms extra
            em relação ao anterior.

            Limitamos o atraso máximo a 360ms:
            no telemóvel (uma coluna) os últimos
            cartões não ficam assim mais de um
            terço de segundo à espera.
        */

        const atraso = Math.min(posicao * 120, 360);

        elemento.style.transitionDelay = atraso + "ms";

    }


    observador.observe(elemento);

});



/* =========================================================
   MENU MOBILE (HAMBÚRGUER)
========================================================= */

const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");


/*
    Função que fecha o menu.
    Usada em vários momentos: clique num link,
    clique fora do menu e tecla Esc.
*/

function fecharMenu() {

    hamburger.classList.remove("ativo");

    menu.classList.remove("aberto");

    hamburger.setAttribute("aria-expanded", "false");

    document.body.classList.remove("menu-aberto");

}


/*
    Clicar no botão abre ou fecha o menu.
*/

hamburger.addEventListener("click", () => {

    const estaAberto = menu.classList.toggle("aberto");

    hamburger.classList.toggle("ativo", estaAberto);

    hamburger.setAttribute("aria-expanded", String(estaAberto));

    document.body.classList.toggle("menu-aberto", estaAberto);

});


/*
    Clicar num link do menu fecha-o.
*/

menu.querySelectorAll("a").forEach((link) => {

    link.addEventListener("click", fecharMenu);

});


/*
    Clicar fora do menu fecha-o.
*/

document.addEventListener("click", (evento) => {

    if (!hamburger.contains(evento.target) && !menu.contains(evento.target)) {

        fecharMenu();

    }

});


/*
    A tecla Esc também fecha o menu.
*/

document.addEventListener("keydown", (evento) => {

    if (evento.key === "Escape") fecharMenu();

});



/* =========================================================
   EFEITOS AO ROLAR A PÁGINA

   Barra de progresso, sombra na navegação,
   botão voltar ao topo e parallax.
========================================================= */

const header = document.querySelector(".header");
const progressBar = document.getElementById("progressBar");
const backToTop = document.getElementById("backToTop");
const heroImage = document.querySelector(".hero-image");


/*
    Respeita quem prefere menos movimento.
*/

const reduzirAnimacao =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;


function aoRolar() {

    /*
        1. Barra de progresso de leitura.
    */

    const alturaTotal =
        document.documentElement.scrollHeight - window.innerHeight;

    const progresso = alturaTotal > 0 ? (window.scrollY / alturaTotal) * 100 : 0;

    progressBar.style.width = progresso + "%";


    /*
        2. Sombra na barra de navegação.
    */

    header.classList.toggle("com-sombra", window.scrollY > 50);


    /*
        3. Botão voltar ao topo.
    */

    backToTop.classList.toggle("visivel", window.scrollY > 400);


    /*
        4. Parallax suave na imagem principal.

        A imagem desce um pouco mais devagar
        do que o resto da página.
    */

    if (!reduzirAnimacao && heroImage && window.scrollY < window.innerHeight) {

        heroImage.style.transform = "translateY(" + (window.scrollY * 0.12) + "px)";

    }

}


/*
    A cada rolagem, atualizamos a barra de progresso,
    a sombra da navegação, o botão voltar ao topo
    e o efeito parallax.
*/

window.addEventListener("scroll", aoRolar, { passive: true });


/*
    Botão volta ao topo com rolagem suave.
*/

backToTop.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: reduzirAnimacao ? "auto" : "smooth"

    });

});



/* =========================================================
   LINK ATIVO NO MENU

   Destaca no menu a secção
   que está visível na tela.
========================================================= */

const secoes = document.querySelectorAll("section[id]");
const linksMenu = document.querySelectorAll(".menu a");


const observadorSecoes = new IntersectionObserver(

    (entradas) => {

        entradas.forEach((entrada) => {

            if (entrada.isIntersecting) {

                linksMenu.forEach((link) => {

                    link.classList.toggle(
                        "ativo",
                        link.getAttribute("href") === "#" + entrada.target.id
                    );

                });

            }

        });

    },

    {
        /*
            A secção precisa de passar pelo meio
            da tela para ser considerada ativa.
        */

        rootMargin: "-45% 0px -50% 0px"
    }

);


secoes.forEach((secao) => observadorSecoes.observe(secao));



/*
    Aplicamos o estado correto logo no início,
    por exemplo quando a página é recarregada
    a meio do scroll.
*/

aoRolar();



/* =========================================================
   LIGHTBOX (MODAL DE IMAGEM)

   Permite ampliar imagens ao clicar nelas.
========================================================= */

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxCounter = document.getElementById("lightboxCounter");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");

/* Array com todas as imagens que têm lightbox */
const imagensLightbox = Array.from(
    document.querySelectorAll("[data-lightbox-src]")
);

let indiceAtual = 0;


/*
    Abre o lightbox com a imagem selecionada.
*/
function abrirLightbox(indice) {

    indiceAtual = indice;

    const item = imagensLightbox[indice];

    lightboxImg.src = item.getAttribute("data-lightbox-src");

    lightboxImg.alt = item.getAttribute("data-lightbox-alt");

    lightboxCaption.textContent = item.getAttribute("data-lightbox-caption");

    lightboxCounter.textContent = (indice + 1) + " / " + imagensLightbox.length;

    lightbox.classList.add("aberto");

    lightbox.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

}


/*
    Fecha o lightbox.
*/
function fecharLightbox() {

    lightbox.classList.remove("aberto");

    lightbox.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

}


/*
    Navega para a imagem seguinte.
*/
function proximaImagem() {

    indiceAtual = (indiceAtual + 1) % imagensLightbox.length;

    abrirLightbox(indiceAtual);

}


/*
    Navega para a imagem anterior.
*/
function imagemAnterior() {

    indiceAtual = (indiceAtual - 1 + imagensLightbox.length) % imagensLightbox.length;

    abrirLightbox(indiceAtual);

}


/* Eventos: clique nas imagens */
imagensLightbox.forEach((item, indice) => {

    item.addEventListener("click", () => {

        abrirLightbox(indice);

    });

});


/* Eventos: botões e overlay */
lightboxClose.addEventListener("click", fecharLightbox);
lightboxPrev.addEventListener("click", imagemAnterior);
lightboxNext.addEventListener("click", proximaImagem);


/* Fechar ao clicar no overlay escuro */
lightbox.querySelector(".lightbox-overlay").addEventListener("click", fecharLightbox);


/*
    Os links "Ver projeto" dentro de cada cartão
    também abrem o lightbox com a imagem respetiva.
*/
document.querySelectorAll(".project-link").forEach((link) => {

    link.addEventListener("click", (evento) => {

        evento.preventDefault();

        const cartao = link.closest(".project-card");

        if (!cartao) return;

        const imagem = cartao.querySelector(".project-image");

        const indice = imagensLightbox.indexOf(imagem);

        if (indice !== -1) {

            abrirLightbox(indice);

        }

    });

});


/* Navegação por teclado */
document.addEventListener("keydown", (evento) => {

    if (!lightbox.classList.contains("aberto")) return;

    switch (evento.key) {

        case "Escape":

            fecharLightbox();

            break;

        case "ArrowRight":

            proximaImagem();

            break;

        case "ArrowLeft":

            imagemAnterior();

            break;

    }

});

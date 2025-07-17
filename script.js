// ============================================================================
// PASSO 1: CONFIGURAÇÃO INICIAL E VARIÁVEIS GLOBAIS
// ============================================================================

// Aqui guardamos a chave da API que você pegou no site do TMDb.
// É uma boa prática colocar valores que não mudam (constantes) em maiúsculas.
const API_KEY = 'c1cbdb8988439672cf6ce9ff07e406b2'; // <-- IMPORTANTE: Troque pela sua chave

// Aqui estamos "pegando" o elemento do nosso HTML que tem o id 'movies-container'.
// É neste container que vamos adicionar os cards dos filmes.
// Usamos 'const' porque essa referência ao container não vai mudar.
const moviesContainer = document.getElementById('movies-container');

//Selecionar os elementos do formulário
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

// Esta é a parte principal da URL da API para buscar os filmes populares.
// A documentação do TMDb nos diz qual URL usar para cada tipo de informação.
const API_URL_POPULAR = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR`;

//URL para a base de pesquisa dos filmes
const API_URL_SEARCH_BASE = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=pt-BR&query=`;

// ============================================================================
// PASSO 2: A FUNÇÃO PRINCIPAL PARA BUSCAR E EXIBIR OS FILMES
// ============================================================================

// 'async' antes da palavra 'function' indica que esta função fará operações assíncronas (como esperar a resposta de uma API).
async function getPopularMovies() {

    // O bloco 'try...catch' é uma forma de lidar com erros. O código dentro do 'try' é executado. Se algum erro acontecer
    // (ex: a internet caiu, a API está fora do ar), o código dentro do 'catch' é executado, evitando que a página quebre.
    try {
        // 'fetch()' é a função que faz a requisição para a URL da API. 
        // 'await' pausa a execução DESTA FUNÇÃO até que o 'fetch' receba uma resposta.
        // O resto da página continua funcionando normalmente.
        const response = await fetch(API_URL_POPULAR); 

        // A resposta do fetch precisa ser convertida para o formato JSON, que é um formato que o JavaScript entende facilmente.
        // 'await' novamente, pois essa conversão também leva um tempinho.
        const data = await response.json();

        // Agora, 'data' é um objeto JavaScript. 
        // A lista de filmes, segundo a documentação do TMDb, está dentro de uma propriedade chamada 'results'.
        // Vamos chamar a função que exibe os filmes, passando essa lista para ela.
        displayMovies(data.results);

    }   catch(error) {
        // Se qualquer coisa no bloco 'try' der errado, este código será executado.
        console.error("Erro ao buscar os filmes populares:", error);
    }
}

//Função que busca filmes com base num termo de pesquisa
async function searchMovies(searchTerm) {
    try {
        //Monta a URL final da pesquisa juntando a base com o termo pesquisado
        const response = await fetch(API_URL_SEARCH_BASE + searchTerm);
        const data = await response.json();
        if (data && data.results){
            displayMovies(data.results);
        }
    } catch (error) {
        console.error("Erro ao pesquisar filme:", error)
    }
}

// ============================================================================
// PASSO 3: A FUNÇÃO PARA CRIAR E EXIBIR OS CARDS DOS FILMES NA TELA
// ============================================================================

// Esta função recebe uma lista de filmes ('movies') como argumento.
function displayMovies(movies) {

    // Primeiro, limpamos qualquer conteúdo que já exista no container.
    // Isso será útil mais tarde, quando formos fazer a busca.
    moviesContainer .innerHTML = '';

    // 'forEach' é um laço de repetição que passa por cada item do array 'movies'.
    // Para cada 'movie' na lista, o código dentro das chaves será executado.
    movies.forEach(movie => {
        // --- Criando os Elementos HTML com JavaScript ---
        /* Vou deixar comentado pois exibirei apenas os filmes que possuem pôster.

        // 1. Cria uma <div> para ser o card do filme.
        const movieCard = document.createElement('div');
        // Adiciona a classe 'movie-card' a essa div, para que o CSS que já fizemos seja aplicado.
        movieCard.classList.add('movie-card');

        // 2. Cria uma tag <img> para o pôster.
        const poster = document.createElement('img');
        poster.classList.add('movie-poster');
        // A URL completa da imagem é formada pela base + o caminho do pôster que vem da API.
        // 'w500' é o tamanho da imagem.
        poster.scr = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        poster.alt = movie.title; //Texto alternativo para accessibilidade

        //3. Cria uma tag <p> para o título.
        const title = document.createElement('p');
        title.textContent = movie.title;

        // --- Montando o Card e Adicionando na Página ---

        // Agora, colocamos a imagem e o título DENTRO do card.
        movieCard.appendChild(poster);
        movieCard.appendChild(title);

        // Finalmente, colocamos o card completo DENTRO do nosso container principal.
        moviesContainer.appendChild(movieCard);
        */
       if(movie.poster_path){
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        const poster = document.createElement('img');
        poster.classList.add('movie-poster');
        poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        poster.alt = movie.title;

        const title = document.createElement('p');
        title.textContent = movie.title;

        movieCard.appendChild(poster);
        movieCard.appendChild(title);

        moviesContainer.appendChild(movieCard);
       }
    });
}

// ============================================================================
// PASSO 4: INICIANDO O PROCESSO
// ============================================================================



//Adicionar um ouvinte de eventos para o formulário de pesquisa.
searchForm.addEventListener('submit', (event) => {
    // event.preventDefault() impede que a página recarregue, que é o comportamento padrão de um formulário.
    event.preventDefault();

    // Pega o texto que o utilizador digitou, removendo espaços em branco do início e do fim.
    const searchTerm = searchInput.value.trim();

    // Se o utilizador digitou algo...
    if (searchTerm && searchTerm !== '') {
        //... chama nossa função de pesquisa
        searchMovies(searchTerm);
        // Limpa o campo de pesquisa para a próxima busca.
        searchInput.value = '';
    } else {
        // Se o campo de pesquisa estiver vazio, podemos simplesmente recarregar a página
        // para mostrar os filmes populares novamente.
        window.location.reload();
    }
});

// Esta é a linha que efetivamente inicia tudo.
// Assim que o script é carregado, ele chama a função para buscar os filmes.
getPopularMovies();


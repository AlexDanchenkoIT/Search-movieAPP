const MODAL_OPENED_CLASSNAME = 'modal_open';
const BODY_FIXED_CLASSNAME = 'body_fixed';

const bodyNode = document.querySelector('body');
const modalNode = document.querySelector('.js-modal');
const inputNode = document.querySelector('.js-input');
const buttonNode = document.querySelector('.js-btn');
const moviesNode = document.querySelector('.js-movies');

//// получаем от пользователя запрос
function getRequestFromUser(){
    request = inputNode.value.trim();
    return request
}

//// выводим в HTML список фильмов
function renderMovies (movies) {
    let moviesHTML = ''
    movies.forEach((movie) => {
        const moviePoster = movie.Poster;
        const movieTitle = movie.Title;
        const movieYear = movie.Year;
        const movieType = movie.Type;
        const movieImdbID = movie.imdbID;

        moviesHTML += `
        <div class="movie" id="${movieImdbID}">
        <div class="movie__img">
        <img
                class="movie__img-card"
                src="${moviePoster !== "N/A" ? moviePoster : "resources/image-noicon.png"}"
                alt="${movieTitle}"
              />
            </div>
            <div class="movie__description">
              <div class="movie__description-title">${movieTitle}</div>
              <div class="movie__description-year">${movieYear}</div>
              <div class="movie__description-type">${movieType}</div>
            </div>
          </div>
        `
        moviesNode.innerHTML = moviesHTML;
    });

}

// получаем массив с фильмами и выводим его в HTML c помощью функции renderMovie и чистим input
function getMovies() {
    const request = getRequestFromUser()
    if(!request || (request.length <= 2)){
        alert('введите название фильма')
        return
    }
    fetch(`https://www.omdbapi.com/?s=${request}&apikey=418b4501`)
    .then(response => response.json())
    .then(result => {
        movies = result.Search;
        try{
            renderMovies(movies);
        }
        catch(err){
            alert('введите корректное название фильма на английском языке');
        }
    })
    clearInput();
}

function clearInput(){
    inputNode.value = '';
    inputNode.focus();
}

//// слушатели 

buttonNode.addEventListener('click', getMovies);
moviesNode.addEventListener('click', openModal);
modalNode.addEventListener('click', closeModal);

////MODAL

function openModal(event){

    if (!event.target.closest('.movie')) {
        return
    }

    if (event.target.closest('.movie')){
        const selectMovie = event.target.closest('.movie');
        id = selectMovie.getAttribute('id');
        showModalCard(id);
        modalNode.classList.add(MODAL_OPENED_CLASSNAME);
        bodyNode.classList.add(BODY_FIXED_CLASSNAME);
    }
    
}

function closeModal (event) {
    if (!event.target.closest('.modal__btn')) {
        return
    }

    if (event.target.closest('.modal__btn')){
        modalNode.classList.remove(MODAL_OPENED_CLASSNAME);
        bodyNode.classList.remove(BODY_FIXED_CLASSNAME);
        modalNode.innerHTML = '';
      }
}

function renderModalCard (result){
    modalNode.innerHTML = `
    <div class="modal__card">
  <button class="modal__btn">Назад к поиску</button>
  <div class="modal__card-movie">
    <div class="card-movie__img">
      <img src="${result.Poster !== "N/A" ? result.Poster : "resources/image-noicon.png"}" alt="${result.Title}" />
    </div>
    <div class="card-movie__description">
      <h2 class="card-movie__title">${result.Title}</h2>
      <p class="card-movie__description">
      Year:
        <span class="description-decoration"> ${result.Year}</span>
      </p>
      <p class="card-movie__description">
      Rated:
        <span class="description-decoration"> ${result.Rated}</span>
      </p>
      <p class="card-movie__description">
      Released:
        <span class="description-decoration"> ${result.Released}</span>
      </p>
      <p class="card-movie__description">
      Runtime:
        <span class="description-decoration"> ${result.Runtime}</span>
      </p>
      <p class="card-movie__description">
      Genre:
        <span class="description-decoration"> ${result.Genre}</span>
      </p>
      <p class="card-movie__description">
      Director:
        <span class="description-decoration"> ${result.Director}</span>
      </p>
      <p class="card-movie__description">
      Writer:
        <span class="description-decoration"> ${result.Writer}</span>
      </p>
      <p class="card-movie__description">
      Actors:
        <span class="description-decoration"> ${result.Actors}</span>
      </p>
    </div>
  </div>
  <p class="modal__card-description">${result.Plot}</p>
</div>
    `
}

function showModalCard(id) {
    const imdbID = id

    fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=418b4501`)
    .then(response => response.json())
    .then((result) => {
        renderModalCard(result)
        }); 
}


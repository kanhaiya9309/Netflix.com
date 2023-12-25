const movie_id = sessionStorage.getItem('movieId');
console.log(movie_id);

const movie_detail_http = "https://api.themoviedb.org/3/movie"; // Define the base URL
let Api_key = "your-movie-database-api-key";


fetch(`${movie_detail_http}/${movie_id}?` + new URLSearchParams({
    api_key: Api_key
}))
.then(res => res.json())
.then(data => {
    // console.log(data);
    setMovieInfo(data);
})

const setMovieInfo = (data) =>{
   const movieName = document.querySelector('.movie-name')
   const movieGenres = document.querySelector('.genres')
   const movieDescription  = document.querySelector('.dec')
   const title = document.querySelector('title')
   const backdrop = document.querySelector('.movie-info')


   title.innerHTML = movieName.innerHTML = data.title ;
   movieGenres.innerHTML = `${data.release_date.split('-')[0]} | `  ;

   for(i=0 ; i<data.genres.length ; i++) {
     movieGenres.innerHTML += data.genres[i].name + formatingString(i ,data.genres.length) ;
   }

   if(data.adult == true ){
    movieGenres.innerHTML += ' | +18';
   }

   if(data.backdrop_path == null){
    data.backdrop_path = data.poster_path ;
   }

   movieDescription.innerHTML += data.overview.substring(0,200) + '...' ;

   backdrop.style.backgroundImage = `url(${original_img_url}${data.backdrop_path})`;
}

const formatingString = (currentIndex ,maxIndx)=>{
   return  (currentIndex == maxIndx-1 ) ? ' ' : ' , '
}

//fetching cast info 

fetch(`${movie_detail_http}/${movie_id}/credits?`+ new URLSearchParams({
    api_key: Api_key
}))
 .then(res=>res.json())
 .then(data=>{
//    console.log(data)

   const cast = document.querySelector('.Starring');
    for(let i=0 ; i< 5 ; i++){
        cast.innerHTML += data.cast[i].name +  formatingString(i , 5);
    }
})

// fetching video 

fetch(`${movie_detail_http}/${movie_id}/videos?` + new URLSearchParams({
    api_key : Api_key
}))
.then(res=>res.json())
.then(data=>{
    // console.log(data)

    const trailers = document.querySelector('.trailer-container');
    const maxVideos = (data.results.length > 4) ? 4 : data.results.length ;

    for(let i=0 ; i< maxVideos; i++ ){
        trailers.innerHTML += `
        <iframe src="https://www.youtube.com/embed/${data.results[i].key}" title="YouTube video player" 
         frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen>
        </iframe> `;

    }
})

// fetching recommendations 

fetch(`${movie_detail_http}/${movie_id}/recommendations?` + new URLSearchParams({
    api_key:Api_key 
}))
.then(res=>res.json())
.then(data=>{
    console.log(data);
    const container = document.querySelector('.recommendation-container');
   
     for(i=0; i<16 ; i++){
        if(data.results[i].backdrop_path == null){
            continue ;
        }

        container.innerHTML +=`
        <div class="movie"  onclick="movieSelected('${data.results[i].id}')" >
                <img src="${img_Url}${data.results[i].backdrop_path}" alt="movie-poster">
                <p class="movie-title">${data.results[i].title}</p>
        </div>
        `
     }

});

function movieSelected(id) {
    sessionStorage.setItem('movieId', id);
    window.location = 'about.html';
    return false;
}



const main = document.getElementById("main");



fetch( genres_list_http + new URLSearchParams({
    api_key : api_key 
}))

 .then(res=>res.json())
 .then(data=> {
     console.log(data);
    //  const filteredGenres = data.genres.filter(item => item.id !== 15 && item.id !== 14);
    const filteredGenres = data.genres.filter(item => item.name !== 'TV Movie' && item.name !== 'Science Fiction');
    console.log(filteredGenres)
     filteredGenres.forEach(item => {
         fetchMoviesListByGenres(item.id, item.name);
     });
    // data.genres.forEach(item => {
    //     fetchMoviesListByGenres(item.id ,item.name); 
    // });
 })

const fetchMoviesListByGenres = (id , genres)=>{
   fetch(movie_genres_http + new URLSearchParams({
    api_key:api_key,
    with_genres:id,
    page: Math.floor(Math.random()* 3)+1 
   }))
   .then(res=>res.json())
   .then(data=>{
    console.log(data) 
    // makeCategoryOfMovies(`${genres}_movies`, data.results);
    if (data.results && data.results.length > 10) {
      makeCategoryOfMovies(`${genres}_movies`, data.results);
  } else {
      console.log(`No movies found for ${genres}`);
  }
   })
   .catch(err=>{
    console.log(err)
   })
}

const makeCategoryOfMovies =(category,data)=>{
   main.innerHTML +=`
   <div class="movie-list">
   <button type="button" class="pre-btn"><img src="./img/pre.png" alt="pre-btn" ></button>

    <h1 class="movie-category">${category.split("_").join(" ")}</h1>
   <div class="movie-container" id=${category}>
        
   </div>
 <button type="button" class="next-btn"><img src="./img/nxt.png"  alt="next-btn"></button>

  </div>
 ` ;
   makeCards(category,data);
}


const makeCards = (id,data)=>{
   const movieContainer = document.getElementById(id);
   data.forEach((item ,i)=>{
    if(item.backdrop_path == null){
        item.backdrop_path = item.poster_path ;
       if(item.backdrop_path == null){
         return ;
       }   
    }
  

   movieContainer.innerHTML +=` 
       <div class="movie" onclick="movieSelected('${item.id}')" >
       <img src="${img_Url}${item.backdrop_path} " alt="movie-poster">
       <p class="movie-title">${item.title}</p>
     </div>
  `;
    if(i==data.length -1){
      setTimeout(()=>{
            setUpScrolling();
      } ,100)
    }
  })  
}

function movieSelected(id) {
  sessionStorage.setItem('movieId', id);
  window.location = 'about.html';
  return false;
}



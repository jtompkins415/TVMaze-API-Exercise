"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const res = await axios.get('https://api.tvmaze.com/search/shows', {params:{q: term}});
  const showMap = res.data.map(({show}) => {   
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image.original
    }
  })
  return showMap;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image}" 
              alt="${show.name}" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div id="show-summary"><small>${show.summary}</small></div>
             <button id="get-episodes">
              Episodes
             </button> 
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);  } 
    


}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);


}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) { 
  const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  const episodeMap = res.data.map((element) => {
     return {
      id:element.id,
      name: element.name,
      season: element.season,
      number: element.number
     }
  })
  return episodeMap
  }



/** Write a clear docstring for this function... */

 function populateEpisodes(episodes) {
    const $episodesList = $('#episodes-list');
    // const $showText = $('#show-summary');
    $episodesList.empty()

    for(let episode of episodes){
      console.log(episode);
      let $episode = $(
        `<li>${episode.name}(season: ${episode.season}, episode: ${episode.number})</li>
      `)

      $episodesList.append($episode);
    }

    $('#episodes-area').show();
    // $showText.closest('#show-summary').append($episodesArea);
    
 }

  $('#shows-list').on('click', '#get-episodes',  async function episodeClick(e){
  console.log (e)
  let showId = $(e.target).closest('.Show').data('show-id');
  let episodes = await getEpisodesOfShow(showId)
  populateEpisodes(episodes)
  
})
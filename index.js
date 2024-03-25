// Configuration for the autoComplete function, specifying how movies are displayed and fetched
const autoCompleteConfig = {
    // Defines how each movie option should be rendered in the autocomplete dropdown
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src="${imgSrc}" />
            ${movie.Title} (${movie.Year})
        `;
    },
    // Specifies the value to be filled in the autocomplete input when a movie is selected
    inputValue(movie) {
        return movie.Title;
    },
    // Function to fetch movie data based on the search term
    async fetchData(searchTerm) {
        const response = await axios.get('https://www.omdbapi.com/', {
            params: {
                apikey: '544fb3ee',
                s: searchTerm,
            },
        });

        if (response.data.Error) {
            return [];
        }

        return response.data.Search;
    },
};

// Initialize autoComplete for the left search box
createAutoComplete({
    ...autoCompleteConfig, // Spread operator to reuse the autoCompleteConfig
    root: document.querySelector('#left-autocomplete'),
    // Function to execute when a movie is selected from the left search box
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden'); // Hide tutorial
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    },
});

// Initialize autoComplete for the right search box
createAutoComplete({
    ...autoCompleteConfig, // Reusing the same autoCompleteConfig for consistent behavior
    root: document.querySelector('#right-autocomplete'),
    // Function to execute when a movie is selected from the right search box
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden'); // Hide tutorial
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    },
});

// Variables to store the selected movie details from each autocomplete
let leftMovie;
let rightMovie;

// Function called when a movie is selected, to fetch and display detailed information
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('https://www.omdbapi.com/', {
        params: {
            apikey: '544fb3ee',
            i: movie.imdbID,
        },
    });

    // Update the UI with the movie details
    summaryElement.innerHTML = movieTemplate(response.data);

    // Store the movie details based on which side it was selected
    if (side === 'left') {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }

    // If both sides have selected movies, run the comparison
    if (leftMovie && rightMovie) {
        runComparison();
    }
};

// Function to compare the movie details of the two selected movies
const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    // Loop through each stat for comparison
    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];

        const leftSideValue = parseFloat(leftStat.dataset.value);
        const rightSideValue = parseFloat(rightStat.dataset.value);

        // Apply styling based on which side's stat is greater
        if (rightSideValue > leftSideValue) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    });
};

// Template function for displaying detailed movie information
const movieTemplate = (movieDetail) => {
    // Parse movie details to extract and compute values needed for comparison
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word);

        if (isNaN(value)) {
            return prev;
        } else {
            return prev + value;
        }
    }, 0);

    // HTML template for displaying the movie details
    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}" alt="">
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h1>${movieDetail.Genre}</h1>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>

        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
};

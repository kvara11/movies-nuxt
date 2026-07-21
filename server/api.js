import fs from 'fs'
import axios from 'axios'
import path from 'path'
import { fileURLToPath } from 'url'

// @ts-check

/**
 * @typedef {'comedy.json' | 'anim.json' | 'doc.json' | 'fav.json' | 'short.json' | 'series.json'} TargetFile
 */

// consts!!!
const key = "5cb2d740df2112798fd70fa4d4fac2cb";
const token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Y2IyZDc0MGRmMjExMjc5OGZkNzBmYTRkNGZhYzJjYiIsIm5iZiI6MTc1NDMzOTkyMC4yOTEwMDAxLCJzdWIiOiI2ODkxMWE1MGQ5MTYyNTRjZDEyNjIzMWYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.3dgfCDxNnLz9XOFmjTy4LgLUMdSKD5GjMHvXdo8OB2U";
const omdbKey = "8cc46d71";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __dataPath = '../app/data/movies/';


// <><><><><><><>  only change <<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
/** @type {TargetFile} */
let targetFile = 'fav.json';

const needImdbIds = [
  'tt0040522'
];

// <<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

async function fetchMovies() {

  let allResults = []
  let errors = [];
  let genres = JSON.parse(
    fs.readFileSync(path.join(__dirname, __dataPath + '/genres.json'), 'utf8')
  );

  const incrementPath = path.join(__dirname, __dataPath + 'increment.json');
  const incrementValue = JSON.parse(fs.readFileSync(incrementPath, 'utf8'));
  const newId = ++incrementValue.id;
  console.log(newId);
  
  try {

    // http://www.omdbapi.com/?i=tt1166827&plot=full

    for (const id of needImdbIds) {

      if (!id) {
        console.log('Id is empty');
        continue;
      }
      
      const omdbResponse = await axios.get('https://www.omdbapi.com/', {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: 'application/json'
        },
        params: {
          apikey: omdbKey,
          i: id,
          plot: 'full',
          include_adult: true,
        }
      })


      if (omdbResponse.status == 200 && omdbResponse.data) {

        console.log(`Fetched: ${id}`)

        const movie = omdbResponse.data;
        const movieGenres = movie.Genre.split(',').map(g => g.trim());
        
        const myMovieObj = {
          id: newId,
          title: movie.Title,
          year: movie.Year,
          genre: movieGenres,
          director: movie.Director,
          duration: movie.Runtime,
          poster: movie.Poster,
          description: movie.Plot,
          imdb: movie.imdbRating,
          imdbId: movie.imdbID,
          language: movie.Language,
          country: movie.Country
        };

        for (const genre of movieGenres) {
          if (!genres.includes(genre)) {
            genres.push(genre);
          }
        }

        allResults.push(myMovieObj)

      } else {
        errors.push({
          movie: id,
        });
      }
    }

  } catch (error) {
    console.error('Error fetching data:', error)
  }

  if (allResults && allResults.length > 0) {
    const targetPath = path.join(__dirname, __dataPath + targetFile);
    // const errorPath = path.join(__dirname, __dataPath + 'errors.json');
    const genresPath = path.join(__dirname, __dataPath + 'genres.json');
  
  
    if (!fs.existsSync(targetPath)) {
      fs.writeFileSync(targetPath, '[]');
    }
    // if (!fs.existsSync(errorPath)) {
    //   fs.writeFileSync(errorPath, '[]');
    // }
  
    const existingMovies = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    // const existingErrors = JSON.parse(fs.readFileSync('errors.json', 'utf8'));
  
    const updatedMovies = [...existingMovies, ...allResults];
    // const updatedErrors = [...existingErrors, ...errors];
  
    console.error('READY >> ')
  
    fs.writeFileSync(targetPath, JSON.stringify(updatedMovies, null, 2));
    // fs.writeFileSync(errorPath, JSON.stringify(updatedErrors, null, 2));
    fs.writeFileSync(genresPath, JSON.stringify(genres, null, 2));
    fs.writeFileSync(incrementPath, JSON.stringify({ id: newId }, null, 2));

    console.error('DONE << ')
  }
}


async function convertGenres() {

  const flName = 'short';
  const jsonData = fs.readFileSync(path.join(__dirname, '../' + flName + '.json'), 'utf8');
  const data = JSON.parse(jsonData);

  for (const mov of data) {
    mov.genre = mov.genre.split(',').map(g => g.trim());
  }

  fs.writeFileSync(flName + '2.json', JSON.stringify(data, null, 2));

  console.log(data);

}


async function addColumn(columnName, defaultValue) {

  const targetPath = path.join(__dirname, __dataPath + targetFile);
  const incrementPath = path.join(__dirname, __dataPath + 'increment.json');
  const incrementValue = JSON.parse(fs.readFileSync(incrementPath, 'utf8'));
  const existingMovies = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
  
  let id = incrementValue.id;
  const updatedMovies = existingMovies.map(movie => ({
    ...movie,
    [columnName]: id++,
  }));

  // Optional: Save back to the JSON file
  console.error('Starting to insert Records')
  
  fs.writeFileSync(targetPath, JSON.stringify(updatedMovies, null, 2));
  fs.writeFileSync(incrementPath, JSON.stringify({ id }, null, 2));
}

// addColumn('id', 1)
fetchMovies()


// convertGenres()
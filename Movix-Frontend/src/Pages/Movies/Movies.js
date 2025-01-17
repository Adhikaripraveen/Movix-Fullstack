import CustomPagination from "../../Components/Pagination/CustomPagination";
import { useState, useEffect } from "react";
import SingleContent from "../../Components/SingleContent/SingleContent";
import Genre from "../../Components/Genre/Genre.js";
import axios from "axios";
import "./Movies.css";

const Movies = () => {
  const [content, setContent] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectGenre, setSelectGenre] = useState([]);
  const [error, setError] = useState(null);

  const url = (selectGenre) => {
    if (selectGenre < 1) return " ";
    const gerneIds = selectGenre.map((g) => g.id);
    return gerneIds.reduce((acc, curr) => acc + "," + curr);
  };
  const value = url(selectGenre);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown";
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const fetchMovies = async () => {
    try {
      axios.defaults.withCredentials=false;
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${currentPage}&with_genres=${value}`
        ,{
          withCredentials: false // Disable sending cookies with this request
        });
      setError(null);
      setContent(data.results);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchMovies();
    //eslint-disable-next-line
  }, [currentPage, value]);
  const arr = Array.from({ length: 20 }, (_, index) => index);
  let numberOfPages = 10;
  let pages = Array.from(Array(numberOfPages), (_, index) => index + 1);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="movie_title">
        <h2>Movies</h2>
      </div>
      <Genre
        type="movie"
        setCurrentPage={setCurrentPage}
        setSelectGenre={setSelectGenre}
        selectGenre={selectGenre}
      />

      {content.length === 0 ? (
        <div className="loading_p_container">
          {arr.map((e, index) => {
            return <div className="card" key={index}></div>;
          })}
          {error && <div className="axios_error">{error.message}!!!</div>}
        </div>
      ) : (
        <div className="movies_section">
          {content.map((e) => {
            return (
              <SingleContent
                key={e.id}
                id={e.id}
                poster={e.poster_path}
                title={e.title || e.name}
                formattedDate={formatDate(e.first_air_date || e.release_date)}
                media_type="movie"
                rating={e.vote_average}
              />
            );
          })}
        </div>
      )}
      {content.length === 20 && (
        <CustomPagination
          currentPage={currentPage}
          pages={pages}
          handlePageChange={handlePageChange}
          numberOfPages={numberOfPages}
        />
      )}
    </>
  );
};
export default Movies;

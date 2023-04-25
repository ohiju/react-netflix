import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import axios from '../../api/axios';
import './SearchPage.css';
import { useDebounce } from '../../hooks/useDebounce';
import { useNavigate } from 'react-router-dom';

export default function SearchPage() {
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState([]);
    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    }

    let query = useQuery();
    const searchTerm = query.get('q');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);


    useEffect(() => {
        if(debouncedSearchTerm) {
            fetchSearchMovie();
        }
    }, [debouncedSearchTerm]);

    const fetchSearchMovie = async () => {
        try {
            const request = await axios.get(
                `search/multi?include_adult=true&query=${searchTerm}&exclude_adult=false`
            );
            setSearchResults(request.data.results);
        } catch (error) {
            console.error(error);
        }
    };
    
    const renderSearchResults = () => {
        return searchResults.length > 0 ? (
            <section className='search-container'>
                {searchResults.map((movie) => {
                    if(movie.backdrop_path !== null && movie.media_type !== 'person') {
                        const movieImageUrl =
                        "https://image.tmdb.org/t/p/w500" + movie.backdrop_path
                        return (
                            <div className='movie' key={movie.id}>
                                <div onClick={()=>navigate(`/${movie.id}`)} className='movie__column-poster'>
                                    <img src={movieImageUrl} alt="movie image" className='movie__poster'/>
                                </div>
                            </div>
                        )
                    }
                })}
            </section>
        ) : (
            <section className='no-results'>
                <div className='no-results__text'>
                <p>
                    찾고자하는 검색어 "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
                </p>
                </div>
            </section>
        )
    }

  return (renderSearchResults())
}

import React, { useState, useEffect } from "react";
import Header from "../../components/Header/header";
import SearchBar from "../../components/SearchBar/searchBar";
import ExerciseCard from "../../components/ExerciseCard/exerciseCard";
import Footer from "../../components/Footer/footer";
import "./routines.css";

const ExercisePage = () => {
  const [exerciseDataState, setExerciseDataState] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [bodyPart, setBodyPart] = useState('');
  const [limit, setLimit] = useState(25);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState();

  useEffect(() => {
    fetchExercises();
  }, [searchTerm, bodyPart, limit]);

  const fetchExercises = () => {
    setLoading(true);
    let url = '/api/exercises?';
    if (searchTerm) {
      url += `search=${searchTerm}&`;
    }
    if (bodyPart) {
      url += `bodyPart=${bodyPart}&`;
    }
    url += `limit=${limit}`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setExerciseDataState(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching exercises:', error);
        setLoading(false);
      });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleBodyPartChange = (part) => {
    setBodyPart(part);
  };

  const handleLimitChange = (value) => {
    setLimit(value);
  };

  const bodyParts = [
    'chest',
    'upper legs',
    'lower arms',
    'neck',
    'shoulders',
    'upper arms',
    'lower legs',
    'waist',
    'back',
    'cardio'
  ];

  useEffect(() => {
    const tryToken = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          setIsLoggedIn(false);
          return;
        }
        else{
          setIsLoggedIn(true);
          setToken(token);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsLoggedIn(false);
      }
    };

    tryToken();
  }, []);

  return (
    <div className="exercise-page">
      <Header isAuthenticated={isLoggedIn}/>
      <SearchBar onSearch={handleSearch} />
      {loading ? (
        <div className="loader-container">
          <span className="loader"></span>
        </div>
      ) : (
        <div className="exercise-list">
        <div key={"most-rated"} className={`$most-rated-exercises`}>
              <h1 className="h1-exercise">MOST RATED EXERCISES</h1>
              {console.log(exerciseDataState.samples["rates"])}
              {exerciseDataState.samples["rates"] && (
                <ExerciseCard
                  exercise={exerciseDataState.samples["rates"]}
                  limit={limit}
                />
              )}
            </div>
          {bodyParts.map((part) => (
            <div key={part} className={`${part}-exercises`}>
              <h1 className="h1-exercise">{part.toUpperCase()} EXERCISES</h1>
              {exerciseDataState.samples[part] && (
                <ExerciseCard
                  exercise={exerciseDataState.samples[part]}
                  bodyPartChoosen={part}
                  limit={limit}
                />
              )}
            </div>
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ExercisePage;

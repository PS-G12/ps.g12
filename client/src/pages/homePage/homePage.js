import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Line } from 'react-chartjs-2';
import { CategoryScale, Chart, LineElement, PointElement } from 'chart.js';
import { LinearScale } from 'chart.js';
import 'chartjs-plugin-datalabels';
import Header from '../../components/Header/header';
import ObjectiveCard from '../../components/ObjectiveCard/ObjectiveCard';
import MacrosCard from '../../components/MacrosCard/macrosCard';
import Footer from '../../components/Footer/footer';
import './homePage.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDumbbell, faHeart } from "@fortawesome/free-solid-svg-icons";

Chart.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

const IndexPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [objectiveData, setObjectiveData] = useState({
    value: 0,
    kcalObjective: 0,
    food: 0,
    exercise: 0,
    remaining: 0
  });
  const [macrosData, setMacrosData] = useState({
    value: 0,
    max: 0,
    value2: 0,
    max2: 0,
    value3: 0,
    max3: 0
  });

  useEffect(() => {
    fetch('/user/data', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    })
    .then(response => {
      if (response.ok) {
        setIsLoggedIn(true);
        return response.json();
      } else {
        setIsLoggedIn(false);
        throw new Error('User data not available');
      }
    })
    .then(data => {
      setObjectiveData({
        value: data.objective.value,
        kcalObjective: data.objective.kcalObjective,
        food: data.objective.food,
        exercise: data.objective.exercise,
        remaining: data.objective.remaining
      });
      setMacrosData({
        value: data.macros.value1,
        max: data.macros.max1,
        value2: data.macros.value2,
        max2: data.macros.max2,
        value3: data.macros.value3,
        max3: data.macros.max3
      });
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
      setIsLoggedIn(false);
    });
  }, []);
  

  return (
    <div className="index-page">
      <Header isAuthenticated={isLoggedIn} />
      {isLoggedIn ? (
        <div className="cards">
          <ObjectiveCard 
            value={(objectiveData.remaining / objectiveData.kcalObjective) * 100} 
            kcalObjective={objectiveData.kcalObjective} 
            food={objectiveData.food} 
            exercise={objectiveData.exercise} 
            remaining={objectiveData.remaining} 
          />
          <MacrosCard 
            value={macrosData.value} 
            max={macrosData.max} 
            value2={macrosData.value2} 
            max2={macrosData.max2} 
            value3={macrosData.value3} 
            max3={macrosData.max3}
          />
        </div>
      ) : (
        <div className="cards default">
          <div className="message-block">
            <span role="img" aria-label="lock" className="lock-icon">&#x1F512;</span>
            <p>Please <Link to="/login">log in</Link> or <Link to="/register">register</Link> to access this content.</p>
          </div>
          <div className="blur-content">
            <ObjectiveCard value={50} kcalObjective={2000} food={0} exercise={0} remaining={1000} />
            <MacrosCard value={60} max={150} value2={40} max2={50} value3={30} max3={80}/>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default IndexPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { Line } from "react-chartjs-2";
import { CategoryScale, Chart, LineElement, PointElement } from "chart.js";
import { LinearScale } from "chart.js";
import "chartjs-plugin-datalabels";
import Header from "../../components/Header/header";
import ObjectiveCard from "../../components/ObjectiveCard/ObjectiveCard";
import MacrosCard from "../../components/MacrosCard/macrosCard";
import WaterGlass from "../../components/WaterCard/WaterCard";
import Footer from "../../components/Footer/footer";
import "./homePage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDumbbell, faHeart } from "@fortawesome/free-solid-svg-icons";
import Tutorial from "../../components/Tutorial/tutorial";
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

Chart.register(LineElement, CategoryScale, LinearScale, PointElement);

const IndexPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false); 

  const [objectiveData, setObjectiveData] = useState({
    value: 0,
    kcalObjective: 0,
    food: 0,
    kcalBurned: 0,
    remaining: 0,
  });
  const [macrosData, setMacrosData] = useState({
    value: 0,
    max: 0,
    value2: 0,
    max2: 0,
    value3: 0,
    max3: 0,
  });

  const [weightProgressionData, setWeightProgressionData] = useState({
    dates: [],
    weights: [],
  });

  const [PulseProgressionData, setPulseProgressionData] = useState({
    dates: [],
    ratio: [],
  });

  const [popupData, setPopupData] = useState(null);

  const [waterCount, setwaterCount] = useState(0);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      
      fetch("/user/data", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          
          if (response.ok) {
            setIsLoggedIn(true);
            return response.json();
          } else {
            setIsLoggedIn(false);
            throw new Error("User data not available");
          }
        })
        .then((data) => {
          //setLoading(false);
          if (!data.objectiveData.userLastLogin) {
            setShowTutorial(true);
          } else {
            setShowTutorial(false);
          }

          setObjectiveData({
            value: data.objectiveData.kcalConsumed,
            kcalObjective: data.objectiveData.kcalObjective,
            food: data.objectiveData.kcalConsumed,
            exercise: data.objectiveData.kcalBurned === undefined ? 0 : data.objectiveData.kcalBurned,
            remaining:
              data.objectiveData.kcalObjective -
              data.objectiveData.kcalConsumed,
          });
          setMacrosData({
            value: data.objectiveData.carbsConsumed,
            max: data.objectiveData.carbsObjective,
            value2: data.objectiveData.fatsConsumed,
            max2: data.objectiveData.fatsObjective,
            value3: data.objectiveData.proteinsConsumed,
            max3: data.objectiveData.proteinsObjective,
          });

          let weightProgressionDates = [];
          let weightProgressionWeights = [];
          let pulseProgressionDates = [];
          let pulseProgressionratio = [];

          weightProgressionDates = Object.keys(
            data.objectiveData.weightProgression
          );
          weightProgressionWeights = Object.values(
            data.objectiveData.weightProgression
          );
          pulseProgressionDates = Object.keys(
            data.objectiveData.pulseProgression
          );
          pulseProgressionratio = Object.values(
            data.objectiveData.pulseProgression
          );

          setWeightProgressionData({
            dates: weightProgressionDates,
            weights: weightProgressionWeights,
          });

          setPulseProgressionData({
            dates: pulseProgressionDates,
            ratio: pulseProgressionratio,
          });
          setwaterCount(data.objectiveData.waterAmount || 0);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setIsLoggedIn(false);
          
        });
    } else {
      
    }
  }, []);

  const handlePulseChartClick = (event) => {
    const clickedDate = event.target.dataset.date;
    const defaultDate = new Date(clickedDate);
    const currentDate = new Date();
    if (defaultDate > currentDate) return;

    const pulsePopup = (
      <div className="pulse-popup">
        <h3>Register your pulse</h3>
        <form className="pulse-form" onSubmit={handleSubmit}>
          <label htmlFor="pulseDate">Date:</label>
          <input
            type="date"
            id="pulseDate"
            name="pulseDate"
            defaultValue={clickedDate}
            max={currentDate.toISOString().split("T")[0]}
            required
          />
          <label htmlFor="pulse">Pulse (Bpm):</label>
          <input type="number" id="pulse" name="pulse" min="0" required />
          <div className="button-space">
            <button type="submit" className="submit-button">
              Submit
            </button>
            <button
              className="cancel-button"
              onClick={() => setPopupData(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );

    setPopupData(pulsePopup);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const weightDate = formData.get("weightDate");
    const weight = formData.get("weight");
    const pulseDate = formData.get("pulseDate");
    const pulse = formData.get("pulse");

    if (pulse > 0) {
      const token = sessionStorage.getItem("token");
      if (token) {
        fetch("/user/data/pulse", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pulseDate, pulse }),
        }).then((response) => {
          setPopupData(null);
          window.location.reload();
        });
      }
    } else if (weight > 0) {
      const token = sessionStorage.getItem("token");
      if (token) {
        fetch("/user/data/weight", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ weightDate, weight }),
        }).then((response) => {
          setPopupData(null);
          window.location.reload();
        });
      }
    }
  };

  const handleWeightChartClick = (event) => {
    const clickedDate = event.target.dataset.date;
    const defaultDate = new Date(clickedDate);
    const currentDate = new Date();
    if (defaultDate > currentDate) return;

    const weightPopup = (
      <div className="weight-popup">
        <h3>Register your weight</h3>
        <form className="weight-form" onSubmit={handleSubmit}>
          <label htmlFor="weightDate">Date:</label>
          <input
            type="date"
            id="weightDate"
            name="weightDate"
            defaultValue={clickedDate}
            max={currentDate.toISOString().split("T")[0]}
            required
          />
          <label htmlFor="weight">Weight (Kg):</label>
          <input type="number" id="weight" name="weight" min="0" required />
          <div className="button-space">
            <button type="submit" className="submit-button">
              Submit
            </button>
            <button
              className="cancel-button"
              onClick={() => setPopupData(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );

    setPopupData(weightPopup);
  };

  const handleWaterData = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const waterAmount = parseInt(formData.get("waterAmount"));

    if (waterAmount > 0) {
      const token = sessionStorage.getItem("token");
      if (token) {
        fetch("/user/data/water", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ waterAmount }),
        })
          .then((response) => {
            if (response.ok) {
              setwaterCount(waterAmount + waterCount);
              setPopupData(null);
            } else {
              console.error("Failed to add water");
            }
          })
          .catch((error) => {
            console.error("Error adding water:", error);
          });
      }
    } else {
      console.error("Invalid water amount");
    }
  };

  const handleWaterSubmit = (event) => {
    event.preventDefault();
    const waterPopup = (
      <div className="water-popup" onSubmit={handleWaterData}>
        <h3>Add Water</h3>
        <form className="water-form">
          <label htmlFor="waterAmount">Amount (ml):</label>
          <input
            type="number"
            id="waterAmount"
            name="waterAmount"
            min="0"
            required
          />
          <div className="button-space">
            <button type="submit" className="submit-button">
              Submit
            </button>
            <button
              className="cancel-button"
              onClick={() => setPopupData(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
    setPopupData(waterPopup);
  };

  return (
    <div className="index-page">
      <Header isAuthenticated={isLoggedIn} />
      {false ? (
        <div className="loader-container">
          <span className="loader"></span>
        </div>
      ) : (
        <>
          {isLoggedIn ? (
            
            <div className="cards"> 
              <button className="floating-button" onClick={() => setShowTutorial(true)}>
                <FontAwesomeIcon icon={faQuestionCircle} />
              </button>
              <div className="card-container-top">
                <ObjectiveCard
                  remaining={Math.round(
                    parseFloat(
                      (objectiveData.value / objectiveData.kcalObjective) * 100
                    )
                  )}
                  kcalObjective={Math.round(
                    parseFloat(objectiveData.kcalObjective)
                  )}
                  food={Math.round(parseFloat(objectiveData.food))}
                  exercise={Math.round(parseFloat(objectiveData.exercise))}
                  value={Math.round(parseFloat(objectiveData.remaining))}
                />

                <MacrosCard
                  value={Math.round(parseFloat(macrosData.value))}
                  max={Math.round(parseFloat(macrosData.max))}
                  value2={Math.round(parseFloat(macrosData.value2))}
                  max2={Math.round(parseFloat(macrosData.max2))}
                  value3={Math.round(parseFloat(macrosData.value3))}
                  max3={Math.round(parseFloat(macrosData.max3))}
                />

                {showTutorial && <Tutorial />}
                <div className="water-container" onClick={handleWaterSubmit}>
                  <WaterGlass waterCount={waterCount} waterGoal={1500} />
                </div>
              </div>
              <div className="chart-container-main">
                <div
                  className="chart-container"
                  onClick={handleWeightChartClick}
                >
                  <p>
                    {" "}
                    Your Weight Progression{" "}
                    <FontAwesomeIcon icon={faDumbbell} />
                  </p>
                  <Line
                    data={{
                      labels: weightProgressionData.dates,
                      datasets: [
                        {
                          label: "Weight Progression",
                          data: weightProgressionData.weights,
                          fill: false,
                          borderColor: "rgb(75, 192, 192)",
                          tension: 0.1,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                        legend: {
                          display: true,
                        },
                      },
                    }}
                  />
                </div>

                <div
                  className="chart-container2"
                  onClick={handlePulseChartClick}
                >
                  <p>
                    Your Pulse Progression <FontAwesomeIcon icon={faHeart} />
                  </p>
                  <Line
                    data={{
                      labels: PulseProgressionData.dates,
                      datasets: [
                        {
                          label: "Pulse Progression",
                          data: PulseProgressionData.ratio,
                          fill: false,
                          borderColor: "rgb(12, 374, 12)",
                          tension: 0.1,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                        legend: {
                          display: true,
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="cards default">
              <div className="message-block">
                <span role="img" aria-label="lock" className="lock-icon">
                  &#x1F512;
                </span>
                <p>
                  Please <Link to="/login">log in</Link> or{" "}
                  <Link to="/register">register</Link> to access this content.
                </p>
              </div>
              <div className="blur-content">
                <div className="cards">
                  <div className="card-container-top">
                    <ObjectiveCard
                      remaining={35}
                      kcalObjective={2000}
                      food={1000}
                      exercise={0}
                      value={200}
                    />

                    <MacrosCard
                      value={40}
                      max={110}
                      value2={50}
                      max2={70}
                      value3={35}
                      max3={100}
                    />
                    <div
                      className="water-container"
                      onClick={handleWaterSubmit}
                    >
                      <WaterGlass waterCount={0} waterGoal={1500} />
                    </div>
                  </div>
                  <div className="chart-container-main">
                    <div
                      className="chart-container"
                      onClick={handleWeightChartClick}
                    >
                      <p>
                        {" "}
                        Your Weight Progression{" "}
                        <FontAwesomeIcon icon={faDumbbell} />
                      </p>
                      <Line
                        data={{
                          labels: [
                            "2024-02-05",
                            "2024-03-11",
                            "2024-03-26",
                            "2024-03-31",
                          ],
                          datasets: [
                            {
                              label: "Weight Progression",
                              data: [66, 67, 67.4, 68, 70],
                              fill: false,
                              borderColor: "rgb(75, 192, 192)",
                              tension: 0.1,
                            },
                          ],
                        }}
                        options={{
                          plugins: {
                            scales: {
                              y: {
                                beginAtZero: true,
                              },
                            },
                            legend: {
                              display: true,
                            },
                          },
                        }}
                      />
                    </div>

                    <div
                      className="chart-container2"
                      onClick={handlePulseChartClick}
                    >
                      <p>
                        Your Pulse Progression{" "}
                        <FontAwesomeIcon icon={faHeart} />
                      </p>
                      <Line
                        data={{
                          labels: [
                            "2024-02-03",
                            "2024-03-10",
                            "2024-03-20",
                            "2024-03-31",
                            "2024-04-11",
                          ],
                          datasets: [
                            {
                              label: "Pulse Progression",
                              data: [54, 63, 78, 74, 79],
                              fill: false,
                              borderColor: "rgb(12, 374, 12)",
                              tension: 0.1,
                            },
                          ],
                        }}
                        options={{
                          plugins: {
                            scales: {
                              y: {
                                beginAtZero: true,
                              },
                            },
                            legend: {
                              display: true,
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <Footer />
          {popupData}
        </>
      )}
    </div>
  );
};

export default IndexPage;

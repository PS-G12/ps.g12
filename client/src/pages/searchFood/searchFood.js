import React, { useState, useEffect } from "react";
import Header from "../../components/Header/header.js";
import AddFood from "../../components/AddFood/addFood.js";
import FoodCard from "../../components/FoodCard/foodCard.js"; 
import { Link, useLocation } from "react-router-dom";
import "./searchFood.css";

const FoodSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [savedMessage, setSavedMessage] = useState("");
  const [queryType, setQuerytype] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDetails, setShowDetails] = useState(false); 

  const location = useLocation();

  const type = new URLSearchParams(location.search).get("type");
  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      fetch("/verify-token", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
            console.error("Invalid token");
          }
        })
        .catch((error) => {
          console.error("Error verifying token:", error);
        });
    } else {
      console.error("Could not find the token, user not authenticated");
    }

    if (type === "none") {
      setQuerytype(false);
      fetch(`/api/food?search=${query}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setSearchResult(data);
        })
        .catch((error) => {
          console.error("Error fetching food data:", error);
        });
      return;
    }
    setQuerytype(true);
  }, []);

  const handleSearch = () => {
    const token = sessionStorage.getItem("token");
    const requestOptions = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    if (type === "none" || !queryType) {
      fetch(`/api/food?search=${searchQuery}`, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setSearchResult(data);
          const localData = JSON.parse(localStorage.getItem("foodData"));
          let filteredData = [];
          if (localData) {
            filteredData = localData.filter(obj => {
              return obj.hasOwnProperty("0") && obj["0"].name && obj["0"].name.toLowerCase().startsWith(searchQuery.toLowerCase());
            });
          }
          const mergedData = {
            items: [...data.items, ...filteredData]
          };
          setSearchResult(mergedData);
        })
        .catch((error) => {
          console.error("Error fetching food data:", error);
        });
    } else {
      fetch(`/api/food?search=${searchQuery}`, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setSearchResult(data);
          const localData = JSON.parse(localStorage.getItem("foodData"));
          let filteredData = [];
          if (localData) {
            filteredData = localData.filter(obj => {
              return obj.hasOwnProperty("0") && obj["0"].name && obj["0"].name.toLowerCase().startsWith(searchQuery.toLowerCase());
            });
          }
          const mergedData = {
            items: [...data.items, ...filteredData]
          };
          setSearchResult(mergedData);
        })
          
        .catch((error) => {
          console.error("Error fetching exercises data:", error);
        });
    }
  };

  const handleShowDetails = () => {
    setShowDetails(!showDetails); 
  };
  

  const handleRowClick = (item) => {
    setSelectedItem(item);
  };

  const handleAddToMeal = () => {
    if (!selectedItem) {
      console.error("No se ha seleccionado ningún alimento.");
      return;
    }

    const nuevoAlimento = {
      typeComida: type,
      nombre: selectedItem.name,
      calorias: (selectedItem.calories * quantity) / 100,
      cantidad: quantity,
      servingSize: (selectedItem.serving_size_g * quantity) / 100,
      fatTotal: (selectedItem.fat_total_g * quantity) / 100,
      fatSaturated: (selectedItem.fat_saturated_g * quantity) / 100,
      protein: (selectedItem.protein_g * quantity) / 100,
      sodium: (selectedItem.sodium_mg * quantity) / 100,
      potassium: (selectedItem.potassium_mg * quantity) / 100,
      cholesterol: (selectedItem.cholesterol_mg * quantity) / 100,
      carbohydratesTotal: (selectedItem.carbohydrates_total_g * quantity) / 100,
      fiber: (selectedItem.fiber_g * quantity) / 100,
      sugar: (selectedItem.sugar_g * quantity) / 100,
    };
    if (isLoggedIn) {
      const token = sessionStorage.getItem("token");
      fetch("/user/data/food", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ food: nuevoAlimento }),
      })
        .then((response) => {
          if (response.ok) {
            setSavedMessage("Alimento guardado correctamente.");
            setSearchQuery("");
            setSearchResult(null);
            setSelectedItem(null);
            setQuantity(100);
          } else {
            console.error("Error al guardar el alimento:", response.statusText);
            throw new Error("Error al guardar el alimento");
          }
        })
        .catch((error) => {
          console.error("Error al guardar el alimento:", error);
        });
    } else {
      const alimentosGuardados =
        JSON.parse(localStorage.getItem("alimentos")) || [];
      const nuevosAlimentos = [...alimentosGuardados, nuevoAlimento];
      localStorage.setItem("alimentos", JSON.stringify(nuevosAlimentos));
      setSavedMessage("Alimento guardado correctamente.");
      setSearchQuery("");
      setSearchResult(null);
      setSelectedItem(null);
      setQuantity(100);
    }
  };
  return (
    <div className="buscarAlimento-box">
      <Header isAuthenticated={isLoggedIn} />
      {queryType ? <h1>Add food to {type}</h1> : null}
      <div className="searchbar">
        <div id="form" className="searchbar-container">
          <input
            type="text"
            placeholder="Enter search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch} className="searchButton">
            <svg viewBox="0 0 1024 1024">
              <path
                className="path1"
                d="M848.471 928l-263.059-263.059c-48.941 
              36.706-110.118 55.059-177.412 55.059-171.294 0-312-140.706-312-312s140.706-312 
              312-312c171.294 0 312 140.706 312 312 0 67.294-24.471 128.471-55.059 177.412l263.059 
              263.059-79.529 79.529zM189.623 408.078c0 121.364 97.091 218.455 218.455 
              218.455s218.455-97.091 218.455-218.455c0-121.364-103.159-218.455-218.455-218.455-121.364 
              0-218.455 97.091-218.455 218.455z"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <Link to="/registerFood">
        <button>Go to Food Log</button>
      </Link>

      <AddFood isAuthenticated={isLoggedIn}></AddFood>

      <div className="resultSearchFood">
        <div className="search-result">
          {searchResult ? (
            <div className="result-container-searchFood">
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Calories</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResult.items.map((item, index) => {
                      if (item.hasOwnProperty("name")) {
                        return (
                          <tr
                            key={index}
                            onClick={() => handleRowClick(item)}
                            className={
                              selectedItem === item ? "selected-row" : ""
                            }
                          >
                            <td>{item.name}</td>
                            <td>{item.calories}</td>
                          </tr>
                        );
                      } else {
                        const specialItem = Object.values(item)[0];
                        return (
                          <tr
                            key={index}
                            onClick={() => handleRowClick(specialItem)}
                            className={
                              selectedItem === specialItem ? "selected-row" : ""
                            }
                          >
                            <td>{specialItem.name}</td>
                            <td>{specialItem.calories}</td>
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </table>
              </div>

              {selectedItem && (
                <div className="details-container">
                  <h2>Details of {selectedItem.name}:</h2>
                  <p>
                    <strong>Calories:</strong> {selectedItem.calories}
                  </p>
                  <p>
                    <strong>Serving size:</strong> {selectedItem.serving_size_g}{" "}
                    g
                  </p>
                  <p>
                    Quantity:{" "}
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />{" "}
                    grams
                  </p>
                  {queryType ? (
                    <button onClick={handleAddToMeal}>Add to {type}</button>
                  ) : null}

                <button onClick={handleShowDetails}>
                  {showDetails ? "Hide Details" : "See More Details"}
                </button>

                {showDetails && <FoodCard selectedItem={selectedItem} quantity={quantity} />}
                {savedMessage && <p>{savedMessage}</p>}
                </div>
              )}



              {searchResult.items.length === 0 && (
                <p>No se encontraron resultados.</p>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default FoodSearch;

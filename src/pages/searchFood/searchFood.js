import React, { useState } from "react";
import fetchFood from "../../api/fetchFood.js";
import Header from "../../components/Header/header.js";
import { useLocation } from "react-router-dom";
import "./searchFood.css";
import AddFood from "../../components/AddFood/addFood.js";
import FoodCard from "../../components/FoodCard/foodCard.js";
import Footer from "../../components/Footer/footer.js";

const FoodSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const location = useLocation();
  const type = new URLSearchParams(location.search).get("type");

  const handleSearch = () => {
    const storedFood = JSON.parse(localStorage.getItem("foodData")) || [];

    const alimentosGuardados = JSON.parse(localStorage.getItem("foodData")) || {
      items: [],
    };
    const searchQueryNormalized = searchQuery.trim().toLowerCase();
    const found = alimentosGuardados.items.find(
      (items) => items.name === searchQueryNormalized
    );

    if (found) {
      setSearchResult(found);
      setSelectedItem(null);
      return;
    }

    fetchFood(searchQuery)
      .then((result) => {
        setSearchResult(result);
        setSelectedItem(null);
      })
      .catch((error) => {
        console.error("Error:", error.message);
        setSearchResult(null);
        setSelectedItem(null);
      });
  };

  const handleRowClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className="searchFood-box">
      <Header />
      <div className="searchFood-container">
        <h1>Add food to {type}</h1>
        <div className="searchbar-container">
          <input
            className="form-search-input"
            type="text"
            placeholder="Introduce the food you're looking for"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {searchResult && (
          <div className="result-container-food">
            <div className="table-container-food">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Calories</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResult.items && searchResult.items.length > 0 ? (
                    searchResult.items.map((item, index) => (
                      <tr
                        key={index}
                        onClick={() => handleRowClick(item)}
                        className={
                          selectedItem === item ? "selected-row" : index
                        }
                        id="tr-result"
                      >
                        <td>{item.name}</td>
                        <td>{item.calories}</td>
                      </tr>
                    ))
                  ) : searchResult.name ? (
                    <tr
                      key={1}
                      onClick={() => handleRowClick(searchResult)}
                      className="selected-row"
                    >
                      <td>{searchResult.name}</td>
                      <td>{searchResult.calories}</td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan="2">There were no results.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedItem && (
          <div className="search-result-container">
            {searchResult && (
              <div className="result-container-food-details">
                <FoodCard
                  selectedItem={selectedItem}
                  quantity={100}
                  // setQuantity={setQuantity}
                />
              </div>
            )}
          </div>
        )}
        <AddFood />
      </div>
      <Footer />
    </div>
  );
};

export default FoodSearch;

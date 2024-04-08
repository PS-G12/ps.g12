import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Routines from "./pages/routines/routines.js";
import HomePage from "./pages/homePage/homePage.js";
import SearchResultsPage from "./pages/searchResults/searchResults.js";
import ExercisePage from "./pages/exercise/exercise";
import RegisterFood from "./pages/registerFood/registerFood.js";
import SearchFood from "./pages/searchFood/searchFood.js";
import BMICalculatorPage from "./pages/bmi/bmi.js";
import MacrosCalculator from "./pages/MacrosCalculator/macrosCalculation.js";
import RegisterForm from "./pages/Authentication/registerPage.js";
import LoginForm from "./pages/Authentication/loginPage.js";
import UserProfile from './pages/profile/profile.js';


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/routines" element={<Routines />} />
        <Route path="/results" element={<SearchResultsPage />} />
        <Route path="/exercise" element={<ExercisePage />} />
        <Route path="/BMIcalculation" element={<BMICalculatorPage />} />
        <Route path="/searchFood" element={<SearchFood />} />
        <Route path="/registerFood" element={<RegisterFood />} />
        <Route path="/MacrosCalculation" element={<MacrosCalculator />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;

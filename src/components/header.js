import React from 'react';
import '../styles/header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faUtensils, faDumbbell, faCalculator } from '@fortawesome/free-solid-svg-icons'

function Header() {
  return (
    <header className="header">
      <nav className="navbar">
        <div className="logo"></div>
        <ul className="nav-links">
            <li><a href="/"><FontAwesomeIcon icon={faChartLine} /> INICIO</a></li>
            <li><a href="/alimentos"><FontAwesomeIcon icon={faUtensils} /> ALIMENTOS</a></li>
            <li><a href="/ejercicios"><FontAwesomeIcon icon={faDumbbell} /> EJERCICIOS</a></li>
            <li><a href="/calculadora"><FontAwesomeIcon icon={faCalculator} /> CALCULADORA</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
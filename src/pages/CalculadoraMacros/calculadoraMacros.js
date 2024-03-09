import React, { useState } from "react";
import './calculadoraMacros.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faFire, faCheese, faBreadSlice, faFish, faPlay } from '@fortawesome/free-solid-svg-icons'
import Header from '../../components/Header/header';
function CalculadoraMacros(){

    // Lectura de datos: sistema, altura, edad, peso, genero, actividad y meta
    const [sistema, setSistema] = useState("metrico");
    const [altura, setAltura] = useState("");
    const [edad, setEdad] = useState("");
    const [peso, setPeso] = useState("");
    const [genero, setGenero] = useState("hombre");
    const [actividad, setActividad] = useState("sedentario");
    const [meta, setMeta] = useState("perder-peso");

    // Resultados de calorías, proteínas, carbohidratos y grasas
    const [resultadoCalorias, setCalorias] = useState("");
    const [resultadoProteinas, setProteinas] = useState("");
    const [resultadoCarbohidratos, setCarbohidratos] = useState("");
    const [resultadoGrasas, setGrasas] = useState("");

    let checks = document.querySelectorAll("input[type=checkbox]");
    checks.forEach(check => check.addEventListener("change", function(e){
        let marcado = e.target.checked;
        checks.forEach(check => check.checked = false);
        e.target.checked = marcado;
    }));

    const LeerEdad = (event) => {
        setEdad(event.target.value);
    };

    const LeerAltura = (event) => {
        setAltura(event.target.value);
    };

    const LeerPeso = (event) => {
        setPeso(event.target.value);
    };

    const seleccionSistema = (event) => {
        setSistema(event.target.value);
    }

    const seleccionGenero = (event) => {
        setGenero(event.target.value);
    }

    const seleccionActividad = (event) => {
        setActividad(event.target.value);
    }

    const seleccionMeta = (event) => {
        setMeta(event.target.value);
    }

    const calcularMacros = () => {
        if (!altura || !peso || !edad) {
            alert('Por favor, complete todos los campos');
            return;
        }

        const factorSedentario = 1.2;
        const factorModerado = 1.375;
        const factorIntenso = 1.60;

        const alturaUser = parseFloat(altura);
        const pesoUser = parseFloat(peso);

        let objetivoCalorias;
        switch (meta) {
            case "ganar-peso":
                objetivoCalorias = 500; // Añadir 500 calorías por día para ganar peso
                break;
            case "perder-peso":
                objetivoCalorias = -500; // Restar 500 calorías por día para perder peso
                break;
            case "mantener-peso":
            default:
                objetivoCalorias = 0; // Mantener el mismo número de calorías
                break;
        }
    
        let TMB; // Tasa metabólica basal
        let actividadFactor; // Factor de actividad
    
        // Calcular la TMB según el género
        if (genero === "hombre") {
            TMB = 10 * pesoUser + 6.25 * alturaUser - 5 * edad + 5;
        } else {
            TMB = 10 * pesoUser + 6.25 * alturaUser - 5 * edad - 161;
        }
    
        // Calcular el factor de actividad
        if (actividad === "sedentario") {
            actividadFactor = factorSedentario;
        } else if (actividad === "moderado") {
            actividadFactor = factorModerado;
        } else {
            actividadFactor = factorIntenso;
        }
    
        // Calcular las calorías necesarias por día
        const calorias = TMB * actividadFactor + objetivoCalorias;
        setCalorias(calorias.toFixed(2));
    
        // Calcular las proteínas necesarias
        const proteinas = pesoUser * 2.2; // En gramos
        setProteinas(proteinas.toFixed(2));
    
        // Calcular las grasas necesarias
        const grasas = (calorias * 0.25) / 9; // El 25% de las calorías diarias proviene de grasas
        setGrasas(grasas.toFixed(2));
    
        // Calcular los carbohidratos necesarios
        const carbohidratos = (calorias - (proteinas * 4) - (grasas * 9)) / 4; // Los carbohidratos aportan 4 calorías por gramo
        setCarbohidratos(carbohidratos.toFixed(2));
    };


    return (
        <div className="contenedor-macros">
            {/* <Header /> */}
            <p>MACRONUTRIENTES Y CALORÍAS</p>
            <div className="intro">
                <span className="dato1">Calcule los macronutrientes necesarios que debe consumir, dependiendo de su estatura, peso y objetivos.</span>
                <span className="dato2">Elija un sistema de medida:</span>
                <div className="seleccion-medidas">
                    <label>
                        Sistema anglosajón
                        <input type="checkbox" value="anglosajon" onChange={seleccionSistema}></input>
                    </label>
                    <label>
                        Sistema métrico
                        <input type="checkbox" defaultChecked value="metrico" onChange={seleccionSistema}></input>
                    </label>
                </div>
            </div>
            <form>
                <div className="fila1">
                    <div className="introducir-edad">
                        <form className="edad">
                            <label className="info-edad">{"Edad:"}</label>
                            <input type="text" placeholder="Edad" className="input-edad" value={edad} onChange={LeerEdad} required></input>
                        </form>
                    </div>
        
                    <div className="introducir-genero">
                        <form className="genero">
                            <label className="info-genero">{"Género:"}</label>
                            <select id="info-genero" className="info-genero" value={genero} onChange={seleccionGenero}>
                                <option value="hombre">Hombre</option> 
                                <option value="mujer">Mujer</option>
                            </select>
                        </form>
                    </div>
                    <div className="input-altura">
                        <form className="altura">
                            <label className="info-altura">{sistema === "anglosajon" ? "Estatura (ft):" : "Estatura (cm):"}</label>
                            <input type="text" placeholder="Estatura" className="input-altura" value={altura} onChange={LeerAltura} required></input>
                        </form>
                    </div>
        
                    <div className="input-peso">
                        <form className="peso">
                            <label className="info-peso">{sistema === "anglosajon" ? "Peso (lbs):" : "Peso (kg):"}</label>
                            <input type="text" placeholder="Peso" className="input-peso" value={peso} onChange={LeerPeso} required></input>
                        </form>
                    </div>
                </div>
                <div className="fila2">
                    <div className="introducir-actividad">
                        <form className="actividad">
                            <label htmlFor="actividad-fisica">Actividad física actual:</label>
                            <select id="actividad-fisica" className="input-actividad" value={actividad} onChange={seleccionActividad}>
                                <option value="sedentario">Sedentario</option> 
                                <option value="moderado">Moderado</option>
                                <option value="intensa">Intensa</option>
                            </select>
                        </form>
                    </div>
        
                    <div className="introducir-meta">
                        <label className="info-meta">{"Meta:"}</label>
                        <ul>
                            <li><input type="radio" id="perder-peso" name="meta" value="perder-peso" checked={meta === "perder-peso"} onChange={seleccionMeta}/><label htmlFor="perder-peso">Perder peso</label></li>
                            <li><input type="radio" id="mantener" name="meta" value="mantener" checked={meta === "mantener"} onChange={seleccionMeta}/><label htmlFor="mantener">Mantener</label></li>
                            <li><input type="radio" id="ganar-peso" name="meta" value="ganar-peso" checked={meta === "ganar-peso"} onChange={seleccionMeta}/><label htmlFor="ganar-peso">Ganar peso</label></li>
                        </ul>
                    </div>
                </div>
                <button className="calcularMacros" onClick={calcularMacros}>Calcular</button>
                <div className="resultado-calculoMacros">
                    <div className="resultado-label">Los macronutrientes necesarios son:</div>
                    <div className="contenedor-recuadros">
                        <div className="recuadro">
                            <FontAwesomeIcon icon={faFire} className="icon-calorias" />
                            <h3>Calorías</h3>
                            <p className="info" id="calorias-info">{resultadoCalorias} calorias por día</p>
                        </div>
                        <div className="recuadro">
                            <FontAwesomeIcon icon={faBreadSlice} className="icon-carbos" />
                            <h3>Carbohidratos</h3>
                            <p className="info" id="carbohidratos-info">{resultadoCarbohidratos} gramos por día</p>
                        </div>
                        <div className="recuadro">
                            <FontAwesomeIcon icon={faFish} className="icon-proteinas" />
                            <h3>Proteínas</h3>
                            <p className="info" id="proteinas-info">{resultadoProteinas} gramos por día</p>
                        </div>
                        <div className="recuadro">
                            <FontAwesomeIcon icon={faCheese} className="icon-grasas" />
                            <h3>Grasas</h3>
                            <p className="info" id="grasas-info">{resultadoGrasas} gramos por día</p>
                        </div>
                    </div>
                </div>
                
                <button className="calc-macros">Calculadora de IMC<FontAwesomeIcon icon={faPlay} className="icon-playIMC"/></button>
            </form>
        </div>
    );
}

export default CalculadoraMacros;

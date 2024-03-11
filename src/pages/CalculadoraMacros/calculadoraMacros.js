import React, { useState } from "react";
import './calculadoraMacros.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faCheese, faBreadSlice, faFish, faPlay } from '@fortawesome/free-solid-svg-icons';
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
        let marked = e.target.checked;
        checks.forEach(check => check.checked = false);
        e.target.checked = marked;
    }));

    const readAge = (event) => {
        setAge(event.target.value);
    };

    const readHeight = (event) => {
        setHeight(event.target.value);
    };

    const readWeight = (event) => {
        setWeight(event.target.value);
    };

    const systemSelection = (event) => {
        setSystem(event.target.value);
    };

    const seleccionGenero = (event) => {
        setGenero(event.target.value);
    }

    const seleccionActividad = (event) => {
        setActividad(event.target.value);
    }

    const seleccionMeta = (event) => {
        setMeta(event.target.value);
    }

    const calcularMacros = (event) => {
        event.preventDefault();
        
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
        <div>
            <Header />
            <div className="macros-container-calc">
                {/* <Header />  */}
                <p>MACRONUTRIENTS AND CALORIES</p>
                <div className="intro">
                    <span className="data1">Calculate the necessary macronutrients you should consume based on your height, weight, and goals.</span>
                    <span className="data2">Choose a unit of measurement:</span>
                    <div className="measurement-selection">
                        <label>
                            Imperial system
                            <input type="checkbox" value="imperial" onChange={systemSelection}></input>
                        </label>
                        <label>
                            Metric system
                            <input type="checkbox" defaultChecked value="metric" onChange={systemSelection}></input>
                        </label>
                    </div>
                </div>
                <form>
                    <div className="row1">
                        <div className="enter-age">
                            <div className="age">
                                <label className="age-info">{"Age:"}</label>
                                <input type="text" placeholder="Age" className="input-age" value={age} onChange={readAge} required></input>
                            </div>
                        </div>
            
                        <div className="enter-gender">
                            <div className="gender">
                                <label className="gender-info">{"Gender:"}</label>
                                <select id="gender-info" className="gender-options" value={gender} onChange={genderSelection}>
                                    <option value="male">Male</option> 
                                    <option value="female">Female</option>
                                </select>
                            </div>
                        </div>
                        <div className="input-height">
                            <div className="height">
                                <label className="height-info">{system === "imperial" ? "Height (ft):" : "Height (cm):"}</label>
                                <input type="text" placeholder="Height" className="input-height" value={height} onChange={readHeight} required></input>
                            </div>
                        </div>
            
                        <div className="input-weight">
                            <div className="weight">
                                <label className="weight-info">{system === "imperial" ? "Weight (lbs):" : "Weight (kg):"}</label>
                                <input type="text" placeholder="Weight" className="input-weight" value={weight} onChange={readWeight} required></input>
                            </div>
                        </div>
                    </div>
                    <div className="row2">
                        <div className="enter-activity">
                            <div className="activity">
                                <label htmlFor="activity-fisica">Current Physical Activity:</label>
                                <select id="activity-fisica" className="input-activity" value={activity} onChange={activitySelection}>
                                    <option value="sedentary">Sedentary</option> 
                                    <option value="moderate">Moderate</option>
                                    <option value="intense">Intense</option>
                                </select>
                            </div>
                        </div>
            
                        <div className="enter-goal">
                            <label className="goal-info">{"Goal:"}</label>
                            <ul>
                                <li><input type="radio" id="lose-weight" name="goal" value="lose-weight" checked={goal === "lose-weight"} onChange={goalSelection}/><label htmlFor="lose-weight">Lose weight</label></li>
                                <li><input type="radio" id="maintain" name="goal" value="maintain" checked={goal === "maintain"} onChange={goalSelection}/><label htmlFor="maintain">Keep weight</label></li>
                                <li><input type="radio" id="gain-weight" name="goal" value="gain-weight" checked={goal === "gain-weight"} onChange={goalSelection}/><label htmlFor="gain-weight">Gain weight</label></li>
                            </ul>
                        </div>
                    </div>
                    <button className="calculate-macros" onClick={macrosCalculation}>Calculate</button>
                    <div className="macros-calculation-result">
                        <div className="result-label">The necessary macronutrients are:</div>
                        <div className="boxes-container">
                            <div className="box">
                                <FontAwesomeIcon icon={faFire} className="icon-calories" />
                                <p>Calories</p>
                                <p className="info" id="calories-info">{caloriesResult} calories per day</p>
                            </div>
                            <div className="box">
                                <FontAwesomeIcon icon={faBreadSlice} className="icon-carbs" />
                                <p>Carbohydrates</p>
                                <p className="info" id="carbohydrates-info">{carbohydratesResult} grams per day</p>
                            </div>
                            <div className="box">
                                <FontAwesomeIcon icon={faFish} className="icon-proteins" />
                                <p>Proteins</p>
                                <p className="info" id="proteins-info">{proteinsResult} grams per day </p>
                            </div>
                            <div className="box">
                                <FontAwesomeIcon icon={faCheese} className="icon-fats" />
                                <p>Fats</p>
                                <p className="info" id="fats-info">{fatsResult} grams per day</p>
                            </div>
                        </div>
                    </div>
                </form>
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
                <button className="calcularMacros" onClick={(event) => calcularMacros(event)}>Calcular</button>
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
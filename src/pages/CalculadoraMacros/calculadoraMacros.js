import React, { useState } from "react";
import './calculadoraMacros.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faCheese, faBreadSlice, faFish, faPlay } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/Header/header';
import Footer from "../../components/Footer/footer";

function CalculadoraMacros() {

    // Data inputs: system, height, age, weight, gender, activity, and goal
    const [system, setSystem] = useState("metric");
    const [height, setHeight] = useState("");
    const [age, setAge] = useState("");
    const [weight, setWeight] = useState("");
    const [gender, setGender] = useState("male");
    const [activity, setActivity] = useState("sedentary");
    const [goal, setGoal] = useState("lose-weight");

    // Results of calories, proteins, carbohydrates, and fats
    const [caloriesResult, setCalories] = useState("");
    const [proteinsResult, setProteins] = useState("");
    const [carbohydratesResult, setCarbohydrates] = useState("");
    const [fatsResult, setFats] = useState("");

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

    const genderSelection = (event) => {
        setGender(event.target.value);
    };

    const activitySelection = (event) => {
        setActivity(event.target.value);
    };

    const goalSelection = (event) => {
        setGoal(event.target.value);
    };

    const macrosCalculation = (event) => {
        event.preventDefault();
        
        if (!height || !weight || !age) {
            alert('Please fill out all fields');
            return;
        }

        const sedentaryFactor = 1.2;
        const moderateFactor = 1.375;
        const intenseFactor = 1.60;

        let heightUser = 0;
        let weightUser = 0;

        if (system === "imperial") {
            heightUser = parseFloat(height.replace(",", "."));
            weightUser = parseFloat(weight.replace(",", "."));
      
            heightUser = heightUser / 0.032808; // From feet to centimeters
            weightUser = weightUser / 2.2046; // From pounds to kilograms
        } else {
            heightUser = parseFloat(height);
            weightUser = parseFloat(weight.replace(",", "."));
        }

        let caloriesObjective;
        switch (goal) {
            case "gain-weight":
                caloriesObjective = 500; 
                break;
            case "lose-weight":
                caloriesObjective = -500; 
                break;
            case "maintain-weight":
            default:
                caloriesObjective = 0; 
                break;
        }
    
        let BMR; // Basal Metabolic Rate
        let activityFactor; // Activity factor
    
        // Calculate BMR based on gender
        if (gender === "male") {
            BMR = 10 * weightUser + 6.25 * heightUser - 5 * age + 5;
        } else {
            BMR = 10 * weightUser + 6.25 * heightUser - 5 * age - 161;
        }
    
        // Calculate activity factor
        if (activity === "sedentary") {
            activityFactor = sedentaryFactor;
        } else if (activity === "moderate") {
            activityFactor = moderateFactor;
        } else {
            activityFactor = intenseFactor;
        }

        // Calculate necessary calories per day
        const calories = BMR * activityFactor + caloriesObjective;
        setCalories(calories.toFixed(2));
    
        // Calculate necessary proteins
        const proteins = calories * 0.25 / 4; // In grams
        setProteins(proteins.toFixed(2));
    
        // Calculate necessary fats
        const fats = (calories * 0.25) / 9; // 25% of daily calories come from fats
        setFats(fats.toFixed(2));
    
        // Calculate necessary carbohydrates
        const carbohydrates = (calories - (proteins * 4) - (fats * 9)) / 4; // Carbohydrates provide 4 calories per gram
        setCarbohydrates(carbohydrates.toFixed(2));
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
            <Footer />
        </div>
    );
}

export default CalculadoraMacros;


import Header from '../../components/Header/header';
/* import IngestaAgua from '../../components/WaterConsumption/waterConsumption';
import GraficaPulsasiones from '../../components/PulseGraph/pulseGraph';
import WeightGraph from '../../components/WeightGraph/weightGraph'; */
import ObjectiveCard from '../../components/ObjectiveCard/ObjectiveCard';
import TarjetaMacros from '../../components/MacrosCard/macrosCard';
import './inicio.css'

const indexPage = () => {
    
    return (
      <div className="index-page">
        <Header />
        <div className="cards">
          <ObjectiveCard value={(1500/2542)*100} KcalObjective={2542} food={0} exercise={0} remaining={1500} />
          <TarjetaMacros value={81} max={165} value2={50} max2={65} value3={32} max3={85}/>
        </div>

{/*         <IngestaAgua/>
        <IngestaAgua/>
        <GraficaPulsasiones/>
        <GraficaPeso/> */}
      </div>
    );
  };
  
  export default indexPage;
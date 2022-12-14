import './App.css';
import {SplitScreen} from "./SplitScreen";
import React from "react";

const LeftComponent = () => {
    return <p style={{background: 'green'}}>Left</p>
}

const RightComponent = () => {
    return <p style={{background: 'blue'}}>Right</p>
}

function App() {
  return (
    <div className="App">
      <SplitScreen leftWeight={1} rightWeight={3}>
          <LeftComponent />
          <RightComponent />
      </SplitScreen>
    </div>
  );
}

export default App;

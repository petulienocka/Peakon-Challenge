import React, { } from "react";

import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import LiveSearch from "./components/LiveSearch";

import './style/main.scss';



const App = () => {
  return (
      <div className="App">
       
        <div className="component mt-5">
          <LiveSearch />
        </div>
        
        <div className="bottom-content">
        <Jumbotron fluid className="footer text-center">
          <Container>
            <h6>© 2021 Petra Piknova</h6>
          </Container>
        </Jumbotron>
        </div>
      
      </div>
    )
}

export default App;

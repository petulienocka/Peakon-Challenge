import React, { useState, useRef, useEffect} from "react";
import userData from "../data.json"
import { BsChevronDown } from "react-icons/bs";



const managerInformations = "https://gist.githubusercontent.com/daviferreira/41238222ac31fe36348544ee1d4a9a5e/raw/5dc996407f6c9a6630bfcec56eee22d4bc54b518/employees.json";



const LiveSeearch = () => {

  
  
  // Keyboard Navigation //

  const useKeyPress = (targetKey) => {
    
    const [keyPressed, setKeyPressed] = useState(false);

    const downHandler = ({key}) => {
      if (key === targetKey) {
        setKeyPressed(true)
      }
    };

    const upHandler = ({key}) => {
      if (key == targetKey) {
        setKeyPressed(false)
      }
    };

    useEffect(() => {
      window.addEventListener("keydown", downHandler);
      window.addEventListener("keyup", upHandler);

    return () => {
        window.removeEventListener("keydown", downHandler);
        window.removeEventListener("keyup", upHandler);
      };
    });
    return keyPressed
  };


  const pressKeyDown = useKeyPress("ArrowDown");
  const pressKeyUp = useKeyPress("ArrowUp");
  const pressEnter = useKeyPress("Enter");
  const pressEscape = useKeyPress("Escape");
  
  const [cursor, setCursor] = useState(0);



  useEffect(() => {
    if (managerData.length && pressKeyDown) {
      setCursor(prevState =>
      prevState < managerData.length - 1 ? prevState + 1 : prevState
      );
    }
  },[pressKeyDown]);

  useEffect(() => {
    if (managerData.length && pressKeyUp) {
      setCursor(prevState => (prevState > 0 ? prevState - 1 : prevState));
    }
  },[pressKeyUp]);

  useEffect(() => {
    if (managerData.length && pressEnter) {
      setSearch(managerData[cursor].name);
    }
  },[cursor, pressEnter]);

  useEffect(() => {
    if (managerData.length && pressEscape) {
      hideSuggestion();
    }
  },[ pressEscape]);


  
  
  
  // Data Fetch //

  const [managerData, setManagerData] = useState([]);
  const [isVisible, setVisibility] = useState(false);

  const searchContainer = useRef(null);
  const searchResultRef = useRef(null);
    
  useEffect(() => {
    getManagerInfo();
  }, []);

  const [filteredManagerData, setFilteredManagerData] = useState([]);
  const [search, setSearch ] = useState(undefined);

    const getManagerInfo = async () => {
      try {
        const response = await fetch(managerInformations);
        const jsonData = await response.json();
        const { data, included } = jsonData;
        const combinedData = data.map(({ attributes }, i) => ({
          ...attributes,
          ...included[i].attributes 
        }));
        setManagerData(combinedData); 
        setFilteredManagerData(combinedData);
      } catch (err) {
        console.log(err)
        }
   };

  useEffect(() => {
    filterData();
  },[search]);

  const filterData = () => {
    const filtered = managerData && managerData.filter((attributes) => {
      const normalize = str => str.replaceAll(' ', '').toLowerCase();
      return normalize(attributes.name).includes(normalize(search));
    });
    setFilteredManagerData(filtered);
  };

  
  const handleChange = (e) => {
    setSearch(e.target.value)
    setVisibility(!!e.target.value)
  };




// Show-Hide Function //

  useEffect(() => {
      window.addEventListener("mousedown", handleClickOutisde);
      return () => {
      window.removeEventListener("mousedown", handleClickOutisde);
      }
  },[]);


  const handleClickOutisde = event => {
      if (searchContainer.current && !searchContainer.current.contains(event.target)) {
          hideSuggestion();
      }
  };

  const showSuggestion = () => setVisibility(true);
  const hideSuggestion = () => setVisibility(false);



    return (
      
        <div className="container justify-content-center" ref={searchContainer}>
            
            <label>Manager</label>
            <div className="input-container">
                <input type="text" name="search" autoComplete="off" onClick={showSuggestion} onChange={handleChange} 
                placeholder="Choose Manager" className="manager-input" value={search} /> 
                < BsChevronDown className="icon" />
            </div>

            <div className={`results ${ isVisible ? "visible" : "invisible "}`}>
                <ul className="list-group" ref={searchResultRef}>
                { filteredManagerData && filteredManagerData.map(( attributes, index)  =>
                <li className={`list-group-item `} key={"index" + index}>
                    <div className="row">
                        <div className="col" >
                            <div className="row">
                                <div className="col-6"><div className="container-square text-center">
                                <h5 className="mt-2">{(attributes.firstName.charAt(0))}{(attributes.lastName.charAt(0))}</h5>
                                </div>
                            </div>
                                <div className="col-6 text pt-2">
                                <h5 onClick={()=>{setSearch(attributes.name)}}>{attributes.name} </h5>
                                <p>{attributes.email} </p>  
                                </div>
                            </div>   
                        </div>   
                        <hr/>
                    </div>
                </li>
                )}                
                </ul>
            </div>
        
        </div>
  
        
    )
};
export default LiveSeearch;
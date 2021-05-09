
import {useEffect, useState} from 'react';
// import styled from "styled-components";
import './css/main.css';



// const GridContainer = styled.div`
//   display: grid;
//   grid-template-columns: repeat(32, auto);
//   grid-template-rows: repeat(32, auto);
//   grid-gap: 1px;
// `;

function App() {


  const [gridArray, setGridArray] = useState([0])
  const [selectedGrid, setSelectedGrid] = useState(null)

  useEffect(() => {
    createGridArray()
  }, [])

  

  let createGridArray = () => {
    let gridNumber = 1024
    let gridArray =  Array.from({length: gridNumber}, (v, i) => i);

    let newGrid = [];
    gridArray.forEach(number => {
      let blockDetail = {
        id : number,
        color : ""
      }
      newGrid.push(blockDetail)
    });
    setGridArray(newGrid)
    createBlocks(gridArray)
  }

  let createBlocks = async(gridArray) => {
    let container = document.querySelector(".grid-container")
    await gridArray.forEach(number => {
      let block = document.createElement("div");
      block.setAttribute("id", number)
      block.classList.add("block")
      container.appendChild(block);  
    });
  }


  let gridSelected = (e) => {
    setSelectedGrid(e.target.id)
  }





  return (
    <div className="container">
      <div>{selectedGrid}</div>
      <div className="grid-container" 
        onClick={gridSelected}
      >

      </div>
    </div>
  );

  
}

export default App;


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

  const [gridBlocks, setGridBlocks] = useState([0])
  const [selectedBlock, setSelectedBlock] = useState({})
  // const [selectedGridColor, setSelectedGridColor] = useState(null)

  useEffect(() => {
    createGridArray()
  }, [])

  

  let createGridArray = async() => {
    let gridNumber = 1024
    let gridArray =  Array.from({length: gridNumber}, (v, i) => i);

    gridArray.forEach(number => {
      let blockDetail = {
        id : number,
        color : ""
      }
      gridBlocks.push(blockDetail)
    });
    
    setGridBlocks(gridBlocks)
    createBlocks(gridArray)
    // console.log(gridBlocks)
  }

  let createBlocks = async(gridArray) => {
    let container = document.querySelector(".grid-container")
    container.innerHTML = ""
    await gridArray.forEach(number => {
      let block = document.createElement("div");
      block.setAttribute("id", number)
      block.classList.add("block")
      container.appendChild(block);  
    });
  }


  let gridSelected = (e) => {
    setSelectedBlock({})
    let selectedGrid = gridBlocks.filter(number => number.id == e.target.id);
    setSelectedBlock(selectedGrid[0])
  }





  return (
    <div className="container">
      <div>{selectedBlock.id}, {selectedBlock.color}</div>
      <div className="grid-container" 
        onClick={gridSelected}
      >

      </div>
    </div>
  );

  
}

export default App;

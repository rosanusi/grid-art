
import {useEffect, useState} from 'react';
import { HexColorPicker } from "react-colorful";
// import styled from "styled-components";
import './css/main.css';
import './css/react-colorful.css';



// const GridContainer = styled.div`
//   display: grid;
//   grid-template-columns: repeat(32, auto);
//   grid-template-rows: repeat(32, auto);
//   grid-gap: 1px;
// `;

function App() {

  const [gridBlocks, setGridBlocks] = useState([0])
  const [selectedBlock, setSelectedBlock] = useState({})
  const [color, setColor] = useState("#aabbcc");
  // const [selectedGridColor, setSelectedGridColor] = useState(null)

  useEffect(() => {
    createGridArray()
  }, [])

  

  let createGridArray = async() => {
    let gridNumber = 3136
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

    let activeBlock = e.target

    if(!activeBlock.classList.contains("block")) 
      return
      
      setSelectedBlock({})
      let selectedGrid = gridBlocks.filter(number => number.id == activeBlock.id);
      setSelectedBlock(selectedGrid[0])
      selectedBlock.color = color
      addColortoBlock(activeBlock)

      updateColorBlocks()
  }

  let addColortoBlock = (activeBlock) => {
    activeBlock.style.backgroundColor = color;
  }

  let updateColorBlocks = () => {
    
    let blockNumber = 16
    let blockArray =  Array.from({length: blockNumber}, (v, i) => i);

    let colorContainer = document.querySelector(".colorSettings")
    colorContainer.innerHTML = ""

    blockArray.forEach(number => {
      let colorBlock = document.createElement("div");
      colorBlock.setAttribute("id", number)
      colorBlock.classList.add("color-block")
      colorContainer.appendChild(colorBlock);  
    });

  }





  return (
    <div className="container">

        <div className="leftPane">
          <div className="grid-container" 
            onClick={gridSelected}
          >
          </div>
        </div>

        <div className="rightPane">
          <div className="colorPane">
            <HexColorPicker color={color} onChange={setColor} />
          </div>
          <div className="colorSettings">

          </div>
          {/* <div>{selectedBlock.id}, {selectedBlock.color}</div> */}
        </div>

    </div>
  );

  
}

export default App;

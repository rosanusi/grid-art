
import {useEffect, useState} from 'react';
import { HslColorPicker } from "react-colorful";
import styled from "styled-components";
import './css/main.css';
import './css/react-colorful.css';


function App() {

  const [gridBlocks, setGridBlocks] = useState([0])
  const [selectedBlock, setSelectedBlock] = useState({})
  const [selectedColorTweak, setSelectedColorTweak] = useState('lightness')
  const [colorRemixValue, setColorRemixValue] = useState(50)
  const [color, setColor] = useState({ h: 200, s: 39, l: 45 });


  useEffect(() => {
    setGridArray()
  },[gridBlocks])

  useEffect(() => {
    setColorRemixBlocks()
  },[color, selectedColorTweak, colorRemixValue])
  
  

  let setGridArray = async() => {
    let gridNumber = 3136
    let gridArray =  Array.from({length: gridNumber}, (v, i) => i);

    gridArray.forEach(number => {
      let block = {
        id : number,
        color : ""
      }
      gridBlocks.push(block)
    });
    
    setGridBlocks(gridBlocks)
    createGridBlocks(gridArray)
  }

  
  let createGridBlocks = async(gridArray) => {
    let container = document.querySelector(".grid-container")
    container.innerHTML = ""
    await gridArray.forEach(number => {
      let block = document.createElement("div");
      block.setAttribute("id", number)
      block.classList.add("block")
      container.appendChild(block);  
    });
  }


  let selectedGrid = (e) => {
    let activeBlock = e.target
    if(!activeBlock.classList.contains("block")) 
      return
      setSelectedBlock({}) 
      let selectedGrid = gridBlocks.filter(number => number.id === activeBlock.id);
      setSelectedBlock(selectedGrid[0])
      addColortoBlock(activeBlock)
  }

  let addColortoBlock = (activeBlock) => {
    activeBlock.style.backgroundColor = `hsl(${color.h},${color.s}%,${color.l}%)`;
  }


  let setColorRemixBlocks = () => {
    

    let number = 32
    let colorGrid =  Array.from({length: number}, (v, i) => i);
    let colorRemixGrid = document.querySelector(".colorRemixGrid")
    colorRemixGrid.innerHTML = ""

    let value = colorRemixValue
    let saturation = color.s
    let lightness = color.l
    
    colorGrid.forEach(number => {
      let colorRemixBlock = document.createElement("div");
      colorRemixBlock.setAttribute("id", number)
      colorRemixBlock.classList.add("color-block")
      colorRemixGrid.appendChild(colorRemixBlock)

      if(selectedColorTweak === 'saturation'){
        colorRemixBlock.style.backgroundColor = `hsl(${color.h}, ${value ++}%, ${lightness}%)`
      }else {
        colorRemixBlock.style.backgroundColor = `hsl(${color.h}, ${saturation}%, ${value ++}%)`
      }

    });

  



    console.log(selectedColorTweak, color )

  }

  let setTweakType = (e) => {
      let tweakType = e.target.value;
      let slider = document.getElementById("rangeSlider")     

      setSelectedColorTweak(tweakType)

      console.log(slider)

  }

  let setTweakValue = () => {
    let slider = document.getElementById("rangeSlider")
    setColorRemixValue(slider.value)
    
    console.log(colorRemixValue)
  }


  return (
    <div className="container">

        <div className="leftPane">
          <GridContainer className="grid-container" defaultBlockColors={color}
            onClick={selectedGrid}
          / >
        </div>

        <div className="rightPane">
          <div className="colorPane">
            <HslColorPicker color={color} onChange={ setColor } />
          </div>
          <div className="colorRemix">
            <div className="customSlider">
              <label className="select" htmlFor="saturation">
              <select id="slct" required="required" onChange={setTweakType}>
                <option value="saturation">Saturation</option>
                <option value="lightness">Lightness</option>
              </select>
              </label>
              <input type="range" id="rangeSlider" 
                // defaultValue={colorRemixValue} 
                className="slider" 
                onChange={ setTweakValue } 
              />
              <span className="value">{colorRemixValue}%</span>
            </div>
          </div>
          <ColorRemixBlocks className="colorRemixGrid" id="colorRemixGrid"/>
          {/* <div className="selectedColors">
            <span className=""title>Selected Colors</span>
          </div> */}

          {/* <div>{selectedBlock.id}, {JSON.stringify(selectedBlock.color)}</div> */}
        </div>

    </div>
  );

  
}

export default App;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(56, auto);
  grid-template-rows: repeat(56, auto);
  grid-gap: 1px;

  .block {
    width: 12px;
    height: 12px;
    background-color: hsl(206, 63%, 94%);
    border-radius: 2px;

    &:hover {
      background-color: hsl(
        ${props => props.defaultBlockColors.h}, 
        ${props => props.defaultBlockColors.s}%, 
        ${props => props.defaultBlockColors.l}%
      );
    }
  }

`;

const ColorRemixBlocks = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(8, auto);
  {/* grid-template-rows: repeat(5, auto); */}
  position: relative;
  grid-gap: 4px;
  margin-top: 16px;
  overflow: hidden;

  .color-block {
    background-color: #fff;
    height: 28px;
    border-radius: 4px;

  }
`;
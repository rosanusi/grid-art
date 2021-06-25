
import {useEffect, useState} from 'react';
import { HslColorPicker } from "react-colorful";
import convert from 'color-convert';
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

    let gridNumber;

    // Create a media condition that targets viewports at least 768px wide
    let mediaQuery = window.matchMedia('(max-width: 500px)')
    // Check if the media query is true
    if (mediaQuery.matches) {
      // Then trigger an alert
      gridNumber = 256;
    } else {
      gridNumber = 1024;
    }

    console.log(mediaQuery, gridNumber)

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

  }

  let setTweakType = (e) => {
      let tweakType = e.target.value;    
      setSelectedColorTweak(tweakType)
  }

  let setTweakValue = () => {
    let slider = document.getElementById("rangeSlider")
    setColorRemixValue(slider.value)
  }


  let getSelectedColorBlock = (e) => {
    
    let bgColor = e.target.style.backgroundColor
    let colorValue = bgColor.substring(4,bgColor.length-1);

    let colorArray = colorValue.split(',');
    let r = colorArray[0]
    let g = colorArray[1]
    let b = colorArray[2]
    
    let hslColorArray = convert.rgb.hsl(r, g, b);
    let h = hslColorArray[0]
    let s = hslColorArray[1]
    let l = hslColorArray[2]

    setColor({ h: h, s: s, l: l })

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
          <ColorRemixBlocks className="colorRemixGrid" id="colorRemixGrid" onClick={getSelectedColorBlock}/>
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
  grid-template-columns: repeat(32, auto);

  grid-gap: 2px;

  @media only screen and (max-width: 500px) {
     grid-template-columns: repeat(16, auto);

  }  

  .block {
    width: 24px;
    height: 24px;

    @media only screen and (max-width: 500px) {
      width: 20px;
      height: 20px;
   }
    
    background-color: hsl(98, 0%, 97%);
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
  position: relative;
  box-sizing: border-box;
  grid-gap: 4px;
  margin-top: 16px;
  overflow: hidden;

  .color-block {
    background-color: #fff;
    border: 4px solid rgba(0, 0, 0, 0);
    height: 28px;
    border-radius: 4px;
    transition: all 150ms ease;
    cursor: pointer;

    &:hover {
      border: 4px solid rgba(255, 255, 255, .8);
    }
  }
`;
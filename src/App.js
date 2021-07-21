
import {useEffect, useState} from 'react';
import { HslColorPicker } from "react-colorful";
import ReactGA from 'react-ga';
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
  const [colorSelector, setColorSelector] = useState(false)


  useEffect(() => {
    setGridArray()
  },[gridBlocks])

  useEffect(() => {
    const trackingId = "G-VH68Y528TY"; // Replace with your Google Analytics tracking ID
    ReactGA.initialize(trackingId);
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
    activeBlock.style.border = "none";
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

  // let handleColorSelector = () => {
  //   setColorSelector(prevColorSelector => !prevColorSelector)

  // }

  return (
    <>
      <div className="canvasWrap">
        <div className="canvasAndControls">
          <GridContainer className="grid-container" defaultBlockColors={color} onClick={selectedGrid}
          />
          <RightPane className="rightPane">
          {/* <span className="colorSelector-action" onClick={handleColorSelector}>Show Color selector</span> */}
          {
            // colorSelector &&
            <>
              <div className="colorPane"><HslColorPicker color={color} onChange={ setColor } /></div>
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
                  {/* <span className="value">{colorRemixValue}%</span> */}
                </div>
              </div>
            </>
          }

          <ColorRemixBlocks className="colorRemixGrid" id="colorRemixGrid" onClick={getSelectedColorBlock}/>
          {/* <div className="selectedColors">
            <span className=""title>Selected Colors</span>
          </div> */}

          {/* <div>{selectedBlock.id}, {JSON.stringify(selectedBlock.color)}</div> */}
        </RightPane>
        </div>
      </div>

    </>
  );

  
}

export default App;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(32, auto);
  align-self: center;

  @media only screen and (max-width: 500px) {
     grid-template-columns: repeat(16, auto);

  }  

  .block {
    width: 24px;
    height: 24px;
    border: 1px solid #f1f1f1;
    margin-left: -1px;
    margin-top: -1px;



    @media only screen and (max-width: 500px) {
      width: 20px;
      height: 20px;
   }
    

    &:hover {
      background-color: hsl(
        ${props => props.defaultBlockColors.h}, 
        ${props => props.defaultBlockColors.s}%, 
        ${props => props.defaultBlockColors.l}%
      );
      border: none;
    }
  }

`;

const RightPane = styled.div`

  position: relative;
  padding: 0;
  margin-left: 40px;


  @media only screen and (max-width: 500px) {
    width: 100vw;
    background-color: #fff;
    position: fixed;
    padding: 24px;
    margin-left: 0;
    left: 0;

    align-self: flex-end;
    // top: -100px;
    border-radius: 16px;
    box-shadow: 0px 6px 64px rgb(0 0 0 / 10%);

  } 

  .colorRemixGrid {

  }

`;


const ColorRemixBlocks = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(4, auto);  
  position: relative;
  box-sizing: border-box;
  overflow: hidden;

  @media only screen and (max-width: 500px) {
    grid-template-columns: repeat(16, auto);  
  }

  .color-block {
    background-color: #fff;
    height: 40px;
    transition: all 150ms ease;
    cursor: pointer;

    @media only screen and (max-width: 500px) {
      height : 24px;
    }

    &:hover {
      transform: scale(1.5);
    }
  }


`;
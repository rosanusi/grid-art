
import {useEffect, useState} from 'react';
import { HslColorPicker } from "react-colorful";
import useLongPress from "./utility/useLongPress";
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
  const [colorPalette, setColorPalette] = useState([])


  useEffect(() => {
    setGridArray()
  },[gridBlocks])


  useEffect(() => {
    const trackingId = "G-VH68Y528TY"; // Replace with your Google Analytics tracking ID
    ReactGA.initialize(trackingId);

    setColorRemixBlocks()
  },[color, selectedColorTweak, colorRemixValue, colorPalette])
  
  

  const setGridArray = async() => {

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

  
  const createGridBlocks = async(gridArray) => {
    let container = document.querySelector(".grid-container")
    container.innerHTML = ""

    await gridArray.forEach(number => {
      let block = document.createElement("div");
      block.setAttribute("id", number)
      block.classList.add("block")
      container.appendChild(block); 
    });
  }





  // Press settings. Onclick adds color to the block, long-press removes painted color

  const onClick = (e) => {

    let activeBlock = e.target
    let selectedColor = `hsl(${color.h},${color.s}%,${color.l}%)`

    if(!activeBlock.classList.contains("block")) 
      return
      setSelectedBlock({}) 
      let selectedGrid = gridBlocks.filter(number => number.id === activeBlock.id);
      setSelectedBlock(selectedGrid[0])
      activeBlock.style.backgroundColor = selectedColor;
      activeBlock.style.border = "none";

      console.log(selectedColor)
      addColortoPallete(selectedColor)
  }

  const onLongPress = (e) => {
    let activeBlock = e.target
    activeBlock.setAttribute("style", "");
  };

  const defaultOptions = {
    isPreventDefault: true,
    delay: 300
  };

  const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);


// Adding color to Palette


let addColortoPallete = (selectedColor) => {

  // Create a new array based on current state:
  let colorList = colorPalette;

  // let selectedColor = color 
  if(colorList.includes(selectedColor))
    return

  // Add item to it
  colorList.push(selectedColor);

  // Set state
  setColorPalette([...colorList])

}



  const setColorRemixBlocks = () => {
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

  const setTweakType = (e) => {
      console.log(e.target)
      
      let container = document.querySelector('.label-block');
      let activeSelection = container.querySelector('.active');

      activeSelection.classList.remove('active')

      e.target.classList.add('active');
      let tweakType = e.target.innerHTML;   
      setSelectedColorTweak(tweakType)
  }


  const setTweakValue = () => {
    let slider = document.getElementById("rangeSlider")
    setColorRemixValue(slider.value)
  }


  const getSelectedColorBlock = (e) => {
    
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


  const ColorPaletteList = () => {
    return (
      <>
        {colorPalette.map((color, index) => (
          <div 
            key={index}
            className="palette-block"
            style={{backgroundColor: color}}
          >
          </div>
        ))}
      </>
    );
  };





  // let handleColorSelector = () => {
  //   setColorSelector(prevColorSelector => !prevColorSelector)

  // }

  return (
    <>
      <div className="canvasWrap">
        <div className="canvasAndControls">
          <div className="mainPane">
            <GridContainer className="grid-container" BlockColors={color} {...longPressEvent} />
            <ColorPalette>
              <ColorPaletteList />
            </ColorPalette>
          </div>
          <RightPane className="rightPane">
          {/* <span className="colorSelector-action" onClick={handleColorSelector}>Show Color selector</span> */}
          {
            // colorSelector &&
            <>
              <div className="colorPane"><HslColorPicker color={color} onChange={ setColor } /></div>


              <ColorRemix className="colorRemix" BlockColors={color}>
                <div className="label-block">
                  <span className="label active" onClick={setTweakType}>Saturation</span>
                  <span className="label" onClick={setTweakType}>Lightness</span>
                </div>
                <div className="customSlider">
                  <input type="range" id="rangeSlider" 
                    // defaultValue={colorRemixValue} 
                    className="slider" 
                    onChange={ setTweakValue } 
                  />
                  {/* <span className="value">{colorRemixValue}%</span> */}
                </div>
              </ColorRemix>
            </>
          }
          <ColorRemixBlocks className="colorRemixGrid" id="colorRemixGrid" onClick={getSelectedColorBlock}/>
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
  width: 100%;
  position: relative;

  @media only screen and (max-width: 500px) {
     grid-template-columns: repeat(16, auto);

  }  

  .block {
    position: relative;
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
        ${props => props.BlockColors.h}, 
        ${props => props.BlockColors.s}%, 
        ${props => props.BlockColors.l}%
      );
      border: none;
    }

    &:empty-block {

      &:hover {
        background-color: none;
      }
    }
  }

`;


const ColorPalette = styled.div`

display: flex;
flexx-flow: row wrap;
justify-content: center;
max-width: 736px;
margin-top: 24px;

  .palette-block {
    width: 50px;
    height: 50px;
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


const ColorRemix = styled.div`

  display: flex;
  flex-flow: column nowrap;
  background-color: #f3f3f3;
  padding: 8px;
  border-radius: 8px 8px 0 0;

  .label-block {
    font-size: 12px;
    margin-bottom: 8px;

    .label {
      display: inline-block;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: rgba(0, 0, 0, .3);
      font-weight: 600;
      padding: 8px;
      border-radius: 16px;
      font-size: 10px;
      line-height: 1;
      margin-right: 4px;
      cursor: pointer;
      transition: all 250ms ease;


      &:hover {
        background-color: rgba(255, 255, 255, .6);
        color: rgba(0, 0, 0, .5);
      }


      &.active {
          background-color: rgba(0, 0, 0, .09);
          color: rgba(0, 0, 0, .5);
      }
    }
  }

`;
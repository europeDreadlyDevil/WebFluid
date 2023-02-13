import React from 'react';
import '../styles/properties.css'

const Properties2 = (props) => {

    const selectedElement = props.selectedElement
    return (
        <div id={'properties'}>
            <section id={'alignment-settings'}>
                <h4>Alignment</h4>
                <button onClick={() => {
                    selectedElement.style.marginRight = 0
                    selectedElement.style.marginLeft = 0
                }}>Left</button>
                <button onClick={() => {
                    selectedElement.style.marginLeft = 'auto'
                    selectedElement.style.marginRight = 'auto'
                }}>Center</button>
                <button onClick={() => {
                    selectedElement.style.marginRight = 0
                    selectedElement.style.marginLeft = 'auto'
                }}>Right</button>
            </section>
            <section id={'design-setting'}>
                <section id={'text-design-settings'}>
                    <h4>Text</h4>
                    <label>
                        Font size:
                        <input id={'font-size-input'} placeholder={selectedElement.style.fontSize} onChange={ () =>{
                            const input = document.getElementById('font-size-input')
                            if (Number(input.value) == input.value) {
                                selectedElement.style.fontSize = input.value + 'px'
                            }
                        }}/>
                    </label>
                    <label>
                        Color:
                        <input id={'font-color-input'} type={'color'} onChange={ () =>{
                            const input = document.getElementById('font-color-input')
                            selectedElement.style.color = input.value
                        }}/>
                    </label>
                    <label>
                        Background color:
                        <input id={'font-bgcolor-input'} placeholder={selectedElement.style.backgroundColor} type={'color'} onChange={ () =>{
                            const input = document.getElementById('font-bgcolor-input')
                            selectedElement.style.backgroundColor = input.value
                        }}/>
                    </label>
                    <label>
                        line height:
                        <input id={'font-line-height-input'} placeholder={selectedElement.style.lineHeight} onChange={ () =>{
                            const input = document.getElementById('font-line-height-input')
                            if (Number(input.value) == input.value) {
                                selectedElement.style.lineHeight = input.value + 'px'
                            }
                        }}/>
                    </label>
                    <label>
                        line height:
                        <input id={'font-letter-spacing-input'} placeholder={selectedElement.style.lineHeight} onChange={ () =>{
                            const input = document.getElementById('font-letter-spacing-input')
                            if (Number(input.value) == input.value) {
                                selectedElement.style.letterSpacing = input.value + 'px'
                            }
                        }}/>
                    </label>
                </section>
            </section>
        </div>
    );
};

export default Properties2;
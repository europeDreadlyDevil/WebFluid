import React from 'react';
import '../styles/properties.css'

export function setProperties(node) {
    const WIDTH_PROPERTIES = document.getElementById('width-style-input')
    const HEIGHT_PROPERTIES = document.getElementById('height-style-input')
    const FONT_FAMILY_PROPERTIES = document.getElementById('font-family-style-input')
    const FONT_SIZE_PROPERTIES = document.getElementById('font-size-style-input')
    const LETTER_SPACING_PROPERTIES = document.getElementById('letter-spacing-style-input')
    const TEXT_COLOR = document.getElementById('text-color-style-input')
    WIDTH_PROPERTIES.value = node.style.width
    HEIGHT_PROPERTIES.value = node.style.height
    FONT_FAMILY_PROPERTIES.value = node.style.fontFamily
    FONT_SIZE_PROPERTIES.value = node.style.fontSize
    LETTER_SPACING_PROPERTIES.value = node.style.letterSpacing
    TEXT_COLOR.value = node.style.color
}

const PropertiesManager = () => {

    return (
        <div id={'project-element-properties'}>
            <section id={'element-size'}>
                <h2>Size</h2>
                <section>
                    <h3>Width:</h3>
                    <input id={'width-style-input'} placeholder={''} onChange={()=>{
                        g_projectInfo.selectedElement.style.width = document.getElementById('width-style-input').value
                    }}/>
                </section>
                <section>
                    <h3>Height:</h3>
                    <input id={'height-style-input'} placeholder={''} onChange={()=>{
                        g_projectInfo.selectedElement.style.height = document.getElementById('height-style-input').value
                    }}/>
                </section>
            </section>
            <section id={'element-text-settings'}>
                <h2>Text settings</h2>
                <section>
                    <h3>Font:</h3>
                    <input id={'font-family-style-input'} placeholder={''} onChange={()=>{
                        g_projectInfo.selectedElement.style.fontFamily = document.getElementById('font-family-style-input').value
                    }}/>
                </section>
                <section>
                    <h3>Font size:</h3>
                    <input id={'font-size-style-input'} placeholder={''} onChange={()=>{
                        g_projectInfo.selectedElement.style.fontSize = document.getElementById('font-size-style-input').value
                    }}/>
                </section>
                <section>
                    <h3>Letter spacing:</h3>
                    <input id={'letter-spacing-style-input'} placeholder={''} onChange={()=>{
                        g_projectInfo.selectedElement.style.letterSpacing = document.getElementById('letter-spacing-style-input').value
                    }}/>
                </section>
                <section>
                    <h3>Text color:</h3>
                    <input id={'text-color-style-input'} type={'color'} placeholder={''} onChange={()=>{
                        g_projectInfo.selectedElement.style.color = document.getElementById('text-color-style-input').value
                    }}/>
                </section>
            </section>
        </div>
    );
};

export default PropertiesManager;
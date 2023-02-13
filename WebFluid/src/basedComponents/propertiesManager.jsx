import React, {useEffect, useState} from 'react';
import '../styles/properties.css'

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
                <section >
                    <h3>Font:</h3>
                    <input id={'font-family-style-input'} placeholder={''} onChange={()=>{
                        g_projectInfo.selectedElement.style.fontFamily = document.getElementById('font-family-style-input').value
                    }}/>
                </section>
                <section >
                    <h3>Font size:</h3>
                    <input id={'font-size-style-input'} placeholder={''} onChange={()=>{
                        g_projectInfo.selectedElement.style.height = document.getElementById('height-style-input').value
                    }}/>
                </section>
            </section>
        </div>
    );
};

export default PropertiesManager;
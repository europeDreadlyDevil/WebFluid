import React, {useEffect, useState} from 'react';
import ToolBar from "./tool_bar.jsx";
import '../styles/work-space.css'
import LayerManager from "./layerManager.jsx";
import PropertiesManager from "./propertiesManager.jsx";

const WorkSpace = (props) => {

    useEffect(() => {
        const OVER_VIEW = document.getElementById(props.projectName)
        OVER_VIEW.onclick = (ev) => {
            g_projectInfo.selectedElement = ev.target
            ev.stopPropagation()
        }

        const PROJECT_LAYERS = document.getElementById('user-project-layers')

        function selectLayer (elementInArr, target) {
            if (elementInArr.linkToLayer.layerNode === target.parentNode) {
                g_projectInfo.selectedElement = elementInArr.linkToLayer.linkToNode
                const WIDTH_PROPERTIES = document.getElementById('width-style-input')
                const HEIGHT_PROPERTIES = document.getElementById('height-style-input')
                const FONT_FAMILY_PROPERTIES = document.getElementById('font-family-style-input')
                WIDTH_PROPERTIES.value = g_projectInfo.selectedElement.style.width
                HEIGHT_PROPERTIES.value = g_projectInfo.selectedElement.style.height
                FONT_FAMILY_PROPERTIES.value = g_projectInfo.selectedElement.style.fontFamily
            }
        }

        PROJECT_LAYERS.onclick = (ev) => {
            switch (ev.target.parentNode.dataset.elementType) {
                case 'component' :
                    for (const component of g_projectInfo.componentsArrNew) {
                        selectLayer(component, ev.target)
                    }
                    ev.stopPropagation()
                    break;
                case 'module' :
                    for (const module of g_projectInfo.moduleArr) {
                        selectLayer(module, ev.target)
                    }

                    ev.stopPropagation()
                    break;
            }

        }
    })

    return (
        <div id={'user-project-work-space'}>
            <section id={'user-project-overview-container'}>
                <section id={'user-project-tool-bar'}>
                    <ToolBar projectName = {props.projectName}/>
                </section>
                <section id={'user-project-layers'}>
                    <LayerManager projectName = {props.projectName}/>
                </section>
                <section id={'user-project-overview'}>
                    <div id={props.projectName}>

                    </div>
                </section>
                <section id={'user-project-element-properties'}>
                    <PropertiesManager elementProperties={g_projectInfo.elementProperties}/>
                </section>
            </section>
        </div>
    );
};

export default WorkSpace;
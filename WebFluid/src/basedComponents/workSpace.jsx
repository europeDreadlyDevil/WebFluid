import React, {useEffect, useState} from 'react';
import ToolBar from "./toolbar.jsx";
import '../styles/work-space.css'
import LayerManager from "./layerManager.jsx";
import PropertiesManager, {setProperties} from "./propertiesManager.jsx";

const WorkSpace = (props) => {

    function selectLayer (elementInArr, target) {
        if (elementInArr.linkToLayer.layerNode === target.parentNode) {
            g_projectInfo.selectedElement = elementInArr.linkToLayer.linkToNode
            setProperties(g_projectInfo.selectedElement)
        }
    }

    useEffect(() => {
        const OVER_VIEW = document.getElementById(props.projectName)
        OVER_VIEW.onclick = (ev) => {
            g_projectInfo.selectedElement = ev.target
            setProperties(g_projectInfo.selectedElement)
            ev.stopPropagation()
        }

        const PROJECT_LAYERS = document.getElementById('user-project-layers')

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
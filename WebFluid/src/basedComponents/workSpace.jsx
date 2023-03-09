import React, {useEffect, useState} from 'react';
import ToolBar, {syncComponents} from "./toolbar.jsx";
import '../styles/work-space.css'
import LayerManager from "./layerManager.jsx";
import PropertiesManager, {setProperties} from "./propertiesManager.jsx";

const WorkSpace = (props) => {

    function setStyle(elm, newElm) {
        newElm.style.width = elm.elementStyle.width
        newElm.style.height = elm.elementStyle.height
        newElm.style.fontFamily = elm.elementStyle.fontFamily
        newElm.style.fontSize = elm.elementStyle.fontSize
        newElm.style.letterSpacing = elm.elementStyle.letterSpacing
        newElm.style.color = elm.elementStyle.color
        return newElm
    }

    function deparseElm (elm) {
        if (elm.elementType === 'component') {
            let div = document.createElement('div')
            div.dataset.elementType = elm.elementType
            div.setAttribute('name', elm.componentName)
            div = setStyle(elm, div)
            if(elm.elementsInside.length !== 0) {
                for (const elmInside of elm.elementsInside) {
                    let newElm = deparseElm(elmInside)
                    div.append(newElm)
                }
            }
            return div
        } else if (elm.elementType === 'module') {
            let module = document.createElement(elm.moduleNode)
            module.dataset.elementType = elm.elementType
            module.dataset.moduleType = elm.moduleType
            module = setStyle(elm, module)
            if (module.dataset.moduleType === 'textModule') {
                module.dataset.textInner = elm.textContent
                module.innerHTML = elm.textContent
                return module
            } else {
                module.dataset.textInner = elm.moduleType
                if(elm.elementsInside.length !== 0) {
                    for (const elmInside of elm.elementsInside) {
                        let newElm = deparseElm(elmInside)
                        module.append(newElm)
                    }
                }
                return module
            }

        }
    }

    function deparseProject(projectObj, container) {
        for (const elm of projectObj.components) {
            let newElm = deparseElm(elm)
            container.append(newElm)
        }
    }

    function selectLayer (elementInArr, target) {
        if (elementInArr.linkToLayer.layerNode === target.parentNode) {
            g_projectInfo.selectedElement = elementInArr.linkToLayer.linkToNode
            setProperties(g_projectInfo.selectedElement)
        }
    }

    useEffect(() => {
        const OVER_VIEW = document.getElementById(props.projectName)
        if (props.infoObj !== undefined) {
            deparseProject(props.infoObj, OVER_VIEW)
            syncComponents(OVER_VIEW)
            console.log()
        }
        OVER_VIEW.onclick = (ev) => {
            g_projectInfo.selectedElement = ev.target
            setProperties(g_projectInfo.selectedElement)
            ev.stopPropagation()
        }

        const PROJECT_LAYERS = document.getElementById('user-project-layers')

        PROJECT_LAYERS.onclick = (ev) => {
            switch (ev.target.parentNode.dataset.elementType) {
                case 'component' :
                    for (const component of g_projectInfo.componentsArr) {
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
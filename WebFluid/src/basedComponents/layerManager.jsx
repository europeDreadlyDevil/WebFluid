import React, {useEffect} from 'react';
import '../styles/layers-style.css'
import {syncComponents, updateText} from "./toolbar.jsx";

export class Layer {
    constructor(linkToNode) {
        this.layerNode = document.createElement('ul')
        this.linkToNode = linkToNode
        this.layerNode.dataset.moduleType = linkToNode.dataset.moduleType
        this.layerNode.dataset.moduleName = linkToNode.nodeName
        this.layerNode.dataset.elementType = linkToNode.dataset.elementType
    }
    createLayer(layerName, projectName) {
        const NODE_CONTAINER = document.getElementById(projectName)
        const LAYER_CONTAINER = document.getElementById('project-layers')
        const PARENT_NODE = this.linkToNode.parentNode

        let listElm = document.createElement('li')
        listElm.innerText = layerName
        this.layerNode.append(listElm)

        function appendLayer(element, elementForAppend) {
            const LAYER = element.linkToLayer
            if (LAYER.linkToNode === PARENT_NODE) {
                LAYER.layerNode.append(elementForAppend)
            }
        }
        if (g_projectInfo.baseSettings.textModules.includes(this.linkToNode.nodeName)) {
            let textEditButton = document.createElement('button')
            textEditButton.textContent = 'T'
            textEditButton.onclick = () => {
                updateText(this.linkToNode)
                syncComponents(this.linkToNode.parentNode)
            }
            this.layerNode.append(textEditButton)
        }

        if (PARENT_NODE === NODE_CONTAINER) {
            LAYER_CONTAINER.append(this.layerNode)
        }else {
            switch (PARENT_NODE.hasAttribute('name')) {
                case true:
                    for (let component of g_projectInfo.componentsArr){
                        appendLayer(component, this.layerNode)
                    }
                    break;
                case false:
                    for (let module of g_projectInfo.moduleArr){
                        appendLayer(module, this.layerNode)
                    }
                    break;
            }
        }
    }
}

const LayerManager = () => {

    return (
        <div>
            <ul id={'project-layers'}>

            </ul>
        </div>
    );
};

export default LayerManager;
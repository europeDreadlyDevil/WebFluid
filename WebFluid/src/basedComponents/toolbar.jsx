import React from 'react';
import '../styles/tools.css'
import {Layer} from './layerManager.jsx'

class Component {
    constructor(name) {
        this.elementType = 'component'
        this.name = name
        this.componentNode = document.createElement('div')
        this.elementsInside = []
        this.linkToLayer = new Layer(this.componentNode)
        this.componentNode.dataset.elementType = 'component'
    }
    createComponent(componentContainer, componentName) {
        if (componentContainer !== '') {
            let isClone = false
            for (const currentComponent of g_projectInfo.componentsArr) {
                if (currentComponent.name === componentName) {
                    isClone = true
                    break
                }
            }
            if (!isClone) {
                //create component
                let newComponent = this.componentNode
                newComponent.setAttribute('name', componentName)
                //append to container
                componentContainer.append(newComponent)
                addDefaultProperties(this.componentNode)
                syncComponents(componentContainer)
                if (componentContainer !== document.getElementById(g_projectInfo.projectName)) {
                    for (const component of g_projectInfo.componentsArr) {
                        if (component.componentNode === componentContainer) {
                            component.componentsInside = Array.from(component.componentsInside)
                            component.componentsInside.push(newComponent)
                        }
                    }
                }
            } else {
                window.alert('This name already used.')
            }
        }else {
            window.alert('Select component for put in')
        }
    }
    deleteComponent(component) {
        const COMPONENT_CONTAINER = component.parentNode
        component.parentNode.removeChild(component)
        syncComponents(COMPONENT_CONTAINER)
        g_projectInfo.selectedElement = ''
    }
    copyComponent(componentContainer, currentComponent) {
        if (componentContainer !== '') {
            let copyComponent = currentComponent.cloneNode(true)
            this.componentNode = copyComponent
            componentContainer.append(copyComponent)
            syncComponents(componentContainer)
        }else {
            window.alert('Select component for copy')
        }
    }
}

class Module {
    constructor(moduleType) {
        this.elementType = 'module'
        this.moduleNode = document.createElement(moduleType)
        this.moduleNode.dataset.moduleName = moduleType.toUpperCase()
        if (g_projectInfo.baseSettings.textModules.includes(moduleType.toUpperCase())) {
            this.moduleNode.dataset.moduleType = 'textModule'
        }else {
            this.moduleNode.dataset.moduleType = 'moduleContainer'
        }
        this.linkToLayer = new Layer(this.moduleNode)
        this.moduleNode.dataset.elementType = 'module'
    }
    createModule(container) {
        if (container.dataset.moduleType !== 'textModule') {
            let newModule = this.moduleNode
            newModule.textContent = 'hi from ' + newModule.nodeName + ' module'
            newModule.dataset.textInner = newModule.textContent
            container.append(newModule)
            addDefaultProperties(this.moduleNode)
            syncComponents(container)
        }else {
            alert('Error: To lay out a text module, you need to select a container module or component')
        }
    }
    deleteModule(module) {
        const MODULE_CONTAINER = module.parentNode
        module.parentNode.removeChild(module)
        syncComponents(MODULE_CONTAINER)
        g_projectInfo.selectedElement = ''
    }
    copyModule(container, currentModule) {
        let copyModule = currentModule.cloneNode(true)
        this.moduleNode = copyModule
        container.append(copyModule)
        syncComponents(container)
    }
}

function addDefaultProperties(node) {
    node.style.width = 'auto'
    node.style.height = 'auto'
    node.style.fontFamily = "'Arial', sans-serif"
    switch (node.nodeName) {
        case 'H1':
            node.style.fontSize = '32px';
            break;
        case 'H2':
            node.style.fontSize = '24px';
            break;
        case 'H3':
            node.style.fontSize = '18px';
            break;
        case 'H5':
            node.style.fontSize = '12px';
            break;
        case 'H6':
            node.style.fontSize = '10px';
            break;
        default:
            node.style.fontSize = '16px';
            break;
    }
    node.style.letterSpacing = '0px'
    node.style.color = '#000'
}

export function updateText(module) {
    const newText = prompt('Enter new text:')
    module.innerHTML = newText
    module.dataset.textInner = newText
}

export function syncComponents(componentContainer) {

    if (componentContainer.hasAttribute('name')) {
        let componentName = componentContainer.getAttribute('name')
        let allSameComponents = document.getElementsByName(componentName)
        for (let oldComponent of allSameComponents) {
            oldComponent.replaceWith(componentContainer.cloneNode(true))
        }
    }

    let container = document.getElementById(g_projectInfo.projectName).querySelectorAll('*')
    g_projectInfo.componentsArr = []
    g_projectInfo.moduleArr = []
    let projectLayers = document.getElementById('project-layers')
    projectLayers.replaceWith(projectLayers.cloneNode(false))
    for (let element of container) {
        if (element.hasAttribute('name')) {
            let componentName = element.getAttribute('name')
            let newComponent = new Component(componentName)
            newComponent.linkToLayer = new Layer(element)
            newComponent.linkToLayer.createLayer(componentName, g_projectInfo.projectName)
            newComponent.componentNode = element
            newComponent.elementsInside = element.querySelectorAll('*')
            g_projectInfo.componentsArr.push(newComponent)
        }else {
            if (element.nodeName !== 'BR') {
                let newModule = new Module(element.nodeName)
                newModule.linkToLayer = new Layer(element)
                newModule.linkToLayer.createLayer(element.dataset.textInner, g_projectInfo.projectName)
                newModule.moduleNode = element
                g_projectInfo.moduleArr.push(newModule)
            }
        }
    }
}

function elementFlow(action, currentElement, elementContainer) {
    let elementIndex = 0
    let moved = false
    for (elementIndex; elementIndex < elementContainer.length; elementIndex++) {
        if (elementContainer[elementIndex] === currentElement) {
            if (action === 'moveUp') {
                if (elementIndex === 0) {
                    syncComponents(currentElement.parentNode)
                    break
                }
                else {
                    elementContainer[elementIndex-1].before(elementContainer[elementIndex])
                    syncComponents(currentElement.parentNode)
                    break
                }
            } else if (action === 'moveDown') {
                if (elementContainer[elementIndex+1]=== undefined) {
                    syncComponents(currentElement.parentNode)
                    break
                }
                else {
                    elementContainer[elementIndex+1].after(elementContainer[elementIndex])
                    syncComponents(currentElement.parentNode)
                    break
                }
            }
            if (elementContainer[elementIndex].getAttribute('name') !== elementContainer[elementIndex-1].getAttribute('name')) {
                if (action === 'putInUp') {
                    if (elementIndex === 0) {
                        syncComponents(currentElement.parentNode)
                        break
                    }
                    else {
                        elementContainer[elementIndex-1].append(elementContainer[elementIndex])
                        syncComponents(currentElement.parentNode)
                        break
                    }
                } else if (action === 'putInDown') {
                    if (elementContainer[elementIndex+1]=== undefined) {
                        syncComponents(currentElement.parentNode)
                        break
                    }
                    else {
                        elementContainer[elementIndex+1].append(elementContainer[elementIndex])
                        syncComponents(currentElement.parentNode)
                        break
                    }
                }
            } else {
                alert("You can't put a component in the same component")
            }
        }
    }
}

const ToolBar = (props) => {

    return (
        <div id={'tool-bar'}>
            <section id='component-manager-tools'>
                <section id={'component-create-tool'}>
                    <input id='component-name-input' placeholder={'Component name'}/>
                    <button className={'tool-button'} onClick={() => {
                        const input = document.getElementById('component-name-input')
                        const component = new Component(input.value)
                        component.createComponent(document.getElementById(props.projectName), component.name)
                    }}>
                        <div className={'tool-button-convex'}><div className={'tool-button-icon'}><img  src="../../src/svg/Plus.svg" alt=""/></div></div>
                        <span className={'list-item-name'}>Add</span>
                    </button>
                    <button className={'tool-button'} onClick={() => {
                        const input = document.getElementById('component-name-input')
                        const component = new Component(input.value)
                        component.createComponent(g_projectInfo.selectedElement, component.name)
                    }}>
                        <div className={'tool-button-convex'}><div className={'tool-button-icon'}><img  src="../../src/svg/PutIn.svg" alt=""/></div></div>
                        <span className={'list-item-name'}>Put in</span>
                    </button>
                </section>
                <section id={'component-delete-tool'}>
                    <button className={'tool-button'} onClick={() => {
                        new Component().deleteComponent(g_projectInfo.selectedElement)
                    }}><div className={'tool-button-convex'}><div className={'tool-button-icon'}><img  src="../../src/svg/Trash.svg" alt=""/></div></div>
                        <span className={'list-item-name'}>Delete</span></button>
                </section>
                <section id={'component-copy-tool'}>
                    <button className={'tool-button'} onClick={() => {
                        if (g_projectInfo.selectedElement !== '') {
                            if (g_projectInfo.selectedElement.hasAttribute('name')) {
                                let component = new Component(g_projectInfo.selectedElement.getAttribute('name'))
                                component.copyComponent(g_projectInfo.selectedElement.parentNode, g_projectInfo.selectedElement)
                            }else {
                                alert('COPY ERROR: Maybe you select module. Please select component for copy.')
                            }

                        }else {
                            alert('COPY ERROR: Please select component for copy.')
                        }
                    }}><div className={'tool-button-convex'}><div className={'tool-button-icon'}><img  src="../../src/svg/Copy.svg" alt=""/></div></div>
                        <span className={'list-item-name'}>Copy</span></button>
                </section>
            </section>
            <section id={'module-tool-manager'}>
                <section id={'module-type'}>
                    <select name='modules' id={'module-type-selector'}>
                        <option value='h1'>h1</option>
                        <option value='h2'>h2</option>
                        <option value='h3'>h3</option>
                        <option value='h4'>h4</option>
                        <option value='h5'>h5</option>
                        <option value='h6'>h6</option>
                        <option value='p'>p</option>
                        <option value='div'>div</option>
                        <option value='ul'>ul</option>
                    </select>
                </section>
                <section id={'module-create-tool'}>
                    <button className={'tool-button'} onClick={() => {
                        const selector = document.getElementById('module-type-selector')
                        let module = new Module(selector.value)
                        module.createModule(g_projectInfo.selectedElement)
                    }}>
                        <div className={'tool-button-convex'}><div className={'tool-button-icon'}><img  src="../../src/svg/Plus.svg" alt=""/></div></div>
                        <span className={'list-item-name'}>Add Module</span>
                    </button>
                    <button className={'tool-button'} onClick={() => {
                        new Module().deleteModule(g_projectInfo.selectedElement)
                    }}>
                        <div className={'tool-button-convex'}><div className={'tool-button-icon'}><img  src="../../src/svg/Trash.svg" alt=""/></div></div>
                        <span className={'list-item-name'}>Delete Module</span>
                    </button>
                    <button className={'tool-button'} onClick={() => {
                        const selectedModule = g_projectInfo.selectedElement
                        if (selectedModule !== '') {
                            if (selectedModule.hasAttribute('name') === false) {
                                let module = new Module(selectedModule.nodeName)
                                module.copyModule(selectedModule.parentNode, selectedModule)
                            }else {
                                window.alert('COPY MODULE ERROR: Select module for copy')
                            }
                        }else {
                            window.alert('COPY MODULE ERROR: Select module for copy')
                        }
                    }}><div className={'tool-button-convex'}><div className={'tool-button-icon'}><img  src="../../src/svg/Copy.svg" alt=""/></div></div>
                        <span className={'list-item-name'}>Copy</span></button>
                </section>
            </section>
            <section id={'element-move-tool'}>
                <button className={'tool-button'} onClick={() => {
                    elementFlow('moveUp', g_projectInfo.selectedElement, g_projectInfo.selectedElement.parentNode.children)
                }}><div className={'tool-button-convex'}><div className={'tool-button-icon'}><img  src="../../src/svg/Chevron Up.svg" alt=""/></div></div>
                    <span className={'list-item-name'}>Move up</span></button>
                <button className={'tool-button'} onClick={() => {
                    elementFlow('moveDown', g_projectInfo.selectedElement, g_projectInfo.selectedElement.parentNode.children)
                }}><div className={'tool-button-convex'}><div className={'tool-button-icon'}><img  src="../../src/svg/Chevron Down.svg" alt=""/></div></div>
                    <span className={'list-item-name'}>Move Down</span></button>
                <button className={'tool-button'} onClick={() => {
                    elementFlow('putInUp', g_projectInfo.selectedElement, g_projectInfo.selectedElement.parentNode.children)
                }}><div className={'tool-button-convex'}><div className={'tool-button-icon'}><img  src="../../src/svg/Double Chevron Up.svg" alt=""/></div></div>
                    <span className={'list-item-name'}>Put In Up</span></button>
                <button className={'tool-button'} onClick={() => {
                    elementFlow('putInDown', g_projectInfo.selectedElement, g_projectInfo.selectedElement.parentNode.children)
                }}><div className={'tool-button-convex'}><div className={'tool-button-icon'}><img  src="../../src/svg/Double Chevron Down.svg" alt=""/></div></div>
                    <span className={'list-item-name'}>Put In Down</span></button>
            </section>
        </div>
    );
};

export default ToolBar;
import React from 'react';
import "../styles/tools.css"
import {invoke} from "@tauri-apps/api/tauri";
import Properties2 from "./properties2.jsx";
import ReactDOM from "react-dom/client";

let selectedComponent
let selectedModule
let selectedNestModule

const WorkSpace = (props) => {

    function manageComponent(name, action) {
        if (action === 'create') {
            let div = document.createElement('div')
            div.classList.add(name)
            div.style.display = 'flex'
            const container = document.getElementById(props.name)
            for (const containerElement of container.children) {
                if (containerElement.classList.value.split(' ')[0] === name) {
                    return containerElement
                }
            }
            return div
        }
        else if (action === 'delete') {
            selectedComponent.parentNode.removeChild(selectedComponent)
            update()
        }
    }

    function manageModule(type, action) {
        let module = document.createElement(type)
        module.textContent = type + ' module'
        module.style.lineHeight = 'normal'
        module.style.letterSpacing = 'normal'
        if (type === 'h1') {
            module.style.fontSize = '32px'
        }
        else if (type === 'h2') {
            module.style.fontSize = '24px'
        }
        else if (type === 'h3') {
            module.style.fontSize = '19px'
        }
        else if (type === 'h4') {
            module.style.fontSize = '16px'
        }
        else if (type === 'h5') {
            module.style.fontSize = '13px'
        }
        else if (type === 'h6') {
            module.style.fontSize = '11px'
        } else {
            module.style.fontSize = '16px'
        }
        if (action === 'add') {
            selectedComponent.append(module)
            addListeners(module)
            update()
        }
        else if (action === 'delete') {
            selectedModule.parentNode.removeChild(selectedModule)
            addListeners(module)
            update()
        }
        else if (action === 'nest') {
            selectedModule.append(module)
            addListeners(module)
            update()
        }
    }

    function nestChecker() {
        let nestModuleList = document.getElementById('nest-module-selector')
        console.log(selectedModule.nodeName)
        if (selectedModule.nodeName === ('UL' || 'OL')) {
            for (const nestModuleListElement of nestModuleList.children) {
                if (nestModuleListElement.value !== 'li') {
                    nestModuleListElement.setAttribute('hidden', '')
                }else {
                    nestModuleListElement.removeAttribute('hidden')
                }
            }
        } else {
            for (const nestModuleListElement of nestModuleList.children) {
                if (nestModuleListElement.value === 'li') {
                    nestModuleListElement.setAttribute('hidden', '')
                }else {
                    nestModuleListElement.removeAttribute('hidden')
                }
            }
        }
    }

    function mover(vector, container) {
        let component
        let j
        let i
        let moved = false
        for (j = 0; j < container.length; j++) {
            if (container[j] === selectedComponent) {
                if (vector === 'upComponent') {
                    if (j === 0) {
                        moved = true
                        break
                    }
                    else {

                        container[j-1].before(container[j])
                        moved = true
                        break
                    }
                } else if (vector === 'downComponent') {
                    if (container[j+1]=== undefined) {
                        moved = true
                        break
                    }
                    else {
                        container[j+1].after(container[j])
                        moved = true
                        break
                    }
                }
            }
            component = container[j].children
            for (i = 0; i < component.length; i++) {
                if (component[i] === selectedModule) {
                    if (vector === 'up') {
                        if (i === 0) {
                            moved = true
                            break
                        }
                        else {
                            component[i-1].before(component[i])
                            moved = true
                            break
                        }
                    } else if (vector === 'down') {
                        if (component[i+1] === undefined) {
                            moved = true
                            break
                        }
                        else {
                            component[i+1].after(component[i])
                            moved = true
                            break
                        }
                    }
                }
            }
            if (moved === true) {
                break
            }
        }
        update()
    }

    function addListeners(module) {
        // let deepCount = 0
        // let basedComponents = container.children
        //     for (let i = 0; i < basedComponents.length; i++) {
        //         let newContainer = basedComponents[deepCount].children
        //         let deepCount1 = newContainer.length
        //         while (deepCount1 > 0) {
        //
        //         }
        //     }
                    module.onclick = () => {
                        selectedModule = module
                        nestChecker()
                        renderProperties(selectedModule)
                    }
                    module.ondblclick = () => {
                        let textarea = document.createElement('textarea');
                        let backUpTextContent = module.textContent
                        module.textContent = ''
                        textarea.textContent = backUpTextContent
                        module.append(textarea)
                        module.onkeydown = (event) => {
                            if (event.key === 'Enter') {
                                backUpTextContent = textarea.value
                                module.textContent = backUpTextContent
                                let content = module.textContent.split(' ')
                                let newContent = ''
                                let postContent = ''
                                for (let i = 0; i < content.length; i++) {
                                    if (content[i] === '<br>') {
                                        let j
                                        for (j = i + 1; j < content.length; j++) {
                                            postContent = postContent + content[j]
                                        }
                                        content[i] = document.createElement('br')
                                        module.textContent = newContent
                                        module.append(content[i])
                                        i = i + j
                                    }
                                    if (i < content.length) {
                                        newContent = newContent + content[i]
                                    }
                                    module.append(postContent)
                                    syncComponents(document.getElementById(props.name), selectedComponent)
                                    updateLayers(document.getElementById(props.name))
                                }
                            }
                        }
                    }
    }

    function saveContent(container) {
        let components = []
        for (const component of container.children) {
            components.push(component.outerHTML)
        }
        invoke('file_manager', {componentsContent: components})
    }

    async function syncComponents(container, changedComponent) {
        let newContent = changedComponent.cloneNode(true)
        let name = changedComponent.classList.value.split(' ')
        name[0] = '.' + name[0]
        let components = document.querySelectorAll(name[0])
        for (let component of components) {
            if (component !== changedComponent) {
                component.replaceWith(newContent.cloneNode(true))
            }
        }

    }

    function updateLayers(container) {
        const list = document.getElementById('project-layers-list')
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        let components = container.children
        for (const component of components) {
            let li = document.createElement('li')
            li.textContent = component.classList.value.split(' ')[0]
            li.onclick = () => {
                selectedComponent = component
            }
            let modules = component.children
            for (const module of modules) {
                let liMod = document.createElement('li')
                liMod.textContent = module.textContent
                liMod.classList.add('project-layers-list-module')
                liMod.onclick = () => {
                    selectedModule = module
                }
                li.append(liMod)
            }
            list.append(li)
        }
    }

    function update() {
        syncComponents(document.getElementById(props.name), selectedComponent)
        //addListeners(document.getElementById(props.name))
        updateLayers(document.getElementById(props.name))
    }

    function renderProperties(selectedElement) {
        const root = ReactDOM.createRoot(document.getElementById('render-properties'))
        const propertiesComponent = <Properties2 selectedElement = {selectedElement}/>
        root.render(propertiesComponent)
    }

    return (
        <div id='work-space'>
            <section className={'container'}>
                <div id='tools'>
                    <input id='component-name-input' placeholder={'Component name'}/>
                    <button onClick={() => {
                        const input = document.getElementById('component-name-input')
                        const component = manageComponent(input.value, 'create')
                        let newContent = component.cloneNode(true)
                        document.getElementById(props.name).append(newContent)
                        update()
                    }}>Create</button>
                    <button onClick={() => {
                        manageComponent(selectedComponent, 'delete')
                    }}>Delete</button>
                    <button onClick={() => {
                        mover('upComponent', selectedComponent.parentNode.children)
                    }}>Up Component</button>
                    <button onClick={() => {
                        mover('downComponent', selectedComponent.parentNode.children)
                    }}>Down Component</button>
                    <br/>
                    <h3>Module</h3>
                    <select name='modules' id={'module-selector'}>
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
                    <button onClick={() => {
                        const select = document.getElementById('module-selector')
                        manageModule(select.value, 'add')
                    }}>Add Module</button>
                    <button onClick={() => {
                        manageModule(selectedModule, 'delete')
                    }}>Delete Module</button>
                    <button onClick={() => {
                        mover('up', selectedComponent.parentNode.children)
                    }}>Up Module</button>
                    <button onClick={() => {
                        mover('down', selectedComponent.parentNode.children)
                    }}>Down Module</button>
                    <h3>Nest module</h3>
                    <select name='nest-modules' id={'nest-module-selector'}>
                        <option value='h1'>h1</option>
                        <option value='h2'>h2</option>
                        <option value='h3'>h3</option>
                        <option value='h4'>h4</option>
                        <option value='h5'>h5</option>
                        <option value='h6'>h6</option>
                        <option value='p'>p</option>
                        <option value='div'>div</option>
                        <option value='li'>li</option>
                    </select>
                    <button onClick={() => {
                        const select = document.getElementById('nest-module-selector')
                        manageModule(select.value, 'nest')
                    }}>Nest Module</button>
                    <button onClick={() => {
                        saveContent(document.getElementById(props.name))
                    }}>Save</button>
                </div>
            </section>

            <section className={'grid-container'}>
                <div id={'project-layers-list'}>
                    <ul id={'project-layers-list'}>

                    </ul>
                </div>
                <div id={props.name} className={'main-project'}>

                </div>
                <div id={'render-properties'}>

                </div>
            </section>
        </div>
    );
};

export default WorkSpace;
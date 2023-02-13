import React, {createContext, useEffect, useState} from 'react';
import {invoke} from '@tauri-apps/api/tauri';

let windowUpdate = true
let updateCounter = 0
let selectedModule

const ToolBar = () => {
    let changedComponentsArr = []

    let [mainWindow, setMainWindow] = useState(document.querySelectorAll('.mainModule'))
    useEffect(() => {
        if (windowUpdate === true) {
            setMainWindow(document.querySelectorAll('.mainModule'))
            addDefaultListeners(mainWindow).then(r => console.log('listeners added'))
            updateCounter++
            if (updateCounter === 3) {
                windowUpdate = false
            }
        }
    })
    function screenUpdate() {
        for (const mainWindowStateElement of mainWindow) {
            changedComponentsArr.push(mainWindowStateElement.outerHTML)
        }
        componentManager('component1', '../../projects/TestProject/', 1, 'TestProject', '', changedComponentsArr)
        window.location.reload()
    }
    async function addDefaultListeners(mainWindowState) {
        for (const mainWindowStateElement of mainWindowState) {
            if (mainWindowStateElement == null || mainWindowStateElement.hasChildNodes()) {
                let modules = mainWindowStateElement.children
                for (const module of modules) {

                    module.onclick = () => {
                        updateCounter = 0
                        windowUpdate = true
                        selectedModule = module
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
                                screenUpdate()
                            }
                        }
                    }
                }
            }
            else {}
        }
    }
    function upModuleIndex(selectedModule, mainWindowState) {
        for (let j = 0; j < mainWindowState.length; j++) {
            if (mainWindowState[j] == null || mainWindowState[j].hasChildNodes()) {
                let modules = mainWindowState[j].children
                for (let i=0; i < modules.length; i++) {

                    if (selectedModule === modules[i]) {
                        return [i, i - 1, j]
                    }
                }
            }
            else {}
        }
    }
    function downModuleIndex(selectedModule, mainWindowState) {
        for (let j = 0; j < mainWindowState.length; j++) {
            if (mainWindowState[j] == null || mainWindowState[j].hasChildNodes()) {
                let modules = mainWindowState[j].children
                for (let i=0; i < modules.length; i++) {
                    if (selectedModule === modules[i]) {
                        console.log([i, i + 1, j])
                        return [i, i + 1, j]
                    }
                }
            }
            else {}
        }
    }
    function componentManager(componentName, projectPath, action, projectName, moduleType, screenUpdate) {
        invoke('component_manager', {componentName, projectPath, action, projectName, moduleType, screenUpdate})
    }
    return (
        <div>
            <button onClick={() => {
                componentManager('component1', '../../projects/TestProject/', 0, 'TestProject', '', [])
                window.location.reload()
            }}>Create component</button>
            <select name='modules' id={'modules'}>
                <option value='h2'>h2</option>
                <option value='p'>p</option>
            </select>
            <button onClick={() => {
                let moduleType = document.getElementById('modules')
                componentManager('component1', '../../projects/TestProject/', 1, 'TestProject', moduleType.value, [])
                window.location.reload()
            }}>Add module</button>
            <button onClick={() => {
                componentManager('component1', '../../projects/TestProject/', 2, 'TestProject', '', [])
                window.location.reload()
            }}>Delete last component</button>
            <button onClick={() => {
                selectedModule.parentNode.removeChild(selectedModule)
                screenUpdate()
            }}>Delete module</button>
            <button onClick={() => {
                let is = upModuleIndex(selectedModule, mainWindow)
                let i1, i2, i3
                i1 = is[0]; i2 = is[1]; i3 = is[2];
                let modules = mainWindow[i3].children
                mainWindow[i3].insertBefore(modules[i1], modules[i2])
                for (const mainWindowStateElement of mainWindow) {
                    changedComponentsArr.push(mainWindowStateElement.outerHTML)
                }
                componentManager('component1', '../../projects/TestProject/', 1, 'TestProject', '', changedComponentsArr)
                window.location.reload()
            }}>Up module</button>
            <button onClick={() => {
                let is = downModuleIndex(selectedModule, mainWindow)
                let j1, j2, j3
                j1 = is[0]; j2 = is[1]; j3 = is[2];
                let modules = mainWindow[j3].children
                modules[j2].after(modules[j1]);
                screenUpdate()
            }}>Down module</button>

        </div>
    );
};

export default ToolBar;
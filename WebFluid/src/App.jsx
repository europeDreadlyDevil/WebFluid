import React, {useEffect, useState} from "react";
import WorkSpace from "./basedComponents/workSpace.jsx";
import StartMenu from "./basedComponents/startMenu.jsx";
import './App.css'
import {invoke} from "@tauri-apps/api/tauri";
import ReactDOM from "react-dom/client";

function filterArray(arr) {
    arr = Array.from(arr)
    arr = arr.filter((item, index) => arr.indexOf(item) === index);
    return arr
}

function parseElement(elm) {
    if (elm.dataset.elementType === 'component') {
        let component = {
            elementType: elm.dataset.elementType,
            componentName: elm.getAttribute('name'),
            elementStyle: {
                width: elm.style.width,
                height: elm.style.height,
                fontFamily: elm.style.fontFamily,
                fontSize: elm.style.fontSize,
                letterSpacing: elm.style.letterSpacing,
                color: elm.style.color
            },
            elementsInside: []
        }

        let elmsInside = filterArray(elm.children)
        for (const elmInside of elmsInside) {
            let newElm = parseElement(elmInside)
            component.elementsInside.push(newElm)
        }
        return component
    } else if (elm.dataset.elementType === 'module') {
        let module = {
            elementType: elm.dataset.elementType,
            moduleType: elm.dataset.moduleType,
            moduleNode: elm.nodeName,
            elementStyle: {
                width: elm.style.width,
                height: elm.style.height,
                fontFamily: elm.style.fontFamily,
                fontSize: elm.style.fontSize,
                letterSpacing: elm.style.letterSpacing,
                color: elm.style.color
            }
        }
        if (module.moduleType === 'moduleContainer') {
            let elmsInside = filterArray(elm.children)
            module.elementsInside = []
            for (const elmInside of elmsInside) {
                let newElm = parseElement(elmInside)
                module.elementsInside.push(newElm)
            }
        }else if (module.moduleType === 'textModule'){
            module.textContent = elm.innerHTML
        }
        return module
    }
}

function collectElementsForSave(globalObj, infoWFSObj) {
    let elms = filterArray(document.getElementById(globalObj.projectName).children)
    infoWFSObj.components = []
    for (const elm of elms) {
        let newElm = parseElement(elm)
        infoWFSObj.components.push(newElm)
    }
    return infoWFSObj
}

window.saveProject = () => {
    function sendRequests(infoArr) {
        invoke('save_file', {content: infoArr}).then((massage) => {alert(massage)}).catch((e) => console.error(e))
    }
    if (g_projectInfo.projectName === '') {
        alert('Please create a project before saving it')
        return 0
    }
    let infoForSave = collectElementsForSave(g_projectInfo, {projectName: g_projectInfo.projectName})

    infoForSave.version = g_projectInfo.appVersion
    infoForSave = JSON.stringify(infoForSave)
    sendRequests(infoForSave)
}

window.openProject = () => {
    let infoObj
    invoke('open_file').then((massage) => {
        infoObj = JSON.parse(massage)
        console.log(infoObj)
        g_projectInfo.projectName = infoObj.projectName
        const workSpace = <WorkSpace projectName={g_projectInfo.projectName} infoObj={infoObj} />
        const root = ReactDOM.createRoot(document.getElementById("app"))
        root.render(workSpace)
    })
}

window.g_projectInfo = {
    appVersion: '0.0.1',
    projectName: '',
    selectedElement: '',
    componentsArr: [],
    moduleArr: [],
    baseSettings: {
        textModules: ['H1','H2','H3','H4','H5','H6','P','SPAN']
    }
}

function App() {

    return (
        <div id='app'>
            <StartMenu/>
        </div>
    );

}

export default App;


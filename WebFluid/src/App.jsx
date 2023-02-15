import React from "react";
import WorkSpace from "./basedComponents/workSpace.jsx";
import StartMenu from "./basedComponents/startMenu.jsx";
import './App.css'

function App() {

    window.g_projectInfo = {
        projectName: '',
        selectedElement: '',
        componentsArrNew: [],
        moduleArr: [],
        baseSettings: {
            textModules: ['H1','H2','H3','H4','H5','H6','P','SPAN']
        }
    }

    return (
        <div id='app'>
            <StartMenu/>
            {/*<WorkSpace projectName={g_projectInfo.projectName}/>*/}
        </div>
    );

}

export default App;


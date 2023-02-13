
import React from "react";
import WorkSpace from "./basedComponents/work_space.jsx";


function App() {

    window.g_projectInfo = {
        projectName: 'test-project',
        selectedElement: '',
        componentsArrNew: [],
        moduleArr: [],
        baseSettings: {
            textModules: ['H1','H2','H3','H4','H5','H6','P','SPAN']
        }
    }

    return (
        <div id='app'>
            <WorkSpace projectName = {g_projectInfo.projectName}/>
        </div>
    );

}

export default App;


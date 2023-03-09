import React from 'react';
import '../styles/startMenu.css'
import WorkSpace from "./workSpace.jsx";
import ReactDOM from "react-dom/client";


const StartMenu = () => {
    return (
        <div id={'start-menu'}>
            <section id={'new-project'}>
                <input placeholder={'Project name'} id={'project-name-input'}/>
                <button onClick={() => {
                    let input = document.getElementById('project-name-input')
                    g_projectInfo.projectName = input.value
                    const workSpace = <WorkSpace projectName={input.value} />
                    const root = ReactDOM.createRoot(document.getElementById("app"))
                    root.render(workSpace)
                }}>
                    New project
                </button>
            </section>
            <section id={'open-project'}>
                <button onClick={() => {
                    openProject()
                }}>
                    Open project
                </button>
            </section>
        </div>
    );
};

export default StartMenu;
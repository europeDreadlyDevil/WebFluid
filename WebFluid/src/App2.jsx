
import "./App.css";
import React, {useEffect} from "react";
import WorkSpace from "./basedComponents/work_space.jsx";
import GreetingMenu from "./basedComponents/greeting_menu2.jsx";
import ReactDOM from "react-dom/client";
import WorkSpaceDeep from "./basedComponents/work_space_deep";

export function createChecker() {
    if (createProject.isCreate === true) {
        document.getElementById('greeting-menu-section').setAttribute('hidden', '')
        const root = ReactDOM.createRoot(document.getElementById('work-space-section'))
        const workSpace = <WorkSpace name = {createProject.name} />
        document.getElementById('work-space-section').removeAttribute('hidden')
        root.render(workSpace)
    }
}

function App() {

    window.createProject = {
        name: '',
        isCreate: false
    }

    return (
        <div id='app'>
            <section id={'greeting-menu-section'} className={'container'}>
                <GreetingMenu/>
            </section>
            <section id={'work-space-section'} hidden>

            </section>

        </div>
    );

}

export default App;


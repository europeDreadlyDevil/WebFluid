import React from 'react';
import {createChecker} from "../App.jsx";

const GreetingMenu = () => {
    return (
        <div>
            <button onClick={() => {
                document.getElementById('create-project-section').removeAttribute('hidden')
            }}>Create new project</button>
            <section id={'create-project-section'} hidden>
                <input id={'create-project-input'} placeholder={'Project name'}/>
                <button onClick={() => {
                    const input = document.getElementById('create-project-input')
                    window.createProject = {
                        name: input.value,
                        isCreate: true
                    }
                    createChecker()
                }}>Create</button>
            </section>
        </div>
    );
};

export default GreetingMenu;
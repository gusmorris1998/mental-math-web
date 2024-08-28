import { convertTextToMP3 } from "./tts.js";

const mode = document.querySelector("#mode-select");
const container = document.querySelector('#container');
const sleep = ms => new Promise(r => setTimeout(r, ms));

var running = false;
var selected;
var settings;
var button;
var interval;

mode.addEventListener("change", function() { 
    selected = mode.value;

    handleSelection(selected)
})

function handleSelection(selection) {
    if ( button ) { container.removeChild(button) }
    if ( settings ) { container.removeChild(settings.parent) }

    switch (selection) {
        case 'addition':
            settings = initializeAddition()
            button = createStartButton()
            break;
        default:
            settings = null;
            button = null;
            break;
       }

       if (settings) { 
            settings.parent.setAttribute("id", "settings")
            container.appendChild(settings.parent); 
            container.appendChild(button)
            console.log(container)
       }
}

function handleRuntime() {
    if (!running) {
        running = true;
        if (button) { 
            container.removeChild(button);
            button = createStopButton();
            container.appendChild(button);
        }
        
        run(selected);
    }
}

function initializeAddition() {
    config = {
        numDigitsSlider1: createSlider(1,5),
        numDigitsSlider2: createSlider(1,5),
        delaySlider: createSlider(1,20),
    }
    var settings = new Settings(config)

    return settings
}

// To replace runAddition
function run(selection) {
    if (!running) return; // Stop if running is set to false

    let equation;
    const int1 = getRandomInt(parseInt('9'.repeat(settings.numDigitsSlider1.value)));
    const int2 = getRandomInt(parseInt('9'.repeat(settings.numDigitsSlider2.value)));
    const delay = settings.delaySlider.value * 1000;

    switch (selection) {
        case 'addition':
            equation = `${int1} + ${int2}`;
            console.log(equation);
            convertTextToMP3()

            setTimeout(() => {
                const answer = int1 + int2;
                console.log(`Answer: ${answer}`);
                run(selection); // Start the next round after the current delay
            }, delay);
    }
}

function createSlider(min, max) {
    let slider = document.createElement("input");

    slider.setAttribute("type", "range")
    slider.setAttribute("min", min)
    slider.setAttribute("max", max)
    
    return slider
}

function createStartButton() {
    let button = document.createElement("button");

    button.textContent = "Start";
    button.setAttribute("class", "start");

    button.addEventListener("click", handleRuntime)

    return button
}

function createStopButton() {
    let button = document.createElement("button");

    button.textContent = "Stop";
    button.setAttribute("class", "stop");

    button.addEventListener("click", stop)

    return button
}

function stop() {
    runnng = false;

    handleSelection(selected);
}

function Settings(config) {
    this.parent = document.createElement("div");
    
    for (let key in config) {
        if (config.hasOwnProperty(key)) {
            this[key] = config[key]
            this.parent.appendChild(this[key])
        }
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


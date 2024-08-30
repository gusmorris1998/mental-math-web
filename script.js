const mode = document.querySelector("#mode-select");
const container = document.querySelector('#container');
const sleep = ms => new Promise(r => setTimeout(r, ms));

var running = false;
var selected;
var settings;
var button;
var interval;

mode.addEventListener("change",  (event) => {
    event.preventDefault(); // Prevent default action 
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
    console.log("handleRuntime called");
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
    const config = {
        numDigitsSlider1: createSlider(1,5),
        numDigitsSlider2: createSlider(1,5),
        delaySlider: createSlider(1,20),
    }
    var settings = new Settings(config)

    return settings
}


function run(selection) {
    let equation;
    const int1 = getRandomInt(parseInt('9'.repeat(settings.numDigitsSlider1.value)));
    const int2 = getRandomInt(parseInt('9'.repeat(settings.numDigitsSlider2.value)));
    const delay = settings.delaySlider.value * 1000;

    if (running) {
        switch (selection) {
            case 'addition':
                equation = `${int1}+${int2}`;
                console.log("Equation:", equation);

                // Fetch audio for the equation
                fetchAudio(equation);

                setTimeout(() => {
                    const answer = int1 + int2;
                    console.log(`Answer: ${answer}`);
                    fetchAudio(answer);
                    setTimeout(() => {run(selection)}, 5000) // Start the next round after the current delay
                }, delay);
                break;
        }
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

    button.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent default action
        console.log("Start button clicked");
        handleRuntime();
    });

    return button;
}


function createStopButton() {
    let button = document.createElement("button");

    button.textContent = "Stop";
    button.setAttribute("class", "stop");

    button.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent default action
        console.log("Stop button clicked");
        stop();
    });

    return button;
}

function stop() {
    console.log("stop called");
    running = false;

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

function fetchAudio(text) {
    console.log("Fetching audio for equation:", text);
    fetch(`http://localhost:3000/convert?text=${encodeURIComponent(text)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }   
            return response.blob();
        })
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            console.log("Audio object created:", audio);
            audio.play().then(() => {
                console.log("Audio playback started");
            }).catch(error => {
                console.error("Error during audio playback:", error);
            });
        })
        .catch(error => console.error('Error:', error));
}
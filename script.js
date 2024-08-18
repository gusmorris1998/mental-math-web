const mode = document.querySelector("#mode-select");
const container = document.querySelector('#container');
const sleep = ms => new Promise(r => setTimeout(r, ms));

var running = false;
var selected;
var settings;
var startButton;

mode.addEventListener("change", function() { 
    selected = mode.value;

    handleSelection(selected)
})

function handleSelection(selection) {
    if ( startButton ) { container.removeChild(startButton) }
    if ( settings ) { container.removeChild(settings.parent) }

    switch (selection) {
        case 'addition':
            settings = initializeAddition()
            startButton = createButton()
            break;
        default:
            settings = null;
            startButton = null;
            break;
       }
       
       if (settings) { 
            settings.parent.setAttribute("id", "settings")
            container.appendChild(settings.parent); 
            container.appendChild(startButton)
            console.log(container)
       }
}

function handleRuntime() {
    switch (selected) {

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

async function runAddition() {
    const numRange1 = parseInt('9'.repeat(settings.numDigitsSlider1.value));
    const numRange2 = parseInt('9'.repeat(settings.numDigitsSlider2.value));
    const delay = settings.delaySlider.value

    while ( running ) {
        var int1 = getRandomInt(numRange1)
        var int2 = getRandomInt(numRange2)
        console.log(int1 + " + " + int2)
        
        await sleep(delay * 1000);

        console.log(int1 + int2)
    }
}

function createSlider(min, max) {
    let slider = document.createElement("input");

    slider.setAttribute("type", "range")
    slider.setAttribute("min", min)
    slider.setAttribute("max", max)
    
    return slider
}

function createButton() {
    let button = document.createElement("button");

    button.textContent = "Start";
    button.setAttribute("class", "start");

    button.addEventListener("click", function() {
        switch (selected) {
            case 'addition':
                running = true;
                runAddition()
        }
    })

    return button
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
function usernameEdit() {
    var inputElement = document.getElementById('usernameInput');
    if (inputElement) {
        inputElement.readOnly = false;
    } else {
        console.error("Input element not found!");
    }
}

function usernameEnter(event) {
    if (event.keyCode === 13) {
        var inputElement = document.getElementById('usernameInput');
        if (inputElement) {
            inputElement.readOnly = true;
        } else {
            console.error("Input element not found!");
        }
    }
}

function phoneEdit() {
    var inputElement = document.getElementById('phoneInput');
    if (inputElement) {
        inputElement.readOnly = false;
    } else {
        console.error("Input element not found!");
    }
}

function phoneEnter(event) {
    if (event.keyCode === 13) {
        var inputElement = document.getElementById('phoneInput');
        if (inputElement) {
            inputElement.readOnly = true;
        } else {
            console.error("Input element not found!");
        }
    }
}

function emailEdit() {
    var inputElement = document.getElementById('emailInput');
    if (inputElement) {
        inputElement.readOnly = false;
    } else {
        console.error("Input element not found!");
    }
}

function emailEnter(event) {
    if (event.keyCode === 13) {
        var inputElement = document.getElementById('emailInput');
        if (inputElement) {
            inputElement.readOnly = true;
        } else {
            console.error("Input element not found!");
        }
    }
}

function addrEdit() {
    var inputElement = document.getElementById('addrInput');
    if (inputElement) {
        inputElement.readOnly = false;
    } else {
        console.error("Input element not found!");
    }
}

function addrEnter(event) {
    if (event.keyCode === 13) {
        var inputElement = document.getElementById('addrInput');
        if (inputElement) {
            inputElement.readOnly = true;
        } else {
            console.error("Input element not found!");
        }
    }
}
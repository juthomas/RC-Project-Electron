
window.addEventListener("gamepadconnected", function (e) {
	console.log("Contrôleur n°%d connecté : %s. %d boutons, %d axes.",
		e.gamepad.index, e.gamepad.id,
		e.gamepad.buttons.length, e.gamepad.axes.length);
});
var controllers = [];

function scangamepads() {
	var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
	var i = 0
	for (; i < gamepads.length; i++) {
		if (gamepads[i]) {
			
			controllers[gamepads[i].index] = gamepads[i];
		}
	}
	controllers[i] = {"id":"keyboard"}
}

var currentControllerId = undefined;

function selectInput(input){
	inputSelectBtn.innerText = input.id;

	if (input.id == "keyboard")
	{
		currentControllerId = undefined;
	}
	else 
	{
		currentControllerId = input.id;
	}
}

const inputSelectBtn = document.getElementById('inputSelectBtn');
inputSelectBtn.onclick = getInputSources;

function getInputSources() {
	scangamepads();


	const inputOptionsMenu = Menu.buildFromTemplate(
		controllers.map(input => {
		  return {
			label: input.id,
			click: () => selectInput(input)
		  };
		})
	  );
		inputOptionsMenu.popup();
}

document.addEventListener("DOMContentLoaded", function (event) {
	// Your code to run since DOM is loaded and ready
	console.log("document loaded");
	const { ipcRenderer, remote } = require('electron');
	const { dialog, Menu } = remote;


	const upButton = document.getElementById('upButton');
	const downButton = document.getElementById('downButton');
	const leftButton = document.getElementById('leftButton');
	const rightButton = document.getElementById('rightButton');

	const upProgress = document.getElementById('upProgress');
	const downProgress = document.getElementById('downProgress');
	const leftProgress = document.getElementById('leftProgress');
	const rightProgress = document.getElementById('rightProgress');

	const ipAddr = document.getElementById('ipAddr');
	const port = document.getElementById('port');
	const udpActivated = document.getElementById('sendUdp');

	var eventTarget = new EventTarget();

	let accelValue = 0;
	let turnValue = 0;
	const minAccel = -100;
	const maxAccel = 100;
	const minTurn = -100;
	const maxTurn = 100;
	const stepValue = 5;
	let accelModifier = 0;
	let turnModifier = 0;

	upButton.addEventListener("mousedown", function () {
		accelModifier = stepValue;
	});

	upButton.addEventListener("mouseup", function () {
		accelModifier = 0;
	});
	downButton.addEventListener("mousedown", function () {
		accelModifier = -stepValue;
	});

	downButton.addEventListener("mouseup", function () {
		accelModifier = 0;
	});

	leftButton.addEventListener("mousedown", function () {
		turnModifier = stepValue;
	});

	leftButton.addEventListener("mouseup", function () {
		turnModifier = 0;
	});
	rightButton.addEventListener("mousedown", function () {
		turnModifier = -stepValue;
	});

	rightButton.addEventListener("mouseup", function () {
		turnModifier = 0;
	});


	document.addEventListener("keyup", event => {
		console.log("keyup : ", event.key);
		if (event.key == "ArrowUp" || event.key == "ArrowDown") {
			accelModifier = 0;
		}
		if (event.key == "ArrowLeft" || event.key == "ArrowRight") {
			turnModifier = 0;
		}

	});

	document.addEventListener("keydown", event => {
		console.log("keydown");

		if (event.key == "ArrowUp") {
			accelModifier = stepValue;
		}
		else if (event.key == "ArrowDown") {
			accelModifier = -stepValue;
		}
		else if (event.key == "ArrowLeft") {
			turnModifier = stepValue;
		}
		else if (event.key == "ArrowRight") {
			turnModifier = -stepValue;
		}
	});


	window.setInterval(() => {

		if (accelModifier) {
			if (accelModifier > 0) {
				if (accelValue < 0)
					accelValue = 0;
				let addValue = accelModifier * (maxAccel * 1.5 - accelValue) / 100;
				accelValue = accelValue + addValue > maxAccel ? maxAccel : accelValue + addValue;
			}
			else {
				if (accelValue > 0)
					accelValue = 0;
				let addValue = accelModifier * (-minAccel * 1.5 + accelValue) / 100;
				accelValue = accelValue + addValue < minAccel ? minAccel : accelValue + addValue;
			}
		}
		else {
			if (accelValue >= 0) {
				accelValue = accelValue - stepValue < 0 ? 0 : accelValue - stepValue;
			}
			else {
				accelValue = accelValue + stepValue > 0 ? 0 : accelValue + stepValue;
			}
		}
		if (turnModifier) {
			if (turnModifier > 0) {
				if (turnValue < 0)
					turnValue = 0;
				let addValue = turnModifier * (maxTurn * 1.5 - turnValue) / 100;
				turnValue = turnValue + addValue > maxTurn ? maxTurn : turnValue + addValue;
			}
			else {
				if (turnValue > 0)
					turnValue = 0;
				let addValue = turnModifier * (-minTurn * 1.5 + turnValue) / 100;
				turnValue = turnValue + addValue < minTurn ? minTurn : turnValue + addValue;
			}
		}
		else {
			if (turnValue >= 0) {
				turnValue = turnValue - stepValue < 0 ? 0 : turnValue - stepValue;
			}
			else {
				turnValue = turnValue + stepValue > 0 ? 0 : turnValue + stepValue;
			}
		}

		scangamepads();
		if (currentControllerId != undefined)
		{
			const currentController = controllers.find(elem => elem.id == currentControllerId);
			accelValue = currentController.buttons[6].value > 0 ? currentController.buttons[6].value * -100 : currentController.buttons[7].value * 100
			turnValue = currentController.axes[0] * -100;
			accelValue = parseInt(accelValue, 10);
			turnValue = parseInt(turnValue, 10);
		}

		upProgress.value = accelValue > 0 ? accelValue : 0;
		downProgress.value = -accelValue > 0 ? -accelValue : 0;
		leftProgress.value = turnValue > 0 ? turnValue : 0;
		rightProgress.value = -turnValue > 0 ? -turnValue : 0;
		if (udpActivated.checked == true) {

			ipcRenderer.send('control:data', {
				'accelValue': accelValue,
				'turnValue': turnValue,
				'port': parseInt(port.value, 10),
				'ip': ipAddr.value
			});
		}
	}, 50);

});



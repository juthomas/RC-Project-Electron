document.addEventListener("DOMContentLoaded", function(event) {
	// Your code to run since DOM is loaded and ready
	console.log("document loaded");
	const {ipcRenderer} = require('electron');

	const upButton = document.getElementById('upButton');
	const downButton = document.getElementById('downButton');
	const leftButton = document.getElementById('leftButton');
	const rightButton = document.getElementById('rightButton');

	const upProgress = document.getElementById('upProgress');
	const downProgress = document.getElementById('downProgress');
	const leftProgress = document.getElementById('leftProgress');
	const rightProgress = document.getElementById('rightProgress');

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

	// upButton.onclick = () => {
	// 	// accelValue++;
	// 	console.log(accelValue);
	// }
	// downButton.onclick = () => {
	// 	// accelValue--;
	// 	console.log(accelValue);

	// }
	// leftButton.onclick = () => {
	// 	// turnValue--;		
	// }
	// rightButton.onclick = () => {
	// 	// turnValue++;		
	// }

    upButton.addEventListener("mousedown", function(){
        accelModifier = stepValue;
    });

    upButton.addEventListener("mouseup", function() {
        accelModifier = 0;
	});
    downButton.addEventListener("mousedown", function(){
        accelModifier = -stepValue;
    });

	downButton.addEventListener("mouseup", function() {
        accelModifier = 0;
	});

    leftButton.addEventListener("mousedown", function(){
        turnModifier = stepValue;
    });

    leftButton.addEventListener("mouseup", function() {
    	turnModifier = 0;
	});
    rightButton.addEventListener("mousedown", function(){
        turnModifier = -stepValue;
    });

	rightButton.addEventListener("mouseup", function() {
        turnModifier = 0;
	});


	document.addEventListener("keyup", event => {
		console.log("keyup : ", event.key);
		if (event.key == "ArrowUp" || event.key == "ArrowDown")
		{
			accelModifier = 0;
		}
		if (event.key == "ArrowLeft" || event.key == "ArrowRight")
		{
			turnModifier = 0;
		}

	});
	  
	document.addEventListener("keydown", event => {
		console.log("keydown");

		if (event.key == "ArrowUp")
		{
			accelModifier = stepValue;
		}
		else if (event.key == "ArrowDown")
		{
			accelModifier = -stepValue;
		}
		else if (event.key == "ArrowLeft")
		{
			turnModifier = stepValue;
		}
		else if (event.key == "ArrowRight")
		{
			turnModifier = -stepValue;
		}
	});


	window.setInterval(() => {

		if (accelModifier)
		{
			if (accelModifier > 0)
			{
				if (accelValue < 0)
					accelValue = 0;
				let addValue = accelModifier * (maxAccel * 1.5 - accelValue) / 100;
				accelValue = accelValue + addValue > maxAccel ? maxAccel : accelValue + addValue;
			}
			else
			{
				if (accelValue > 0)
					accelValue = 0;
				let addValue = accelModifier * (-minAccel * 1.5 + accelValue) / 100;
				accelValue = accelValue + addValue < minAccel ? minAccel : accelValue + addValue;
			}
		}
		else
		{
			if (accelValue >= 0)
			{
				accelValue = accelValue - stepValue < 0 ? 0 : accelValue - stepValue;
			}
			else
			{
				accelValue = accelValue + stepValue > 0 ? 0 : accelValue + stepValue;
			}
		}
		// console.log("turn modifier :", turnModifier);
		if (turnModifier)
		{
			if (turnModifier > 0)
			{
				if (turnValue < 0)
					turnValue = 0;
				let addValue = turnModifier * (maxTurn * 1.5 - turnValue) / 100;
				turnValue = turnValue + addValue > maxTurn ? maxTurn : turnValue + addValue;
			}
			else
			{
				if (turnValue > 0)
					turnValue = 0;
				let addValue = turnModifier * (-minTurn * 1.5 + turnValue) / 100;
				turnValue = turnValue + addValue < minTurn ? minTurn : turnValue + addValue;
			}
		}
		else
		{
			if (turnValue >= 0)
			{
				turnValue = turnValue - stepValue < 0 ? 0 : turnValue - stepValue;
			}
			else
			{
				turnValue = turnValue + stepValue > 0 ? 0 : turnValue + stepValue;
			}
		}

		upProgress.value = accelValue > 0 ? accelValue : 0;
		downProgress.value = -accelValue > 0 ? -accelValue : 0;
		leftProgress.value = turnValue > 0 ? turnValue : 0;
		rightProgress.value = -turnValue > 0 ? -turnValue : 0;
		// console.log(accelValue);
		ipcRenderer.send('control:data', {
			'accelValue':accelValue,
			'turnValue':turnValue});
	}, 50);

});



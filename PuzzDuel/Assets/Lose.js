#pragma strict

function Start () {
Screen.SetResolution (750, 1334, false);
}

function Update () {
	if ( Input.GetMouseButtonDown (0)){
		loadStart();
	}
}

function loadStart() {
	yield WaitForSeconds (2);
	Application.LoadLevel(0);
}
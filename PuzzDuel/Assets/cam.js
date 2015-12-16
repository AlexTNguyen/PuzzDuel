#pragma strict

function Start () {
	var camera : Camera = GameObject.FindWithTag("MainCamera").GetComponent(Camera);
	camera.aspect = 640.0/1136.0;
}

function Update () {

}
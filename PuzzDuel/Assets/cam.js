#pragma strict

function Start () {
	var camera : Camera = GameObject.FindWithTag("MainCamera").GetComponent(Camera);
	camera.aspect = 750.0/1334.0;
}

function Update () {

}
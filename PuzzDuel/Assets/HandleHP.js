#pragma strict
var currentHP: int;
var maxHP: int = 100;
var enemyCurrent: int; 


function Start () {
	currentHP = maxHP; 
	enemyCurrent = maxHP;

}

function Update () {

}

function UpdateCurrent(newHP : int) {
	currentHP = newHP;
} 

function UpdateEnemy(newHP : int){
	enemyCurrent = newHP;
}
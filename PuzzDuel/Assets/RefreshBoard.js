#pragma strict

var startFreeze : float;
var freeze: boolean = false; 

function Start () {

}

function Update () {
	var TileArray : GameObject[,] = GameObject.FindWithTag("BoardArray").GetComponent(CreateArray).board;
	var maxHeight : int = GameObject.FindWithTag("Spawner").GetComponent(SpawnTiles).MaxHeight; 
	if(freeze == true && Time.time - startFreeze >= 1.5) { 
		for(var m = 0; m < maxHeight; m++) {
			for(var n = 0; n < maxHeight; n++){
				TileArray[m,n].GetComponent(Renderer).material.color.a = 1;
			}
		}
		freeze = false;
	}
}

function OnMouseOver() {
	var TileArray : GameObject[,] = GameObject.FindWithTag("BoardArray").GetComponent(CreateArray).board;
	var maxHeight : int = GameObject.FindWithTag("Spawner").GetComponent(SpawnTiles).MaxHeight; 
	startFreeze = Time.time;
	if(Input.GetMouseButtonDown(0) && freeze == false){
	freeze = true; 
	Debug.Log("Refresh!");
	for(var i = 0; i < maxHeight; i++) {
		for(var j = 0; j < maxHeight; j++){
			var rand : float = Random.Range(0, 5);
		    if( rand < 1){
		        TileArray[i,j].GetComponent(Renderer).material.color = Color.red;
		    }
		    else if( rand < 2){
		        TileArray[i,j].GetComponent(Renderer).material.color = Color.blue;
		    }
		    else if( rand < 3){
		        TileArray[i,j].GetComponent(Renderer).material.color = Color.green;
		    }
		    else if (rand < 4){
		        TileArray[i,j].GetComponent(Renderer).material.color = Color.yellow;
		    }
		    else TileArray[i,j].GetComponent(Renderer).material.color = Color.magenta;
		    TileArray[i,j].GetComponent(Renderer).material.color.a = 0.5;
		}
	}
	}
}

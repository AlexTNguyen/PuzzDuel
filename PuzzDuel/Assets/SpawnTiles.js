#pragma strict

var TilePrefab : GameObject;
var spawnTimer: float = 0.25;
var colHeight : int = 1;
var MaxHeight : int = 8;

function Start () {
    
}

function Update () {
    if(spawnTimer > 0){
        spawnTimer -= Time.deltaTime;
    }
    if(spawnTimer <= 0 && colHeight < MaxHeight){
        spawnTiles();
        spawnTimer = 0.25;
        colHeight++;
    }
}

function spawnTiles(){
    var newTile : GameObject = Instantiate(TilePrefab, transform.position, transform.rotation); 
    var rand : float = Random.Range(0, 5);
    Debug.Log(rand);
    if( rand < 1){
        newTile.GetComponent(Renderer).material.color = Color.red;
    }
    else if( rand < 2){
        newTile.GetComponent(Renderer).material.color = Color.blue;
    }
    else if( rand < 3){
        newTile.GetComponent(Renderer).material.color = Color.green;
    }
    else if (rand < 4){
        newTile.GetComponent(Renderer).material.color = Color.yellow;
    }
    else newTile.GetComponent(Renderer).material.color = Color.magenta;
}
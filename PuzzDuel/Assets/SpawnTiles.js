﻿#pragma strict

var TilePrefab : GameObject;
var GrayCat : Sprite;
var OrangeCat : Sprite;
var WhiteCat : Sprite;
var BrownCat : Sprite;
var spawnTime: float = 0.25;
var colHeight : int = 1;
var MaxHeight : int = 8;
var spawnTimer : float = spawnTime;

function Start () {
	GrayCat = Resources.Load("gray cat", Sprite);
	OrangeCat = Resources.Load("orange cat", Sprite);
	WhiteCat = Resources.Load("white cat", Sprite);
	BrownCat = Resources.Load("brown cat", Sprite);
}

function Update () {
    var col : int = 0;
    if(spawnTimer > 0){
        spawnTimer -= Time.deltaTime;
    }

    if(spawnTimer <= 0){ 
        var colArray : int[] = GameObject.FindWithTag("BoardArray").GetComponent(CreateArray).colArray;
        if(transform.position.x == -2){
            colHeight = colArray[0];
            col = 0;
        }
        else if(transform.position.x == -1.75){
            colHeight = colArray[1];
            col = 1;
        }
        else if(transform.position.x == -1.5){
            colHeight = colArray[2];
            col = 2;
        }
        else if (transform.position.x == -1.25){
            colHeight = colArray[3];
            col = 3;            
        }
        else if (transform.position.x == -1){
            colHeight = colArray[4];
            col = 4;            
        }
        else if (transform.position.x == -.75){
            colHeight = colArray[5];
            col = 5;            
        }
        else if (transform.position.x == -.5){
            colHeight = colArray[6];
            col = 6;            
        }
        else{
            colHeight = colArray[7];
            col = 7;            
        }
        if(colHeight < MaxHeight){
            spawnTiles(colHeight, col);
            spawnTimer = spawnTime;
            colArray[col]++;
        }
    }
}

function spawnTiles(colHeight : int, col : int){
 
    yield WaitForSeconds (0.20);
    var TileArray : GameObject[,] = GameObject.FindWithTag("BoardArray").GetComponent(CreateArray).board;
    TileArray[colHeight, col] = Instantiate(TilePrefab, Vector3(-2 + (col * (0.25)), (-0.9 + (colHeight * (0.25))), 0) , transform.rotation);
    var newTile : GameObject = TileArray[colHeight, col];
    var rand : float = Random.Range(0, 4);
	//Debug.Log(newTile.GetComponent(SpriteRenderer).sprite);
    if( rand < 1){
        //newTile.GetComponent(Renderer).material.color = Color.red;
        Debug.Log(GrayCat);
        newTile.GetComponent(SpriteRenderer).sprite = GrayCat; 
    }
    else if( rand < 2){
        //newTile.GetComponent(Renderer).material.color = Color.blue;
        newTile.GetComponent(SpriteRenderer).sprite = WhiteCat; 
    }
    else if( rand < 3){
        //newTile.GetComponent(Renderer).material.color = Color.green;
        newTile.GetComponent(SpriteRenderer).sprite = OrangeCat; 
    }
    //else if (rand < 4){
        //newTile.GetComponent(Renderer).material.color = Color.yellow;
    //}
  //  else newTile.GetComponent(SpriteRenderer).sprite = orangeCat; 
}
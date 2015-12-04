#pragma strict

var TilePrefab : GameObject;
var x : float = -1;
var y : float = -1;
var chainCreated : boolean = false; 
var chainColor : Color; 
var lastTileX: float = 0;
var lastTileY: float = 0;
var healthBar: GameObject;
var barPos: float; 
var maxValue: float; 
var minValue: float;
var currentHP: int;
var maxHP: int = 100;
var minHP: int = 0; 
var barWidth: float; 
var barY: float;

var canvas: GameObject;
var hpText: GameObject;

function Start () {
	hpText = GameObject.FindWithTag("Text");
	canvas = GameObject.FindWithTag("Canvas");
	healthBar = GameObject.FindWithTag("HP"); 
	barWidth = healthBar.GetComponent(RectTransform).rect.width * canvas.transform.localScale.x;
		maxValue = healthBar.transform.position.x;
		minValue = healthBar.transform.position.x - barWidth;
		barY = healthBar.transform.position.y;
	Debug.Log(maxValue);
	Debug.Log(minValue);
	currentHP = maxHP; 
}

function Update () {
	var matchedArray : GameObject[] = GameObject.FindWithTag("BoardArray").GetComponent(CreateArray).matchedArray;
	var arrayScript : CreateArray = GameObject.FindWithTag("BoardArray").GetComponent(CreateArray);
	var spawnScript : SpawnTiles = GameObject.FindWithTag("Spawner").GetComponent(SpawnTiles);
	var pos: Vector3 = Camera.main.ScreenToWorldPoint(Input.mousePosition);
	if ( Input.GetMouseButton (0)){
    var hit: RaycastHit2D = Physics2D.Raycast(pos, Vector2.zero);
	if (hit.transform != null && hit.transform.CompareTag("Tile"))
	{
	     if(hit.transform.GetComponent(Renderer).material.color.a != 0.5) {
			 if(arrayScript.numMatched == 0) {
			 	chainColor = hit.transform.GetComponent(Renderer).material.color;
			 	matchedArray[arrayScript.numMatched] = hit.transform.gameObject; 
			 	hit.transform.GetComponent(Renderer).material.color.a = 0.5;
			 	//hit.transform.localScale += new Vector3(0.2F, 0.2F, 0);
			 	lastTileX = hit.transform.position.x;
			 	lastTileY = hit.transform.position.y;
			 	arrayScript.numMatched += 1;
			 }
			 else {
			 	// Check if it next tile is to the left
			 	if((hit.transform.position.x == lastTileX - 0.25 && hit.transform.position.y == lastTileY) ||
			 		//To the right
			 	   (hit.transform.position.x == lastTileX + 0.25 && hit.transform.position.y == lastTileY) || 
			 	   //Above
			 	   (hit.transform.position.x == lastTileX && hit.transform.position.y == lastTileY + 0.25) || 
			 	   //Below
			 	   (hit.transform.position.x == lastTileX && hit.transform.position.y == lastTileY - 0.25)) { 
				 	Debug.Log(chainColor);
				 	var selectedColor = hit.transform.GetComponent(Renderer).material.color;
				 	Debug.Log(selectedColor);
				 	if(selectedColor.r == chainColor.r && selectedColor.g == chainColor.g && selectedColor.b == chainColor.b){
				 		//matchedArray[arrayScript.numMatched-1].transform.localScale += new Vector3(-0.2F, -0.2F, 0);
				 	 	matchedArray[arrayScript.numMatched] = hit.transform.gameObject; 
				 	 	hit.transform.GetComponent(Renderer).material.color.a = 0.5;
				 	 	lastTileX = hit.transform.position.x;
			 			lastTileY = hit.transform.position.y;
				     	arrayScript.numMatched += 1;
			     	}
			 	}
			}
		}
		}
	}
	else {
					if(arrayScript.numMatched <= 2){ 
						for(var j = 0; j < arrayScript.numMatched; j++){
							matchedArray[j].transform.GetComponent(Renderer).material.color.a = 1;
						}
					}
			 		else if(arrayScript.numMatched >= 3) 
			 		{
			 			currentHP -= arrayScript.numMatched; 
			 			if (arrayScript.numMatched >= 5)
			 				currentHP += 2*arrayScript.numMatched;
			 			if(currentHP <= 0)
			 				currentHP = 0;
			 			if(currentHP >= 100)
			 				currentHP = 100;
			 			HandleHealth();
			 			Debug.Log(healthBar.transform.position.x);
					 	for(var i = 0; i < arrayScript.numMatched; i++){
				    		var toSpawnx : float = matchedArray[i].transform.position.x;
				    		var toSpawny : float = matchedArray[i].transform.position.y;
				    		spawnScript.spawnTiles((toSpawny + 0.9)/0.25, (toSpawnx + 2)/0.25);
				    		Destroy(matchedArray[i]);
				    
						}
					}
					arrayScript.numMatched = 0;
					//chainColor = selectedColor;
	}
}

function HandleHealth() {
	var newXPosition = ConvertToX(currentHP, 0, maxHP, minValue, maxValue);
	//hpText.GetComponent.<TextMesh>().text = "HP: " + currentHP;
	Debug.Log("newXPosition " + newXPosition);
	healthBar.transform.position = new Vector3(newXPosition, barY);
}

function ConvertToX(x: float, inMin: float, inMax: float, outMin: float, outMax: float) {
	return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin; 
}

function SpawnNew(){
//    Debug.Log(x);
//    Debug.Log(y);
    var TileArray : GameObject[,] = GameObject.FindWithTag("BoardArray").GetComponent(CreateArray).board;
    var newTile : GameObject = Instantiate(TilePrefab, Vector3(x, y, 0), Quaternion.Euler(0, 0, 0));
    TileArray[(x + 2)/0.25, ((y + 1.15)/0.25) - 1] = newTile;
    var rand : float = Random.Range(0, 5);
    Debug.Log(rand);
    if( rand == 0){
        newTile.GetComponent(Renderer).material.color = Color.red;
    }
    else if( rand == 1){
        newTile.GetComponent(Renderer).material.color = Color.blue;
    }
    else if( rand == 2){
        newTile.GetComponent(Renderer).material.color = Color.green;
    }
    else if (rand == 3){
        newTile.GetComponent(Renderer).material.color = Color.yellow;
    }
    else newTile.GetComponent(Renderer).material.color = Color.magenta;
    newTile.active = true;
}

function attached(row : int, col: int){
    var TileArray : GameObject[,] = GameObject.FindWithTag("BoardArray").GetComponent(CreateArray).board;
    var tileColor = gameObject.GetComponent(Renderer).material.color;
    if(col > 0){
        var colorleft = TileArray[row, col-1].GetComponent(Renderer).material.color;
        if(colorleft.r == tileColor.r && colorleft.g == tileColor.g && colorleft.b == tileColor.b && colorleft.a != 1){
            return true;
        }
    }
    if(col < 7){
        var colorright = TileArray[row, col + 1].GetComponent(Renderer).material.color;
        if(colorright.r == tileColor.r && colorright.g == tileColor.g && colorright.b == tileColor.b && colorright.a != 1){
            return true;
        }

    }
    if(row > 0){
        var colordown = TileArray[row - 1, col].GetComponent(Renderer).material.color;
        if(colordown.r == tileColor.r && colordown.g == tileColor.g && colordown.b == tileColor.b && colordown.a != 1){
            return true;
        }

    }
    if(row < 7){
        var colorup = TileArray[row + 1, col].GetComponent(Renderer).material.color;
        if(colorup.r == tileColor.r && colorup.g == tileColor.g && colorup.b == tileColor.b && colorup.a != 1){
            return true;
        }

    }
    return false;
}
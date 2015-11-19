#pragma strict

var TilePrefab : GameObject;
var x : float = -1;
var y : float = -1;
var chainCreated : boolean = false; 
var chainColor : Color; 


function Start () {

}

function Update () {
	var matchedArray : GameObject[] = GameObject.FindWithTag("BoardArray").GetComponent(CreateArray).matchedArray;
	var arrayScript : CreateArray = GameObject.FindWithTag("BoardArray").GetComponent(CreateArray);
	var spawnScript : SpawnTiles = GameObject.FindWithTag("Spawner").GetComponent(SpawnTiles);
	var pos: Vector3 = Camera.main.ScreenToWorldPoint(Input.mousePosition);
    var hit: RaycastHit2D = Physics2D.Raycast(pos, Vector2.zero);
	if (hit.transform != null && hit.transform.CompareTag("Tile"))
	{
	     if(hit.transform.GetComponent(Renderer).material.color.a != 0.5) {
		 if(arrayScript.numMatched == 0) {
		 	chainColor = hit.transform.GetComponent(Renderer).material.color;
		 	matchedArray[arrayScript.numMatched] = hit.transform.gameObject; 
		 	hit.transform.GetComponent(Renderer).material.color.a = 0.5;
		 	arrayScript.numMatched += 1;
		 }
		 else {
		 	Debug.Log(chainColor);
		 	var selectedColor = hit.transform.GetComponent(Renderer).material.color;
		 	Debug.Log(selectedColor);
		 	if(selectedColor.r == chainColor.r && selectedColor.g == chainColor.g && selectedColor.b == chainColor.b){
		 		Debug.Log("2");
		 	 	matchedArray[arrayScript.numMatched] = hit.transform.gameObject; 
		 	 	hit.transform.GetComponent(Renderer).material.color.a = 0.5;
		     	arrayScript.numMatched += 1;
		 	}
		 	else {
		 		Debug.Log("3");
		 		if(arrayScript.numMatched <= 2){ 
					for(var j = 0; j < arrayScript.numMatched; j++){
						matchedArray[j].transform.GetComponent(Renderer).material.color.a = 1;
					}
				}
		 		else if(arrayScript.numMatched >= 3) 
		 		{
				 	for(var i = 0; i < arrayScript.numMatched; i++){
			    		var toSpawnx : float = matchedArray[i].transform.position.x;
			    		var toSpawny : float = matchedArray[i].transform.position.y;
			    		spawnScript.spawnTiles((toSpawny + 0.9)/0.25, (toSpawnx + 2)/0.25);
			    		Destroy(matchedArray[i]);
			    
					}
				}
				arrayScript.numMatched = 0;
				chainColor = selectedColor;
			}
		}
		}
	}
}

/*
function OnMouseDown(){
    x = gameObject.transform.position.x;
    y = gameObject.transform.position.y;
    var matchedArray : GameObject[] = GameObject.FindWithTag("BoardArray").GetComponent(CreateArray).matchedArray;
    var arrayScript : CreateArray = GameObject.FindWithTag("BoardArray").GetComponent(CreateArray);
    var spawnScript : SpawnTiles =GameObject.FindWithTag("Spawner").GetComponent(SpawnTiles);
    if(attached(((y + 0.9)/0.25), (x + 2)/0.25) || (arrayScript.numMatched == 0))
    {
        Debug.Log(arrayScript.numMatched);
        matchedArray[arrayScript.numMatched] = gameObject;
        gameObject.GetComponent(Renderer).material.color.a = 0.5;
        arrayScript.numMatched += 1;
        Debug.Log(arrayScript.numMatched);
    }
    else{
        Debug.Log("Destroying");
        for(var i = 0; i < arrayScript.numMatched; i++){
            var toSpawnx : float = matchedArray[i].transform.position.x;
            var toSpawny : float = matchedArray[i].transform.position.y;
            spawnScript.spawnTiles((toSpawny + 0.9)/0.25, (toSpawnx + 2)/0.25);
            Destroy(matchedArray[i]);
            
        }
        arrayScript.numMatched = 0;
    }
}
*/

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
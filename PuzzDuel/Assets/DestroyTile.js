#pragma strict

var TilePrefab : GameObject;
var x : float = -1;
var y : float = -1;
var chainCreated : boolean = false; 
var chainColor : Color; 
var lastTileX: float = 0;
var lastTileY: float = 0;
var healthBar: RectTransform;
var currentHP: int;
var maxHP: int = 100;
var minHP: int = 0; 
var barWidth: float; 
var enemyHP: RectTransform;
var enemyCurrent: int; 
var canvas: GameObject;
var hpText: GameObject;
var HpScript : HandleHP;
var HPx : float;

var photonView : PhotonView;

function Start () {
	//hpText = GameObject.FindWithTag("Text");
	canvas = GameObject.FindWithTag("Canvas");
	healthBar = GameObject.FindWithTag("HP").GetComponent(RectTransform); 
	enemyHP = GameObject.FindWithTag("enemyHP").GetComponent(RectTransform);
	barWidth = healthBar.rect.width;
	Debug.Log("Anchored Position: " + healthBar.anchoredPosition);
	HPx = healthBar.anchoredPosition.x;	
	HpScript = GameObject.FindWithTag("HandleHP").GetComponent(HandleHP);
	photonView = PhotonView.Get(this);
}

function Update () {
	currentHP = HpScript.currentHP;
	enemyCurrent = HpScript.enemyCurrent;
	if (enemyCurrent <= 0)
		Application.LoadLevel(3);
	if (currentHP <= 0){
		Debug.Log("Lost");
		Application.LoadLevel(2);
	} 
	var matchedArray : GameObject[] = GameObject.FindWithTag("BoardArray").GetComponent(CreateArray).matchedArray;
	var arrayScript : CreateArray = GameObject.FindWithTag("BoardArray").GetComponent(CreateArray);
	var spawnScript : SpawnTiles = GameObject.FindWithTag("Spawner").GetComponent(SpawnTiles);
	var pos: Vector3 = Camera.main.ScreenToWorldPoint(Input.mousePosition);
	if ( Input.GetMouseButton (0)){
    var hit: RaycastHit2D = Physics2D.Raycast(pos, Vector2.zero);
	if (hit.transform != null && hit.transform.CompareTag("Tile"))
	{
	     if(hit.transform.GetComponent(Renderer).material.color.a > 0.5) {
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
			 			//currentHP -= arrayScript.numMatched; 
			 			//if (arrayScript.numMatched >= 5)
			 			//	currentHP += 2*arrayScript.numMatched;
			 		    //HandleHealth();
			 		    DoDamage(arrayScript.numMatched);
			 			
			 			ChangeColor(arrayScript.numMatched); 
					 	//for(var i = 0; i < arrayScript.numMatched; i++){
				    	//	var toSpawnx : float = matchedArray[i].transform.position.x;
				    	//	var toSpawny : float = matchedArray[i].transform.position.y; 
					    //		Destroy(matchedArray[i]);
					    //		Debug.Log("SPAWNING" + i);
					    //		Debug.Log("After" + i + ": x = " + ((toSpawny + 0.9)/0.25) + " y = " + ((toSpawnx + 2)/0.25));
					    //	}
						//}
					}
					if(arrayScript.numMatched >= 5)
						Heal(arrayScript.numMatched);
					arrayScript.numMatched = 0;
					//chainColor = selectedColor;
	}
}

function Heal(amount: int) {
	currentHP = HpScript.currentHP;
	enemyCurrent = HpScript.enemyCurrent;
	Debug.Log("Enemy Before: " + enemyCurrent);
	Debug.Log("Current: " + currentHP);
	currentHP += amount;
	if(currentHP > maxHP){
		currentHP = maxHP;
	}
	HpScript.UpdateCurrent(currentHP);
	var newXPosition = ConvertToX(currentHP);
    healthBar.anchoredPosition.x = newXPosition;
    photonView.RPC("updateEnemyBar", PhotonTargets.Others, amount, currentHP);
}
@PunRPC
function updateEnemyBar (amount: int, updatedEnemyHP: int) {
	currentHP = HpScript.currentHP;
	enemyCurrent = HpScript.enemyCurrent;
	Debug.Log("Enemy Before: " + updatedEnemyHP);
	enemyCurrent = updatedEnemyHP;
	if(enemyCurrent > maxHP){
		enemyCurrent = maxHP;
	}
	HpScript.UpdateEnemy(enemyCurrent);
	var newXPosition = ConvertToX(enemyCurrent);
    enemyHP.anchoredPosition.x = newXPosition;
	Debug.Log("Enemy Current: " + enemyCurrent);
}

function ChangeColor(chainLength : int) {
	var TileArray : GameObject[,] = GameObject.FindWithTag("BoardArray").GetComponent(CreateArray).board;
	var matchedArray : GameObject[] = GameObject.FindWithTag("BoardArray").GetComponent(CreateArray).matchedArray;
	
	for(var j = 0; j < chainLength; j++){
		matchedArray[j].transform.GetComponent(Renderer).material.color.a = 0;
	}
	for(var i = 0; i < chainLength; i++){
		matchedArray[i].transform.GetComponent(Renderer).material.color.a = 1;
		var rand : float = Random.Range(0, 5);
	    if( rand < 1){
	        matchedArray[i].transform.GetComponent(Renderer).material.color = Color.red;
	    }
	    else if( rand < 2){
	        matchedArray[i].transform.GetComponent(Renderer).material.color = Color.blue;
	    }
	    else if( rand < 3){
	        matchedArray[i].transform.GetComponent(Renderer).material.color = Color.green;
	    }
	    else if (rand < 4){
	        matchedArray[i].transform.GetComponent(Renderer).material.color = Color.yellow;
	    }
	    else matchedArray[i].transform.GetComponent(Renderer).material.color = Color.magenta;
	}
} 

function HandleHealth() {
	currentHP = HpScript.currentHP;
	var newXPosition = ConvertToX(currentHP);
	//hpText.GetComponent.<TextMesh>().text = "HP: " + currentHP;
	Debug.Log("newXPosition " + newXPosition);
	healthBar.anchoredPosition.x = newXPosition;
}


function DoDamage(damage : int){
	currentHP = GameObject.FindWithTag("HandleHP").GetComponent(HandleHP).currentHP;
	enemyCurrent = GameObject.FindWithTag("HandleHP").GetComponent(HandleHP).enemyCurrent;
    photonView.RPC("ChangeHP", PhotonTargets.Others, damage);
    Debug.Log("Enemy Before: " + enemyCurrent);
    enemyCurrent -= damage;
    HpScript.UpdateEnemy(enemyCurrent);
    var enemyXPosition = ConvertToX(enemyCurrent);
    enemyHP.anchoredPosition.x = enemyXPosition;
    	Debug.Log("Enemy Current: " + enemyCurrent);
}
@PunRPC
function ChangeHP(damage : int){
	currentHP = HpScript.currentHP;
	enemyCurrent = HpScript.enemyCurrent;
    Debug.Log(currentHP);
    currentHP -= damage;
    HpScript.UpdateCurrent(currentHP);
    var newXPosition = ConvertToX(currentHP);
    healthBar.anchoredPosition.x = newXPosition;
    Debug.Log("Current HP: " + currentHP);
    FlashOnDamage();
}


function ConvertToX(health : float) {
	 return (HPx - (( (maxHP - health)/maxHP) * barWidth));
}

function SpawnNew(){

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

function FlashOnDamage(){
	var i : float;
	var damageTexture : UI.Image;
	Debug.Log("flashing");
	damageTexture = GameObject.FindWithTag("Damage").GetComponent(UI.Image);
	for(i = 0.0; i < 0.3; i += Time.deltaTime)
	{
		damageTexture.color.a = Mathf.Lerp(0.0, 0.5, i);
		yield;
		damageTexture.color.a = 0.5;
	}
	yield WaitForSeconds(0.01);
	for(i = 0.0; i < 0.3; i += Time.deltaTime)
	{
		damageTexture.color.a = Mathf.Lerp(0.5, 0.0, i);
		yield;
		damageTexture.color.a = 0.0;
	}
}
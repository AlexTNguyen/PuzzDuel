#pragma strict

var TilePrefab : GameObject;
var GrayCat : Sprite;
var OrangeCat : Sprite;
var WhiteCat : Sprite;
var BrownCat : Sprite;
var x : float = -1;
var y : float = -1;
var chainCreated : boolean = false; 
var chainColor : Sprite; 
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
var cat1poop: Sprite;
var cat2poop: Sprite;
var cat1mad: Sprite;
var cat2mad: Sprite;
var idleAnimation: AnimationClip;

var photonView : PhotonView;

function Start () {
    Screen.SetResolution (750, 1334, false);

	//hpText = GameObject.FindWithTag("Text");
	canvas = GameObject.FindWithTag("Canvas");
	healthBar = GameObject.FindWithTag("HP").GetComponent(RectTransform); 
	enemyHP = GameObject.FindWithTag("enemyHP").GetComponent(RectTransform);
	barWidth = healthBar.rect.width;
	Debug.Log("Anchored Position: " + healthBar.anchoredPosition);
	HPx = healthBar.anchoredPosition.x;	
	HpScript = GameObject.FindWithTag("HandleHP").GetComponent(HandleHP);
	photonView = PhotonView.Get(this);
	GrayCat = Resources.Load("gray cat", Sprite);
	OrangeCat = Resources.Load("orange cat", Sprite);
	WhiteCat = Resources.Load("white cat", Sprite);
	BrownCat = Resources.Load("brown cat", Sprite);
	cat1poop = Resources.Load("cat1_4", Sprite);
	cat2poop = Resources.Load("cat2_27", Sprite);
	cat1mad = Resources.Load("cat1_1", Sprite);
	cat2mad = Resources.Load("cat2_44", Sprite);
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
			 	chainColor = hit.transform.GetComponent(SpriteRenderer).sprite;
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
				 	var selectedColor = hit.transform.GetComponent(SpriteRenderer).sprite;
				 	Debug.Log(selectedColor);
				 	if(selectedColor == chainColor){
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

			 		    DoDamage(arrayScript.numMatched);
			 			
			 			ChangeColor(arrayScript.numMatched); 
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
	for(var row = 0; row < 8; row++) {
		for(var col = 0; col < 8; col++) {
			if(TileArray[col, row].transform.GetComponent(Renderer).material.color.a == 0) {
				var tempCol = col+1; 
				while(tempCol < 8) { 
					if(TileArray[tempCol, row].transform.GetComponent(Renderer).material.color.a == 1){
						TileArray[tempCol, row].transform.GetComponent(Renderer).material.color.a = 0;
						TileArray[col, row].transform.GetComponent(SpriteRenderer).sprite = TileArray[tempCol, row].transform.GetComponent(SpriteRenderer).sprite;
						TileArray[col, row].transform.GetComponent(Renderer).material.color.a = 1;
						tempCol = 9;
					}
					else tempCol++; 
				}
				if(tempCol == 8) {
					var rand : float = Random.Range(0, 4);
	   				if( rand < 1){
	       				TileArray[col, row].transform.GetComponent(SpriteRenderer).sprite = GrayCat; 
	    			}
	    			else if( rand < 2){
	        			TileArray[col, row].transform.GetComponent(SpriteRenderer).sprite = WhiteCat; 
	    			}
	    			else if( rand < 3){
	        			TileArray[col, row].transform.GetComponent(SpriteRenderer).sprite = OrangeCat; 
	    			}
					else TileArray[col, row].transform.GetComponent(SpriteRenderer).sprite = BrownCat;
					TileArray[col, row].transform.GetComponent(Renderer).material.color.a = 1;
				}
			}
		}
	}
//	for(var i = 0; i < chainLength; i++){
//		matchedArray[i].transform.GetComponent(Renderer).material.color.a = 1;
//		
//		var rand : float = Random.Range(0, 4);
//	    if( rand < 1){
//	        matchedArray[i].transform.GetComponent(SpriteRenderer).sprite = GrayCat; 
//	    }
//	    else if( rand < 2){
//	        matchedArray[i].transform.GetComponent(SpriteRenderer).sprite = WhiteCat; 
//	    }
//	    else if( rand < 3){
//	        matchedArray[i].transform.GetComponent(SpriteRenderer).sprite = OrangeCat; 
//	    }
//		else matchedArray[i].transform.GetComponent(SpriteRenderer).sprite = BrownCat;
//	}
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
    if(damage >= 5) {
    	FlashOnDamage();
    	//cat2attack(); 
    }
}



function ConvertToX(health : float) {
	 return (HPx - (( (maxHP - health)/maxHP) * barWidth));
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
#pragma strict

var TilePrefab : GameObject;
var x : float;
var y : float;

function Start () {

}

function Update () {

}

function OnMouseDown(){
    x = gameObject.transform.position.x;
    y = gameObject.transform.position.y;
    var matchedArray : GameObject[] = GameObject.FindWithTag("BoardArray").GetComponent(CreateArray).matchedArray;
    //var numMatched : int = GameObject.FindWithTag("BoardArray").GetComponent(CreateArray).numMatched;
    //Debug.Log(numMatched);
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

    
    //Destroy(gameObject);
    //gameObject.active = false;
    
    //var colArray : int[] = GameObject.FindWithTag("BoardArray").GetComponent(CreateArray).colArray;
    //Invoke("SpawnNew", 0.25);
 
    /*if(transform.position.x >= -2.1 && transform.position.x <= -1.9){
        colArray[0]--;
    }
    else if(transform.position.x >= -1.85 && transform.position.x <= - 1.65 ){
        colArray[1]--;
    }
    else if(transform.position.x >= -1.6 && transform.position.x <= - 1.4){
        colArray[2]--;
    }
    else if (transform.position.x >= -1.35 && transform.position.x <= - 1.15){
        colArray[3]--;
    }
    else if (transform.position.x >= -1.1 && transform.position.x <= - 0.9){
        colArray[4]--;
    }
    else if (transform.position.x >= -.85 && transform.position.x <= -.65){
        colArray[5]--;
    }
    else if (transform.position.x >= -.6 && transform.position.x <= -.4){
        colArray[6]--;
    }
    else{
        colArray[7]--;
    }*/
    //Debug.Log(TileArray[2,3]);

}

function SpawnNew(){
    Debug.Log(x);
    Debug.Log(y);
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
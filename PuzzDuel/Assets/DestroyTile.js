#pragma strict

function Start () {

}

function Update () {

}

function OnMouseDown(){
    Destroy(gameObject);
    var TileArray : GameObject[,] = GameObject.FindWithTag("BoardArray").GetComponent(CreateArray).board;
    var colArray : int[] = GameObject.FindWithTag("BoardArray").GetComponent(CreateArray).colArray;
    if(transform.position.x >= -2.1 && transform.position.x <= -1.9){
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
    }
    Debug.Log(TileArray[2,3]);

}
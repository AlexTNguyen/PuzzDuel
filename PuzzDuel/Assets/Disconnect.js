#pragma strict

function Start () {
	yield WaitForSeconds (1);
	PhotonNetwork.Disconnect();
}

function Update () {

}
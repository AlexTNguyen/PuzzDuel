#pragma strict

var roomOptions : RoomOptions;

function Start () {

}

function Update () {

}

function Connect(){
		PhotonNetwork.Disconnect();
	    PhotonNetwork.ConnectUsingSettings("0.1");
}
function OnGUI() {
    GUILayout.Label(PhotonNetwork.connectionStateDetailed.ToString());
}

function OnJoinedLobby(){
    PhotonNetwork.JoinRandomRoom();
}

function OnPhotonRandomJoinFailed(){
    Debug.Log("can't join a room");
    roomOptions = new RoomOptions();
    roomOptions.maxPlayers = 2;
    PhotonNetwork.CreateRoom(null, roomOptions, TypedLobby.Default);
}

function OnJoinedRoom(){
	Debug.Log(PhotonNetwork.otherPlayers.Length);
	if(PhotonNetwork.otherPlayers.Length > 0){
		Application.LoadLevel(1);
	}
	else {
		var text : UI.Text = GameObject.FindWithTag("Start").GetComponent(UI.Text);
		text.text = "Waiting For More Players...";
	}
}
function OnPhotonPlayerConnected(newPlayer : PhotonPlayer){
	Debug.Log(PhotonNetwork.otherPlayers.Length);
	if(PhotonNetwork.otherPlayers.Length > 0){
		Application.LoadLevel(1);
	}
}

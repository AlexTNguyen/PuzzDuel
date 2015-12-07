#pragma strict

var roomOptions : RoomOptions;

function Start () {

    PhotonNetwork.ConnectUsingSettings("0.1");
}

function Update () {

}

function OnGUI() {
    GUILayout.Label(PhotonNetwork.connectionStateDetailed.ToString());
}

function OnJoinedLobby(){
    PhotonNetwork.JoinRandomRoom();
}

function OnPhotonRandomJoinFailed(){
    Debug.Log("can't join a room");
    PhotonNetwork.CreateRoom(null);
}

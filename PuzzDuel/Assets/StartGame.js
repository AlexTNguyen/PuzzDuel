#pragma strict

var ConnectScript : Connect;
var connecting : boolean = false;
function Start () {
	ConnectScript = GameObject.FindWithTag("Connect").GetComponent(Connect);
	Screen.SetResolution (750, 1334, false);
}

function Update () {

	if ( Input.GetMouseButtonDown (0)){
		if(connecting == false) { 
			ConnectScript.Connect();
			var text : UI.Text = gameObject.GetComponent(UI.Text);
			text.text = "Connecting...";
		}
		connecting = true;
	}
}

var client = null;
 
function uploadFile()
{
    //Wieder unser File Objekt
    var file = document.getElementById("file").files[0];
    //FormData Objekt erzeugen
    var formData = new FormData();
    //XMLHttpRequest Objekt erzeugen
    client = new XMLHttpRequest();
 
    //hide messages
    reset();
 
    if(!file)
        return;

    //Fügt dem formData Objekt unser File Objekt hinzu
    formData.append("file", file);
 
    client.onerror = function(e) {
        alertDanger("Error while upload");
    };
 
    client.onload = function(e) {
        document.getElementById("progress").style.width="100%";
        alertSuccess("Upload Successful");
    };
 
    client.upload.onprogress = function(e) {
        var p = Math.round(100 / e.total * e.loaded);
        document.getElementById("progress").style.width = p+"%";
    };
 
    client.onabort = function(e) {
        
    };
 
    client.open("POST", "/upload");
    client.send(formData);
}

function alertDanger(text){
    document.getElementById("alert-danger").style.display = "block";
    document.getElementById("alert-danger").innerHTML = text;
}

function alertSuccess(text){
    document.getElementById("alert-success").style.display = "block";
    document.getElementById("alert-success").innerHTML = text;
}

function reset(){
    document.getElementById("alert-success").style.display = "none";
    document.getElementById("alert-danger").style.display = "none";
    document.getElementById("progress").style.width = "0%";
}

function uploadAbort() {
    if(client instanceof XMLHttpRequest){
        //Briecht die aktuelle Übertragung ab
        client.abort();
        document.getElementById("progress").style.width = "0%";
        alertDanger("Upload Aborted");
    }
}

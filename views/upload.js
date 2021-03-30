//var b64 = "";
function previewFile() {
  const preview = document.querySelector('img');
  const file = document.querySelector('input[type=file]').files[0];
  const reader = new FileReader();

  reader.addEventListener("load", function () {
    // convert image file to base64 string
      preview.src = reader.result;
      //b64 = reader.result;
  }, false);

  if (file) {
    reader.readAsDataURL(file);
    }

    url = `http://${window.location.host}/saveImage`
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({"image":b64});

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
  //window.open(`http://${window.location.host}/detect`, __self);
  window.URL(`http://${window.location.host}/detect`, __self);
}
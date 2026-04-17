function main() {
  var start = false;
  document.getElementById("button").addEventListener("click", stop);
  document.getElementById("destination").addEventListener("click", perm)
}

export async function perm(){
  start = true;
  const arrow = document.getElementById("arrow");
  
  try {
    let permission = await DeviceOrientationEvent.requestPermission();
  } catch (error) {
    let permission = "granted";
  }

  console.log("it worked");
  var orientation = document.getElementById("compass");

  if (window.DeviceOrientationEvent && start){
    window.addEventListener('deviceorientation', function(event){
    var a = event.alpha;
    var b = event.beta;
    var g = event.gamma;

    // orientation.innerHTML="a= " + a;
    arrow.setAttribute('style', 'transform:rotate('+ a +'deg);');
    },false)
  }
}

export async function stop(){
  start = false;
  arrow.setAttribute('style', 'transform:rotate(45deg);');
}

main();
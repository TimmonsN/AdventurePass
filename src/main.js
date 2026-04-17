//variables
var start = false;
const arrow = document.getElementById("arrow");


function main() {
  document.getElementById("button").addEventListener("click", stop);
  document.getElementById("destination").addEventListener("click", perm)
}

export async function perm(){
  start = true;  
  try {
    let permission = await DeviceOrientationEvent.requestPermission();
  } catch (error) {
    let permission = "granted";
  }

  console.log("it worked");
  let orientation = document.getElementById("compass");

  if (window.DeviceOrientationEvent && start){
    window.addEventListener('deviceorientation', function(event){
    let a = event.alpha;
    let b = event.beta;
    let g = event.gamma;

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
//variables
var start = false;
const arrow = document.getElementById("arrow");

//main
function main() {
  document.getElementById("button").addEventListener("click", stop);
  document.getElementById("destination").addEventListener("click", perm);
  window.addEventListener('deviceorientation', rotate);
}

//request permissions
export async function perm(){
  start = true;
  
  let orientation = document.getElementById("compass");
  orientation.innerHTML="a= " + a;

  try {
    await DeviceOrientationEvent.requestPermission();
  } catch (error) {
    console.log("Permission error");
  }
}

//rotate arrow
export function rotate(event){
  if (window.DeviceOrientationEvent && start){
    //rotation
    let a = event.alpha;
    //roll & pitch
    let b = event.beta;
    let g = event.gamma;

    // let orientation = document.getElementById("compass");
    // orientation.innerHTML="a= " + a;

    arrow.style.transform = 'rotate('+ a +'deg);';
  }
}

//stop arrow spinning
export function stop(){
  start = false;
  arrow.style.transform = 'rotate(45deg);';

  let orientation = document.getElementById("compass");
  orientation.innerHTML = "stopped";
}

main();
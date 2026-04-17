//variables
var start = false;
const arrow = document.getElementById("arrow");
let orientation = document.getElementById("compass");

//main
function main() {
  document.getElementById("button").addEventListener("click", stop);
  document.getElementById("destination").addEventListener("click", perm);
  window.addEventListener('deviceorientation', rotate);
}

//request permissions
export async function perm(){
  start = true;

  // orientation.innerHTML = "a";

  try {
    await DeviceOrientationEvent.requestPermission();
  } catch (error) {
    console.log("Permission error");
  }

  getLocation();
}

//rotate arrow
export function rotate(event){
  if (window.DeviceOrientationEvent && start){
    //rotation
    let a = event.alpha;
    //roll & pitch
    let b = event.beta;
    let g = event.gamma;

    // orientation.innerHTML = "a= " + a;

    arrow.style.transform = 'rotate(' + a + 'deg)';
  }
}

//stop arrow spinning
export function stop(){
  start = false;
  arrow.style.transform = 'rotate(45deg)';

  // orientation.innerHTML = "stopped";
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else { 
    // orientation.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function success(position) {
  // orientation.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
}

function error() {
  alert("Sorry, no position available.");
}

main();
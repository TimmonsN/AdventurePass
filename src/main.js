//variables
var start = false;
const arrow = document.getElementById("arrow");
let orientation = document.getElementById("compass");
// let origin = {lon : 0, lat : 0};

let origin = {lat:39.964679, lon:-83.005196};

let currentPos = {lon : 0, lat : 0};
let theta = 0;
const options = {
  enableHighAccuracy: true,
  maximumAge: 0,
};

//main
function main() {
  document.getElementById("button").addEventListener("click", stop);
  document.getElementById("destination").addEventListener("click", perm);
  window.addEventListener('deviceorientation', rotate);
  watchLocation();
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

  // if (currentPos.lon !== 0) {
  //   console.log("origin captured");
  //   origin.lon = currentPos.lon;
  //   origin.lat = currentPos.lat;
  // }

  // setInterval(rotate, 100);
}

//rotate arrow
export function rotate(event){
  if (window.DeviceOrientationEvent && start){
    let head = event.webkitCompassHeading;
    let ab = event.absolute;
    //rotation
    let a = event.alpha;
    //roll & pitch
    let b = event.beta;
    let g = event.gamma;

    theta = findAngle(origin, currentPos);

    let angle = theta - head;

    arrow.style.transform = 'rotate(' + angle + 'deg)';

    orientation.innerHTML = "head= " + head + "<br>theta= " + theta + "<br>angle= " + angle;
  }
}

//stop arrow spinning
export function stop(){
  start = false;
  arrow.style.transform = 'rotate(45deg)';

  // orientation.innerHTML = "stopped";
}

//get current location stream
function watchLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(success, error, options);
  }
}
    
//location stream succes var sets
function success(position) {
  console.log("position updated");
  currentPos.lon = position.coords.longitude;
  currentPos.lat = position.coords.latitude;
}

//location stream error
function error(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      console.log("User denied the request for Geolocation.")
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("Location information is unavailable.")
      break;
    case error.TIMEOUT:
      console.log("The request to get user location timed out.")
      break;
    case error.UNKNOWN_ERROR:
      console.log("An unknown error occurred.")
      break;
  }
}

function findAngle(origin, currentPos){
  console.log("origin lon: " + origin.lon + ",  origin lat: " + origin.lat);
  console.log("location lon: " + currentPos.lon + ",  location lat: " + currentPos.lat);

  const dx = origin.lon-currentPos.lon;
  const dy = origin.lat-currentPos.lat;

  let rad = Math.atan(dy, dx);
  
  let deg = rad * (180/Math.PI);

  if (currentPos.lon - origin.lon < 0){
    deg += 180;
  }

  console.log("theta: " + deg);

  // orientation.innerHTML=("origin lon: " + origin.lon + " <br>origin lat: " + origin.lat + 
  //   "<br>location lon: " + currentPos.lon + "<br>location lat: " + currentPos.lat + "<br>theta= " + theta);
  return (deg);
}

main();
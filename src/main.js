//variables
var start = false;
const arrow = document.getElementById("arrow");
let orientation = document.getElementById("compass");
let origin = {x : 0, y : 0};
let currentPos = {x : 0, y : 0};
let theta = 0;
// originCap removed: success() now always updates currentPos, so no flag is needed
// to decide which variable to write to
const options = {
  enableHighAccuracy: true,
  // timeout removed: on Mac (and any device without a GPS chip), the 5s timeout was
  // firing an error callback after every first reading, blocking all further updates
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
  // originCap = false removed: origin is now captured directly below from currentPos,
  // not through the GPS callback

  // orientation.innerHTML = "a";

  try {
    await DeviceOrientationEvent.requestPermission();
  } catch (error) {
    console.log("Permission error");
  }

  if (currentPos.x !== 0) {
    console.log("origin captured");
    origin.x = currentPos.x;
    origin.y = currentPos.y;
  }

  setInterval(rotate, 100);
}

//rotate arrow
export function rotate(event){
  if (window.DeviceOrientationEvent && start){
    // //rotation
    // let a = event.alpha;
    // //roll & pitch
    // let b = event.beta;
    // let g = event.gamma;

    // orientation.innerHTML = "a= " + a;

    theta = findAngle(origin, currentPos);

    arrow.style.transform = 'rotate(' + theta + 'deg)';
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
  // Always update currentPos on every GPS callback.
  // Previously this had an if/else that set origin on the first call and currentPos
  // on all others — meaning currentPos was never populated until the second GPS reading,
  // which on Mac (WiFi positioning) never came.
  console.log("position updated");
  currentPos.x = position.coords.longitude;
  currentPos.y = position.coords.latitude;
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
  console.log("origin X: " + origin.x + ",  origin Y: " + origin.y);
  console.log("location X: " + currentPos.x + ",  location Y: " + currentPos.y);

  const dx = origin.x-currentPos.x;
  const dy = origin.y-currentPos.y;

  const rad = Math.atan2(dy, dx);

  const deg = rad * (180/Math.PI);
  console.log("theta: " + deg);

  orientation.innerHTML=("origin X: " + origin.x + " <br>origin Y: " + origin.y + "<br>location X: " + currentPos.x + "<br>location Y: " + currentPos.y);
  return (deg);
}

main();
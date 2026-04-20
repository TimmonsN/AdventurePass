//variables
var start = false;
const arrow = document.getElementById("arrow");
let orientation = document.getElementById("compass");
const body = document.getElementById("body");
const destination = document.getElementById("destination");
let origin = {lon : 0, lat : 0};

// let origin = {lat:39.995378, lon:-83.011820};

let currentPos = {lon : 0, lat : 0};
let theta = 0;
const options = {
  enableHighAccuracy: true,
  maximumAge: 0,
};

//main
function main() {
  document.getElementById("button").addEventListener("click", stop);
  window.addEventListener('deviceorientation', rotate);
  document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault();
    search();
  });
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
    theta = findAngle(origin, currentPos);
    let ab = event.absolute;
    if(ab){//android
      //rotation
      let a = event.alpha;
      //roll & pitch
      let b = event.beta;
      let g = event.gamma;
      let angle = theta - a;
    } else {//ios
      let head = event.webkitCompassHeading;
      let angle = theta - head;
    }
   
    arrow.style.transform = 'rotate(' + angle + 'deg)';

    madeIt(currentPos, origin);

    // orientation.innerHTML = "head= " + head + "<br>theta= " + theta + "<br>angle= " + angle;
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

  let rad = Math.atan2(dy, dx);
  
  let deg = rad * (180/Math.PI);
  deg = (90 - deg + 360) % 360;

  // if (currentPos.lon - origin.lon < 0){
  //   deg += 180;
  // }

  console.log("theta: " + deg);

  // orientation.innerHTML=("origin lon: " + origin.lon + " <br>origin lat: " + origin.lat + 
  //   "<br>location lon: " + currentPos.lon + "<br>location lat: " + currentPos.lat + "<br>theta= " + theta);
  return (deg);
}

//check if at correct location and change display if so
function madeIt(){
  let lon = (origin.lon.toFixed(5) == currentPos.lon.toFixed(5));
  let lat = (origin.lat.toFixed(5) == currentPos.lat.toFixed(5));

  let here = (lon && lat);

  if(here){
    start = false;
    body.style.background = '#6fd179';
    changeImage()
  }
}

//switches arrow to cirlce
function changeImage() {
  const circle = document.getElementById('circle');
  arrow.classList.toggle('hidden');
  circle.classList.toggle('hidden');
}

//destination setting
function search(){
  //e.preventDefault(); // Prevents page reload

  const capturedText = destination.value;

  let coords = capturedText.split(",");


  origin.lat = Number(coords[0].trim());
  origin.lon = Number(coords[1].trim());
  console.log("O lat: " + origin.lat + " |O lon: " + origin.lon);

  perm();
}

main();
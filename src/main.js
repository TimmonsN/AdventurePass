//variables
var start = false;
const arrow = document.getElementById("arrow");
let orientation = document.getElementById("compass");
const body = document.getElementById("body");
const destination = document.getElementById("destination");
let origin = {lon : 0, lat : 0};
let exited = true;

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
  // console.log("perm");
  reset();
  start = true;
  exited = false;
  changeImage("toArrow");
  // orientation.innerHTML = "a";

  try {
    await DeviceOrientationEvent.requestPermission();
  } catch (error) {
    console.log("Permission error");
  }

  // setInterval(rotate, 100);
}

//rotate arrow
export function rotate(event){
  if (window.DeviceOrientationEvent && start){
    theta = findAngle(origin, currentPos);
    let ab = event.absolute;
    let angle = 0;
    if(ab){//android - note: 'deviceorientation' almost always fires with absolute: false on Android.
      // For true north-referenced heading on Android, add a separate listener for 'deviceorientationabsolute'.
      //rotation
      let a = event.alpha;
      //roll & pitch
      let b = event.beta;
      let g = event.gamma;
      angle = theta - a;
    } else {//ios
      let head = event.webkitCompassHeading;
      angle = theta - head;
    }
   
    arrow.style.transform = 'rotate(' + angle + 'deg)';

    madeIt(currentPos, origin);

    // orientation.innerHTML = "head= " + head + "<br>theta= " + theta + "<br>angle= " + angle;
  }
}

//stop arrow spinning
export function stop(){
  start = false;
  exited = true;
  reset();
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
  // console.log("position updated");
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

//the math for the angle of the arrow (arc tan of the right triangle formed between the two coords)
function findAngle(origin, currentPos){
  // console.log("origin lon: " + origin.lon + ",  origin lat: " + origin.lat);
  // console.log("location lon: " + currentPos.lon + ",  location lat: " + currentPos.lat);

  const dx = origin.lon-currentPos.lon;
  const dy = origin.lat-currentPos.lat;

  let rad = Math.atan2(dy, dx);
  
  let deg = rad * (180/Math.PI);
  deg = (90 - deg + 360) % 360;

  // console.log("theta: " + deg);

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
    changeImage("toCirlce");
  }
}

//switches arrow to cirlce
function changeImage(which) {
  // console.log("change image");
  const circle = document.getElementById('circle');
  switch (which) {
    case "toArrow":
      arrow.classList.remove('hidden');
      circle.classList.add('hidden');
      break;
    case "toCirlce":
      arrow.classList.add('hidden');
      circle.classList.remove('hidden');
      break;
    default:
      console.log("Error Switching Images");
  }
}

//destination setting
function search(){
  //e.preventDefault(); // Prevents page reload
  if(exited){
    const capturedText = destination.value;
    let flipLon = 1;
    let flipLat = 1;

    let coords = capturedText.split(",");

    if(coords[1].includes('W') || coords[1].includes('w')){
      flipLon = -1;
    }
    if(coords[0].includes('S') || coords[0].includes('s')){
      flipLat = -1;
    }

    let regex = /([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[Ee]([+-]?\d+))?/i;
    let inLat = coords[0].match(regex);
    let inLon = coords[1].match(regex);


    origin.lat = Number(inLat[0]) * flipLat;
    origin.lon = Number(inLon[0]) * flipLon;
    console.log("O lat: " + origin.lat + " |O lon: " + origin.lon);

    perm();
  }
}

//reset screen
function reset(){
  // console.log("reset");
  body.style.background = '#2d2f2d';
  changeImage("toCirlce");
}

main();
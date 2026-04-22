// FUTURE TO-DOS
// madeIt() arrival zone isnt radius?
// Android, add deviceorientationabsolute event listener 
// Dropdown tap outside dismissal
// pressing Enter does nothing if exited=false, should behave same as clicking a suggestion

//variables
let start = false;
const arrow = document.getElementById("arrow");
let orientation = document.getElementById("compass");
const body = document.getElementById("body");
const destination = document.getElementById("destination");
let origin = {lon : 0, lat : 0};
let exited = true;
let timer;
let suggestions = [];
let fetchController = null;

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
  destination.addEventListener('input', () => {clearTimeout(timer); timer = setTimeout(() => {api(destination.value);}, 200)});
  watchLocation();
}

//sends user input off to api for autocomplete
function api(input){
  if(!input.trim()) return; // don't fire on empty input
  if(input.trim().length < 3) return; //dont fire on less than 3 chars
  if(fetchController) fetchController.abort(); // cancel any previous in-flight fetch
  fetchController = new AbortController();
  fetch("https://api.geoapify.com/v1/geocode/autocomplete?text=" + encodeURIComponent(input) + "&apiKey=7e89b21189e34400aeec411151299ea8&limit=5", { signal: fetchController.signal })
    .then(response => response.json())
    .then(result => {
      suggestions = result.features;
      renderDropdown(suggestions);
    })
    .catch(error => {
      if(error.name !== 'AbortError') console.log('error', error); // ignore intentional cancellations
    });
}

// builds dropdown items from api results
function renderDropdown(features){
  const dropdown = document.getElementById('dropdown');
  dropdown.innerHTML = '';
  features.forEach((feature) => {
    let item = document.createElement('div');
    item.textContent = feature.properties.formatted;
    item.addEventListener('click', () => select(feature));
    dropdown.appendChild(item);
  });
}

// sets origin from a selected feature and starts navigation
function select(feature){
  if(fetchController) fetchController.abort();
  origin.lat = feature.properties.lat;
  origin.lon = feature.properties.lon;
  destination.value = feature.properties.formatted;
  clearTimeout(timer);
  suggestions = [];
  document.getElementById('dropdown').innerHTML = '';
  destination.blur();
  perm();
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

    madeIt();

    // orientation.innerHTML = "head= " + head + "<br>theta= " + theta + "<br>angle= " + angle;
  }
}

//stop arrow spinning
export function stop(){
  start = false;
  exited = true;
  destination.value = '';
  suggestions = [];
  document.getElementById('dropdown').innerHTML = '';
  reset();
  destination.value = "";
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
  // decimal places|decimal degrees|DMS|Object that can be unambiguously recognized at this scale|N/S or E/W at equator
  // 0	1.0	1° 00′ 0″	country or large region	111 km
  // 1	0.1	0° 06′ 0″	large city or district	11.1
  // 2	0.01	0° 00′ 36″	town or village	1.11 km
  // 3	0.001	0° 00′ 3.6″	neighborhood, street	111 m
  // 4	0.0001	0° 00′ 0.36″	individual street, large buildings	11.1 m
  // 5	0.00001	0° 00′ 0.036″	individual trees, houses	1.11 m
  // 6	0.000001	0° 00′ 0.0036″	individual humans	111 mm
  // 7	0.0000001	0° 00′ 0.00036″	practical limit of commercial surveying	11.1 mm
  // 8	0.00000001	0° 00′ 0.000036″	specialized surveying	1.11 mm
  
  let percision = 4; //after testing 4 seems best

  let lon = (origin.lon.toFixed(percision) == currentPos.lon.toFixed(percision));
  let lat = (origin.lat.toFixed(percision) == currentPos.lat.toFixed(percision));

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

//destination setting — selects top suggestion on Enter
function search(){
  if(exited && suggestions.length > 0){
    select(suggestions[0]);
  }
}

//reset screen
function reset(){
  // console.log("reset");
  body.style.background = '#2d2f2d';
  changeImage("toCirlce");
}

main();
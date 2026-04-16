function main() {
    console.log("Hello World");
}
function init(){
  console.log("it worked");
  var orientation = document.getElementById("compass");
  
  if (window.DeviceOrientationEvent){
    window.addEventListener('deviceorientation', function(event){
      var a = event.alpha;
      var b = event.beta;
      var g = event.gamma;

      orientation.innerhtml="a= " + a + "b= " + b + "g= " + g;
    },false)
  }
}
main();
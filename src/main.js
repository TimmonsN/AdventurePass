function main() {
    console.log("Hello World");
}
async function init(){
  console.log("it worked");
  var orientation = document.getElementById("compass");
  var test = document.getElementById("test")
  test.innerHTML="bye"
  
  try {
    permission = await DeviceOrientationEvent.requestPermission();
  } catch (error) {
    permission = "granted";
  }

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
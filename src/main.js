function main() {
  document.getElementById("button").addEventListener("click", perm);
}

export async function perm(){
  const arrow = document.getElementById("arrow");
  
  try {
    let permission = await DeviceOrientationEvent.requestPermission();
  } catch (error) {
    let permission = "granted";
  }

  console.log("it worked");
  var orientation = document.getElementById("compass");

  if (window.DeviceOrientationEvent){
    window.addEventListener('deviceorientation', function(event){
    var a = event.alpha;
    var b = event.beta;
    var g = event.gamma;

<<<<<<< Updated upstream
    orientation.innerHTML="a= " + a;
    arrow.setAttribute('style', 'transform:rotate('+ a +'deg);');
    },false)
  }
}

=======
    arrow.style.transform = 'rotate(' + a + 'deg)'
  }
}

//stop arrow spinning
export function stop(){
  start = false;
  arrow.style.transform = 'rotate(45deg)';

  orientation.innerHTML = "stopped";
}

>>>>>>> Stashed changes
main();
const n = 25;
const arr = [];
const container = document.getElementById("container");

init();

let audioCtx=null;

function playNote(freq){
    if(audioCtx==null){
        audioCtx=new(
            AudioContext||
            webkitAudioContext ||
            window.webkitAudioContext
        )();
    }
    const dur=0.1;
    const osc=audioCtx.createOscillator();
    osc.frequency.value=freq;
    osc.start();
    osc.stop(audioCtx.currentTime+dur);
    const node=audioCtx.createGain();
    node.gain.value=0.1;
    node.gain.linearRampToValueAtTime(
        0, audioCtx.currentTime+dur
    );
    osc.connect(node);
    osc.connect(audioCtx.destination);

}

// function to initialize a random array
function init() {
  for (let i = 0; i < n; i++) {
    arr[i] = Math.random();
  }
  showBars();
}

// function to start sorting
function play() {
  const copy = [...arr];
  const moves = bubbleSort(copy);
  animate(moves);
}

// animation function
function animate(moves) {
  if (moves.length === 0) {
    showBars();
    return;
  }
  const move = moves.shift();
  const [i, j] = move.indices;

  if (move.type === "swap") {
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  playNote(200+arr[i]*500);
  playNote(200+arr[j]*500);

  showBars(move);
  setTimeout(function () {
    animate(moves);
  }, 100);
}

// sorting function
function bubbleSort(arr) 
{
  const moves = [];
  let swapped;
  do {
    swapped = false;
    for (let i = 1; i < arr.length; i++) {
      //moves.push({ indices: [i - 1, i], type: "comp" });
      // Start from 1
      if (arr[i - 1] > arr[i]) {
        swapped = true;
        moves.push({ indices: [i - 1, i], type: "swap" });
        [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
      }
    }
  } while (swapped);
  return moves;
}

// function for creating bars of length of array size*100
function showBars(move) {
  container.innerHTML = "";
  for (let i = 0; i < arr.length; i++) {
    const bar = document.createElement("div");
    bar.style.height = arr[i] * 100 + "%";
    bar.classList.add("bar");

    if (move && move.indices.includes(i)) {
      bar.style.backgroundColor = move.type === "swap" ? "red" : "blue";
    }
    container.appendChild(bar);
  }
}

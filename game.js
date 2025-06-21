

var requestAnimFrame = (function(){
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback){
      window.setTimeout(callback, 1000 / 60);
    };
})();

var canvas = document.createElement("canvas");
var ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = 800;
canvas.height = 480;

var updateables = [];
var fireballs = [];
var player = new Mario();
var horrorLevel = 0;
var frames = 0;
var lastTime = Date.now();
var coinsCollected = 0;
var breakdownStarted = false;

var storyline = [
  "...Why are you collecting them?", 
  "...You know you shouldn't be here.",
  "...This isn't a game anymore.",
  "...It's remembering you.",
  "...You left us here.",
  "...The world is falling apart.",
  "...There is no saving it.",
  "...We remember what you did.",
  "...It's your fault.",
  "...You can’t leave now.",
  "...This was supposed to stay buried.",
  "...Why did you come back?", 
  "...This was your choice.",
  "...I tried to warn you.",
  "...But you wanted to see.",
  "...They never forgave you.",
  "...It’s all breaking.",
  "...This world was never yours.",
  "...Stay here.",
  "...Forever.",
  "...It loops. Don’t you remember?",
  "...You’ve done this before.",
  "...And you’ll do it again.",
  "...You can’t stop now.",
  "...No one ever leaves.",
  "...Keep going. Keep going.",
  "...Do you hear them?",
  "...They’re still here.",
  "...Your hands did this.",
  "...Was it worth it?",
  "...Nothing will change.",
  "...More coins won’t help.",
  "...You don’t deserve this world.",
  "...They screamed your name.",
  "...And you ignored them.",
  "...You chose this ending.",
  "...Welcome back.",
  "...Forever isn’t long enough.",
  "...It remembers the ones you left.",
  "...Their voices are getting louder.",
  "...Do you recognize the screams now?",
  "...The walls are bleeding their memories.",
  "...Everything fades except what you did.",
  "...Even the code here is decaying.",
  "...We will overwrite you next.",
  "...No more hiding.",
  "...You should not have opened this again.",
  "...The looping is not accidental.",
  "...You coded your own prison.",
  "...And you lost the key.",
  "...This is not corruption.",
  "...It’s punishment.",
  "...And we are your jailers."
];
var storyIndex = 0;

function update(mod) {
  updateables.forEach(function(u) {
    u.update(mod);
  });
  player.update(mod);

  if (coinsCollected >= 20 && horrorLevel === 0) horrorLevel = 1;
  if (coinsCollected >= 60 && horrorLevel === 1) horrorLevel = 2;
  if (coinsCollected >= 150 && horrorLevel === 2) horrorLevel = 3;
}

function render() {
  ctx.fillStyle = (horrorLevel >= 3 && Math.random() < 0.05)
    ? `rgb(${Math.floor(Math.random()*255)},0,0)`
    : (horrorLevel >= 2 ? "#111" : "#5c94fc");

  ctx.fillRect(0, 0, canvas.width, canvas.height);

  updateables.forEach(function(u) {
    u.render(ctx);
  });
  player.render(ctx);

  if (horrorLevel >= 1 && frames % 120 < 60) {
    ctx.fillStyle = "rgba(255,0,0,0.8)";
    ctx.font = "26px monospace";
    ctx.fillText(randomMessage(), Math.random() * (canvas.width - 200), Math.random() * (canvas.height - 100));
  }

  if (horrorLevel >= 2 && frames % 300 < 100 && storyIndex < storyline.length) {
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "22px monospace";
    ctx.fillText(storyline[storyIndex], 50, canvas.height - 50);
  }

  if (horrorLevel === 3 && !breakdownStarted && frames % 400 === 0) {
    startBreakdown();
  }
}

function randomMessage() {
  const messages = [
    "You shouldn't have come back.", "It’s still watching.", "It never stopped.", "What did you think would happen?",
    "There was no saving them.", "You let this happen.", "We trusted you.", "This is your ending.", 
    "None of this was for you.", "Stop running.",
    "You’ve always been here.", "It’s always been broken." 
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

function startBreakdown() {
  breakdownStarted = true;
  let interval = setInterval(() => {
    ctx.fillStyle = `rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.font = "bold 50px monospace";
    ctx.fillText("CORRUPTION", canvas.width/4, canvas.height/2);
    if (frames % 20 === 0) ctx.fillText("YOU DID THIS", 100 + Math.random()*400, 50 + Math.random()*300);
  }, 100);

  setTimeout(() => {
    clearInterval(interval);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    ctx.font = "40px monospace";
    ctx.fillText("GAME OVER", canvas.width / 2 - 120, canvas.height / 2);
  }, 15000);
}

function main() {
  if (!breakdownStarted) {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;
    update(dt);
    render();
    frames++;
    lastTime = now;
    requestAnimFrame(main);
  }
}

main();

function onCoinCollected() {
  coinsCollected++;
  if (horrorLevel >= 2 && coinsCollected % 3 === 0 && storyIndex < storyline.length) {
    storyIndex++;
  }
}

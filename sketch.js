var Electrofast, ElectrofastRunImg, ElectrofastStandRightImg, ElectrofastStandLeftImg ,ElectrofastJumpImg, ElectrofastRunLeftImg
var ElectrofastLastDirection = "right"
var Gadgetack, GadgetackRunImg, GadgetackStandRightImg, GadgetackStandLeftImg ,GadgetackJumpImg, GadgetackRunLeftImg
var GadgetackLastDirection = "right"
var ground, platformImg, leftWall, rightWall, wallImg, middlePlatform
var lightning, lightningImg, lightningGroup
var drones, dronesImg, dronesGroup
var bomb, bombImg
var gameOver = false
var p1score = 0
var p2score = 0
var lives = 3
var edges
var gameSpeed
var timeMarker = 0

function preload() {
  // This creates ElectroFast's in-game animations. It's pretty long!
  ElectrofastRunImg = loadAnimation("Images/ElectroFast1_jumpRight.svg", "Images/ElectroFast2Right.svg",
  "Images/ElectroFast3Right.svg", "Images/ElectroFast4Right.svg","Images/ElectroFast1_jumpRight.svg","Images/ElectroFast2Right.svg",
  "Images/ElectroFast4Right.svg")
  ElectrofastRunLeftImg = loadAnimation("Images/ElectroFast4Left.svg", "Images/ElectroFast3Left.svg", "Images/ElectroFast2Left.svg",
  "Images/ElectroFast1_jumpLeft.svg", "Images/ElectroFast4Left.svg","Images/ElectroFast3Left.svg","Images/ElectroFast2Left.svg")
  ElectrofastStandRightImg=loadImage('Images/ElectroFast5_standRight.svg')
  ElectrofastStandLeftImg=loadImage('Images/ElectroFast5_standLeft.svg')
  ElectrofastJumpImg=loadImage('Images/ElectroFast1_jumpLeft.svg')

  // This creates Gadgetack's in-game animations. It's pretty long!
  GadgetackRunImg = loadAnimation("Images/Gadgetack_jumpRight.svg", "Images/Gadgetack2Right.svg",
  "Images/Gadgetack3Right.svg", "Images/Gadgetack4Right.svg","Images/Gadgetack_jumpRight.svg","Images/Gadgetack2Right.svg",
  "Images/Gadgetack4Right.svg")
  GadgetackRunLeftImg = loadAnimation("Images/Gadgetack4Left.svg", "Images/Gadgetack3Left.svg", "Images/Gadgetack2Left.svg",
  "Images/Gadgetack_jumpLeft.svg", "Images/Gadgetack4Left.svg","Images/Gadgetack3Left.svg","Images/Gadgetack2Left.svg")
  GadgetackStandRightImg=loadImage('Images/Gadgetack5_standRight.svg')
  GadgetackStandLeftImg=loadImage('Images/Gadgetack5_standLeft.svg')
  GadgetackJumpImg=loadImage('Images/Gadgetack_jumpLeft.svg')

  // The platforms images:
  platformImg = loadImage("Images/Ground_Platform.png")
  wallImg = loadImage("Images/Walls.png")

  //Image for the gimmicks:
  dronesImg=loadImage('Images/Drone.png')
  bombImg=loadImage('Images/Golden Bomb.png')
  lightningImg=loadImage('Images/Lightning.png')
}

function setup() {
  createCanvas(1400, 700)
  edges = createEdgeSprites()

  // The code below forms ElectroFast's size, picture and animation.
  Electrofast = createSprite(700,50,20,20)
  Electrofast.addImage('standright',ElectrofastStandRightImg)
  Electrofast.addImage('standleft',ElectrofastStandLeftImg)
  Electrofast.addAnimation("run",ElectrofastRunImg)
  Electrofast.addImage('Boing!!!',ElectrofastJumpImg)
  Electrofast.addAnimation('left',ElectrofastRunLeftImg)
  Electrofast.scale = 0.32

  Gadgetack = createSprite(700,50,20,20)
  Gadgetack.addImage('standright',GadgetackStandRightImg)
  Gadgetack.addImage('standleft',GadgetackStandLeftImg)
  Gadgetack.addAnimation("run",GadgetackRunImg)
  Gadgetack.addImage('Boing!!!',GadgetackJumpImg)
  Gadgetack.addAnimation('left',GadgetackRunLeftImg)
  Gadgetack.scale = 0.32

  // The walls and the platforms ElectroFast stands on:
  ground = createSprite(700, 670)
  ground.addImage(platformImg)
  ground.scale = 1.5

  leftWall = createSprite(30, 350)
  leftWall.addImage(wallImg)

  rightWall = createSprite(1370, 350)
  rightWall.addImage(wallImg)

  middlePlatform = createSprite(700, 430)
  middlePlatform.addImage(platformImg)
  middlePlatform.scale =0.5

  //Groups for the gimmicks:
  dronesGroup=createGroup()
  lightningGroup=createGroup()
  bombGroup=createGroup()

  //THE BOMB😱😱😱:
  bomb=createSprite(140,550)
  bomb.addImage(bombImg)
  bomb.scale=0.5
  bomb.setCollider("circle",0,27,78)
  bombGroup.add(bomb)
}

function draw() { 
  background("cyan")

  if(!gameOver){
    gameSpeed=1+((p1score+p2score)/10)

    drawSprites()

    // Displays the score and lives.
    textSize(30)
    stroke("blue")
    strokeWeight(7)
    text("P1 Score: "+p1score, 250,30)

    textSize(30)
    stroke("green")
    strokeWeight(7)
    text("P2 Score: "+p2score, 550,30)

    //stroke("green")
    //text("Lives: "+lives, 10,30)

    // Subtracts lives where necessary.
    if(Electrofast.isTouching(dronesGroup)||Gadgetack.isTouching(dronesGroup)) {
      lives--
    }

    // These functions control some of the game's fundementals, such as controls, the drones and the lightning bolts.
    ElectroFastControlsAndPhysics()
    GadgetackControlsAndPhysics()
    //buildDrones()
    //lightningControl()
    createBombs()

    //console.log("timeMarker: ",timeMarker," time left: ",frameCount-timeMarker)

    if(frameCount-timeMarker>130/gameSpeed){
      gameOver=true
    }

    // This checks if the game has ended.
    if(lives==0||p1score>29||p2score>29){
      gameOver=true
    }

  } else {
    // This displays the game-over message.
    background("red")

    stroke("pink")
    strokeWeight(20)
    textSize(100)
    text("Game Over!", width/2, height/2)
    if(p1score>p2score){
      text("P1 wins!", width/2, 500)
    } else if(p1score<p2score) {
      text("P2 wins!", width/2, 500)
    } else {
      text("Tie! 😭😭😭", width/2, 500)
    }
  }
}

// This controls Electrofast's movement, jumping, falling and animation changes.
function ElectroFastControlsAndPhysics(){
  Electrofast.velocityY+=1
  Electrofast.collide(ground)
  Electrofast.collide(middlePlatform)
  // Jumping on the middle platform.
  if(keyDown("UP_ARROW")&&Electrofast.y>380&&Electrofast.y<385&&Electrofast.x>400&&Electrofast.x<1100) {
    Electrofast.velocityY=-20
  }

 // Jumping on the bottom platform.
  if(keyDown("UP_ARROW")&&Electrofast.y>580&&Electrofast.y<585) {
  Electrofast.velocityY=-20
  }

  if(keyDown("RIGHT_ARROW")&&!Electrofast.isTouching(rightWall)&&!Electrofast.isTouching(middlePlatform)) {
    Electrofast.x+=10*gameSpeed
    Electrofast.changeAnimation('run')
    ElectrofastLastDirection = "right"
  }

  if(keyDown("LEFT_ARROW")&&!Electrofast.isTouching(leftWall)&&!Electrofast.isTouching(middlePlatform)) {
    Electrofast.x-=10*gameSpeed
    Electrofast.changeAnimation('left')
    //ElectrofastLastDirection = "left"
  }

  if(!keyDown("RIGHT_ARROW")&&!keyDown("LEFT_ARROW")) {
    if(ElectrofastLastDirection=="right"){
      Electrofast.changeImage("standright")
    } else {
      Electrofast.changeAnimation("standleft")
    }
  }
}

// This controls Gadgetack's movement, jumping, falling and animation changes.
function GadgetackControlsAndPhysics(){
  Gadgetack.velocityY+=1
  Gadgetack.collide(ground)
  Gadgetack.collide(middlePlatform)

  // Jumping on the middle platform.
  if(keyDown("W")&&Gadgetack.y>380&&Gadgetack.y<385&&Gadgetack.x>400&&Gadgetack.x<1100) {
    Gadgetack.velocityY=-20
  }

 // Jumping on the bottom platform.
  if(keyDown("w")&&Gadgetack.y>580&&Gadgetack.y<585) {
  Gadgetack.velocityY=-20
  }

  if(keyDown("D")&&!Gadgetack.isTouching(rightWall)&&!Gadgetack.isTouching(middlePlatform)) {
    Gadgetack.x+=10*gameSpeed
    Gadgetack.changeAnimation('run')
    GadgetackLastDirection = "right"
  }

  if(keyDown("A")&&!Gadgetack.isTouching(leftWall)&&!Gadgetack.isTouching(middlePlatform)) {
    Gadgetack.x-=10*gameSpeed
    Gadgetack.changeAnimation('left')
    GadgetackLastDirection = "left"
  }

  if(!keyDown("D")&&!keyDown("A")) {
    if(GadgetackLastDirection=="right"){
      Gadgetack.changeImage("standright")
    } else {
      Gadgetack.changeAnimation("standleft")
    }
  }
}

// This creates the drones.
function buildDrones(){
  if(frameCount%70==0){
    drones=createSprite(random(350,width),30,)
    drones.addImage(dronesImg)
    drones.scale=0.17
    drones.velocityX=-7
    drones.velocityY=+7
    //drones.setCollider("rectangle",0,0,400,300)
    dronesGroup.add(drones)
    } 

    dronesGroup.bounceOff(leftWall)
    dronesGroup.bounceOff(rightWall)
    dronesGroup.bounceOff(ground)
    dronesGroup.bounceOff(middlePlatform)
    dronesGroup.bounceOff(edges)

    if(dronesGroup.isTouching(lightningGroup)){
      dronesGroup[0].destroy()
      score++
    }

    if(dronesGroup.isTouching(bomb)){
      dronesGroup[0].destroy()
    }

    if(dronesGroup.isTouching(Electrofast)){
      dronesGroup[0].destroy()
    }
}

function lightningControl() {
  if(keyDown("DOWN_ARROW")||keyDown("SPACE")) {
    lightning = createSprite(Electrofast.x,Electrofast.y)
    lightning.addImage(lightningImg)
    lightning.velocityX = 12
    lightning.lifetime = 50
    lightning.scale = 0.5
    lightningGroup.add(lightning)
  }
}

function createBombs() {
  if(bombGroup.isTouching(Electrofast)){
    console.log("success")
    p1score++
    bombGroup[0].destroy()
    bomb=createSprite(random(350,width-100),550)
    bomb.addImage(bombImg)
    bomb.scale=0.5
    bomb.setCollider("circle",0,27,78)
    bombGroup.add(bomb)
    timeMarker = frameCount
  }

  if(bombGroup.isTouching(Gadgetack)){
    console.log("success")
    p2score++
    bombGroup[0].destroy()
    bomb=createSprite(random(350,width-100),550)
    bomb.addImage(bombImg)
    bomb.scale=0.5
    bomb.setCollider("circle",0,27,78)
    bombGroup.add(bomb)
    timeMarker = frameCount
  }
}
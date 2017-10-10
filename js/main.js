var stage;
var container;
var planet;
var planetRadius = 100;
var water;
var crust;
var clouds;
var plusKey = false;
var minusKey = false;
var upKey = false;
var downKey = false;
var leftKey = false;
var rightKey = false;
var shiftKey = false;
var selectUpKey = false;
var selectDownKey = false;
var selectLeftKey = false;
var selectRightKey = false;
var rotateLeftKey = false;
var rotateRightKey = false;
function debug() {
    debugger;
}

function init() {
    var canvas = document.getElementsByTagName('canvas')[0];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', resize, false);

    stage = new createjs.Stage("canvas");
    container = new createjs.Container();
    container.regX = window.innerWidth / 2;
    container.regY = window.innerHeight / 2;
    container.x = window.innerWidth / 2;
    container.y = window.innerHeight / 2;


    stage.addChild(container);
    planet = new createjs.Shape();
    planet.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, planetRadius);
    planet.x = window.innerWidth / 2;
    planet.y = window.innerHeight / 2;
    container.addChild(planet);
    addWater();
    generateTerrain();
    addClouds();

    stage.update();

    createjs.Ticker.framerate = 60;
    createjs.Ticker.on("tick", function (e) {
        update(e);
    });

}

function addWater() {
    water = new createjs.Shape();
    water.graphics.beginFill("blue").drawCircle(0, 0, planetRadius + 50);
    water.alpha = .5;
    water.x = window.innerWidth / 2;
    water.y = window.innerHeight / 2;
    container.addChild(water);
}

function generateTerrain() {
    var totalMountains = 0;
    var totalOceans = 0;
    var mountainFreq = 10;//gets less likely the higher this gets
    var mountainHeight = 20;
    var oceanFreq = 10;
    var oceanWidth = 2;
    var oceanDepth = 20;
    var oceanCounter = 0;//oceans can be multiple sides wide, so we need a counter
    var points = 30;
    crust = new createjs.Shape();
    crust.graphics.beginFill("#6d380f");
    for (var i = 0; i < points; i++) {
        var offset = 50;
        var variance = 30;
        var finalOffset = offset + (Math.random() * variance);
        if ((Math.random() * oceanFreq) <= 1 && oceanCounter <= 0) {
            oceanCounter = 3;
            while ((Math.random() * oceanFreq) <= 1)
                oceanCounter++;
        }
        else if ((Math.random() * mountainFreq) <= 1) {
            finalOffset += mountainHeight * (Math.random() * 2);
            totalMountains++;
        }

        //applies an ocean if needed
        if (oceanCounter > 0) {
            finalOffset -= oceanDepth;
            oceanCounter--;
            totalOceans++;
        }
        var x = planet.x + (planetRadius + finalOffset) * Math.sin(toRadians((360 / points) * i));
        var y = planet.y + (planetRadius + finalOffset) * Math.cos(toRadians((360 / points) * i));
        crust.graphics.lineTo(x, y);
    }
    crust.graphics.closePath();
    container.addChild(crust);
}

function addClouds() {
    clouds = new createjs.Shape();
    clouds.graphics.beginFill("white").drawCircle(0, 0, planetRadius + 150);
    clouds.alpha = .3;
    clouds.x = window.innerWidth / 2;
    clouds.y = window.innerHeight / 2;
    var blurFilter = new createjs.BlurFilter(50, 50, 1);
    clouds.filters = [blurFilter];
    var bounds = blurFilter.getBounds();
    clouds.cache(-200 + bounds.x, -200 + bounds.y, 400 + bounds.width, 400 + bounds.height);
    container.addChild(clouds);
}

function toRadians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}

function resize() {
    var canvas = document.getElementsByTagName('canvas')[0];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
function update(e) {
    //run everything in here!
    if (!e.paused) {

        if (plusKey && container.scaleX < 20) {

            var holder = container.rotation;
            container.rotation = 0;
            var pointbefore = getCenter();
            container.scaleX += .03 + (container.scaleX / 20);
            container.scaleY += .03 + (container.scaleY / 20);
            stage.update();
            var pointafter = getCenter();

            var pointdiffX = pointafter.x - pointbefore.x;
            var pointdiffY = pointafter.y - pointbefore.y;
            container.x += (pointdiffX * container.scaleX);
            container.y += (pointdiffY * container.scaleY);
            stage.update();
            container.rotation = holder;
        }
        if (minusKey && container.scaleX > .6) {

            var holder = container.rotation;
            container.rotation = 0;

            var pointbefore = getCenter();
            container.scaleX += -.03 - (container.scaleX / 20);
            container.scaleY += -.03 - (container.scaleY / 20);
            stage.update();
            var pointafter = getCenter();

            var pointdiffX = pointafter.x - pointbefore.x;
            var pointdiffY = pointafter.y - pointbefore.y;
            container.x += pointdiffX * container.scaleX;
            container.y += pointdiffY * container.scaleY;
            stage.update();
            container.rotation = holder;
        }

        var movement = shiftKey ? 2 : 1;
        for (var i = 0; i < movement; i++) {
            if (downKey) {
                container.y += -5 - (container.scaleX / 5);
            }
            else if (upKey)
                container.y += 5 + (container.scaleX / 5);
            if (rightKey)
                container.x += -5 - (container.scaleX / 5);
            else if (leftKey)
                container.x += 5 + (container.scaleX / 5);
        }
        clouds.alpha = .3;
        if (container.scaleX > 3.5) {
            clouds.alpha -= (container.scaleX / 25);
        }

        if (!plusKey && !minusKey) {
            if (rotateLeftKey) {
                container.rotation -= 1;
            } else if (rotateRightKey) {
                container.rotation += 1;
            }
        }
        stage.update();
    }
}

function getCenter() {
    return container.globalToLocal(window.innerWidth / 2, window.innerHeight / 2);
}

window.onkeyup = function (e) {
    var key = e.keyCode ? e.keyCode : e.which;

    switch (key) {
        case (72):
            container.scaleX = 1;
            container.scaleY = 1;
            container.x = container.regX;
            container.y = container.regY;
            break;
        case (32):
            debug();
            break;
        case (187):
            plusKey = false;
            break;
        case (189):
            minusKey = false;
            break;
        case (87):
            upKey = false;
            break;
        case (83):
            downKey = false;
            break;
        case (65):
            leftKey = false;
            break;
        case (68):
            rightKey = false;
            break;
        case (16):
            shiftKey = false;
            break;
        case (90):
            rotateLeftKey = false;
            break;
        case (88):
            rotateRightKey = false;
            break;
    }
}
window.onkeydown = function (e) {
    var key = e.keyCode ? e.keyCode : e.which;

    switch (key) {
        case (187):
            plusKey = true;
            break;
        case (189):
            minusKey = true;
            break;
        case (87):
            upKey = true;
            break;
        case (83):
            downKey = true;
            break;
        case (65):
            leftKey = true;
            break;
        case (68):
            rightKey = true;
            break;
        case (16):
            shiftKey = true;
            break;
        case (90):
            rotateLeftKey = true;
            break;
        case (88):
            rotateRightKey = true;
            break;
    }
}
function zoomIn() {
    scale += .5;
}
function zoomOut() {
    scale -= .5;
}
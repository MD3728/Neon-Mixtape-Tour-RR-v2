/* Graphics Setup File (Includes pointBox) */

// Developer Shortcut Methods
function rich() {
  sun = 99999;
  money = 99999;
  for (currentPacket of allPackets) {
    currentPacket.recharge = 0;
  }
  for (currentZombie of allZombies) {
    currentZombie.health = 0;
  }
}

function devMode() {
  money = 20000;
  unlockedLevels = ["l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8", "l9", "l10",
  "l11", "l12", "l13", "l14", "l15", "l16", "l17", "l18", "l19", "l20",
  "l21", "l22", "l23", "l24", "l25", "l26", "l27", "l28", "l29", "l30",
  "l31", "l32", "l33", "l34", "l35", "l36", "m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9", "m10", "m11", "m12", "m13"];
  for (let a = 0; a < 50; a++) {
    unlockedPackets.push(a);
  }
}

// Collision Shortcut
function pointBox(pointX, pointY, boxX, boxY, boxWidth, boxHeight) {
  if ((pointX > boxX) && (pointX < boxX + boxWidth) && (pointY > boxY) && (pointY < boxY + boxHeight)) {
    return true;
  } else {
    return false;
  }
}

// Graphics Setup
function setupLayer(layer) {
  layer.angleMode(DEGREES)
  layer.textAlign(CENTER, CENTER)
  layer.rectMode(CENTER)
  layer.colorMode(RGB, 255, 255, 255, 1)
}

function setupGraphics() {
  for (let a = 0; a < 7; a++) {
    graphics.minor.push(createGraphics(120, 120))
    setupLayer(graphics.minor[a])
    graphics.minor[a].translate(60, 60)
    graphics.minor[a].rotate(a * 360 / 7)
    graphics.minor[a].noStroke()
    graphics.minor[a].fill(236, 130, 138)
    for (let b = 0; b < 5; b++) {
      graphics.minor[a].rotate(72)
      graphics.minor[a].beginShape()
      graphics.minor[a].vertex(0, 0)
      graphics.minor[a].bezierVertex(-14, -14, -14, -28, 0, -42)
      graphics.minor[a].bezierVertex(14, -28, 14, -14, 0, 0)
      graphics.minor[a].endShape()
    }
    graphics.minor[a].fill(213, 88, 102)
    for (let b = 0; b < 5; b++) {
      graphics.minor[a].rotate(72);
      graphics.minor[a].beginShape();
      graphics.minor[a].vertex(0, 0);
      graphics.minor[a].bezierVertex(-7, -10, -7, -20, 0, -30);
      graphics.minor[a].bezierVertex(7, -20, 7, -10, 0, 0);
      graphics.minor[a].endShape();
    }
    graphics.minor[a].fill(255, 161, 161);
    graphics.minor[a].ellipse(0, 0, 4, 4);
  }
  graphics.minor.push(createGraphics(200, 200));
  setupLayer(graphics.minor[7]);
  graphics.minor[7].translate(100, 100);
  graphics.minor[7].noStroke();
  for (let a = 9; a >= 0; a--) {
    for (let b = 0; b < 24; b++) {
      graphics.minor[7].fill(random(200, 260), this.fade);
      graphics.minor[7].arc(0, 0, a * 10 + 10, a * 10 + 10, b * 15, b * 15 + 15);
    }
  }
  // Fog 1 time creation
  graphics.minor.push(createGraphics(800, 600));
  setupLayer(graphics.minor[8]);
  graphics.minor[8].fill(160, 0.8);
  graphics.minor[8].noStroke();
  for (let a = 0; a < 7; a++) {
    for (let b = 0; b < 7; b++) {
      graphics.minor[8].ellipse(a * 60 + random(120, 140), b * 60 + random(120, 140), random(120, 150));
    }
  }
}


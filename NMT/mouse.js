
//Mouse down
document.addEventListener("mousedown",function(e){
  switch (screen){
    case "chooseSeeds"://Choose Your Seeds & Zombie Display Screen
      for (let currentPacket of allPackets){
        if (pointBox(mouseX, mouseY, currentPacket.x, currentPacket.y, 120, 60)){
          // Removing Packets
          let gotRemoved = false;
          for (let cSelectPacket of allPackets){
            if ((cSelectPacket.type === currentPacket.type)&&(cSelectPacket !== currentPacket)&&(currentPacket.disabled === false)){
              allPackets.splice(allPackets.indexOf(currentPacket), 1);
              selectedPackets.splice(selectedPackets.indexOf(currentPacket), 1);
              cSelectPacket.disabled = false;
              gotRemoved = true;
              break;
            }
          }
          if (gotRemoved){break;}

          // Selecting Packets
          if (currentPacket.disabled === false){//Not Disabled
            if ((selectedPackets.length < seedSlots||selectedPackets.length<=seedSlots&&rentSlot)&&(unlockedPackets.includes(currentPacket.type+1))&&(!gotRemoved)){//Add Packet
              currentPacket.disabled = true;
              selectedPackets.push(new SeedPacket(currentPacket.type, currentPacket.name, currentPacket.sun, currentPacket.tier,
                 0, 0, currentPacket.moving, currentPacket.spawnZombie, 0, 0, false));
            }
          }
        }
      }
      for (let currentPacket in selectedPackets){//Update Status of Selected Packets
        selectedPackets[currentPacket].x = 30;
        selectedPackets[currentPacket].y = 70 + 70*currentPacket;
      }
      break;
    case "level": case "prepareDefense"://Level (Gameplay) Screen
      //Planting initial process
      if (readyPlant === null){//No plant selected
        readyPlant = null;
        for (let currentPacket of allPackets){
          if (pointBox(mouseX, mouseY, currentPacket.x, currentPacket.y, 120, 60)  //If packet clicked on
          &&(currentPacket.recharge === 0)&&(sun >= currentPacket.sun)){
            readyPlant = currentPacket;
            currentPacket.selected = true;
          }
        }
      }
      break;
    default:
      break;
  }
});

//Mouse released
document.addEventListener("mouseup",function(e){
  //Title Screen
  switch (screen){
    case "initial"://Title Screen
      if(pointBox(mouseX,mouseY,width/2-60,400,120,50)){
        transition.trigger=true;
        transition.screen="regularLevelSelect";
      }else if(pointBox(mouseX,mouseY,width/2-60,460,120,50)){
        transition.trigger=true;
        transition.screen="minigameSelect";
      }else if(pointBox(mouseX,mouseY,width/2-60,570,120,50)){
        saveData();
        alert("Data Saved");
      }
      break;
    case "daveSpeech"://Crazy Dave Screen
      if (clickCooldown <= 0){
        //Dialogue Box
        if (pointBox(mouseX,mouseY,450,350,300,180)){
          daveIndex++;
        }   
        //Quit Button Hitbox
        if (pointBox(mouseX, mouseY, 800, 30, 60, 40)){
          transition.trigger = true;
          transition.screen = "initial";
        }
        clickCooldown = 10;
      }
      break;
    case "chooseSeeds"://Choose Your Seeds & Zombie Display Screen
      //Start Game Button
      if(pointBox(mouseX, mouseY, 30, 640, 100, 40)){
        if (currentLevel["type"].includes(4)){//Last Stand Preparation Phase
          finalLevelSetup();
          transition.trigger = true;
          transition.screen = "prepareDefense";
        }else{
          startGame();
        }
      }
      //Quit Button
      if(pointBox(mouseX, mouseY, 800, 30, 60, 40)){
        transition.trigger = true;
        transition.screen = "regularLevelSelect";
      }
      //Rent Slot Button
      if(pointBox(mouseX,mouseY,115,20, 100, 40)&&(!rentSlot)&&(money>=2500)){
        money -= 2500;
        rentSlot = true;
      }
      break;
    case "prepareDefense"://Last Stand Preparation Screen
      if (pointBox(mouseX, mouseY, 190,30,80,40)){//Start Button
        startGame();
      };
    case "level"://Level (Gameplay) Screen
      if ((readyPlant !== null)&&(currentLevel["type"].includes(14))){//I Zombie
        let tileFound = null;
        //Find tile to place zombie on
        for (let currentTile of tiles){
          if ((pointBox(mouseX,mouseY,currentTile.x + 1,currentTile.y + 1,78,98))&&(currentTile.x >= currentLevel["plantLine"])){
            tileFound = currentTile;
            break;
          }
        }
        if (tileFound){//Spawn Zombie
          sun -= readyPlant.sun;
          let zombieData = zombieStat[readyPlant.type];
          new Zombie(tileFound.x + 25, tileFound.y, Math.floor((tileFound.y-120)/100) + 1, readyPlant.type, zombieData.health, zombieData.shield, 
            zombieData.degrade, zombieData.speed, zombieData.eatSpeed, zombieData.altSpeed, zombieData.altEatSpeed, zombieData.jam, -1);
        }
        readyPlant.selected = false;
        readyPlant = null;
      }else if (readyPlant !== null){//Planting Process and Shoveling (Regular)
        if (readyPlant.type === "shovel"){//Shoveling
          for (let currentTile of tiles){
            if ((mouseX > currentTile.x + 5)&&(mouseX < currentTile.x + 75)
            &&(mouseY > currentTile.y + 10)&&(mouseY < currentTile.y + 90)
            &&(currentTile.occupied === true)&&!((currentLevel["type"].includes(10))&&(currentTile.x >= 660))&&!((currentLevel["type"].includes(13))&&(currentTile.y === 420))){
              //Make sure to not plant on boss or unsodded lane
              currentTile.occupied = false;
              for (let currentPlant of allPlants){//Find Correct Plant and Not Endangered
                if ((currentPlant.id === currentTile.plantID)&&(currentPlant.endangered === false)){
                  if ((currentLevel["type"].includes(4) === true)&&(screen === "prepareDefense")){//Last Stand Preparation
                    currentPlant.health = 0;
                    sun += currentPlant.sunCost;
                    break;
                  }else{
                    currentPlant.health = 0;
                    sun += currentPlant.refund;
                    break;
                  }
                }
              }
            }
          }
          readyPlant.selected = false;
          readyPlant = null;
        }else{//Planting
          for (let currentTile of tiles){
            if ((mouseX > currentTile.x)&&(mouseX < currentTile.x + 80)&&(mouseY > currentTile.y)&&(mouseY < currentTile.y + 100)
            &&(currentTile.occupied === false)&&!((currentLevel["type"].includes(10))&&(currentTile.x >= 660))&&!((currentLevel["type"].includes(13))&&(currentTile.y === 420))){
              //Make sure to not plant on boss or unsodded lane
              currentTile.occupied = true;
              sun -= readyPlant.sun;
              let newPlant = createPlant(readyPlant.type, readyPlant.tier, currentTile.x + 10, currentTile.y + 10);            currentTile.plantID = newPlant.id;
              readyPlant.recharge = readyPlant.maxRecharge;//Assign plant to tile
              if (readyPlant.moving === true){//Conveyor Packets
                allPackets.splice(allPackets.indexOf(readyPlant), 1);
                allEntities.splice(allEntities.indexOf(readyPlant), 1);
              }
            }
          }
          readyPlant.selected = false;
          readyPlant = null;
        }
      }
      //Shoot Coconut Cannon
      for (let currentPlant of allPlants){
        if ((mouseX > currentPlant.x)&&(mouseX < currentPlant.x + 60)&&(mouseY > currentPlant.y)&&(mouseY < currentPlant.y + 80)
        &&(currentPlant.type === 25)&&(currentPlant.reload <= 0)){
          new Projectile(currentPlant.x + 40, currentPlant.y + 15, currentPlant.lane, currentPlant.projectileType, 
            currentPlant.damage, 3, currentPlant.tier, currentPlant.splashDamage);
          currentPlant.reload = currentPlant.maxReload;
          break;        
        }
      }
      //Win Button
      if (win === true){
        if (pointBox(mouseX,mouseY, 350, 20, 200, 120)){//Reward button hitbox
          for (let currentReward of currentLevel.reward){
            switch (currentReward[0]){
              case 0://New Plant
                if (!unlockedPackets.includes(currentReward[1])){
                  unlockedPackets.push(currentReward[1]);
                }
                break;
              case 1://Money
                money += currentReward[1];
                break;
              case 2://New Level
                if (!unlockedLevels.includes(currentReward[1])){
                  unlockedLevels.push(currentReward[1]);
                }
                break;
              default:
                money += 500;
                break;
            }
          }
          for (let laneMower of lawnMowers){//Lawnmower Money
            if (!laneMower.active){
              money += 200;
            }
          }
          transition.trigger=true;
          transition.screen="initial";
          screen = "initial";
        }
      }
      if (pointBox(mouseX, mouseY, 700, 50, 60, 40)){//Fast foward button hitbox
        levelSpeed = (levelSpeed-0.5)%1.5+1;
      }
      if (pointBox(mouseX, mouseY, 800, 30, 60, 40)){//Quit Button Hitbox
        transition.trigger=true;
        transition.screen="initial";
      }
      break;
    case "gameOver"://Game Over Screen
      if (pointBox(mouseX,mouseY,width/2-60,height-150, 120, 60)){//Exit button hitbox
        transition.trigger=true;
        transition.screen="regularLevelSelect";
      }
      break;
    case "regularLevelSelect"://Adventure Level Select
      if (pointBox(mouseX, mouseY,310,570,120,40)){
        transition.trigger=true;
        transition.screen="almanac";
      }
      if (pointBox(mouseX, mouseY,470,570,120,40)){
        transition.trigger=true;
        transition.screen="shop";
      }
      if (pointBox(mouseX, mouseY,760,20,120,40)){
        transition.trigger=true;
        transition.screen="initial";
      }
      break;
    case "minigameSelect"://Minigame Level Select
      if (pointBox(mouseX, mouseY,310,570,120,40)){
        transition.trigger=true;
        transition.screen="almanac";
      }
      if (pointBox(mouseX, mouseY,470,570,120,40)){
        transition.trigger=true;
        transition.screen="shop";
      }
      if (pointBox(mouseX, mouseY,760,20,120,40)){
        transition.trigger=true;
        transition.screen="initial";
      }
      break;
    case "almanac"://General Almanac Screen
      if(pointBox(mouseX,mouseY,width/4-50,height/2-50,100,100)){
        transition.trigger=true;transition.screen='almanacPlant';
      }else if(pointBox(mouseX,mouseY,width*3/4-50,height/2-50,100,100)){
        transition.trigger=true;transition.screen='almanacZombie';
      }
      if(pointBox(mouseX,mouseY,50,50,100,50)){
        transition.trigger=true;transition.screen='initial';
      }
      break;
    case "almanacPlant"://Plant Almanac
      if(pointBox(mouseX,mouseY,width/2-50,350,100,50)){//Tiering System
        if (money >= 1000){
          if (plantTier[displayPlant.type - 1] === 1){
            plantTier[displayPlant.type - 1] = 2;
          }else{
            plantTier[displayPlant.type - 1] = 1;
          }
          money -= 1000;
        }
      }
      if(pointBox(mouseX,mouseY,50,350,100,50)&&(displayPlant.type>1)){
        displayPlant.type--;
      }
      if(pointBox(mouseX,mouseY,width-150,350,100,50)&&(displayPlant.type<29)){
        displayPlant.type++;
      }
      if(pointBox(mouseX,mouseY,50,50,100,50)){
        transition.trigger=true;
        transition.screen='almanac';
      }
      break;
    case "almanacZombie"://Zombie Almanac
      if(pointBox(mouseX,mouseY,50,350,100,50)&&(displayZombie.type>0)){
        displayZombie.type--;
        if (displayZombie.type === 24){
          displayZombie.type = 23;
        }
      }
      if(pointBox(mouseX,mouseY,width-150,350,100,50)&&(displayZombie.type<zombieStat.length-1)){
        displayZombie.type++;
        if (displayZombie.type === 24){
          displayZombie.type = 25;
        }
      }
      if(pointBox(mouseX,mouseY,50,50,100,50)){
        transition.trigger=true;
        transition.screen='almanac';
      }
      break;
    case "shop"://Shop
      if(pointBox(mouseX,mouseY,50,50,100,50)){
        transition.trigger=true;
        transition.screen='initial';
      }
      for(let a = 0; a < displayPlants.length; a++){
        if(pointBox(mouseX,mouseY,displayPlants[a].x-20,displayPlants[a].y-20,100,100)&&money>=10000){
          money -= 10000;
          displayPlants[a].y += 99999;
          unlockedPackets.push(displayPlants[a].type);
          displayPlants.splice(a,1);
          a--;
        }
      }
      break;
    default:
      console.log("Screen Does Not Exist");
      break;
  }
});


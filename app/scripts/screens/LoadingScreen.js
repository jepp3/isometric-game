define(["json!./../../resources/snowMapCollision.json","utils/IsometricMap","utils/CanvasSingleton","utils/MapHandler","utils/Session","easel"],function(map,IsometricMap,canvas,MapHandler,session,createjs) {


  var KEYCODE_LEFT = 65,
      KEYCODE_RIGHT = 68,
      KEYCODE_UP = 87,
      KEYCODE_DOWN = 83;



  /*Keyboard input handlers - keydown and keyup*/
  var left,
  right,
  up,
  down;

  var LoadingScreen = function(options) {
      this.options = options;

  };

  LoadingScreen.prototype.start = function() {

      var stage = new createjs.Stage(canvas);
      stage.x = 300;
      stage.y = 100;
      session.setStage(stage);
      stage.on("click",function(ev) {
        var t = stage.globalToLocal(ev.stageX,ev.stageY);
        var e = {
          "x":t.x - 32,
          "y":t.y - 96
        };
        var destination = MapHandler.pixleCordinatesToIsometricCordinates(e);
        var source = {
          "x":4,
          "y":3
        };
        var shortestPath = MapHandler.shortestPath(this.stupidMap[3],source,destination);
        console.log(shortestPath);
      }.bind(this));
      createjs.Ticker.addEventListener("tick", tick.bind(this)); // todo: remove me, this should be made in the screen

      loadMap.call(this);

      resizeCanvas(canvas);

      this.fakeCharacter = createFakeCharacter();

      // place the fake character at position 0,0
      var startingPoint = {
        "x":4,
        "y":3
      };
      var pixleCordinates = MapHandler.isometricCordinatesToPixelCordinates(startingPoint);


      this.fakeCharacter.x = pixleCordinates.x;
      this.fakeCharacter.y = pixleCordinates.y;


      // add the character to the stage , we will deep sort it in a second
      session.getStage().addChild(this.fakeCharacter);

      updateCharacterDeepSorting.call(this);
      /*Connecting keydown input to keyPressed handler*/
      document.onkeydown = keyPressed;
                 /*Connecting key up event to keyUp handler*/
      document.onkeyup = keyUp;



  };




  function keyPressed(event) {
      if (!event) {
          var event = window.event;
      }
      switch (event.keyCode) {
          case KEYCODE_LEFT:
              left = true;
              break;
          case KEYCODE_RIGHT:
              right = true;
              break;
          case KEYCODE_UP:
              up = true;
              break;
          case KEYCODE_DOWN:
              down = true;
              break;
      }
  }

  function keyUp(event) {
      if (!event) {
          var event = window.event;
      }
      switch (event.keyCode) {
          case KEYCODE_LEFT:
              left = false;
              break;
          case KEYCODE_RIGHT:
              right = false;
              break;
          case KEYCODE_UP:
              up = false;
              break;
          case KEYCODE_DOWN:
              down = false;
              break;
      }
  }




  function tick() {
      var speed = 1.8;
      var pointer = {
        "x":this.fakeCharacter.x,
        "y":this.fakeCharacter.y
      };
      var update = false;

      if(left) {
        pointer.x-=speed;
        update = true;
      } else if(right) {
        pointer.x+=speed;
        update = true;
      } else if (down) {
        pointer.y+=speed;
        update = true;
      } else if( up) {
        pointer.y-=speed;
        update = true;
      }

      if(checkForCollisions.call(this,pointer) == false && update === true) {

        this.fakeCharacter.x = pointer.x;
        this.fakeCharacter.y = pointer.y;

        updateCharacterDeepSorting.call(this);

      //  session.getStage().update();

      } else {
      //  console.log("collisions")
      }

      session.getStage().update();



  };


  function checkForCollisions(pointer) {

    return MapHandler.collisionDetect(this.stupidMap[3],pointer);
  };



  function updateCharacterDeepSorting() {

    var isometricCordinates = MapHandler.pixleCordinatesToIsometricCordinates({
      "x":this.fakeCharacter.x,
      "y":this.fakeCharacter.y
    });


    var foundTileObject =  undefined;

    if(MapHandler.displayElementExistsAt(this.stupidMap[1],isometricCordinates)) {

        foundTileObject = MapHandler.getAt(this.stupidMap[1],isometricCordinates);

    } else {

        foundTileObject = MapHandler.getPrevWithDisplayElement(this.stupidMap[1],isometricCordinates);

    }
      //if(userStandingOnObj === undefined || userStandingOnObj.displayElement === undefined) {

    if(foundTileObject === undefined || foundTileObject.displayElement === undefined) {
        // there are tiles before me, so

        console.log("standing at" + JSON.stringify(isometricCordinates) + " and cant do a thing");
      //  session.getStage().update();


    } else {

      // firstly remove the character  ( we dont want to create any inconsistency with the indexes)
      session.getStage().removeChild(this.fakeCharacter)

      // get the index of the tile
      var index = session.getStage().getChildIndex(foundTileObject.displayElement);

      // add our character at that given position , will force everything above to increase there index
      session.getStage().addChildAt(this.fakeCharacter,index);

      // our character currently is located under the tile, swap them.
      session.getStage().swapChildren(this.fakeCharacter,foundTileObject.displayElement);

    }

  }

  function resizeCanvas(canvas) {

      canvas.width = 700;//window.outerWidth;    //ie8>= doesn't have innerWidth/Height
      canvas.height =700;//window.outerHeight;  //but they don't have canvas

  };
  /**
  * get the map as json from the backend.
  *
  **/
  function loadMap() {

      var isometricMap = new IsometricMap();
      var ground= 0;
      var objects_on_the_ground = 1;
      this.stupidMap = isometricMap.printOutTilesOnCanvas(map);

  };

  function createFakeCharacter() {

      var tileSpecification = { x: 768, y: 896};

      var crop = new createjs.Bitmap("resources/user1.png");
    // [x=0]  [y=0]  [width=0]  [height=0]
      crop.sourceRect = new createjs.Rectangle(
      0,
      0,
      64,
      128);


      return crop;


  }


  return LoadingScreen;

});

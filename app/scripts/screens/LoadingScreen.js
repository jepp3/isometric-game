define(["json!./../../resources/snowMapCollision.json","utils/IsometricMap","utils/CanvasSingleton","utils/MapWalker","utils/IsometricMapDrawer","utils/Session","easel"],function(map,IsometricMap,canvas,MapWalker,IsometricMapDrawer,session,createjs) {


  var KEYCODE_LEFT = 37,
              KEYCODE_RIGHT = 39,
              KEYCODE_UP = 38,
              KEYCODE_DOWN = 40;



  /*Keyboard input handlers - keydown and keyup*/
  var left,
  right,
  up,
  down;

  var LoadingScreen = function(options) {

      this.options = options;

  };

  LoadingScreen.prototype.start = function() {

    console.log(map);
      var stage = new createjs.Stage(canvas);
      stage.x = 300;
      stage.y = 100;

      session.setStage(stage);

      createjs.Ticker.addEventListener("tick", tick.bind(this)); // todo: remove me, this should be made in the screen

      loadMap.call(this);

      resizeCanvas(canvas);

      this.fakeCharacter = createFakeCharacter();

      // place the fake character at position 0,0

      var pixleCordinates = MapWalker.IsometricCordinatesToPixelCordinates({
        "x":0,
        "y":0
      });



      this.fakeCharacter.x = pixleCordinates.x;
      this.fakeCharacter.y = pixleCordinates.y;

      var mapTile = MapWalker.getAt(this.stupidMap[1],{
        "x":0,
        "y":1
      }).displayElement;


      var index = session.getStage().getChildIndex(mapTile);
      session.getStage().addChildAt(this.fakeCharacter,index);
      session.getStage().swapChildren(this.fakeCharacter,mapTile);




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

      if(left) {
        this.fakeCharacter.x-=0.8;

        updateCharacterDeepSorting.call(this);

      } else if(right) {

        this.fakeCharacter.x+=0.8;
        updateCharacterDeepSorting.call(this);

      } else if (down) {
        this.fakeCharacter.y+=0.8;
        updateCharacterDeepSorting.call(this);
      } else if( up) {
        this.fakeCharacter.y-=0.8;
        updateCharacterDeepSorting.call(this);
      }



  };

  function updateCharacterDeepSorting() {

    var isometricCordinates = MapWalker.pixleCordinatesToIsometricCordinates({
      "x":this.fakeCharacter.x,
      "y":this.fakeCharacter.y +16
    });

    var rule = MapWalker.getAt(this.stupidMap[3],isometricCordinates);
    if(rule) {
        console.log("collision!! of type " + rule.type);
    }

    var foundTileObject =  undefined;

    if(MapWalker.displayElementExistsAt(this.stupidMap[1],isometricCordinates)) {

        foundTileObject = MapWalker.getAt(this.stupidMap[1],isometricCordinates);

    } else {

        foundTileObject = MapWalker.getPrevWithDisplayElement(this.stupidMap[1],isometricCordinates);

    }
      //if(userStandingOnObj === undefined || userStandingOnObj.displayElement === undefined) {

    if(foundTileObject === undefined || foundTileObject.displayElement === undefined) {
        // there are tiles before me, so

        console.log("standing at" + JSON.stringify(isometricCordinates) + " and cant do a thing");
        session.getStage().update();

        return;
    }

    // firstly remove the character  ( we dont want to create any inconsistency with the indexes)
    session.getStage().removeChild(this.fakeCharacter)

    // get the index of the tile
    var index = session.getStage().getChildIndex(foundTileObject.displayElement);

    // add our character at that given position , will force everything above to increase there index
    session.getStage().addChildAt(this.fakeCharacter,index);

    // our character currently is located under the tile, swap them.
    session.getStage().swapChildren(this.fakeCharacter,foundTileObject.displayElement);


    // redraw the map
    session.getStage().update();


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



      var crop = new createjs.Bitmap("resources/user.png");
    // [x=0]  [y=0]  [width=0]  [height=0]
      crop.sourceRect = new createjs.Rectangle(
      0,
      0,
      64,
      128);


      return crop;


  }

   function deepSort() {
     var pixelCordinates = {
       "x":this.fakeCharacter.x,
       "y":this.fakeCharacter.y
     };
  //   var isometricCordinates = MapWalker.pixleCordinatesToIsometricCordinates(pixelCordinates);

   };


  /**
  * load the assets from the backen, so we know what images
  **/
  function loadAssets() {

  };

  return LoadingScreen;

});

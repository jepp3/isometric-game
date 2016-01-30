define(["utils/MapHandler","utils/Session","utils/Printable"],function(MapHandler,session,Printable) {



    MovableHelper = function(movable) {

        this.movable = movable;
        this.speed = 1.8;
        this.movmentList = [];
    };

    /**
    * Attaches the element to the map
    * @param isometric cordinate for the location
    **/
    MovableHelper.prototype.attachTo = function(isometricCordinates) {

        Printable.attachTo(this.movable,isometricCordinates);
        updateCharacterDeepSorting.call(this);

    };

    /**
    * Removes the  movable from the screen.
    **/
    MovableHelper.prototype.destroy = function() {

        Printable.destroy(this.movable);

    };
    /**
    * Moves the character to the given point.
    *
    * @param isometricDestination where to move the character
    **/
    MovableHelper.prototype.goTo = function(isometricDestination) {


      this.isometricDestination = isometricDestination;

      updateMovmentList.call(this,this.movable);

    };

    /**
    * Update movments sprites and so on.
    *
    **/
    MovableHelper.prototype.update = function(character) {

      if(this.movmentList.length >= 2) {
          //session.getMapContainer().update();

          move.call(this);
      }


    };


    //TODO: fix suport for spam clicking
    function move() {


    //  updateMovmentList.call(this,c);
    var switchedSource = false;
        var speed = this.speed;
        var subPathPixleCordinates = MapHandler.isometricCordinatesToPixelCordinates(this.movmentList[1]);
        var orientation = checkOrientation(this.movmentList[0],this.movmentList[1]);
        var c = getMoveCordinates(this.movable,orientation,speed);

        if(orientation === "standStill") {
              return;
        }


        if(orientation === "south") {

            if(c.y >= subPathPixleCordinates.y && c.x <= subPathPixleCordinates.x) {
                MapHandler.copyCordinates(subPathPixleCordinates,this.movable);
                updateMovmentList.call(this,subPathPixleCordinates);
                switchedSource = true;
            }

        } else if(orientation === "west") {

          if(c.y >= subPathPixleCordinates.y && c.x >= subPathPixleCordinates.x) {
            MapHandler.copyCordinates(subPathPixleCordinates,this.movable);
              updateMovmentList.call(this,subPathPixleCordinates);
              switchedSource = true;
          }

        } else if(orientation === "north") {

          if(c.y <= subPathPixleCordinates.y && c.x >= subPathPixleCordinates.x) {
              MapHandler.copyCordinates(subPathPixleCordinates,this.movable);
              updateMovmentList.call(this,subPathPixleCordinates);
              switchedSource = true;
          }

        } else if(orientation === "east") {

          if(c.y <= subPathPixleCordinates.y && c.x <= subPathPixleCordinates.x) {
              MapHandler.copyCordinates(subPathPixleCordinates,this.movable);
              updateMovmentList.call(this,subPathPixleCordinates);
              switchedSource = true;
          }

        }


        if(switchedSource == false) {
          MapHandler.copyCordinates(c,this.movable)
        }


        session.updateOfCanvasNeeded();


    }

    function printDot(e,color) {



     var g = new createjs.Graphics();
      g.setStrokeStyle(1 );
      g.beginStroke(color);
      g.beginFill("rgba(0,0,0,0)");
      g.drawCircle(0,0,1);
      g.endFill();


      var s = new createjs.Shape(g);
      MapHandler.copyCordinates(e,s);

      session.getMapContainer().addChild(s);

    }
    function updateMovmentList(c) {


      var list = [];
      var source = MapHandler.pixleCordinatesToIsometricCordinates(this.movable);
      var myIndex = session.getMapContainer().getChildIndex(this.movable);
      session.getMovableObjects().forEach(function(movableObject) {


        var pixlePoint = movableObject.movable;
        var movableIndex = session.getMapContainer().getChildIndex(movableObject.movable);
        if(myIndex !== movableIndex) {

              var margin = 2;

              // top , right , bottom, left
              var referencePoints = [

                {
                  "x": pixlePoint.x ,
                  "y": pixlePoint.y + margin
                },
                {
                  "x":pixlePoint.x + 32  -margin * 2,
                  "y":pixlePoint.y + 16
                },
                {
                  "x":pixlePoint.x - 32 + margin * 2 ,
                  "y":pixlePoint.y + 16
                },
                {
                  "x":pixlePoint.x,
                  "y":pixlePoint.y + 32 - margin
                }

              ];


        referencePoints.forEach(function(ref) {

            list.push(MapHandler.pixleCordinatesToIsometricCordinates(ref));

        })
      }
      });

      console.log("updating map");
      var v = MapHandler.generateFluidCollisionLayer(session.getMap()[3],list);
      this.movmentList = MapHandler.shortestPath(v,source,this.isometricDestination);
      this.movmentList.unshift(source);

      updateCharacterDeepSorting.call(this);
      session.updateOfCanvasNeeded();

    };
    function updateCharacterDeepSorting() {

      var isometricCordinates = MapHandler.pixleCordinatesToIsometricCordinates(this.movable);

      var foundTileObject =  undefined;

      if(MapHandler.displayElementExistsAt(session.getMap()[1],isometricCordinates))
          foundTileObject = MapHandler.getAt(session.getMap()[1],isometricCordinates);
      else
          foundTileObject = MapHandler.getPrevWithDisplayElement(session.getMap()[1],isometricCordinates);

      if(foundTileObject !== undefined && foundTileObject.displayElement !== undefined) {

        // firstly remove the character  ( we dont want to create any inconsistency with the indexes)
        session.getMapContainer().removeChild(this.movable)

        // get the index of the tile
        var index = session.getMapContainer().getChildIndex(foundTileObject.displayElement);

        // add our character at that given position , will force everything above to increase there index
        session.getMapContainer().addChildAt(this.movable,index);

        // our character currently is located under the tile, swap them.
        session.getMapContainer().swapChildren(this.movable,foundTileObject.displayElement);

      }

    };

    function checkOrientation(curr,next) {

        if(next === undefined)
          return "standStill";
        if(MapHandler.cordinatesSame(next,MapHandler.north(curr)))
          return "north";
        if(MapHandler.cordinatesSame(next,MapHandler.south(curr)))
          return "south";
        if(MapHandler.cordinatesSame(next,MapHandler.east(curr)))
          return "east";
        if(MapHandler.cordinatesSame(next,MapHandler.west(curr)))
          return "west";

        return "standStill";

    };


    function getMoveCordinates(character, orientation,speed) {

        var pointer = {
          "x":character.x,
          "y":character.y
        };

        switch (orientation) {
          case "east": {
            pointer.x-=speed;
            pointer.y-=speed/2;
            break;
          }
          case "west": {
            pointer.x+=speed;
            pointer.y+=speed/2;

            break;
          }
          case "south": {
            pointer.y+=speed;
            pointer.x-=speed*2;

            break;
          }
          case "north": {
            pointer.y-=speed;
            pointer.x+=speed*2;

            break;
          }

        }
        return pointer;
    };



    return MovableHelper;

});

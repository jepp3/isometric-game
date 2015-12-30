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

        var source = MapHandler.pixleCordinatesToIsometricCordinates(this.movable);
        this.movmentList = MapHandler.shortestPath(session.getMap()[3],source,isometricDestination);
        this.movmentList.unshift(source);

    };

    /**
    * Update movments sprites and so on.
    *
    **/
    MovableHelper.prototype.update = function(character) {

        move.call(this);

    };
    //TODO: fix suport for spam clicking
    function move() {

        if(this.movmentList.length < 2) {
            //session.getStage().update();
            return;
        }
        var update = true;
        var speed = this.speed;
        var subPath = this.movmentList[1];
        var subPathPixleCordinates = MapHandler.isometricCordinatesToPixelCordinates(subPath);
        var orientation = checkOrientation(this.movmentList[0],this.movmentList[1]);
        var c = getMoveCordinates(this.movable,orientation,speed);

        if(orientation === "standStill")
            update = false;

        if(orientation === "south") {

            if(c.y >= subPathPixleCordinates.y && c.x <= subPathPixleCordinates.x) {
                MapHandler.copyCordinates(subPathPixleCordinates,c);
                this.movmentList.shift();
            }

        } else if(orientation === "west") {

          if(c.y >= subPathPixleCordinates.y && c.x >= subPathPixleCordinates.x) {
              MapHandler.copyCordinates(subPathPixleCordinates,c);
              this.movmentList.shift();
          }

        } else if(orientation === "north") {

          if(c.y <= subPathPixleCordinates.y && c.x >= subPathPixleCordinates.x) {
              MapHandler.copyCordinates(subPathPixleCordinates,c);
              this.movmentList.shift();
          }

        } else if(orientation === "east") {

          if(c.y <= subPathPixleCordinates.y && c.x <= subPathPixleCordinates.x) {
              MapHandler.copyCordinates(subPathPixleCordinates,c);
              this.movmentList.shift();
          }

        }

        if(update === true) {

          this.movable.x = c.x;
          this.movable.y = c.y;

          updateCharacterDeepSorting.call(this);

        }

    }

    function updateCharacterDeepSorting() {

      var isometricCordinates = MapHandler.pixleCordinatesToIsometricCordinates(this.movable);

      var foundTileObject =  undefined;

      if(MapHandler.displayElementExistsAt(session.getMap()[1],isometricCordinates))
          foundTileObject = MapHandler.getAt(session.getMap()[1],isometricCordinates);
      else
          foundTileObject = MapHandler.getPrevWithDisplayElement(session.getMap()[1],isometricCordinates);

      if(foundTileObject !== undefined && foundTileObject.displayElement !== undefined) {

        // firstly remove the character  ( we dont want to create any inconsistency with the indexes)
        session.getStage().removeChild(this.movable)

        // get the index of the tile
        var index = session.getStage().getChildIndex(foundTileObject.displayElement);

        // add our character at that given position , will force everything above to increase there index
        session.getStage().addChildAt(this.movable,index);

        // our character currently is located under the tile, swap them.
        session.getStage().swapChildren(this.movable,foundTileObject.displayElement);

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

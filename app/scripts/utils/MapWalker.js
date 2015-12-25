define(function() {

    function MapWalker() {

    };
    /**
    U D R L    dX dY
    ================
    0 0 0 0     0  0
    1 0 0 0     0  1
    0 1 0 0     0 -1
    0 0 1 0     1  0
    0 0 0 1    -1  0
    1 0 1 0     1  1
    1 0 0 1    -1  1
    0 1 1 0     1 -1
    0 1 0 1    -1 -1
    **/
    MapWalker.moveNorth = function(layer,startPoint,atVisit) {

        console.log(layer);

        // reverse iterate



    };

    MapWalker.getPrevWithDisplayElement = function(layer,point) {

        return _findPrevDisplayElement(layer,point.y,point.x);
    };

    function _findPrevDisplayElement(layer,y,x) {

        if (y === 0) {
            return undefined;
        }

        var row = layer[y];

        for(var i = x ;  i > 0; i--) {
            var cell = row[i];

            if(cell !== undefined && cell.displayElement !== undefined) {

                return cell;

            }

        }

        return _findPrevDisplayElement(layer,y-1,row.length);
    }

    MapWalker.displayElementExistsAt = function(layer,point) {

          var cell = layer[point.y][point.x];
          return cell !== undefined && cell.displayElement !== undefined;

    };

    MapWalker.getAt = function(layer,point) {

        return layer[point.y][point.x];

    };
    MapWalker.south = function(layer,startPoint) {

        console.log(layer);

        // move y position

        if(startPoint.y-1 < layer.length && startPoint.x >= 0) {

            var tile = layer[startPoint.y-1][startPoint.x];

            return tile;
        }
        else
          throw new Error("out of bounds! The point asked is not inside the map! ");
    };

    MapWalker.north = function(layer,startPoint) {
          return layer[startPoint.y+1][startPoint.x];
    };

    MapWalker.east = function (layer,startPoint) {

        return layer[startPoint.y][startPoint.x+1];

    };


    MapWalker.west = function (layer,startPoint) {

        return layer[startPoint.y][startPoint.x-1];

    };

    MapWalker.moveSouthEast = function (layer, startPoint, atVisit) {

    };

    MapWalker.map = function (layer,atVisit) {

        layer.forEach(function(row,rowIndex) {

            row.forEach(function(tileSpecification,columnIndex){

                 atVisit(tileSpecification,rowIndex,columnIndex);

            });

        })


    };

    /**
    * Converts pixel cordinates to isometric cordinates.
    *
    **/
   MapWalker.pixleCordinatesToIsometricCordinates = function(screen) {

          var TILE_WIDTH_HALF = 32, TILE_HEIGHT_HALF = 16;
          var map = {};
          map.x = (screen.x / TILE_WIDTH_HALF + screen.y / TILE_HEIGHT_HALF) /2;
          map.y = (screen.y / TILE_HEIGHT_HALF - (screen.x / TILE_WIDTH_HALF)) /2;

          map.x = parseInt(map.x);
          map.y = parseInt(map.y);
          return map;
   };


  MapWalker.IsometricCordinatesToPixelCordinates = function(isometricCordinates)  {
      var pixleCordinates = {};
      pixleCordinates.x = ( isometricCordinates.x - isometricCordinates.y ) * 32;
      pixleCordinates.y = ( isometricCordinates.x + isometricCordinates.y ) * 16;

  //    twoDPoint.y = ( index + row ) * map.tileheight/2;
      return pixleCordinates;
  };
    return MapWalker;

});

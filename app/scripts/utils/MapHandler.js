define(["astar"],function(Astar) {

    var TILE_WIDTH_HALF = 32, TILE_HEIGHT_HALF = 16;


    function MapHandler() {

    };

    MapHandler.getPrevWithDisplayElement = function(layer,point) {

        return _findPrevDisplayElement(layer,point.y,point.x);
    };

    // TODO: remove this method, is same as the public method
    function _findPrevDisplayElement(layer,y,x) {

        if (y === 0) {
            return undefined;
        }

        var row = layer[y];

        for(var i = x ;  i > 0; i--) { // loop backwards

            var cell = row[i];

            if(cell !== undefined && cell.displayElement !== undefined) {
                return cell;
            }

        }

        return _findPrevDisplayElement(layer,y-1,row.length);
    };

    MapHandler.displayElementExistsAt = function(layer,point) {

        var cell = layer[point.y][point.x];
        return cell !== undefined && cell.displayElement !== undefined;

    }

    MapHandler.existsAt = function(layer,point) {

        return layer[point.y][point.x] !== undefined;

    }

    MapHandler.getAt = function(layer,point) {

        return layer[point.y][point.x];

    };

    MapHandler.setValue = function(layer,point,value) {

        layer[point.y][point.x] = value;

    };

    /**
    * Returns isometric point to a south position
    *
    **/
    MapHandler.south = function(startPoint) {

          return {
            "x": startPoint.x,
            "y": startPoint.y + 1
          };

    };
    /**
    * Returns isometric point to a north position
    *
    **/
    MapHandler.north = function(startPoint) {

          return {
            "x": startPoint.x,
            "y": startPoint.y - 1
          };

    };

    /**
    * Returns isometric point to a east position
    *
    **/
    MapHandler.east = function (startPoint) {

          return {
            "x": startPoint.x - 1,
            "y": startPoint.y
          };

    };

    /**
    * Returns isometric point to a west position
    *
    **/
    MapHandler.west = function (startPoint) {

          return {
            "x": startPoint.x + 1,
            "y": startPoint.y
          };

    };


    MapHandler.cordinatesSame = function ( a, b ){
        return a.x === b.x && a.y === b.y;
    }


    /**
    * Converts pixel cordinates to isometric cordinates.
    *
    **/
   MapHandler.pixleCordinatesToIsometricCordinates = function(screen) {

        var map = {};
        map.x = (screen.x / TILE_WIDTH_HALF + screen.y / TILE_HEIGHT_HALF) /2;
        map.y = (screen.y / TILE_HEIGHT_HALF - (screen.x / TILE_WIDTH_HALF)) /2;

        map.x = Math.floor(map.x),
        map.y = Math.floor(map.y)

        return map;
   };


  MapHandler.isometricCordinatesToPixelCordinates = function(isometricCordinates)  {

        var pixleCordinates = {};
        pixleCordinates.x = ( isometricCordinates.x - isometricCordinates.y ) * TILE_WIDTH_HALF;
        pixleCordinates.y = ( isometricCordinates.x + isometricCordinates.y ) * TILE_HEIGHT_HALF;
        return pixleCordinates;

  };

  /**
  * Verifies if the point exists inside the given layer
  *
  * @param layer to search through
  * @param pixlePoint
  * @returns boolean
  **/
  MapHandler.collisionDetect = function ( layer, rawPixelPoint ) {

      var pixlePoint = {
          "x": rawPixelPoint.x,
          "y": rawPixelPoint.y,
      };
      // generate 4 points used for collision detection
      var referencePoints = [

        {
          "x": pixlePoint.x,
          "y": pixlePoint.y
        },
        {
          "x":pixlePoint.x + 32,
          "y":pixlePoint.y + 16
        },
        {
          "x":pixlePoint.x - 32,
          "y":pixlePoint.y + 16
        },
        {
          "x":pixlePoint.x ,
          "y":pixlePoint.y + 32
        }

      ];
      var found = false, i = 0;
      while(found === false && i < referencePoints.length) {
          var isometricPoint = MapHandler.pixleCordinatesToIsometricCordinates(referencePoints[i]);
          if(MapHandler.getAt(layer,isometricPoint) !== undefined) {
              found = true;
          }

        i++;
      }
      return found;

      return false;

  };

  MapHandler.generateFluidCollisionLayer = function(collisionLayer,fluidCollisionPoints) {

        var copyOfArray = collisionLayer.map(function(arr) {
          return arr.slice();
        });
        fluidCollisionPoints.forEach(function(fluidPoint) {

            if(MapHandler.existsAt(copyOfArray,fluidPoint) === false)
              MapHandler.setValue(copyOfArray,fluidPoint,{"type":"MOVING_OBJECT"});

        });
        return copyOfArray;
  };

  MapHandler.shortestPath =  function(collisionLayer,isometricSource, isometricDestination) {


    var astarGrid = [];

    collisionLayer.forEach(function(row){
        var astarGridCells = [];
        row.forEach(function(cell){

              if(cell !== undefined) {
                astarGridCells.push(0); // infinit
              } else {

                astarGridCells.push(1); // normal weight
              }

        });

        astarGrid.push(astarGridCells);

    });

    var graph = new Astar.Graph(astarGrid);
    var start = graph.grid[isometricSource.y][isometricSource.x];
    var end = graph.grid[isometricDestination.y][isometricDestination.x];

    var result = convertResultToIsometricPoints(Astar.astar.search(graph, start, end));
    return result;

  };


  MapHandler.copyCordinates = function(source, destination) {

      destination.x = source.x;
      destination.y = source.y;

  };

  function convertResultToIsometricPoints(result) {
      var listOfIsometricPoints = [];

      result.forEach(function(gridPoint){
            listOfIsometricPoints.push({
              "x":gridPoint.y,
              "y":gridPoint.x
            });

      });

      return listOfIsometricPoints;
  };

  return MapHandler;

});

define(["utils/MapHandler","utils/Session"],function(MapHandler,session) {



    PrintableHelper = function(canvasObject) {


    };

    /**
    * Attaches the element to the map
    * @param isometric cordinate for the location
    **/
    PrintableHelper.attachTo = function(canvasObject,isometricCordinates) {

        var pixleCordinates = MapHandler.isometricCordinatesToPixelCordinates(isometricCordinates);

        MapHandler.copyCordinates(pixleCordinates,canvasObject);
        session.getStage().addChild(canvasObject);

    };

    /**
    * Removes the  Printable from the screen.
    **/
    PrintableHelper.destroy = function(canvasObject) {

        session.getStage().removeChild(canvasObject);

    };


    return PrintableHelper;

});

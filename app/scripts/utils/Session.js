define([],function() {

    Session = function() {

        this.updateCanvas = false;
        this.movableObjects = [];
    };

    /**
    * Sets the stage for the application
    */
    Session.prototype.setStage = function(stage) {

        this.stage = stage;
    };

    Session.prototype.getStage = function() {

        return this.stage;
    };

    Session.prototype.setMap = function(map) {

        this.map = map;
    };

    Session.prototype.getMap = function() {

        return this.map;

    };

    Session.prototype.getMovableObjects = function() {

        return this.movableObjects;

    };

    Session.prototype.setMovableObjects = function(movableObj) {

        this.movableObjects = movableObj;

    };
    Session.prototype.updateOfCanvasNeeded = function() {
        this.updateCanvas = true;
    };

    Session.prototype.updateOfCanvasNotNeeded = function() {
        this.updateCanvas = false;
    };

    Session.prototype.isUpdateofCanvasNeeded = function() {
        return this.updateCanvas;
    };

    Session.prototype.getMapContainer = function() {

      return this.mapContainer;

    };

    Session.prototype.setMapContainer = function(mapContainer) {

      this.mapContainer = mapContainer;

    }

    // make it a singleton
    return new Session();

});

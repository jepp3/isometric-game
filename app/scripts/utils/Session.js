define([],function() {

    Session = function() {


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

    // make it a singleton
    return new Session();

});

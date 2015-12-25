/*jshint browser: true*/

define(["screens/LoadingScreen", "jquery"], function (LoadingScreen, $) {
    "use strict";

    var Game = function () {

    };

    /**s
    * bootstrap the application.
    *
    **/

    Game.prototype.init = function () {
      console.log("setting up loading screen")
        // 1. load a  screen ( loader )
        var loadingScreen = new LoadingScreen();

        loadingScreen.start();
    };

    return Game;

});

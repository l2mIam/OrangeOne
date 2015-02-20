/**
 * Created by Kirsten on 2/11/2015.
 *
 * Modified from the jewel loader.js code. Purpose is to pre-load
 * important resources before attempting to use them. This also
 * helps declare a global object "uwetech" for global use.
 */
window.uwetech = {
    screens : {},
    settings : {
        rows : 11,
        cols : 19,
        controls : {
            KEY_UP : "moveUp",
            KEY_LEFT : "moveLeft",
            KEY_DOWN : "moveDown",
            KEY_RIGHT : "moveRight",
            KEY_ENTER : "select",
            KEY_SPACE : "select",
            CLICK : "select",
            TOUCH : "select"
        }
    },
    images : {}
};

window.addEventListener("load", function () {
    Modernizr.addTest("standalone", function () {
        return (window.navigator.standalone !== false);
    });
//
// extend yepnope with preloading
    yepnope.addPrefix("preload", function(resource) {
        resource.noexec = true;
        return resource;
    });
    var numPreload = 0,
        numLoaded = 0;

    yepnope.addPrefix("loader", function (resource) {
        console.log("Loading: " + resource.url)

        var isImage = /.+\.(jpg|png|gif)$/i.test(resource.url);
        resource.noexec = isImage;

        numPreload++;
        resource.autoCallback = function (e) {
            console.log("Finished loading: " + resource.url)
            numLoaded++;
            if (isImage) {
                var image = new Image();
                image.src = resource.url;
                uwetech.images[resource.url] = image;
            }
        };
        return resource;
    });

    function getLoadProgress() {
        if (numPreload > 0) {
            return numLoaded / numPreload;
        } else {
            return 0;
        }
    }
// loading stage 1
//    Modernizr.load([
//        {
//            test : Modernizr.localstorage,
//            yep : "scripts/storage.js",
//            nope : "scripts/storage.cookie.js"
//        }, {
//            load : [
//                "scripts/sizzle.js",
//                "scripts/dom.js",
//                "scripts/requestAnimationFrame.js",
//                "scripts/game.js"
//            ]
//        }, {
//            test : Modernizr.standalone,
//            yep : "scripts/screen.splash.js",
//            nope : "scripts/screen.splash.js",
//            complete : function () {
//                uwetech.game.setup();
//                if (Modernizr.standalone) {
//                    uwetech.game.showScreen("splash-screen",
//                        getLoadProgress);
//                } else {
//                    uwetech.game.showScreen("splash-screen");
//                }
//            }
//        }
//    ]);

// loading stage 2
//    if (Modernizr.standalone) {
//        Modernizr.load([
//            {
//                test : Modernizr.webgl2,
//                yep : [
//                    "loader!scripts/webgl.js",
//                    "loader!scripts/webgl-debug.js",
//                    "loader!scripts/glMatrix-0.9.5.min.js",
//                    "loader!scripts/display.webgl.js",
//                    "loader!images/jewelpattern.jpg",
//                ]
//            }, {
//                test : Modernizr.canvas && !Modernizr.webgl2,
//                yep : "loader!scripts/display.canvas.js"
//            }, {
//                test : !Modernizr.canvas,
//                yep : "loader!scripts/display.dom.js"
//            }, {
//                test : Modernizr.webworkers,
//                yep : [
//                    "loader!scripts/board.worker-interface.js",
//                    "preload!scripts/board.worker.js"
//                ],
//                nope : "loader!scripts/board.js"
//            }, {
//                load : [
//                    "loader!scripts/audio.js",
//                    "loader!scripts/input.js",
//                    "loader!scripts/screen.hiscore.js",
//                    "loader!scripts/screen.main-menu.js",
//                    "loader!scripts/screen.game.js",
//                    "loader!images/jewels" +
//                    uwetech.settings.jewelSize + ".png"
//                ]
//            }
//        ]);
//    }

}, false);

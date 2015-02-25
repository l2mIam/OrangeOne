/**
 * Created by Kirsten on 2/12/2015. Storage for zone data (since 2D arrays
 * tend to get really messy really quick.) Enter at own risk!
 *
 * Work in progress as of 2/24/15!
 */
var zones = {};
window.uwetech.zones = zones; // declare it as a global variable

var Exit = function (x_exit, y_exit, go_to_zone, x_entrance, y_entrance) {
    return {
        x_exit: x_exit,
        y_exit: y_exit,
        go_to_zone: go_to_zone,
        x_entrance: x_entrance,
        y_entrance: y_entrance
    };
};

var Zone = function (id, name, image_src, height, width, exits, bounds) {
    return {
        id : id,
        name : name,
        image_src : image_src,
        height : height,
        width : width,
        exits : exits,
        bounds : bounds
    };
    //var addExit = function (x_exit, y_exit, go_to_zone, x_entrance, y_entrance) {
    //    exits.push(new Exit(x_exit, y_exit, go_to_zone, x_entrance, y_entrance));
    //};
};

zones[1] = new Zone(1, "stairway_bottom", "./img/UWTmap1.png", 608, 928,
            [new Exit(0, 0, 2, 300, 320)],
           [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1],
            [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
            [0,0,0,0,0,0,1,1,1,0,0,0,0,1,0,0,0,0,0],
            [0,1,1,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0],
            [0,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
            [0,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
            [0,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
            [0,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,0],
            [0,0,0,0,1,1,1,1,1,0,0,0,0,1,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,0],
            [0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,1,0],
            [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
            [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
            [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
            [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]
);


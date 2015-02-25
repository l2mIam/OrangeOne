/**
 * Created by Kirsten on 2/12/2015. Storage for zone data (since 2D arrays
 * tend to get really messy really quick.) Enter at own risk!
 *
 * Work in progress as of 2/24/15!
 */
var zones = [];

var book_store_image = new Image();
book_store_image.src = "./img/UWBookStoreInterior11x19.jpg"

var stairway_image = new Image();
stairway_image.src = "./img/UWTmap1.png";


var Exit = function (x_exit, y_exit, go_to_zone, x_entrance, y_entrance) {
        return {
        x_exit: x_exit,
        y_exit: y_exit,
        go_to_zone: go_to_zone,
        x_entrance: x_entrance,
        y_entrance: y_entrance
    };
};

var Zone = function (id, name, image, height, width, exits, bounds) {

    /**
    //console.log(exit_array);
    var exits = [];
    if (exit_array && exit_array.length) {
        //console.log(exits);
        var key;
        for (var i = 0; i < exit_array.length; i++) {
            key = (exit_array[i].x_exit + "," + exit_array[i].y_exit);
            exits[key] = exit_array[i];
        }

        for (var e in exit_array){
            //console.log(exit_array[e]);
            key = (exit_array[e].x_exit + "," + exit_array[e].y_exit);
            //console.log(key);
            exits[key] = exit_array[e];
            //exits.push(key, e);

        }
        //console.log(exits);
    }*/
    console.log(exits);

    return {
        id : id,
        name : name,
        image : image,
        height : height,
        width : width,
        exits : exits,
        bounds : bounds
    };
    //var addExit = function (x_exit, y_exit, go_to_zone, x_entrance, y_entrance) {
    //    exits.push(new Exit(x_exit, y_exit, go_to_zone, x_entrance, y_entrance));
    //};
};

zones[1] = new Zone(1, "stairway_bottom", stairway_image, 608, 928,
            //[Exit(0, 0, 2, 300, 320)],
                {"0,0": Exit(0, 0, 2, 11, 15),
                 "1,0": Exit(0, 1, 2, 12, 15),
                 "2,0": Exit(0, 2, 2, 13, 15)},
               [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1],
                [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,1,1,0,0,0,0,1,0,0,0,0,0],
                [0,1,1,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0],
                [0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
                [0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
                [0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
                [0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
                [0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
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

console.log(zones[1]);

zones[2] = new Zone(2, "book_store", book_store_image, 608, 352,
            [Exit(0, 0, 1, 300, 320)],
            [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]
);

//window.uwetech.zones = zones; // declare it as a global variable
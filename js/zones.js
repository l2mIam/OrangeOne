/**
 * Created by Kirsten on 2/12/2015. Storage for zone data (since 2D arrays
 * tend to get really messy really quick.) Enter at own risk!
 *
 * Work in progress as of 2/24/15!
 */
var zones = [];

// STAIRS LOWER (Zone 1)
var ext_stairs_lower_image = new Image();
ext_stairs_lower_image.src = "./img/ext_stairs_lower.jpg";

var int_book_store_image = new Image();
int_book_store_image.src = "./img/int_bookstore.jpg"

var int_wcg_image = new Image();
int_wcg_image.src = "./img/int_wcg.jpg"


// WALKWAY SOUTH (Zone 3)
var ext_walkway_south_image = new Image();
ext_walkway_south_image.src = "./img/ext_walkway_south.jpg";

var int_cp_image = new Image();
int_cp_image.src = "./img/int_cp.jpg";

var int_library_image = new Image();
int_library_image.src = "./img/int_library.jpg";

// STAIRS MID (Zone 7)
var ext_stairs_mid_image = new Image();
ext_stairs_mid_image.src = "./img/ext_stairs_mid.jpg";

// STAIRS UPPER (Zone 8)
var ext_stairs_upper_image = new Image();
ext_stairs_upper_image.src = "./img/ext_stairs_upper.jpg";

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

zones[1] = new Zone(1, "ext_stairs_lower", ext_stairs_lower_image, 608, 928,
            //[Exit(0, 0, 2, 300, 320)],
                { "0,0": Exit(0, 0, 3, 35, 20),
                  "0,1": Exit(0, 1, 3, 35, 20),
                "17,27": Exit(17, 27, 2, 1, 10),
                "17,26": Exit(17, 26, 2, 0, 9),
                "18,2": Exit(18, 2, 4, 2, 2),
                "18,3": Exit(18, 3, 4, 2, 2)
              },
               [[2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
                [0,1,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,2],
                [0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1],
                [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                [0,0,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,0],
                [0,0,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
                [0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
                [0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
                [0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
                [0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
                [0,0,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                [1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0],
                [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
                [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
                [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
                [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,2,0],
                [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]
);

//console.log(zones[1]);

// Interior West Coast Grocery
// Connections: Zone 1 (lower stairs)
zones[4] = new Zone(4, "int_wcg", int_wcg_image, 608, 352,
           {  "1,0": Exit(1, 0, 1, 16, 2),
              "2,0": Exit(2, 0, 1, 16, 2)
           },
           [[1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1],
            [1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,3,3,1],
            [1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1],
            [1,0,0,1,0,1,3,1,1,1,3,1,1,1,3,1,0,0,1],
            [1,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]
);

zones[2] = new Zone(2, "int_book_store", int_book_store_image, 608, 352,
            {  "1,10": Exit(1, 10, 1, 17, 28),
                "0,9": Exit(0, 9, 1, 16, 27)
            },
            [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
             [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
             [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
             [1,0,0,0,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1],
             [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
             [1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
             [1,1,0,0,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1],
             [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
             [2,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
             [0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]
);

zones[3] = new Zone(3, "ext_walkway_south", ext_walkway_south_image, 1216, 768,
            //x_exit, y_exit, go_to_zone, x_entrance, y_entrance
                {"37,18": Exit(37, 18, 1, 2, 1),
                 "37,19": Exit(37, 19, 1, 2, 1),
                 "37,20": Exit(37, 20, 1, 2, 1),
                 "37,21": Exit(37, 21, 1, 2, 1),
                 "37,17": Exit(37, 17, 1, 2, 1),
                  "20,0": Exit(20, 0, 6, 10, 8),
                  "19,0": Exit(19, 0, 6, 10, 8),
                  "2,23": Exit(2, 23, 5, 16, 2),
                  "3,23": Exit(3, 23, 5, 16, 2)
                },
                [[1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1],
                 [1,0,0,0,0,1,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1],
                 [1,0,0,0,0,1,1,1,1,1,0,0,1,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1],
                 [1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
                 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
                 [1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
                 [1,0,0,1,1,1,1,1,0,0,0,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
                 [1,0,0,1,1,1,1,1,0,0,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1],
                 [1,0,0,1,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1],
                 [0,0,0,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],
                 [0,0,0,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                 [0,0,0,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
                 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
                 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
                 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
                 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
                 [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                 [1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]
);

// Interior Cherry Parks
// Connections: Zone 3 (walkway)
zones[5] = new Zone(5, "int_cp", int_cp_image, 608, 352,
                {  "15,0": Exit(15, 0, 3, 3, 22),
                   "16,0": Exit(16, 0, 3, 3, 22 )
                },
               [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,1,1],
                [1,1,3,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1],
                [1,3,1,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1],
                [1,1,1,1,1,1,0,0,0,0,1,0,0,1,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1],
                [1,0,0,1,3,1,0,0,0,0,1,0,0,0,0,0,0,0,1],
                [1,0,0,3,1,1,0,0,0,0,1,0,0,0,0,0,0,0,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]
);

// Interior library
// Connections: Zone 3 (walkway)
zones[6] = new Zone(6, "int_library", int_library_image, 608, 352,
                {   "8,10": Exit(8,  10, 3, 19, 3),
                    "9,10": Exit(9,  10, 3, 19, 3),
                   "10,10": Exit(10, 10, 3, 19, 3),
                   "11,10": Exit(11, 10, 3, 19, 3)
                  },
                 [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                  [1,0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1],
                  [1,0,0,0,0,0,0,1,0,0,1,3,1,3,1,3,1,3,1],
                  [1,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,3],
                  [1,0,0,1,1,1,1,1,0,0,1,0,0,0,0,0,0,0,3],
                  [1,0,0,1,0,0,0,1,0,0,1,1,1,0,0,1,1,1,1],
                  [1,0,0,1,1,3,1,1,0,0,0,0,0,0,0,0,0,0,1],
                  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                  [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1],
                  [1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0,1],
                  [1,1,1,1,1,1,1,1,2,2,2,2,1,1,1,1,1,1,1]]
);

window.uwetech.zones = zones; // declare it as a global variable

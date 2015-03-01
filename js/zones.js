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

/**
 * Creates an exit object.
 * @param x_exit The x-grid location of where this exit is.
 * @param y_exit The y-grid location of where this exit is.
 * @param go_to_zone The zone to transition to by id number.
 * @param x_entrance The player's x-grid location in the new zone.
 * @param y_entrance The player's y-grid location in the new zone.
 * @returns {{x_exit: *, y_exit: *, go_to_zone: *, x_entrance: *, y_entrance: *}}
 * @constructor
 */
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
    //console.log(exits);

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
                { "0,1": Exit(0, 1, 3, 36, 18), // ext_walkway_south
                  "0,2": Exit(0, 2, 3, 36, 18), // ext_walkway_south
                  "0,3": Exit(0, 3, 3, 36, 19), // ext_walkway_south
                  "0,4": Exit(0, 4, 3, 36, 20), // ext_walkway_south
                  "0,5": Exit(0, 5, 3, 36, 21), // ext_walkway_south
                  "18,6": Exit(18, 6, 4, 2, 2), // int_wcg
                  "18,7": Exit(18, 7, 4, 2, 2), // int_wcg
                  "17,29": Exit(17, 29, 2, 1, 8), //int_book_store
                  "17,30": Exit(17, 30, 2, 1, 9), //int_book_store
                  "17,31": Exit(17, 31, 2, 1, 9) //int_book_store
                  "9,0":  Exit( 9, 0, 7, 5, 23) // ext_stairs_mid
                  "10,0": Exit(10, 0, 7, 6, 23) // ext_stairs_mid
                  "11,0": Exit(11, 0, 7, 7, 23) // ext_stairs_mid
                  "12,0": Exit(12, 0, 7, 8, 23) // ext_stairs_mid

              },
             //  0         5         1         5
               [[1,0,0,0,0,0,1,1,1,2,2,2,2,1,1,1,1,1,1],  // 0
                [2,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1],
                [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
                [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
                [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
                [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1], // 5
                [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
                [0,1,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,2],
                [0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1],
                [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0], // 10
                [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                [0,0,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,0],
                [0,0,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,0],
                [0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0], // 15
                [0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
                [0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
                [0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
                [0,0,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0], // 20
                [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0], // 25
                [1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0],
                [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
                [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
                [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,2,0],
                [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,2,0], // 30
                [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]
);

//console.log(zones[1]);


zones[2] = new Zone(2, "int_book_store", int_book_store_image, 608, 352,
            {
                "0,8": Exit(0, 8, 1, 16, 29),   // ext_stairs_lower
                "0,9": Exit(0, 9, 1, 16, 30),   // ext_stairs_lower
                "1,10": Exit(1, 10, 1, 17, 32)  // ext_stairs_lower
            },
            [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
             [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
             [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
             [1,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1,1],
             [1,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1,1],
             [1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
             [1,1,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1,1],
             [1,1,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1,1],
             [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
             [2,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
             [0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]
);

zones[3] = new Zone(3, "ext_walkway_south", ext_walkway_south_image, 1216, 768,
            //x_exit, y_exit, go_to_zone, x_entrance, y_entrance

                {   "37,16": Exit(37, 16, 1, 1, 2),
                    "37,17": Exit(37, 17, 1, 1, 2),
                    "37,18": Exit(37, 18, 1, 1, 2),
                    "37,19": Exit(37, 19, 1, 1, 3),
                    "37,20": Exit(37, 20, 1, 1, 4),
                    "37,21": Exit(37, 21, 1, 1, 5),
                    "20,0": Exit(20, 0, 6, 10, 8),
                    "19,0": Exit(19, 0, 6, 10, 8),
                    "2,23": Exit(2, 23, 5, 16, 2),
                    "3,23": Exit(3, 23, 5, 16, 2)
                },
                [[1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                 [1,0,0,0,0,1,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                 [1,0,0,0,0,1,1,1,1,1,0,0,1,0,0,0,0,0,0,0,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1],
                 [1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1],
                 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
                 [1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
                 [1,0,0,1,1,1,1,1,0,0,0,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
                 [1,0,0,1,1,1,1,1,0,0,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1],
                 [1,0,0,1,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1],
                 [0,0,0,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],
                 [0,0,0,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                 [0,0,0,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
                 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
                 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
                 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
                 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
                 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
                 [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                 [1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]
);

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

zones[7] = new Zone(7, "ext_stairs_mid", ext_stairs_mid_image, 608, 832, // 19, 26
            //x_exit, y_exit, go_to_zone, x_entrance, y_entrance

                {   "5,0": Exit(5, 0, 8,  7, 31), // ext_stairs_upper
                    "6,0": Exit(6, 0, 8,  8, 31), // ext_stairs_upper
                    "7,0": Exit(7, 0, 8,  9, 31), // ext_stairs_upper
                    "8,0": Exit(8, 0, 8, 10, 31), // ext_stairs_upper
                    "9,0": Exit(9, 0, 8, 11, 31), // ext_stairs_upper
                    "5,25": Exit(5, 25, 8, 5, 2), // ext_stairs_lower
                    "6,25": Exit(6, 25, 8, 6, 2), // ext_stairs_lower
                    "7,25": Exit(7, 25, 8, 7, 2), // ext_stairs_lower
                    "8,25": Exit(8, 25, 8, 8, 2), // ext_stairs_lower
                    "0,24": Exit(0, 24, 3, 36,18), // ext_walkway_south
                    "0,25": Exit(0, 25, 3, 36,19) // ext_walkway_south
                },
              //  0         5         1         5
                [[1,1,1,1,1,2,2,2,2,2,0,0,0,0,0,0,1,1,1], // 0
                 [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                 [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1], // 5
                 [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1], // 10
                 [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1], // 15
                 [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,0,0,0,0,1,1,0,0,0,1,1,1,1,1],
                 [1,1,1,1,1,0,0,0,0,1,1,0,0,0,1,1,1,1,1],
                 [1,1,1,1,1,0,0,0,0,1,1,0,0,0,1,1,1,1,1], // 20
                 [1,1,1,1,1,0,0,0,0,1,1,0,0,0,1,1,1,1,1],
                 [1,1,1,1,1,0,0,0,0,1,1,1,0,0,1,1,1,1,1],
                 [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                 [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                 [2,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0]] // 25
);

zones[8] = new Zone(8, "ext_stairs_upper", ext_stairs_upper_image, 864, 1056, //27, 33
            //x_exit, y_exit, go_to_zone, x_entrance, y_entrance

                {   "7,32":  Exit( 7, 32, 8, 5, 2), // ext_stairs_mid
                    "8,32":  Exit( 8, 32, 8, 6, 2), // ext_stairs_mid
                    "9,32":  Exit( 9, 32, 8, 7, 2), // ext_stairs_mid
                    "10,32": Exit(10, 32, 8, 8, 2), // ext_stairs_mid
                    "11,32": Exit(11, 32, 8, 9, 2) // ext_stairs_mid
                //     "1,19": Exit(1, 19, 9, 1, 2), // int_metro
                //     "1,19": Exit(1, 19, 9, 1, 2), // int_metro
                //     "22,26": Exit(22, 26, 10, 1, 2), // int_science
                //     "22,27": Exit(22, 27, 10, 1, 3), // int_science
                },
              //  0         5         1         5         2         5
                [[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 0
                [[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [[1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [[1,1,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [[1,1,0,0,0,1,1,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
                [[1,1,0,0,0,1,1,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0], // 5
                [[1,1,0,0,0,1,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
                [[1,1,0,0,0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
                [[1,1,0,0,0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
                [[1,1,0,0,0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
                [[1,1,0,0,0,1,1,0,0,0,0,1,1,0,0,1,1,1,1,1,1,1,1,0,0,0,0], // 10
                [[1,1,0,0,0,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [[1,1,0,0,0,1,1,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0],
                [[1,1,0,0,0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1],
                [[1,1,0,0,0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1],
                [[1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1], // 15
                [[1,1,0,0,0,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [[1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
                [[1,1,0,0,0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [[1,2,0,0,0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [[1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1], // 20
                [[1,1,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [[0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [[0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [[1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [[1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1], // 25
                [[0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1],
                [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,2,1,1,1,1],
                [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,1],
                [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1],
                [[1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1], // 30
                [[1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
                [[1,1,1,1,1,1,1,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1]]
);

window.uwetech.zones = zones; // declare it as a global variable

/**
 * Created by Kirsten on 2/12/2015. Storage for zone data (since 2D arrays
 * tend to get really messy really quick.) Enter at own risk!
 *
 * Work in progress as of 2/24/15!
 */
var zones = [];

/**
 * Load all of the zone images.
 * @type {Image}
 */
// STAIRS LOWER (Zone 1)
var ext_stairs_lower_image = new Image();
ext_stairs_lower_image.src = "./img/ext_stairs_lower.jpg";

var int_book_store_image = new Image();
int_book_store_image.src = "./img/int_bookstore.jpg";

var int_wcg_image = new Image();
int_wcg_image.src = "./img/int_wcg.jpg";

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

var int_metro_image = new Image();
int_metro_image.src = "./img/int_metro.jpg";

var int_science_image = new Image();
int_science_image.src = "./img/int_science.jpg";

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
var exit = function (x_exit, y_exit, go_to_zone, x_entrance, y_entrance) {
    return {
        x_exit: x_exit,
        y_exit: y_exit,
        go_to_zone: go_to_zone,
        x_entrance: x_entrance,
        y_entrance: y_entrance
    };
};


/**
 *  bounds: Represents the 2D array for the zone's boundaries.
 *  0 == walkable space
 *  1 == non walkable space
 *  2 == exit exists here
 *  ___ == ????
 */

var Zone = function (id, name, image, height, width, exits, bounds) {
    return {
        id : id,
        name : name,
        image : image,
        height : height,
        width : width,
        exits : exits,
        bounds : bounds
    };
};

zones[1] = new Zone(1, "ext_stairs_lower", ext_stairs_lower_image, 608, 928,
                { "0,1": exit(0, 1, 3, 36, 18), // ext_walkway_south
                  "0,2": exit(0, 2, 3, 36, 18), // ext_walkway_south
                  "0,3": exit(0, 3, 3, 36, 19), // ext_walkway_south
                  "0,4": exit(0, 4, 3, 36, 20), // ext_walkway_south
                  "0,5": exit(0, 5, 3, 36, 21), // ext_walkway_south
                  "18,6": exit(18, 6, 4, 2, 2), // int_wcg
                  "18,7": exit(18, 7, 4, 2, 2), // int_wcg
                  "17,29": exit(17, 29, 2, 1, 8), //int_book_store
                  "17,30": exit(17, 30, 2, 1, 9), //int_book_store
                  "17,31": exit(17, 31, 2, 1, 9), //int_book_store
                  "9,0":  exit( 9, 0, 7, 5, 23), // ext_stairs_mid
                  "10,0": exit(10, 0, 7, 6, 23), // ext_stairs_mid
                  "11,0": exit(11, 0, 7, 7, 23), // ext_stairs_mid
                  "12,0": exit(12, 0, 7, 8, 23) // ext_stairs_mid

              },
             //  0         5         1         5
               [[1,1,1,1,1,1,1,1,1,2,2,2,2,1,1,1,1,1,1],  // 0
                [2,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1],
                [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
                [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
                [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
                [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1], // 5
                [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
                [1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,2],
                [1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1], // 10
                [1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1],
                [1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1], // 15
                [1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
                [1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
                [1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1], // 20
                [1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1], // 25
                [1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1],
                [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
                [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
                [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
                [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,2,1], // 30
                [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
                [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]]
);

zones[2] = new Zone(2, "int_book_store", int_book_store_image, 608, 352,
                {
                "0,8": exit(0, 8, 1, 16, 29),   // ext_stairs_lower
                "0,9": exit(0, 9, 1, 16, 30),   // ext_stairs_lower
                "1,10": exit(1, 10, 1, 17, 32)  // ext_stairs_lower
                },
                [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                 [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,1,1],
                 [1,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1,1],
                 [1,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1,1],
                 [1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
                 [1,1,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1,1],
                 [1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1],
                 [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                 [2,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
                 [0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]
);

zones[3] = new Zone(3, "ext_walkway_south", ext_walkway_south_image, 1216, 768,
                {
                    "37,16": exit(37, 16, 7, 1, 24), // ext_stairs_mid
                    "37,17": exit(37, 17, 7, 1, 24), // ext_stairs_mid
                    "37,18": exit(37, 18, 1, 1, 2), // ext_stairs_lower
                    "37,19": exit(37, 19, 1, 1, 3), // ext_stairs_lower
                    "37,20": exit(37, 20, 1, 1, 4), // ext_stairs_lower
                    "37,21": exit(37, 21, 1, 1, 5), // ext_stairs_lower
                    "20,0": exit(20, 0, 6, 10, 8),
                    "19,0": exit(19, 0, 6, 10, 8),
                    "2,23": exit(2, 23, 5, 16, 2),
                    "3,23": exit(3, 23, 5, 16, 2)
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
                {
                    "1,0": exit(1, 0, 1, 16, 2),
                    "2,0": exit(2, 0, 1, 16, 2)
                },
               [[1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,1],
                [1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1],
                [1,0,0,1,1,1,3,1,1,1,3,1,1,1,3,1,0,0,1],
                [1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]
);

// Interior Cherry Parks
// Connections: Zone 3 (walkway)
zones[5] = new Zone(5, "int_cp", int_cp_image, 608, 352,
                {  "15,0": exit(15, 0, 3, 3, 22),
                   "16,0": exit(16, 0, 3, 3, 22 )
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
                [1,0,0,0,1,1,0,0,0,0,1,0,0,0,0,0,0,0,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]
);

// Interior library
// Connections: Zone 3 (walkway)
zones[6] = new Zone(6, "int_library", int_library_image, 608, 352,
                {   "8,10": exit(8,  10, 3, 19, 3),
                    "9,10": exit(9,  10, 3, 19, 3),
                   "10,10": exit(10, 10, 3, 19, 3),
                   "11,10": exit(11, 10, 3, 19, 3)
                  },
                 [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                  [1,0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1],
                  [1,0,0,0,0,0,0,1,0,0,1,3,1,3,1,3,1,3,1],
                  [1,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,3],
                  [1,0,0,1,1,1,1,1,0,0,1,0,0,0,0,0,0,0,3],
                  [1,0,0,1,1,1,1,1,0,0,1,1,1,0,0,1,1,1,1],
                  [1,0,0,1,1,3,1,1,0,0,0,0,0,0,0,0,0,0,1],
                  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                  [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1],
                  [1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0,1],
                  [1,1,1,1,1,1,1,1,2,2,2,2,1,1,1,1,1,1,1]]
);

zones[7] = new Zone(7, "ext_stairs_mid", ext_stairs_mid_image, 608, 832, // 19, 26
            //x_exit, y_exit, go_to_zone, x_entrance, y_entrance

                {   "5,0": exit(5, 0, 8,  7, 31), // ext_stairs_upper
                    "6,0": exit(6, 0, 8,  8, 31), // ext_stairs_upper
                    "7,0": exit(7, 0, 8,  9, 31), // ext_stairs_upper
                    "8,0": exit(8, 0, 8, 10, 31), // ext_stairs_upper
                    "9,0": exit(9, 0, 8, 11, 31), // ext_stairs_upper
                    "10,0": exit(10, 0, 8, 12, 31), // ext_stairs_upper
                    "11,0": exit(11, 0, 8, 13, 31), // ext_stairs_upper
                    "12,0": exit(12, 0, 8, 14, 31), // ext_stairs_upper
                    "13,0": exit(13, 0, 8, 15, 31), // ext_stairs_upper
                    "14,0": exit(14, 0, 8, 16, 31), // ext_stairs_upper
                    "15,0": exit(15, 0, 8, 17, 31), // ext_stairs_upper
                    "0,24": exit(0, 24, 3, 36,17), // ext_walkway_south
                    "0,25": exit(0, 25, 3, 36,17), // ext_walkway_south
                    "1,25": exit(1, 25, 1,  5, 2), // ext_stairs_lower
                    "2,25": exit(2, 25, 1,  6, 2), // ext_stairs_lower
                    "3,25": exit(3, 25, 1,  7, 2), // ext_stairs_lower
                    "4,25": exit(4, 25, 1,  8, 2), // ext_stairs_lower
                    "5,25": exit(5, 25, 1,  9, 2), // ext_stairs_lower
                    "6,25": exit(6, 25, 1, 10, 2), // ext_stairs_lower
                    "7,25": exit(7, 25, 1, 11, 2), // ext_stairs_lower
                    "8,25": exit(8, 25, 1, 12, 2), // ext_stairs_lower
                    "9,25": exit(9, 25, 1, 13, 2), // ext_stairs_lower
                    "10,25": exit(10, 25, 1, 14, 2), // ext_stairs_lower
                    "11,25": exit(11, 25, 1, 15, 2), // ext_stairs_lower
                    "12,25": exit(12, 25, 1, 16, 2), // ext_stairs_lower
                    "13,25": exit(13, 25, 1, 16, 2), // ext_stairs_lower
                    "14,25": exit(14, 25, 1, 16, 2), // ext_stairs_lower
                    "15,25": exit(15, 25, 1, 16, 2) // ext_stairs_lower
                },
              //  0         5         1         5
                [[1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,1,1,1], // 0
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
                 [1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1],
                 [2,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1],
                 [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1]] // 25
);

zones[8] = new Zone(8, "ext_stairs_upper", ext_stairs_upper_image, 864, 1056, //27, 33
            //x_exit, y_exit, go_to_zone, x_entrance, y_entrance

                {
                    "7,32":  exit( 7, 32, 7, 5, 1), // ext_stairs_mid
                    "8,32":  exit( 8, 32, 7, 6, 1), // ext_stairs_mid
                    "9,32":  exit( 9, 32, 7, 7, 1), // ext_stairs_mid
                    "10,32": exit(10, 32, 7, 8, 1), // ext_stairs_mid
                    "11,32": exit(11, 32, 7, 9, 1), // ext_stairs_mid
                    "12,32": exit(12, 32, 7, 10, 1), // ext_stairs_mid
                    "13,32": exit(13, 32, 7, 11, 1), // ext_stairs_mid
                    "14,32": exit(14, 32, 7, 12, 1), // ext_stairs_mid
                    "15,32": exit(15, 32, 7, 13, 1), // ext_stairs_mid
                    "16,32": exit(16, 32, 7, 14, 1), // ext_stairs_mid
                    "17,32": exit(17, 32, 7, 15, 1), // ext_stairs_mid
                    "18,32": exit(18, 32, 7, 15, 1), // ext_stairs_mid
                    "18,31": exit(18, 31, 7, 15, 1), // ext_stairs_mid
                     "1,18": exit(1, 18, 9, 17, 5), // int_metro
                     "1,19": exit(1, 19, 9, 17, 6), // int_metro
                     "22,26": exit(22, 26, 10, 1, 7), // int_science
                     "22,27": exit(22, 27, 10, 1, 8) // int_science
                },
              //  0         5         1         5         2         5
                [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], // 0
                 [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                 [1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                 [1,1,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                 [1,1,0,0,0,1,1,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1],
                 [1,1,0,0,0,1,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1], // 5
                 [1,1,0,0,0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1],
                 [1,1,0,0,0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1],
                 [1,1,0,0,0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1],
                 [1,1,0,0,0,1,1,0,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1],
                 [1,1,0,0,0,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 10
                 [1,1,0,0,0,1,1,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1,1,0,0,0,1],
                 [1,1,0,0,0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1],
                 [1,1,0,0,0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1],
                 [1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
                 [1,1,0,0,0,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1], // 15
                 [1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
                 [1,1,0,0,0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                 [1,2,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                 [1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1],
                 [1,1,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], // 20
                 [0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                 [0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                 [0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1], // 25
                 [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1],
                 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,2,1,1,1,1],
                 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,1,1],
                 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1], // 30
                 [1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1],
                 [1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1]]
);
zones[10] = new Zone(10, "int_science", int_science_image, 608, 352,
                {
                    "0,7": exit(0, 7, 8, 21, 26),
                    "0,8": exit(0, 8, 8, 21, 27)
                    // Puzzle launch point: 7,9
                },
             //  0         5         1         5
               [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,1,0,0,0,1,1,1,1,1,1,3,3,1],
                [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,1,0,0,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1],
                [1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,1,1,0,1],
                [2,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1],
                [2,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,1,3,1,1,1,1,1,0,0,0,0,0,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]
);
zones[9] = new Zone(9, "int_metro", int_metro_image, 608, 352,
                {
                  "18,5": exit(18, 5, 8, 2, 18), // ext_stairs_upper
                  "18,6": exit(18, 6, 8, 2, 19) // ext_stairs_upper
                },
             //  0         5         1         5
               [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], // 0
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,0,1,0,0,0,0,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,2], // 5
                [1,0,0,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,2],
                [1,0,0,1,1,0,0,1,0,0,0,1,1,1,1,1,1,1,1],
                [1,0,0,1,1,0,0,1,0,0,0,1,1,1,1,1,1,1,1],
                [1,0,0,1,1,0,0,1,0,0,0,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]] // 10
);

window.uwetech.zones = zones; // declare it as a global variable

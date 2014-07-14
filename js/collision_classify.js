/**
 * Created by Travis on 2014/7/13.
 */
// mario collides with the side of the blocks
// @param:  list : [block1, block2,...,]
//          crazy_mario: sprite

var in_range = function (start1, span1, start2, span2) {
    return ((start1 + span1) >= start2) && ((start2 + span2) >= start1);
};
var side_collision = function (crazy_mario, block) {
    return in_range(crazy_mario.y + mario_size[0], 0, block.y, border) && in_range(crazy_mario.x, block.x, mario_size[1], block_size[1]);
};

// mario collides with the bottom surface of the blocks
// @param:  list : [block1, block2,...,]
//          crazy_mario: sprite
var upward_collision = function (crazy_mario, block) {
    return in_range(crazy_mario.x + mario_size[1], 0, block.x, border) && in_range(crazy_mario.y, block.y, mario_size[0], block_size[0]);
};

// mario collides with the top surface of the blocks
// @param:  list : [block1, block2,...,]
//          crazy_mario: sprite
var bottom_collision = function (crazy_mario, block) {
    return in_range(crazy_mario.x, 0, block.x + block_size[1], border) && in_range(crazy_mario.y, block.y, mario_size[0], block_size[0]);
};

// return an array of size 3
// literally top surface collision, side collision, bottom surface collision
var super_collision_detection = function (crazy_mario, list) {
    var has_upward_collision = false;
    var has_side_collision = false;
    var has_bottom_collision = false;
    if (crazy_mario.collidesWithArray(list)) {

        for (var i = 0; i < list.length; i ++) {
            var block = list[i];
            if (!has_bottom_collision) { has_bottom_collision = has_bottom_collision || bottom_collision(crazy_mario, block); }
            if (!has_side_collision) { has_side_collision = has_side_collision || side_collision(crazy_mario, block); }
            if (!has_upward_collision) { has_upward_collision = has_upward_collision || upward_collision(crazy_mario, block); }
        }
    }

    return {
        flag: has_bottom_collision || has_side_collision || has_upward_collision,
        top: has_upward_collision,
        side: has_side_collision,
        bottom: has_bottom_collision};
};

var jump_collision_classify = function (crazy_mario, list) {
    var cb = crazy_mario.collidesWithArray(list);
    if (!cb) {
        if (crazy_mario.xv < 0 && step_away_beneath(crazy_mario, list)) {
            crazy_mario.xv = jump_speed;
            crazy_mario.applyXVelocity();
        }
    } else {
        var type = collision_type(crazy_mario, cb);
        switch (type) {
            case 'top':
                crazy_mario.xv = jump_speed;
                crazy_mario.applyXVelocity();
                break;
            case 'side':
                break;
            case 'bottom':
                break;
            default :
                break;
        }
    }
};

var step_away_beneath = function (crazy_mario, list) {
    step_away = Math.abs(crazy_mario.xv) * factor;
    crazy_mario.move(-step_away, 0);
    var c = crazy_mario.collidesWithArray(list);
    crazy_mario.move(step_away, 0);
    return c && !crazy_mario.collidesWithArray(list);
};

var collision_type = function (crazy_mario, block) {
    if (crazy_mario.xv > 0) {
        var x0 = crazy_mario.x + mario_size[1], y0 = crazy_mario.y + mario_size[0];
        if ((block.x - x0) * crazy_mario.yv - crazy_mario.xv * (block.y - y0) > 0) {
            return "bottom";
        } else {
            return "side";
        }
    } else if (crazy_mario.xv < 0){
        var x0 = crazy_mario.x, y0 = crazy_mario.y + mario_size[0];
        if ((block.x + block_size[0] - x0) * crazy_mario.yv - crazy_mario.xv * (block.y - y0) > 0) {
            return "side";
        } else {
            return "top";
        }
    } else {
        if (in_range(block.x + block_size[1], border, crazy_mario.x, 0)) {
            return "top";
        } else {
            return "side";
        }
    }
};
var update_mario_speed = function () {
    if (crazy_mario.xv > - max_falling_speed)
    {
        crazy_mario.xv -= gravity;
    }
};

var mario_movement_classify = function (crazy_mario, list) {
    var cb = crazy_mario.collidesWithArray(list);
    if (!cb) {
        var xv = crazy_mario.xv, yv = get_current_global_speed();
        var y_step = 1, r = xv / yv;

        // attempt move with given speed
        crazy_mario.move(0, - get_current_global_speed());
        var collisions;
        // adjust y coordinate
        var c;
        var original_x = crazy_mario.x;
        do {
            var x_offset = - Math.floor(r * (y_step - 1)) + Math.floor(r * y_step);
            crazy_mario.move( x_offset , 1);
            c = crazy_mario.collidesWithArray(list);
            y_step ++;
        } while (!c && y_step <= yv);

        // adjust x coordinate to avoid penetrate
        if (c) {
            var f = xv > 0;
            crazy_mario.move( - Math.floor(r * (y_step - 1)), 0);
            do {
                crazy_mario.move(f * 2 - 1, 0);
                var cbb = crazy_mario.collidesWithArray(blocks.list);
                if (cbb) {
                    var type = collision_type(crazy_mario, cbb);
                    if (type != 'side') {
                        break;
                    }
                }
            } while (Math.abs(crazy_mario.x - original_x) < crazy_mario.xv);
            if (f) {
                crazy_mario.xv = -1;
            } else {
                crazy_mario.xv = 0;
            }
        } else {
            update_mario_speed();
        }
    } else {
        var type = collision_type(crazy_mario, cb);
        switch (type) {
            case "top":
                crazy_mario.xv = 0;
                break;
            case "side":
                crazy_mario.move( -1 , - get_current_global_speed());
                update_mario_speed();
                break;
            case "bottom":
                crazy_mario.xv = -1;
//                crazy_mario.move( -1, 0);
        }
        crazy_mario.applyXVelocity();
    }
    crazy_mario.update();
};
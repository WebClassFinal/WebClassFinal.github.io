/**
 * Created by Travis on 2014/7/13.
 */
var screen_h = screen.height - 4;
var screen_w = screen.width;
var block_size = [21,21];
var ground_block_size = block_size;
var mario_size = [block_size[0],46];
var jump_speed = 20;
var global_speed = 3;
var map_height = Math.floor(screen_w / block_size[0]);
var map = {
    height: map_height,
    length: 0,
    mapContent: []
};
var mario_init_y = 50;
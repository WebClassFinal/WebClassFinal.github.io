/**
 * Created by Travis on 2014/7/13.
 */
var body, ctx, crazy_mario, scene, ticker;
var blocks = sjs.List();

var screen_h = screen.height - 4;
var screen_w = screen.width;
var stone_img_size = [21,21];
var block_size = [21,21]; // w, h
var ground_block_size = block_size;
var mario_size = [18,27];
var jump_speed = 20;
var global_speed = 3;
var map_height = Math.floor(screen_w / block_size[1]);
var map_growth = Math.floor(screen_h / block_size[0]);
var map = {
    height: map_height,
    length: 0,
    mapContent: []
};
var mario_init_y = 250;
var map_buffer_size = map_growth;
var border = 3;
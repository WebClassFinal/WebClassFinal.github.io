/**
 * Created by Travis on 2014/7/13.
 */
var body, crazy_mario, scene, ticker;
var blocks = sjs.List();
var medicines = sjs.List();
var medicine_sound;
var screen_h = screen.height - 4;
var screen_w = screen.width;
var stone_img_size = [21,21];
var block_size = [21,21]; // w, h
var mario_size = [18,27];
var jump_speed = 6;
var global_speed = 3;
var speed_mutation_period = 1000;
var speed_mutation_range = 0.3;
var gravity = 0.3;
var map_height = Math.floor(screen_w / block_size[1]);
var map_growth = Math.floor(screen_h / block_size[0]);
var map = {
    height: map_height,
    length: 0,
    mapContent: []
};
var mario_init_y = 250;
var map_buffer_size = map_growth;
var border = 5;
var neighbourhood_size = 50;
var max_falling_speed = 15;
var factor = 1; // step_away / falling speed
var step_away = max_falling_speed * factor;
var medicine_collected = 0;
var medicine_efficacy = 2;

var materials = [
    'images/mario_8_bit.png',
    'images/stone.png',
    'images/medicine.png'
];
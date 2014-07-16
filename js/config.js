/**
 * Created by Travis on 2014/7/13.
 */
// objects
var body, crazy_mario, scene, ticker, mario_head, sun, sky, bee;
var blocks = sjs.List();
var medicines = sjs.List();
var clouds = sjs.List();
var scoreShow = sjs.List();
var initialScore = 100;
var score = initialScore;
var tempScore = score;
/*var scoreImageOffset = [{
    x: 0,
    y: 0
}, {
    x: 40,
    y: 0
}, {
    x: 70,
    y: 0
}, {
    x: 111,
    y: 0
}, {
    x: 145,
    y: 0
}, {
    x: 0,
    y: 54
}, {
    x: 40,
    y: 54
}, {
    x: 72,
    y: 54
}, {
    x: 105,
    y: 54
}, {
    x: 143,
    y: 54
}];*/
var scoreImageOffset = [{
    x: 0,
    y: 0
}, {
    x: 37,
    y: 0
}, {
    x: 74,
    y: 0
}, {
    x: 111,
    y: 0
}, {
    x: 148,
    y: 0
}, {
    x: 0,
    y: 54
}, {
    x: 37,
    y: 54
}, {
    x: 74,
    y: 54
}, {
    x: 111,
    y: 54
}, {
    x: 148,
    y: 54
}];
var medicineScore = 10;
var lowestScore = 1;
var deathCost = 20;
var deathCostQuotient = 2;

var materials = [
    'images/mario_8_bit.png',
    'images/stone.png',
    'images/medicine.png',
    'images/numbers.png',
    'images/baozou/0.png',
    'images/baozou/1.png',
    'images/baozou/2.png',
    'images/baozou/3.png',
    'images/baozou/4.png',
    'images/cloud.png',
    'images/sun.png',
    'images/sky.png',
    'images/bee.png'
];

// size
var screen_h = $( window ).height() - 4;
var screen_w = $( window ).width();
//alert(screen_h + ": " + screen_w);
var stone_img_size = [21, 21];
var block_size = [21, 21]; // w, h
var mario_image_size = [18, 36];
var cloud_image_size = [64, 48];
var mario_width = 21;
var mario_bottom_margin = -1;
var mario_scale = mario_width / mario_image_size[0];
var map_height = Math.floor(screen_w / block_size[1]);
var map_growth = Math.floor(screen_h / block_size[0]);
var map = {
    height: map_height,
    length: 0,
    mapContent: []
};

// speed and distance
var relative_shift = 100;
var jump_speed = 8;
var global_speed = 3;
var speed_mutation_period = 400;
var speed_mutation_range = 0.3;
var max_falling_speed = 15;
var factor = 1.1; // step_away / falling speed
var step_away = Math.max(max_falling_speed * factor, 25);
var gravity = 0.3;
var max_global_speed = 7;
var curr_shift = 0;
var shift_sum = 5;
var shift_span = (max_global_speed - global_speed) / shift_sum;
var map_buffer_size = map_growth;
var border = 3;
var neighbourhood_size = 50 + relative_shift;
var mario_init_y = 250 + relative_shift;
var head_relative_shift = [12, 3];
var rush_boundary = 80 + relative_shift;
var bee_image_size = [51,59];
var bee_position = rush_boundary - bee_image_size[0];
var bee_movement_radius = 5;
var rush_speed_ratio = 1.3;
var bee_stun_countdown = 100;
var bee_yv = 1.5;
var sun_original_angle;

// positions
var sun_x = screen_w - 120;
var sun_y = 40;

// movements
var head_rotation_low = 1;
var head_rotation_up = 2;
var head_rotation_angular_speed = 0.02;
var head_rotation_direction = 1;

// time
var rush_flag = false;
var current_progress = 0;
var map_count = 0;

// stats
var medicine_collected = 0;
var medicine_efficacy = 0.7;

// sounds
var medicine_sound;
var cry_sound;
//var is_crying = false;
var bg_sound;

/**
 * Created by Travis on 2014/7/14.
 */

var eat_medicine_sound = function () {
    medicine_sound = document.getElementById("medicine");
    medicine_sound.load();
    medicine_sound.play();
//    medicine_sound.currentTime = 0;
};

var mario_cry_sound = function () {

//    cry_sound.currentTime = 0;
    cry_sound = document.getElementById("cry");
    if (cry_sound.currentTime == cry_sound.duration ) {
//        cry_sound.currentTime = 0;
        cry_sound.load();
        cry_sound.play();
        console.log("cry");
    }

};
/** 
* Created by Paul on 2014/7/15
*/

const blank = 0,
    stone = 1,
    medicine = 2,
    bomb = 3,
    grass = 4;

var jumpHeight = 4;
var hardFactor1 = 6;
var hardFactor2 = 8;
var denseFactor = 2;
var medicineFactor = 0.1;

//size is an object with  property height and length; preMap is the map previously
//return a newMap {height: some, length: some, mapContent: a two-dimension array}
function generateMap(size, preMap) {
    var currentPreMap = initializeSomeLine(size.height, 1);
    var height = preMap.height;
    if(preMap.length > 0){
        currentPreMap.mapContent[0] = preMap.mapContent[preMap.length - 1].slice();
    }
    else{
        for(var i = 0 ; i < height ; i++){
            if(Math.floor(Math.random() * 2) > 0){
                currentPreMap.mapContent[0][i] = stone;
            }
        }
    }
    var newMap = initializeSomeLine(height, 0);
    //one line for each loop
    while(newMap.length < size.length){
        var tempSomeLine = randomLines(height, currentPreMap);
        newMap = connectMap(newMap, tempSomeLine);
        currentPreMap = tempSomeLine;
    }
    if(newMap.length > size.length){
        newMap.length = size.length;
        newMap.mapContent = newMap.mapContent.slice(0, size.length);
    }
    return newMap;
}

function initializeSomeLine(height, length){
    var result = {
        height: height,
        length: length,
        mapContent: new Array(length)
    };
    for(var i = 0 ; i < length ; i++){
        result.mapContent[i] = new Array(height);
    }
    for(var i = 0 ; i < length ; i++){
        for(var j = 0 ; j < height ; j++){
            result.mapContent[i][j] = blank;
        }
    }
    return result;
}
function repeatLine(repeatTime, repeatedArray){
    var result = initializeSomeLine(repeatedArray.length, Math.max(0, repeatTime));
    for(var i = 0 ; i < repeatTime ; i++){
        result.mapContent[i] = repeatedArray.slice();
        for(var j = 0 ; j < repeatedArray.length ; j++){
            if(result.mapContent[i][j] != stone){
                if(Math.floor(Math.random() * 10) > 0){
                    result.mapContent[i][j] = blank;
                }
            }
        }
    }
    return result;
}
function endArray(map){
    return map.mapContent[map.length - 1].slice();
}
function setValue(map, xPosition, yPosition, value){
    map.mapContent[xPosition][yPosition] = value;
}
function lowestBlank(array){
    var blankPosition = array.length;
    for(var i = array.length - 1 ; i >= 0 ; i--){
        if(array[i] == blank || array[i] == medicine){
            blankPosition = i;
        }
    }
    return blankPosition;
}
function randomLines(height, currentPreMap) {

    var map1 = initializeSomeLine(height, 1);
    if(currentPreMap.length > 0){
        map1.mapContent[0] = currentPreMap.mapContent[currentPreMap.length - 1].slice();
    }
    var tempEnd = endArray(map1);
    map2 = initializeSomeLine(height, 1);
    //random generate
    for(var i = 0 ; i < height - 1 ; i++){
        if(Math.floor(Math.random() * Math.pow(2, i) / denseFactor) == 0){
            var stonePosition = Math.floor(Math.random() * height);
            setValue(map2, 0, stonePosition, stone);
        }
    }
    //jump some distance
    
    for(var i = 0 ; i < height - 1 ; i++){
        if(map1.mapContent[0][i] == stone){
            var top = Math.min(i + jumpHeight, height - 2);
            setValue(map2, 0, top, stone);
            setValue(map2, 0, top + 1, blank);
            for(var j = i + 1 ; j <= Math.min(height - 1, top + 2) ; j++){
                setValue(map1, 0, j, blank);
            }
        }
    }
    //repeat pattern
    var map = connectMap(repeatLine(hardFactor1 - map1.length, endArray(map1)), repeatLine(hardFactor2 - map2.length, endArray(map2)));
    //No blocks
    for(var i = 1 ; i < map.length ; i++){
        var preArray = map.mapContent[i - 1];
        for(var j = 0 ; j < height ; j++){          
            if(j > 0 && (preArray[j] == blank || preArray[j] == medicine)){
                if(preArray[j - 1] == stone || preArray[j - 1] == bomb){
                    setValue(map, i, j, blank);
                }
            }
        }
    }
    //add medicine
    for(var i = 0 ; i < map.length ; i++){
        for(var j = 0 ; j < height ; j++){
            if(map.mapContent[i][j] == blank){
                if((j == 0 && Math.floor(Math.random() / medicineFactor * 5) == 0) 
                    || (j > 0 && map.mapContent[i][j - 1] == stone && Math.floor(Math.random() / medicineFactor) == 0)){
                    map.mapContent[i][j] = medicine;
                }
            }
        }
    }
    return map;
}
function getElementAt(map, x, y) {
    return (map.mapContent)[y][x];
}

function connectMap(map1, map2){
    var newMap = initializeSomeLine(map1.height, map1.length + map2.length);
    newMap.mapContent = map1.mapContent.concat(map2.mapContent);
    return newMap;
}
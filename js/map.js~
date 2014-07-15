/** 
* Created by Paul on 2014/7/14
*/

const blank = 0,
    stone = 1,
    medicine = 2,
    bomb = 3,
    grass = 4;

var height = 20;
var jumpHeight = 5;
var repeatFactor = 4;
var repeatProbability = 0.2;
var denseFactor = 0.6;
var medicineFactor = 0.1;
var blankFactor = 0.1;
var bombFactor = 0.2;

//size is an object with  property height and length; preMap is the map previously
//return a newMap {height: some, length: some, mapContent: a two-dimension array}
function generateMap(size, preMap) {
	var currentPreMap = preMap;
	var height = preMap.height;
	var newMap = initializeSomeLine(height, 0);

    //one line for each loop
    var tempSomeLine = initializeSomeLine(height, 0);
    while(newMap.length < size.length){
        //repeat the previous line
        if(currentPreMap.length > 0 && Math.floor(Math.random() / repeatProbability) == 0){
            var repeatTime = Math.floor(Math.random() * repeatFactor) + 1;
            tempSomeLine = repeatLine(repeatTime, currentPreMap.mapContent[currentPreMap.length - 1]);
        }
        else{//otherwise generate randomly
            tempSomeLine = randomOneLine(height, currentPreMap);
        }
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
    return result;
}
function repeatLine(repeatTime, repeatedArray){
    var result = initializeSomeLine(repeatedArray.length, repeatTime);
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
function lowestBlank(array){
    var blankPosition = array.length;
    for(var i = array.length - 1 ; i >= 0 ; i--){
        if(array[i] == blank || array[i] == medicine){
            blankPosition = i;
        }
    }
    return blankPosition;
}
function randomOneLine(height, currentPreMap) {
    var caseNum = 3;
    var map = initializeSomeLine(height, 1);
    for (var i = 0; i < height; i++) {
        (map.mapContent)[0][i] = blank;
    }
    if(currentPreMap.length == 0){
        currentPreMap = initializeSomeLine(height, 1);
        for(var i = 0 ; i < height ; i++){
            currentPreMap.mapContent[0][i] = blank;
        }
    }
    var preMapEndArray = currentPreMap.mapContent[currentPreMap.length - 1];
    //some random stones
    for(var i = 0 ; i < height - 1 ; i++){
        if(Math.floor(Math.random() * Math.pow(2, i) / denseFactor) == 0){
            var stonePosition = Math.floor(Math.random() * (height - 1));
            (map.mapContent)[0][stonePosition] = stone;
        }
    }
    //repeat pattern
    for(var i = 0 ; i < height - 1 ; i++){
        if(preMapEndArray[i] == stone && Math.floor(Math.random() * 2) == 0){
            map.mapContent[0][i] = stone;
        }
    }
    //jump some distance
    for(var i = 0 ; i < height - 1 ; i++){
        if(preMapEndArray[i] == stone && Math.floor(Math.random() * 4) == 0){
            map.mapContent[0][(i + jumpHeight) % height] = stone;
        }
    }

    for(var i = 0 ; i < height ; i++){
        if(preMapEndArray[i] == blank || preMapEndArray[i] == medicine){
            var preIndexOfi = (i + height - 1) % height;
            if(preMapEndArray[preIndexOfi] == stone || preMapEndArray[preIndexOfi] == bomb){
                map.mapContent[0][i] = blank;
            }
        }
    }

    for(var i = 0 ; i < height ; i++){
        if(map.mapContent[0][i] == blank){
            if((i == 0 && Math.floor(Math.random() / medicineFactor) == 0) 
                || (i > 0 && map.mapContent[0][i - 1] == stone && Math.floor(Math.random() / (medicineFactor * 2)) == 0)){
                map.mapContent[0][i] = medicine;
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



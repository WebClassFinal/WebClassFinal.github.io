/** 
* Created by Paul on 2014/7/14
*/

const blank = 0,
    stone = 1,
    medicine = 2,
    bomb = 3,
    grass = 4;

var repeatFactor = 4;
var denseFactor = 1;
var medicineFactor = 0.1;
var blankFactor = 0.25;
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
        if(currentPreMap.length > 0 && Math.floor(Math.random() * 4) == 0){
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
function randomOneLine(height, currentPreMap) {
    var caseNum = 3;
    var map = initializeSomeLine(height, 1);
    while(true){
        for (var i = 0; i < height; i++) {
            (map.mapContent)[0][i] = blank;
        }

        if(Math.floor(Math.random() / blankFactor) == 0){
            //do nothing
        }else if(Math.floor(Math.random() * 3) > 0) {
            //stones from ground to stoneNum
                var stoneNum = Math.floor(Math.random() * height / 3 * 2);
                for (var i = 0; i < stoneNum; i++) {
                    (map.mapContent)[0][i] = stone;
                }
        }else{
            //some random stones
                for(var i = 0 ; i < height - 1 ; i++){
                    if(Math.floor(Math.random() * Math.pow(2, i) / denseFactor) == 0){
                        var stonePosition = Math.floor(Math.random() * height);
                        (map.mapContent)[0][stonePosition] = stone;
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


        if(map.mapContent[0][height - 1] == stone || bomb){
            map.mapContent[0][height - 1] = blank;
        }
        if(couldConnect(currentPreMap, map)){//Could I connect the line to currentPreMap?
            return map;
        }
    }
}
function getElementAt(map, x, y) {
    return (map.mapContent)[y][x];
}
//If one of map* is empty, return true.
//If the blank or medicine blocks are connected, return true. otherwise return false.
function couldConnect(map1, map2) {
	if(map1.length == 0 || map2.length == 0){
		return true;
	}

    var map1End = map1.mapContent[map1.length - 1];
    var map2Start = map2.mapContent[0];
    var tempConnect = [map1End.slice(), map2Start.slice()];
    var height = map1.height;
    var connectionBound = map1.height - 1;
    var isValidConnect = true;
    //mark -1 for blank and medicine
    for(var i = 0 ; i < tempConnect.length ; i++){
        for(var j = 0 ; j < height ; j++){
            if(tempConnect[i][j] == blank || tempConnect[i][j] == medicine){
                tempConnect[i][j] = 0;
            }
            else{
                tempConnect[i][j] = 1;
            }
        }
    }
    //recursive depth first search
    function markBlank(xPosition, yPosition){
        if(tempConnect[1 - xPosition][yPosition] == 0){
            tempConnect[1 - xPosition][yPosition] = -1;
            markBlank(1 - xPosition, yPosition);
        }
        if(yPosition > 0 && tempConnect[xPosition][yPosition - 1] == 0){
            tempConnect[xPosition][yPosition - 1] = -1;
            markBlank(xPosition, yPosition - 1);
        }
        if(yPosition < connectionBound - 1 && tempConnect[xPosition][yPosition + 1] == 0){
            tempConnect[xPosition][yPosition + 1] = -1;
            markBlank(xPosition, yPosition + 1);
        }
    }
    //mark -1 for first dfs
    (function(){
        for(var i = 0 ; i < tempConnect.length ; i++){
            for(var j = 0 ; j < connectionBound ; j++){
                if(tempConnect[i][j] == 0){
                    tempConnect[i][j] = -1;
                    markBlank(i, j);
                    return;
                }
            }
        }
    })();
    //If all the blanks are marked -1, return true
    for(var i = 0 ; i < tempConnect.length ; i++){
        for(var j = 0 ; j < connectionBound ; j++){
            if(tempConnect[i][j] == 0){
                isValidConnect = false;
            }
        }
    }
    
    return isValidConnect;
}

function connectMap(map1, map2){
	var newMap = initializeSomeLine(map1.height, map1.length + map2.length);
    newMap.mapContent = map1.mapContent.concat(map2.mapContent);
    return newMap;
}

function drawImage(map, canvas){
    canvasContext = canvas.getContext("2d");
    canvasContext.rotate(Math.PI / 2 * (1));
    canvasContext.scale(1,-1);
    var heightPerBlock = canvas.width / map.height;
    var img = new Image;
    img.onload = function(){
        var widthPerBlock = img.width * heightPerBlock / img.height;

        for(var i = 0 ; i < map.length ; i++){
            for(var j = 0 ; j < map.height ; j++){
                if(map.mapContent[i][j] == stone){
                    canvasContext.drawImage(img, i * widthPerBlock, j * heightPerBlock, widthPerBlock, heightPerBlock);
                }
            }
        }
    }
    img.src = "./img/stone.jpg";
    var img2 = new Image;
    img2.onload = function(){
        var widthPerBlock = img2.width * heightPerBlock / img2.height;

        for(var i = 0 ; i < map.length ; i++){
            for(var j = 0 ; j < map.height ; j++){
                if(map.mapContent[i][j] == medicine){
                    canvasContext.drawImage(img2, i * widthPerBlock, j * heightPerBlock, widthPerBlock, heightPerBlock);
                }
            }
        }
    }
    img2.src = "./img/medicine.jpg";
}


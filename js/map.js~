/** 
* Created by Paul on 2014/7/13
*/

const blank = 0,
    stone = 1,
    grass = 2,
    medicine = 3,
    bomb = 4;

//size is an object with  property height and length; preMap is the map previously
//return a newMap {height: some, length: some, mapContent: a two-dimension array}
function generateMap(size, preMap) {
	var currentPreMap = preMap;
	var height = preMap.height;
	var newMap = {
        height: height,
        length: 0,
        mapContent: []
    };
    //one line for each loop
    for(var i = 0 ; i < size.length ; i++){
        var tempOneLine = randomOneLine(height, currentPreMap);
    	newMap = connectMap(newMap, tempOneLine);
    	currentPreMap = tempOneLine;
    }
    return newMap;
}

function getElementAt(map, x, y) {
    return (map.mapContent)[y][x];
}

function randomOneLine(height, currentPreMap) {
    var caseNum = 3;
    var currentCase = Math.floor(Math.random() * 3);
    var map = {
        height: height,
        length: 1,
        mapContent: [new Array(height)]
    };

    
    while(true){
        //repeat the previous line
        if(currentPreMap.length > 0 && Math.floor(Math.random() * 4) == 0){
            map.mapContent = [currentPreMap.mapContent[currentPreMap.length - 1].slice()];
            return map;
        }
        //otherwise generate randomly
        for (var i = 0; i < height; i++) {
            (map.mapContent)[0][i] = blank;
        }
        switch (currentCase) {
            case 0://stones from ground to stoneNum
                var stoneNum = Math.floor(Math.random() * height / 3 * 2);
                for (var i = 0; i < stoneNum; i++) {
                    (map.mapContent)[0][i] = stone;
                }
                break;
            case 1://stones from stoneStart to stoneEnd
                var stoneStart = Math.floor(Math.random() * height / 3);
                var stoneEnd = Math.floor(Math.random() * height / 3 * 2);
                for (var i = stoneStart; i < stoneEnd; i++) {
                    (map.mapContent)[0][i] = stone;
                }
                break;
            case 2://two random stones
                var stonePosition1 = Math.floor(Math.random() * height);
                var stonePosition2 = Math.floor(Math.random() * height);
                (map.mapContent)[0][stonePosition1] = stone;
                (map.mapContent)[0][stonePosition2] = stone;
                break;
        }
        if(couldConnect(currentPreMap, map)){//Could I connect the line to currentPreMap?
            return map;
        }
    }
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
        if(yPosition < height - 1 && tempConnect[xPosition][yPosition + 1] == 0){
            tempConnect[xPosition][yPosition + 1] = -1;
            markBlank(xPosition, yPosition + 1);
        }
    }
    //mark -1 for first dfs
    (function(){
        for(var i = 0 ; i < tempConnect.length ; i++){
            for(var j = 0 ; j < height ; j++){
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
        for(var j = 0 ; j < height ; j++){
            if(tempConnect[i][j] == 0){
                isValidConnect = false;
            }
        }
    }
    
    return isValidConnect;
}

function connectMap(map1, map2){
	var newMap = {
        height: map1.height,
        length: map1.length + map2.length,
        mapContent: []
    };
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
}


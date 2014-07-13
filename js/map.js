/** 
* Created by Paul on 2014/7/13
*/

const blank = 0,
    stone = 1,
    grass = 2,
    medicine = 3,
    bomb = 4;

function generateMap(size, preMap) {
	var currentPreMap = preMap;
	var height = preMap.height;
	var newMap = {
        height: height,
        length: 0,
        mapContent: []
    };
    for(var i = 0 ; i < size.length ; i++){
        var tempOneLine;
        if(currentPreMap.length == 0 || Math.floor(Math.random() * 3) > 0){
    	   tempOneLine = randomOneLine(height, currentPreMap);
        }
        else{console.log(currentPreMap);
            tempOneLine = {
                height: height,
                length: 1,
                mapContent: [currentPreMap.mapContent[currentPreMap.length - 1].slice()]
            }
        }
    	newMap = connectMap(newMap, tempOneLine);
    	currentPreMap = tempOneLine;
    }
    return newMap;
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
        for (var i = 0; i < height; i++) {
            (map.mapContent)[0][i] = blank;
        }
        switch (currentCase) {
            case 0:
                var stoneNum = Math.floor(Math.random() * height / 3 * 2);
                for (var i = 0; i < stoneNum; i++) {
                    (map.mapContent)[0][i] = stone;
                }
                break;
            case 1:
                var stoneStart = Math.floor(Math.random() * height / 3);
                var stoneEnd = Math.floor(Math.random() * height / 3 * 2);
                for (var i = stoneStart; i < stoneEnd; i++) {
                    (map.mapContent)[0][i] = stone;
                }
                break;
            case 2:
                var stonePosition1 = Math.floor(Math.random() * height);
                var stonePosition2 = Math.floor(Math.random() * height);
                (map.mapContent)[0][stonePosition1] = stone;
                (map.mapContent)[0][stonePosition2] = stone;
                break;
        }
        if(couldConnect(currentPreMap, map)){
            return map;
        }
    }
}

function couldConnect(map1, map2) {
	if(map1.length == 0 || map2.length == 0){
		return true;
	}

    var map1End = map1.mapContent[map1.length - 1];
    var map2Start = map2.mapContent[0];
console.log(map1End);console.log(map2Start);
    var tempConnect = [map1End.slice(), map2Start.slice()];
    var height = map1.height;
    var isValidConnect = true;

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

/*function drawImage(map, canvas){
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
}*/
/*var newMap = {
        height: 10,
        length: 0,
        mapContent: []
    };

newMap = generateMap({height: 10, length: 100}, newMap);*/
/*var canvas = $("#map");
canvas.parent().css({"left": "95px"});
canvas.attr("width", canvas.parent().width());
canvas.attr("height", 2 * canvas.parent().height());
drawImage(newMap, canvas.get(0));*/
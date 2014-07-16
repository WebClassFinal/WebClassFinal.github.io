function generateMap(size, preMap) {
    var height = size.height,
        length = size.length;
    var map = initializeMap(height, 0);
    map = connectMap(map, templateMap(height, 3));
    while (map.length < length) {
        map = connectMap(map, templateMap(height));
    }
    //add medicine
    for (var i = 0; i < length; i++) {
        for (var j = 0; j < height; j++) {
            if (j > 0 && map.mapContent[i][j] == blank && map.mapContent[i][j - 1] == stone) {
                //Medicine in the first layer is not very possible; second layer and third layer very possible
                if (j == firstLayerPosition + 1 && Math.floor(Math.random() / medicineFactor * 5) == 0) {
                    map.mapContent[i][j] = medicine;
                }
                if (j == secondLayerPosition + 1 && Math.floor(Math.random() / medicineFactor) == 0) {
                    map.mapContent[i][j] = medicine;
                }
                if (j == thirdLayerPosition + 1 && Math.floor(Math.random() / medicineFactor * 2) == 0) {
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

function connectMap(map1, map2) {
    var newMap = initializeMap(map1.height, map1.length + map2.length);
    newMap.mapContent = map1.mapContent.concat(map2.mapContent);
    return newMap;
}

function initializeMap(height, length) {
    var result = {
        height: height,
        length: length,
        mapContent: new Array(length)
    };
    for (var i = 0; i < length; i++) {
        result.mapContent[i] = new Array(height);
    }
    for (var i = 0; i < length; i++) {
        for (var j = 0; j < height; j++) {
            result.mapContent[i][j] = blank;
        }
    }
    return result;
}

function setValue(map, xPosition, yPosition, value) {
    map.mapContent[xPosition][yPosition] = value;
}

function templateMap(height, templateNum) {
    var randomIndex = Math.floor(Math.random() * map_template.length);
    if (typeof arguments[1] != "undefined") {
        randomIndex = templateNum;
    }
    var template = map_template[randomIndex];
    var map = initializeMap(height, template.length);
    for (var i = 0; i < map.length; i++) {
        setValue(map, i, firstLayerPosition, template.firstLayer[i]);
        setValue(map, i, secondLayerPosition, template.secondLayer[i]);
        setValue(map, i, thirdLayerPosition, template.thirdLayer[i]);
    }
    return map;
}

var blank = 0;
var stone = 1;
var medicine = 2;
var firstLayerPosition = 0;
var secondLayerPosition = 4;
var thirdLayerPosition = 8;

var medicineFactor = 0.15;

var map_template1 = {
    length: 30,
    firstLayer: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    secondLayer: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    thirdLayer: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};

var map_template2 = {
    length: 40,
    firstLayer: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    secondLayer: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    thirdLayer: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};

var map_template3 = {
    length: 10,
    firstLayer: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    secondLayer: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    thirdLayer: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};
var map_template4 = {
    length: 10,
    firstLayer: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    secondLayer: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    thirdLayer: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};
var map_template5 = {
    length: 10,
    firstLayer: [1, 1, 1, 1, 0, 1, 1, 0, 1, 1],
    secondLayer: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    thirdLayer: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};
var map_template6 = {
    length: 10,
    firstLayer: [1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
    secondLayer: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    thirdLayer: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};
var map_template7 = {
    length: 10,
    firstLayer: [1, 1, 1, 0, 0, 1, 1, 0, 1, 1],
    secondLayer: [0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
    thirdLayer: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};

var map_template8 = {
    length: 30,
    firstLayer: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    secondLayer: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    thirdLayer: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};
var map_template9 = {
    length: 50,
    firstLayer: [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    secondLayer: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    thirdLayer: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]
};
var map_template = [map_template1, map_template2, map_template3, map_template4, map_template5, map_template6, map_template7, map_template8, map_template9];


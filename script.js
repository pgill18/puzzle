var PUZZLE_DIFFICULTY = 4;
var PUZZLE_HOVER_TINT = '#58a7d3';

var _stage;
var _canvas;

var _img;
var _pieces;
var _puzzleWidth;
var _puzzleHeight;
var _pieceWidth;
var _pieceHeight;
var _currentPiece;
var _currentDropPiece;

var _mouse;

var _canvasOffset = 0;

function init(dificult, image){
    'use strict';
    // document.ontouchmove = function(event){ event.preventDefault(); }
    document.addEventListener("touchmove", function (e) {
      if (e.target == canvas) { e.preventDefault(); }}, {passive: false});
    _img = new Image();
    _img.addEventListener('load',onImage,false);
    _img.src = image;
    PUZZLE_DIFFICULTY = dificult;
}
function onImage(e){
    'use strict';
    _pieceWidth = Math.floor(_img.width / PUZZLE_DIFFICULTY);
    _pieceHeight = Math.floor(_img.height / PUZZLE_DIFFICULTY);
    _puzzleWidth = _pieceWidth * PUZZLE_DIFFICULTY;
    _puzzleHeight = _pieceHeight * PUZZLE_DIFFICULTY;
    setCanvas();
    initPuzzle();
}
function setCanvas(){
    'use strict';
    _canvas = document.getElementById('canvas');
    _stage = _canvas.getContext('2d');
    _canvas.width = _puzzleWidth;
    _canvas.height = _puzzleHeight;
    _canvas.style.border = "0px solid transparent";
    _canvasOffset = _canvas.getBoundingClientRect();
}
function initPuzzle(){
    'use strict';
    _pieces = [];
    _mouse = {x:0,y:0};
    _currentPiece = null;
    _currentDropPiece = null;
    _stage.drawImage(_img, 0, 0, _puzzleWidth, _puzzleHeight, 0, 0, _puzzleWidth, _puzzleHeight);
    createTitle("Click to open the puzzle");
    buildPieces();
}
function createTitle(msg){
    'use strict';
    _stage.fillStyle = "#000000";
    _stage.globalAlpha = 0.4;
    _stage.fillRect(100,_puzzleHeight - 40,_puzzleWidth - 200,40);
    _stage.fillStyle = "#aec90b";
    _stage.globalAlpha = 1;
    _stage.textAlign = "center";
    _stage.textBaseline = "middle";
    _stage.font = "18px Lato";
    _stage.fillText(msg,_puzzleWidth / 2,_puzzleHeight - 20);
}
function buildPieces(){
    'use strict';
    var i;
    var piece;
    var xPos = 0;
    var yPos = 0;
    for(i = 0;i < PUZZLE_DIFFICULTY * PUZZLE_DIFFICULTY;i+=1){
        piece = {};
        piece.sx = xPos;
        piece.sy = yPos;
        _pieces.push(piece);
        xPos += _pieceWidth;
        if(xPos >= _puzzleWidth){
            xPos = 0;
            yPos += _pieceHeight;
        }
    }
    document.onmousedown = shufflePuzzle;
    document.getElementById('canvas').ontouchstart = shufflePuzzle;
}
function shufflePuzzle(){
    'use strict';
    _pieces = shuffleArray(_pieces);
    _stage.clearRect(0,0,_puzzleWidth,_puzzleHeight);
    var i;
    var piece;
    var xPos = 0;
    var yPos = 0;
    for(i = 0;i < _pieces.length;i+=1){
        piece = _pieces[i];
        piece.xPos = xPos;
        piece.yPos = yPos;
        _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, xPos, yPos, _pieceWidth, _pieceHeight);
        _stage.strokeRect(xPos, yPos, _pieceWidth,_pieceHeight);
        xPos += _pieceWidth;
        if(xPos >= _puzzleWidth){
            xPos = 0;
            yPos += _pieceHeight;
        }
    }
    document.onmousedown = onPuzzleClick;
    document.getElementById('canvas').ontouchstart = onPuzzleClick;
}
function onPuzzleClick(e){
    'use strict';
    // if(e.layerX || e.layerX == 0){
    //     _mouse.x = e.layerX; // - _canvas.offsetLeft;
    //     _mouse.y = e.layerY; // - _canvas.offsetTop;
    // }
    // else if(e.offsetX || e.offsetX == 0){
    //     _mouse.x = e.offsetX - _canvas.offsetLeft;
    //     _mouse.y = e.offsetY - _canvas.offsetTop;
    // }
    // else {
    //     const {pageX, pageY} = e.touches ? e.touches[0] : e;
    //     const multX = _puzzleWidth/screen.width;
    //     _mouse.x = (pageX - _canvasOffset.left) *multX;
    //     _mouse.y = (pageY - _canvasOffset.top) *multX;
    //     // console.log(`${_mouse.x} = ${pageX*multX} - ${_canvasOffset.left*multX}`)
    //     // console.log(`${_mouse.y} = ${pageY*multX} - ${_canvasOffset.top*multX}`)
    // }
    if(e.layerX || e.layerX == 0){
        // _mouse.x = e.layerX - _canvas.offsetLeft;
        // _mouse.y = e.layerY - _canvas.offsetTop;
        let multX = _puzzleWidth/screen.width; if(multX<1) multX = 1;
        _mouse.x = e.layerX * multX; // - _canvas.offsetLeft;
        _mouse.y = e.layerY * multX; // - _canvas.offsetTop;
        // _mouse.x = (e.layerX - _canvasOffset.left) *multX;
        // _mouse.y = (e.layerY - _canvas.offsetTop) *multX;
        // console_log({mx:_mouse.x, my:_mouse.y, pzw: _puzzleWidth, pzh: _puzzleHeight, pcw: _pieceWidth, pch: _pieceHeight}, 
        // { log: ` _mouse.x = (${e.layerX} //- ${_canvas.offsetLeft}); //e.layerX `});
    }
    else if(e.offsetX || e.offsetX == 0){
        // _mouse.x = e.offsetX - _canvas.offsetLeft;
        // _mouse.y = e.offsetY - _canvas.offsetTop;
        let multX = _puzzleWidth/screen.width; if(multX<1) multX = 1;
        _mouse.x = e.offsetX * multX; // - _canvas.offsetLeft;
        _mouse.y = e.offsetY * multX; // - _canvas.offsetTop;
        // _mouse.x = (e.offsetX - _canvasOffset.left) *multX;
        // _mouse.y = (e.offsetY - _canvas.offsetTop) *multX;
        // console_log({mx:_mouse.x, my:_mouse.y, pzw: _puzzleWidth, pzh: _puzzleHeight, pcw: _pieceWidth, pch: _pieceHeight}, 
        // { log: ` _mouse.x = (${e.offsetX} - ${_canvas.offsetLeft}); //e.offsetX `});
    }
    else {
        let {pageX, pageY} = e.touches ? e.touches[0] : e;
        let multX = _puzzleWidth/screen.width;
        _mouse.x = (pageX - _canvasOffset.left) *multX;
        _mouse.y = (pageY - _canvasOffset.top) *multX;
        // console.log(`${_mouse.x} = ${pageX*multX} - ${_canvasOffset.left*multX}`)
        // console.log(`${_mouse.y} = ${pageY*multX} - ${_canvasOffset.top*multX}`)
        // console_log({mx:_mouse.x, my:_mouse.y, pzw: _puzzleWidth, pzh: _puzzleHeight, pcw: _pieceWidth, pch: _pieceHeight}, 
        // { log: ` _mouse.x = (${pageX} - ${_canvasOffset.left}) *${multX}; //pageX `});
    }
    _currentPiece = checkPieceClicked();
    if(_currentPiece != null){
        _stage.clearRect(_currentPiece.xPos,_currentPiece.yPos,_pieceWidth,_pieceHeight);
        _stage.save();
        _stage.globalAlpha = 0.9;
        _stage.drawImage(_img, _currentPiece.sx, _currentPiece.sy, _pieceWidth, _pieceHeight, _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth, _pieceHeight);
        _stage.restore();
        document.onmousemove = updatePuzzle;
        document.getElementById('canvas').ontouchmove = updatePuzzle;
        document.onmouseup = pieceDropped;
        document.getElementById('canvas').ontouchend = pieceDropped;
    }
}
function checkPieceClicked(){
    'use strict';
    var i;
    var piece;
    for(i = 0;i < _pieces.length;i+=1){
        piece = _pieces[i];
        if(_mouse.x < piece.xPos || _mouse.x > (piece.xPos + _pieceWidth) || _mouse.y < piece.yPos || _mouse.y > (piece.yPos + _pieceHeight)){
            //PIECE NOT HIT
        }
        else{
            return piece;
        }
    }
    return null;
}
function updatePuzzle(e){
    'use strict';
    _currentDropPiece = null;
    if(e.layerX || e.layerX == 0){
        // _mouse.x = e.layerX - _canvas.offsetLeft;
        // _mouse.y = e.layerY - _canvas.offsetTop;
        let multX = _puzzleWidth/screen.width; if(multX<1) multX = 1;
        _mouse.x = e.layerX * multX; // - _canvas.offsetLeft;
        _mouse.y = e.layerY * multX; // - _canvas.offsetTop;
        // _mouse.x = (e.layerX - _canvasOffset.left) *multX;
        // _mouse.y = (e.layerY - _canvas.offsetTop) *multX;
        // console_log({mx:_mouse.x, my:_mouse.y, pzw: _puzzleWidth, pzh: _puzzleHeight, pcw: _pieceWidth, pch: _pieceHeight}, 
        // { log: ` _mouse.x = (${e.layerX} //- ${_canvas.offsetLeft}); //e.layerX `});
    }
    else if(e.offsetX || e.offsetX == 0){
        // _mouse.x = e.offsetX - _canvas.offsetLeft;
        // _mouse.y = e.offsetY - _canvas.offsetTop;
        let multX = _puzzleWidth/screen.width; if(multX<1) multX = 1;
        _mouse.x = e.offsetX * multX; // - _canvas.offsetLeft;
        _mouse.y = e.offsetY * multX; // - _canvas.offsetTop;
        // _mouse.x = (e.offsetX - _canvasOffset.left) *multX;
        // _mouse.y = (e.offsetY - _canvas.offsetTop) *multX;
        // console_log({mx:_mouse.x, my:_mouse.y, pzw: _puzzleWidth, pzh: _puzzleHeight, pcw: _pieceWidth, pch: _pieceHeight}, 
        // { log: ` _mouse.x = (${e.offsetX} - ${_canvas.offsetLeft}); //e.offsetX `});
    }
    else {
        let {pageX, pageY} = e.touches ? e.touches[0] : e;
        let multX = _puzzleWidth/screen.width;
        _mouse.x = (pageX - _canvasOffset.left) *multX;
        _mouse.y = (pageY - _canvasOffset.top) *multX;
        // console.log(`${_mouse.x} = ${pageX*multX} - ${_canvasOffset.left*multX}`)
        // console.log(`${_mouse.y} = ${pageY*multX} - ${_canvasOffset.top*multX}`)
        // console_log({mx:_mouse.x, my:_mouse.y, pzw: _puzzleWidth, pzh: _puzzleHeight, pcw: _pieceWidth, pch: _pieceHeight}, 
        // { log: ` _mouse.x = (${pageX} - ${_canvasOffset.left}) *${multX}; //pageX `});
    }
    _stage.clearRect(0,0,_puzzleWidth,_puzzleHeight);
    var i;
    var piece;
    for(i = 0;i < _pieces.length;i+=1){
        piece = _pieces[i];
        if(piece == _currentPiece){
            continue;
        }
        _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
        _stage.strokeRect(piece.xPos, piece.yPos, _pieceWidth,_pieceHeight);
        if(_currentDropPiece == null){
            if(_mouse.x < piece.xPos || _mouse.x > (piece.xPos + _pieceWidth) || _mouse.y < piece.yPos || _mouse.y > (piece.yPos + _pieceHeight)){
                //NOT OVER
            }
            else{
                _currentDropPiece = piece;
                _stage.save();
                _stage.globalAlpha = 0.4;
                _stage.fillStyle = PUZZLE_HOVER_TINT;
                _stage.fillRect(_currentDropPiece.xPos,_currentDropPiece.yPos,_pieceWidth, _pieceHeight);
                _stage.restore();
                // console_log({mx:_mouse.x, my:_mouse.y, pzw: _puzzleWidth, pzh: _puzzleHeight, pcw: _pieceWidth, pch: _pieceHeight}, 
                    // { xps: piece.xPos, xpy: piece.yPos, dpx: _currentDropPiece.xPos, dpy: _currentDropPiece.yPos});
            }
        }
    }
    _stage.save();
    _stage.globalAlpha = 0.6;
    _stage.drawImage(_img, _currentPiece.sx, _currentPiece.sy, _pieceWidth, _pieceHeight, _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth, _pieceHeight);
    _stage.restore();
    _stage.strokeRect( _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth,_pieceHeight);
}
function pieceDropped(e){
    'use strict';
    document.onmousemove = null;
    document.getElementById('canvas').ontouchmove = null;

    document.onmouseup = null;
    document.getElementById('canvas').ontouchend = null;
    if(_currentDropPiece != null){
        var tmp = {xPos:_currentPiece.xPos,yPos:_currentPiece.yPos};
        _currentPiece.xPos = _currentDropPiece.xPos;
        _currentPiece.yPos = _currentDropPiece.yPos;
        _currentDropPiece.xPos = tmp.xPos;
        _currentDropPiece.yPos = tmp.yPos;
    }
    resetPuzzleAndCheckWin();
}
function resetPuzzleAndCheckWin(){
    'use strict';
    _stage.clearRect(0,0,_puzzleWidth,_puzzleHeight);
    var gameWin = true;
    var i;
    var piece;
    for(i = 0;i < _pieces.length;i+=1){
        piece = _pieces[i];
        _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
        _stage.strokeRect(piece.xPos, piece.yPos, _pieceWidth,_pieceHeight);
        if(piece.xPos != piece.sx || piece.yPos != piece.sy){
            gameWin = false;
        }
    }
    if(gameWin){
        setTimeout(gameOver,500);
    }
}
function gameOver(){
    'use strict';
    document.onmousedown = null;
    document.getElementById('canvas').ontouchstart = null;
    document.onmousemove = null;
    document.getElementById('canvas').ontouchmove = null;
    document.onmouseup = null;
    document.getElementById('canvas').ontouchend = null;
    // alert('You Win!');
    // initPuzzle();
    let msg = "Ready for a bigger challenge?";
    if(confirm(msg))
        init(PUZZLE_DIFFICULTY+1, _img.src)
    else
        init(PUZZLE_DIFFICULTY, _img.src)
}
function shuffleArray(o){
    'use strict';
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function console_log(obj1, obj2) {
    // console.log(obj1, obj2);
    document.getElementById("console1").innerHTML = objToString(obj1);
    document.getElementById("console2").innerHTML = objToString(obj2);
    var browserZoomLevel = Math.round(window.devicePixelRatio * 100);
    document.getElementById("console3").innerHTML = `screen-width: ${screen.width}, screen-height: ${screen.height}, zoom: ${browserZoomLevel}%`;
}
function objToString(obj) {
    return Object.keys(obj).map(key => key+' : '+obj[key]).join('\n');
}

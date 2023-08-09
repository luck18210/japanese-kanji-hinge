// CHECK FOR TOUCHSCREEN AND REMOVE SUBMIT BUTTON IF PRESENT
if(window.matchMedia("(pointer: coarse)").matches) {
    document.getElementById("sendButton").style.display = "none";
}

// SET UP CANVAS HEIGHT BASED ON USER PHONESIZE
const bodyheight = document.body.clientHeight;

const upperHalfHeight = document.getElementById('upperHalf').clientHeight;
const kanjiBoxHeight = document.getElementById('newKanji').clientHeight;
const resultsHeight = document.getElementById('resultsBoxes').clientHeight;
const canvasButtonsHeight = document.getElementById('canvasButtons').clientHeight;

const remainder = bodyheight - (upperHalfHeight + kanjiBoxHeight + resultsHeight + canvasButtonsHeight) - 18;

// document.getElementById("canvas").width = document.body.clientWidth - 4;
document.getElementById("canvas").width = document.getElementById("resultsBoxes").clientWidth - 4; // This version accounts for change to size with .appframe class
document.getElementById("canvas").height = remainder;

document.getElementById("canvas").style.display = "block"; // unhide the canvas here -- otherwise you can see this resizing happening on loadup!

// PROVIDE SETTINGS FOR HANDWRITING.JS CANVAS API
var canvas = new handwriting.Canvas(document.getElementById('canvas'), 3);
    
    canvas.setOptions({
        language: "ja", 
        numOfWords: 1, 
        numOfReturn: 6,
    });
    
    canvas.set_Undo_Redo(true, false);
    canvas.setLineWidth(7);


/*  THIS CODE LOADS THE "resultbox" <buttons> WITH INFO: see lines 230-237 in handwriting.canvas.js and see buttons in <DIV> class "resultsboxes" above */
canvas.setCallBack(function(data, err) 
{  
    if (err) {                           
        throw err;
    }
    else {
        // Z-logic to be removed if significant difference between mobile handwriting and mousepad input does not persist.
        for (i = 0, z = 5; i < 6; i++, z--) 
        {
            if (data[i] == null ) {
                continue;
            }
            else {
                // document.getElementById("rb" + i).innerHTML = data[i];
                document.getElementById("rb" + z).innerHTML = data[i];
            }
        }
    }       
});



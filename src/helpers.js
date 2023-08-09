/* Core functionality for handling user input and dictionary lookup */

// NOTE: OS_VAL is defined in "OSsetup.js"

let firstInputCheck = 0;

function submitKanji(newKanji, buttonid)
{
    if (firstInputCheck === 0)
    {   
        // Clear the title ('連想漢字蝶番') upon first user input
        document.getElementById("outputboxes").innerHTML = "";
        firstInputCheck = 1;
    }

    /* These just let the user move to a different kanji if they get stuck/break up their kanji list */
    if (buttonid === "stopButton" || buttonid === "commaButton")
    {
        passKanji(newKanji);
        return;
    }

    let prevKanji = document.getElementById("nk").innerHTML;
    if (prevKanji === newKanji) {
        // user has input same character twice
        document.getElementById(buttonid).className = "resultbox" + OS_VAL + "failure";
        return; 
    }

    let thisBushu = [];     // Need Array: not all kanji entries have >1 components 
    try {
        // newKanji is indeed a kanji
        thisBushu = Array.from(dictionary[newKanji].bushu); 
    }
    catch(err) {
        // newKanji is hiragana, romaji, or special characters
        document.getElementById(buttonid).className = "resultbox" + OS_VAL + "failure";
        return;
    }

    const exceptions = ["　", "。", "、"];
    if (exceptions.includes(prevKanji)) // this checks the LAST kanji that was written, not the PRESENT one!
    {
        passKanji(newKanji);
        return;
    }
    else 
    {
        let prevBushu = Array.from(dictionary[prevKanji].bushu);

        let result = findCommonBushu(thisBushu, prevBushu);
        if (result == true)
        {
            passKanji(newKanji);
            document.getElementById(buttonid).innerHTML = newKanji;
            document.getElementById(buttonid).className = "resultbox" + OS_VAL + "pass"
            return;
        }
        else {
            document.getElementById(buttonid).className = "resultbox" + OS_VAL + "failure";
            return;
        }
    }
}


function passKanji(kanji)
{
    canvas.erase();
    resetColours(); 
    for (i = 0; i < 6; i++) {
        // Mustn't refactor this loop into resetColours() because that gets used by the HTML canvas Undo and Erase buttons
        document.getElementById("rb" + i).innerHTML = "　"; 
    }

    // 1. Update new kanji div; 2. Update previous kanji list; 3. Scroll to bottom of output div.
    document.getElementById("nk").innerHTML = kanji;
    document.getElementById("outputboxes").innerHTML += '<button class="kanjiList' + OS_VAL + '" onclick="kanjiInfo(this.innerHTML)">' + kanji + '</button>';
    updateScroll();
}

function resetColours()
{
    for (i = 0; i < 6; i++) {
        document.getElementById("rb" + i).className = "resultbox" + OS_VAL + "raw";
    }
}

function findCommonBushu(thisBushu, prevBushu) 
{
    /* Iterate through each element in the first array and if some of 
    them include the elements in the second　array then return true */
    return thisBushu.some(item => prevBushu.includes(item))
}    


function help()
{
    // Display app info
    document.getElementById("overlayText").innerHTML = "<center style='font-size:1.4rem;'><fg t='連想'>RENSOU</fg> <fg t='漢字'>KANJI</fg> <fg t='蝶番'>HINGE</fg></center>"
    + "<br>This is a mobile webapp for practicing hand-writing kanji by chaining them by their shared components."
    + "<center><br>例：虫虹工紅、寸吋囗吐土<br><br></center>"
    + "Write a kanji in the white box. Tap your kanji when it appears in one of the grey boxes to add it to the list. " 
    + "Tap ､ or ｡ to start a new sequence. 写 to copy to clipboard. "
    // + "〒 to export. "
    + "If you want to know more about a kanji, tap on it!"
    + "<br><br>"
    + "<a href='https://callumbeaney.github.io/website/'>Callum Beaney</a> made this based on how he used to practice kanji on a notepad at work. Read the source code <a href='https://github.com/CallumBeaney/rensou-kanji-hinge'>here</a>. Report a bug <a href='https://github.com/CallumBeaney/rensou-kanji-hinge/issues'>here</a>."
    + " Tap anywhere to return.";

    turnOverlayOn();
}


function kanjiInfo(kanji, mode)            
{    
    // for passing punctuation through external output modes
    if (mode != null && kanji === "。" || kanji === "、")
    {
        let toSend = [kanji];
        document.getElementById("overlayText").innerHTML += toSend;
        return;
    }

    /* -------------- DICTIONARY ENTRY HANDLING STARTS -------------- */

    let heisigIndex;
        if (dictionary[kanji].heisig === null || dictionary[kanji].heisig === undefined) {   
            heisigIndex = "unlisted";   
        } else { 
            heisigIndex = dictionary[kanji].heisig;   
        }

    let yomikata;
        if (typeof dictionary[kanji].yomikata === 'object') {
            yomikata = dictionary[kanji].yomikata.join("、");
        } else {
            yomikata = dictionary[kanji].yomikata;        
        }
                    
    let translation;
        if (typeof dictionary[kanji].eigo === 'object') {
            translation = dictionary[kanji].eigo.join(", ");
        } else {
            translation = dictionary[kanji].eigo;
        }

    let bushu;
        if (typeof dictionary[kanji].bushu === 'object') {
            bushu = dictionary[kanji].bushu.join(", ");
        } else {
            bushu = dictionary[kanji].bushu;
        }
        
    // .____Kanji and .____Kana ALWAYS correspond in length.
    let onyomiKanji;
    let onyomiKana;
        if (dictionary[kanji].onyomiKana === null) {  // If .____Kana is X, so is .____Kanji 
            onyomiKanji = null;
            onyomiKana  = null;
        } else {
            onyomiKanji = dictionary[kanji].onyomiKanji;
            onyomiKana  = dictionary[kanji].onyomiKana;
        } 

    let kunyomiKanji;
    let kunyomiKana;
        if (dictionary[kanji].kunyomiKana === null) {  
            kunyomiKanji =  null; 
            kunyomiKana  =  null;
        } else {
            kunyomiKanji = dictionary[kanji].kunyomiKanji;
            kunyomiKana  = dictionary[kanji].kunyomiKana;
        } 

    /* _______________ DICTIONARY ENTRY HANDLING ENDS _______________ */

    if (mode === "copy")
    {
            let toSend = kanji;   
            document.getElementById("overlayText").innerHTML += toSend; 
            return;
    }
    else if (mode === "send") // User wants to send themselves e.g. a CSV
    {
            // TODO: sort sending -- https://stackoverflow.com/questions/3868315/invoke-click-a-mailto-link-with-jquery-javascript
            
            // let toSend = [kanji, translation, yomikata, bushu, dictionary[kanji].jikaku.toString(), dictionary[kanji].wiki.toString(), heisigIndex];    
            // let toString = toSend.toString(", ");
            // document.getElementById("overlayText").innerHTML += toString;
            
            return;
    }    
    else // mode is undefined --> user wants to know about a character
    {   
        // TABLE SYNTAX FROM: https://www.tablesgenerator.com/html_tables#
        
        let output = "<p style='font-size: 4.5rem; margin:0 auto;' align='center'>" + kanji + "</p><br>" 
                   + "<table class='tg'><tbody>"
                   + "<tr>" + '<td class="tg-left">' + "発音" + "</td>";

        if (typeof dictionary[kanji].yomikata === 'object' && dictionary[kanji].yomikata.length >= 7) 
        {   
            output += '<td class="tg-right smalltext">' + yomikata + "</td>";
        } 
        else {
            output += '<td class="tg-right">' + yomikata + "</td>";
        }

        output += "<tr>" + '<td class="tg-left">' + "英語" + "</td>" + '<td class="tg-right">' + translation + "</td>"
                + "<tr>" + '<td class="tg-left">' + "部首" + "</td>" + '<td class="tg-right">' + bushu + "</td>"
                + "<tr>" + '<td class="tg-left">' + "字画" + "</td>" + '<td class="tg-right">' + dictionary[kanji].jikaku.toString() + "</td>"
                + "<tr>" + '<td class="tg-left">' + "Heisig" + "</td>" + '<td class="tg-right">' + heisigIndex + "</td>"
                + "<tr>" + '<td class="tg-left">' + "ウィキ" + "</td>" + '<td class="tg-right">' + dictionary[kanji].wiki.toString() + " 回出現する</td>";
        

        /* CONDITIONAL FURIGANA APPENDATION */
        if (onyomiKanji != null)
        {
            let addToOutput = buildFurigana(onyomiKanji, onyomiKana, "音読み");
            output += addToOutput;
        }
        if (kunyomiKanji != null)
        {
            let addToOutput = buildFurigana(kunyomiKanji, kunyomiKana, "訓読み");
            output += addToOutput;
        } 
        
        output += "</tbody></table>"; // Closing tags for HTML table
        document.getElementById("overlayText").innerHTML = output;

        turnOverlayOn(); 
    }

}


function buildFurigana(kanji, kana, type)
{
    let adder = "<tr>"    // Start the left-hand of the table entry
              + '<td class="tg-left">' + type + "</td>";
                    
    if (typeof kanji === 'string') // have just one kanji dict entry
    {
        adder += '<td class="tg-right">' 
               + '<fg t="' + kana + '">' + kanji + '</fg>'
               + '</td>';
    }
    if (typeof kanji === 'object') // have multiple dict entries
    {    
        if (kanji.length >= 8) {
            adder += '<td class="tg-right smalltext">';
        } 
        else {
            adder += '<td class="tg-right">'; 
        }

        // Build the kanji-furigana pairs
        for (i = 0; i < kanji.length; i++) {
            adder += '<fg t="' + kana[i] + '"> ' + kanji[i] + '</fg>, ';
        }

        adder += '</td>'; // Close On/Kunyomi Kanji cell   
    }
    
    return adder;
}

function outputList(mode)
{   
    document.getElementById('overlayText').innerHTML = "";
    let query = ".kanjiList" + OS_VAL;
    let elements = document.querySelectorAll(query);    
    
    // TODO: Can you strip "Array.from" from this?
    //      Appears so but double check
    Array.from(elements).forEach((element, index) => {
        kanjiInfo(element.innerHTML, mode);
    });

    // By now, the HTMLoverlay has been populated with the desired kanji information
    if (mode === "copy") 
    {
        copy_to_clipboard();
        document.getElementById('overlayText').insertAdjacentHTML("afterbegin", "The following list of characters has been copied to your clipboard: <br><br>");
    }
    else if (mode === "send") {
        // TODO: develop this functionality!
        document.getElementById("overlayText").innerHTML += "<center style='font-size:1.4rem;'><br><br>in development<br>発展つつある</center>";
    }

    turnOverlayOn();
}

async function copy_to_clipboard()
{
    let text = document.getElementById('overlayText').innerHTML;

    try {
        await navigator.clipboard.writeText(text);
        /* Passed - text copied to clipboard successfully */
    } catch (err) {
        console.error('Failed to copy: ', err);
        /* Rejected - text failed to copy to the clipboard */
    }

}


/*  UI FUNCTIONS  */

function updateScroll() 
{
    var element = document.getElementById("outputboxes");
    element.scrollTop = element.scrollHeight;
}

function turnOverlayOn() {
    document.getElementById("overlay").style.display = "block";
}
function turnOverlayOff() {
    document.getElementById("overlay").style.display = "none";
}
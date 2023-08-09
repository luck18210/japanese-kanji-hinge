
    // GET BROWSER TYPE AND MAKE ALTERATIONS FOR IOS
const os = (() => {

    if (/windows/i.test(navigator.userAgent)) 
    {
        return "Windows";
    }
    else if (/iphone/i.test(navigator.userAgent) || /ipad/i.test(navigator.userAgent)) 
    {
        adjustGUI("IOS");
        return "IOS";
    }
    else if (/macintosh/i.test(navigator.userAgent)) 
    {
        return "Mac OS";
    }
})();


// Use OS_VAL when constructing HTML in helpers.js
const OS_VAL = (os == "IOS") ? "IOS " : " ";


function adjustGUI(os) // This changes classes to iOS-centric ones should it be needed.
{
    document.getElementById("nk").className = "newestKanjiIOS";
    document.getElementById("commaButton").className =  "NKactionButtonIOS";
    document.getElementById("stopButton").className =  "NKactionButtonIOS";
    document.getElementById("upperHalf").className = "upperHalfIOS";
    document.getElementById("outputButton").className = "actionButtonIOS";
    document.getElementById("helpButton").className = "actionButtonIOS";
    document.getElementById("hiddenButton").className = "actionButtonIOS";
    document.getElementById("copyButton").className = "actionButtonIOS";

    let introText = ["連", "想", "漢", "字", "蝶", "番"];
    document.getElementById("outputboxes").innerHTML = "";
    
    for (i = 0; i < 6; i++)
    {   
        let boxNo = "rb" + i;
        document.getElementById(boxNo).className = "resultboxIOS startup";
        document.getElementById("outputboxes").innerHTML += '<button class="kanjiList' + os + '" onclick="kanjiInfo(this.innerHTML)">' + introText[i] + '</button>';
    }   
}


// TODO: Test -- reportedly unreliable on phones

// window.onbeforeunload = function (e) {
//     var message = "Your confirmation message goes here.",
//     e = e || window.event;
//     // For IE and Firefox
//     if (e) {
//       e.returnValue = message;
//     }
  
//     // For Safari
//     return message;
//   };
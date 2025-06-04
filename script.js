// ensure user isnt on mobile
window.mobileAndTabletCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};



// check visibility of website; used for a puzzle
var vis = (function(){
    var stateKey, eventKey, keys = {
        hidden: "visibilitychange",
        webkitHidden: "webkitvisibilitychange",
        mozHidden: "mozvisibilitychange",
        msHidden: "msvisibilitychange"
    };
    for (stateKey in keys) {
        if (stateKey in document) {
            eventKey = keys[stateKey];
            break;
        }
    }
    return function(c) {
        if (c) document.addEventListener(eventKey, c);
        return !document[stateKey];
    }
})();



/////////////////////////////////////////////////////////////


var puzzleStage = 0;

// entrance page
var firstPuzzleInteract = false;
$(document).ready(function() {

    if(mobileAndTabletCheck()) {
        $("#welcome").html("SORRY!");
        $("#small_para").html("This website doesn't work on mobile.<br>Check in on computer to play!");
        $("#welcome").addClass("vis");
        $("#small_para").addClass("vis");
        $("#box_para").css("display","none");
        $("#btn_entr").css("display","none");
        return;
    }

    $("#welcome").addClass("vis");
    $("#box_para").addClass("vis");
    $("#small_para").addClass("vis");
    $("#btn_entr").addClass("vis");
    $("#btn_entr").click(function(){
        $("#box_entr").addClass("transparent");
        $("#btn_entr").attr("disabled", true);
        
        setTimeout(()=>{$("#box_entr").css('display','none')},1000);
        setTimeout(()=>{$("#sidebar").removeClass("transparent")},1000);

        const bgm = document.querySelector("audio");
        bgm.volume = 0.06;
        bgm.play();

        setTimeout(()=>{puzzleStage = 1;routePuzzle(puzzleStage);},3000);
    });
    $("#btn_cls").click(function(){copyClipboard()});
});


function linkToGame() {
    window.open("https://store.steampowered.com/app/3404410/The_New_Apartment/");
}


// first puzzle
const full_alphabet = "abcdefghijklmnopqrstuvwxyz";
const morseWord = "cry";
var secretWordIndex = 0;
var firstPuzzleBeat = false;

// play sound effect when using keyboard
document.addEventListener('keydown', function(event) {
    if(!puzzleStage==1||!firstPuzzleInteract){return;}
    const key = event.key;
    if(!full_alphabet.includes(key)){return;}
    var audio = new Audio(`assets/keys/keyboard_-0${Math.floor(Math.random()*9+1)}.wav`);
    audio.volume = Math.random()/3+0.3;
    audio.mozPreservesPitch = false;
    audio.playbackRate = Math.random()/3+0.8;
    audio.play();
    if(event.key == morseWord[secretWordIndex]){secretWordIndex++}else{secretWordIndex=0;}
    if(secretWordIndex>=morseWord.length){
        firstPuzzlePassed();
    }
});

// when the puzzle is beat, prepare for next puzzle
function firstPuzzlePassed() {
    firstPuzzleBeat = true;
    firstPuzzleInteract = false;
    puzzleStage++;

    $("#box_lightbulb").css('visibility', 'visible');
    setTimeout(()=>{
        $("#lightbulb").removeClass("vis");
        $("#lightbulb_wire").removeClass("vis");
        $("#lightbulb_glow").removeClass("vis");
        $("#stone_keyboard").removeClass("vis");
    },1000);

    setTimeout(()=>{
        $("#box_task1").css('display', 'none');
        routePuzzle(puzzleStage);
    },3000);
}

// loops through each letter in morse code sequence
function flickerLight(morseString, index) {

    // sequence is composed of letters
    // letters composed of blinks

    let blinkTime = (morseString[index]=='-')*800+300; // the time the blink is held (dash or dot)
    let nextTime = (morseString[index]=='-')*800+800; // the time until the next blink (from when the blink begun)
    let letterSpace = 1800; // the time between the end of a full letter and the start of a new one
    let phraseTime = 4000; // the time between the end of a full sequence and the start of a new one
    let nextIndex = (index + 1 >= morseString.length) ? 0 : index + 1;

    if(morseString[index] == ','){setTimeout(()=>{if(!firstPuzzleBeat){flickerLight(morseString, nextIndex)}},letterSpace);return;} // on next letter, wait
    if(morseString[index] == ';'){setTimeout(()=>{if(!firstPuzzleBeat){flickerLight(morseString, nextIndex)}},phraseTime);return;} // on repeat phrase, wait

    $("#box_lightbulb").css('visibility', 'visible'); // show lightbulb
    var audio = new Audio(`assets/buzz/${(morseString[index]=='-') ? "l" : "s"}${Math.floor(Math.random()*3+1)}.wav`);
    audio.volume = 0.30;
    if(!firstPuzzleBeat){audio.play();} // play buzzing sound
    setTimeout(()=>{if(!firstPuzzleBeat){$("#box_lightbulb").css('visibility', 'hidden')}},blinkTime); // hide lightbulb for established blinkTime
    setTimeout(()=>{if(!firstPuzzleBeat){flickerLight(morseString, nextIndex)}},nextTime); // go to next blink after nextTime
}

// set up variables for morse code loop function
function flickerPuzzle() {

    $("#box_lightbulb").css('display', 'block');
    $("#box_lightbulb").css('visibility', 'hidden');
    $("#stone_keyboard").css('display', 'block');
    $("#box_task1").css('display','block');

    setTimeout(()=>{
        $("#lightbulb").addClass("vis");
        $("#lightbulb_wire").addClass("vis");
        $("#lightbulb_glow").addClass("vis");
        $("#stone_keyboard").addClass("vis");
    },500);

    firstPuzzleInteract = true;

    var morseCode = [
        ".-",
        "-...",
        "-.-.",
        "-..",
        ".",
        "..-.",
        "--.",
        "....",
        "..",
        ".---",
        "-.-",
        ".-..",
        "--",
        "-.",
        "---",
        ".--.",
        "--.-",
        ".-.",
        "...",
        "-",
        "..-",
        "...-",
        ".--",
        "-..-",
        "-.--",
        "--.."
    ];

    var morseWordArray = [];
    morseWord.split('').forEach(letter => {
        morseWordArray.push(morseCode[full_alphabet.indexOf(letter)]);
        morseWordArray.push(",");
    });
    morseWordArray.push(";");
    var morseString = morseWordArray.join('');
    // console.log(morseString);
    setTimeout(()=>{flickerLight(morseString, 0)},2000);
}

// puzzle routing (from puzzle to puzzle)
function routePuzzle(puzzleStage) {

    if(puzzleStage >= 1){
        $(`#dot${puzzleStage-1}`).removeClass("current");
        if(puzzleStage < 6){$(`#dot${puzzleStage}`).addClass("current");}else{$("#sidebar").addClass("transparent");}
    }

    if(puzzleStage >= 2){
        var audio = new Audio('assets/next.wav');
        audio.volume = 0.18;
        audio.mozPreservesPitch = false;
        audio.playbackRate = 0.7;
        audio.play();
    }

    var allPuzzles = [clockPuzzle, flickerPuzzle, namePuzzle, lookPuzzle, candlePuzzle, endScreen];
    allPuzzles[puzzleStage-1]();
}


// second puzzle
function clickNameButton(button_pressed) {
    $("#task2_button").attr("disabled", true);
    $("#task2_button2").attr("disabled", true);

    $("#task2_words").removeClass('vis');
    $("#task2_rqst").removeClass('vis');
    setTimeout(()=>{$("#task2_button").removeClass('vis');},(1-button_pressed)*1200);
    setTimeout(()=>{$("#task2_button2").removeClass('vis');},button_pressed*1200);
    setTimeout(()=>{
        $("#box_task2").css('display', 'none');
        puzzleStage++;
        routePuzzle(puzzleStage);
    },3000);
}

function namePuzzle() {

    $("#box_task2").css('display', 'flex');
    $("#task2_button").css('visibility', 'hidden');
    $("#task2_button2").css('visibility', 'hidden');
    $("#task2_rqst").css('visibility', 'hidden');
    setTimeout(()=>{$("#task2_words").addClass('vis');},500);
    setTimeout(()=>{$("#task2_rqst").addClass('vis');$("#task2_rqst").css('visibility', 'visible');},2500);
    setTimeout(()=>{$("#task2_button").addClass('vis');$("#task2_button").css('visibility', 'visible');},6000);
    setTimeout(()=>{$("#task2_button2").addClass('vis');$("#task2_button2").css('visibility', 'visible');},7000);
    setTimeout(()=>{
        $("#task2_button").attr("disabled", false);
        $("#task2_button2").attr("disabled", false);
        $("#task2_button").click(function(){clickNameButton(0);});
        $("#task2_button2").click(function(){clickNameButton(1);});
    },7500);
}

// third puzzle
var openInterval;
var lookTextInterval;
function checkWebpageOpenInterval() {
    if(vis() == false){
        clearInterval(openInterval);
        clearInterval(lookTextInterval);
        $("#task3_eye").removeClass('vis');
        $("#task3_words").removeClass('vis');
        setTimeout(()=>{
            $("#box_task3").css('display', 'none');
            puzzleStage++;
            routePuzzle(puzzleStage);
        },3000);
    }
}

function changeLookInterval() {
    $("#task3_words").css('transition', 'none');
    setTimeout(()=>{
        $("#task3_words").removeClass('vis');
        if($("#task3_words").html() == "LOOK AWAY"){
            $("#task3_words").html("I SEE YOU");
        } else {
            $("#task3_words").html("LOOK AWAY");
        }
    },500);
    setTimeout(()=>{$("#task3_words").css('transition', 'opacity 2s ease-out');$("#task3_words").addClass('vis');},600);
}

function lookPuzzle() {
    $("#box_task3").css('display', 'flex');
    $("#task3_words").css('visibility', 'hidden');
    $("#task3_eye").css('visibility', 'hidden');
    setTimeout(()=>{
        $("#task3_eye").addClass('vis');
        $("#task3_eye").css('visibility','visible');
    },500);
    setTimeout(()=>{
        $("#task3_words").addClass('vis');
        $("#task3_words").css('visibility','visible');
    },1500);
    openInterval = setInterval(checkWebpageOpenInterval, 800);
    lookTextInterval = setInterval(changeLookInterval, 9000);
}

// fourth puzzle

var checkTimeInterval;
var minutesBack = 0;
var clockStage = 0;
var clockBeat = false;
var clockPhrases = [
    "i was at the apartment <b>one hour ago</b>...",
    "...but i saw her get in your car just <b>twenty minutes ago</b>.",
    "...what do you mean she wasn't with you? where is she <b>now</b>??",
    "...no, no sara, we need to call the police immediately."
];

var clockTimes = [60, 20, 0, 1];

function loadClockPhrase(clockStage) {
    minutesBack = clockTimes[clockStage];
    setTimeout(()=>{$("#task4_words").html(clockPhrases[clockStage]);},5000);
    if(clockStage == clockPhrases.length-1){
        clockBeat = true;
        $('.clock_item').each(function(i, obj) {
            $(this).removeClass('vis');
        });
        setTimeout(()=>{
            $("#task4_words").removeClass('vis');
        },9000);
        setTimeout(()=>{
            $("#box_task4").css('display', 'none');
            puzzleStage++;
            routePuzzle(puzzleStage);
        },12000);
    }
}

function checkClockInterval() {
    var MS_PER_MINUTE = 60000;
    var current_time = new Date()
    var previous_time = new Date(current_time - minutesBack * MS_PER_MINUTE);

    // console.log();
    // console.log(previous_time.getMinutes());

    var hrs_input = $("#inhr").val();
    var min_input = $("#inmn").val();

    var acceptableHour = previous_time.getHours() - 12 >= 0 ? previous_time.getHours() - 12 : "not_applied";
    var acceptableHour2 = previous_time.getHours() + 12 <= 12 ? previous_time.getHours() + 12 : "not_applied";
    if( (parseInt(hrs_input,10) == previous_time.getHours() || parseInt(hrs_input,10) == acceptableHour || parseInt(hrs_input,10) == acceptableHour2) && parseInt(min_input,10) == previous_time.getMinutes()){
        clearInterval(checkTimeInterval);

        if(min_input.length == 1){
            $("#inmn").val(`0${min_input}`);
        }

        clockStage++;
        
        $("#inmn").attr('disabled',true);
        $("#inhr").attr('disabled',true);

        $("#task4_words").removeClass('vis');
        loadClockPhrase(clockStage);
        setTimeout(()=>{
            $("#task4_words").addClass('vis');
        },5000);

        setTimeout(()=>{
            if(!clockBeat){$("#inmn").attr('disabled',false);}
            if(!clockBeat){$("#inhr").attr('disabled',false);}
            if(!clockBeat){checkTimeInterval = setInterval(checkClockInterval, 500);}
        },5500);

    }
}

function clockPuzzle() {
    $("#task4_words").html(clockPhrases[0]);
    $("#box_task4").css('display', 'flex');
    $("#box_clock").css('display', 'flex');
    $("#task4_words").css('visibility', 'hidden');
    $("#box_clock").css('visibility', 'hidden');

    setTimeout(()=>{
        $("#task4_words").addClass('vis');
        $("#task4_words").css('visibility','visible');
    },500);

    setTimeout(()=>{
        $("#box_clock").css('visibility','visible');
        $('.clock_item').each(function(i, obj) {
            $(this).addClass('vis');
        });
    },1500);

    loadClockPhrase(0);
    checkTimeInterval = setInterval(checkClockInterval, 500);
}

// fifth puzzle

var candleClickOrder = []

function candlePuzzle() {
    $("#box_task5").css('display', 'flex');
    $("#box_task5").css('visibility', 'hidden');

    setTimeout(()=>{
        $("#box_task5").css('visibility','visible');
        $('.candle').each(function(i, obj) {
            setTimeout(()=>{
                $(this).addClass('vis');
                var audio = new Audio('assets/lighter.wav');
                audio.volume = Math.random()/4+0.4;
                audio.mozPreservesPitch = false;
                audio.playbackRate = Math.random()/3+0.8;
                audio.play();
            },i*500);
        });
    },1500);
}

// check if candle order is ascending
function isAscending(arr) {
    return arr.every(function (x, i) {
        return i === 0 || x >= arr[i - 1];
    });
}

// when user clicks candle, add order to array and check for win
function activateCandle(n) {
    if(!$(`#can${n}`).hasClass('vis')){
        return;
    }

    candleClickOrder.push(n);
    $(`#can${n}`).removeClass('vis');
    
    var audio = new Audio('assets/candle.wav');
    audio.volume = Math.random()/4+0.3;
    audio.mozPreservesPitch = false;
    audio.playbackRate = Math.random()/2+0.7;
    audio.play();

    if(candleClickOrder.length >= 5){
        if(isAscending(candleClickOrder)){
            setTimeout(()=>{
                $("#box_task5").css('visibility', 'hidden');
                $("#box_task5").css('display', 'none');
            },500);
            setTimeout(()=>{
                puzzleStage++;
                routePuzzle(puzzleStage);
            },3000);
        } else {
            // if player gets candle order wrong
            candleClickOrder = [];
            setTimeout(()=>{
                $('.candle').each(function(i, obj) {
                    setTimeout(()=>{
                        
                        $(this).addClass('vis');
                        var audio = new Audio('assets/lighter.wav');
                        audio.volume = Math.random()/4+0.4;
                        audio.mozPreservesPitch = false;
                        audio.playbackRate = Math.random()/3+0.8;
                        audio.play();
                    
                    },i*500);
                });
            },500);
        }
    }

}

// end screen

function SelectText(element) {
    var doc = document;
    if (doc.body.createTextRange) {
        var range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function endScreen() {
    $("#box_cls").css('visibility', 'hidden');
    $("#box_cls").css('display', 'flex');
    setTimeout(()=>{
        $("#box_cls").css('visibility', 'visible');
        $("#congrats").addClass('vis');
        $("#cls_para").addClass('vis');
        $("#cls_det").addClass('vis');
        $("#cls_input").addClass('vis');
        $("#btn_cls").addClass('vis');
    },500);

}

function copyClipboard() {

    // making the screenshot
    const canvas = document.getElementById("ss_canvas");
    const ctx = canvas.getContext("2d");
    let funnel = new FontFace("funnel", "url(assets/Funnel.ttf)");

    funnel.load().then(function(font){
        
        document.fonts.add(font);
        
        var x = canvas.width / 2;
        var y = canvas.height / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, x*3, y*3);

        ctx.fillStyle = "#F4442E";
        ctx.fillRect(x-320, y+10, 640, 100);
        ctx.font = "50px funnel";
        ctx.textAlign = "center";
        ctx.textBaseline = 'middle';
        ctx.fillStyle = "#000";
        ctx.fillText(`${$("#cls_input").val()}`,x,y+60);

        ctx.font = "90px funnel";
        ctx.textAlign = "center";
        ctx.textBaseline = 'middle';
        ctx.fillStyle = "#F4442E";
        ctx.fillText("I won!",x,y-130);

        ctx.font = "40px funnel";
        ctx.textAlign = "center";
        ctx.textBaseline = 'middle';
        ctx.fillStyle = "#F4442E";
        ctx.fillText("... and my handle is:",x,y-50);

        ctx.font = "30px funnel";
        ctx.textAlign = "center";
        ctx.textBaseline = 'middle';
        ctx.fillStyle = "#F4442E";
        ctx.fillText("Send to @PaulThomasGames on Discord",x,y+180);

        canvas.toBlob(function(blob) { 
            const item = new ClipboardItem({ "image/png": blob });
            navigator.clipboard.write([item]); 
        });
    
        $("#btn_cls").html("COPIED!");
    });
}

////////////////////////////////////////////////////////

// shuffling function for auth code generation
String.prototype.shuffle = function () {
    var a = this.split(""),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}


// generate code when user beats game to allow for verification
function generateAuthCode() {
    var CD = "";

    // generate three unique odds
    var uniqueOddsLeft = [1,3,5,7,9]
    for(var i = 0; i < 3; i++){
        var rx = Math.floor(Math.random()*uniqueOddsLeft.length);
        CD+=uniqueOddsLeft[rx];
        uniqueOddsLeft.splice(rx,1);
    }

    // add another non-unique odd if 50% chance passes
    for(var i = 0; i < Math.round(Math.random()); i++){CD+=CD[2];}

    // add two to four evens (exclude 6)
    for(var i = 0; i < Math.floor(Math.random()*3+2); i++){CD+=[0,2,4,8][Math.floor(Math.random()*[0,2,4,8].length)];}

    // add P, T, or M
    var rx = ["P","T","M"][Math.floor(Math.random()*["P","T","M"].length)]
    if(Math.round(Math.random())){
        rx=rx.toLowerCase();
    }
    CD+=rx;

    // add one vowel
    var rx = ["A","E","I","O","U","Y"][Math.floor(Math.random()*["A","E","I","O","U","Y"].length)]
    if(Math.round(Math.random())){
        rx=rx.toLowerCase();
    }
    CD+=rx;

    // add five specific letters
    var lexic = ["D","F","G","H","J","K","N","Q","V","X","Z"]
    for(var i = 0; i < 5; i++){
        var rx = lexic[Math.floor(Math.random()*lexic.length)]
        if(Math.round(Math.random())){
            rx=rx.toLowerCase();
        }
        CD+=rx;
    }

    return CD.shuffle();
}


// (try to) prevent usage of devtools
setTimeout(()=>{setInterval(()=>{
    var minimalUserResponseInMiliseconds = 100;
    var before = new Date().getTime();
    debugger;
    var after = new Date().getTime();
    if (after - before > minimalUserResponseInMiliseconds) { // user had to resume the script manually via opened dev tools 
        alert("I see you peeking in the source code ♡");
        window.close();
    }
}, 500)},8000);

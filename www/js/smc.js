/**
 * Created by Tim on 9/3/16.
 *
 */

// Debug values
var TEST = false;
var DISABLESWIPE = false;
var SHOWAUDIO = false;

// Reference to the form
var f;

var totalCorrect = 0;
var duration = 2000;
var points = 0;
var overall_score = 0;
var beenWarned = "false";
var introRun = "true";
// Used in named fields to prevent browser from auto-populating
var randomNumber = Math.ceil((Math.random() * 999999999));

var rankoptions = ["BAMBI", "BAMBI'S MOM", "SUPERMAN", "CHUCK NORRIS", "BATMAN", "JEDI"];
var rank;
var numberReady = [0,0,0,0,0,0,0,0,0,0]; // To check when all tracks are ready to play
var playFull = "false";
var storePlayingFull = -1;
var showedPlayAllMessage = "false";
var user = "";
var coinAudio;
var clickAudio;
var startDate = new Date();

var fontWide = " 15pt Lucida Console";
var fontSizeWide = "15";
var fontMedium = " 14pt Lucida Console";
var fontSizeMedium = "14";
var fontNarrow = " 9pt Lucida Console";
var fontSizeNarrow = "9";


var fontSize = fontSizeMedium;
var font = fontMedium;

var mp3Url = "http://www.oursort.co.za/splitmusicchallenge/mp3/";
var holdingPosition = 1;
var Load = [];
var Tracks = [];
var genre;
var decade;
var playInProgress = false;
var pausePlaying = false;
var playedUpTo = 0;
var levelChanged = false;
var highScore;
var isMobileDevice;
var fieldWithFocus; // Needed to blur() when swiping else screen gets messed up
var context;
var bufferLoader;
var CONCURRENTLIMIT = 4;



function updateStatusCallback(response){
    if(isMobileDevice){
        alert("updateStatusCallback " + response.status);
        message(12,"updateStatusCallback " + response.status);
    }
}
function testConnection(){
    if(typeof(Load[0]) == "undefined"){
        noInternet();
    }
    
}
document.addEventListener("deviceready", deviceIsReady, false);

function deviceIsReady(){
    alert("deviceisready");
    console.log("console.log works well");
//    IAP.initialize();
    IAP.load();
//    renderIAPs(document.getElementById("in-app-purchase-list"));
    alert("end");
    alert(window.plugin + " " + window.plugins + " " + window.storekit);
    
}
$(document).ready(function(){
//    $("#page").hide();

    if(!SHOWAUDIO){ $("audio").prop("controls", false) };
    
    isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

                  
                  
                  
                  return;
                  
                  
                  
    if(!isMobileDevice){
        $("#fontTR").show();
        CONCURRENTLIMIT = 99;
    }
    // file:///var/mobile/Containers/Bundle/Application/7996818A-7667-44E1-8F59-DDA1133C9A7F/Split%20Music%20Challenge.app/www/index.html
    if(!navigator.onLine){
        noInternet();
        return false;
    }
    f = document.forms[0];

    setUp();
                  
//    runIntro();
//                  return;

    $.get("http://www.oursort.co.za/splitmusicchallenge/smc.php?genre=" + f.genre.value + "&decade=" + f.decade.value + "&rand=" +
          Math.random(), function(data) {
        populatePage(data);  });


    setTimeout(testConnection, 10000);
    if(!TEST)
    {
                  $("#infoRow11").hide();
                  $("#infoRow12").hide();
                  $("#infoRow13").hide();
    }
    // facebook.login( function(success) { alert(success); }, function(error) { alert(error); } );
    coinAudio = document.getElementById("coinAudio");
    clickAudio = document.getElementById("clickAudio");
    clickAudio.currentTime = 0;
    clickAudio.muted = false;
    clickAudio.loop = false;

    $(window).on('resize orientationChange', function(event) { handleViewport(); });
    try {
        $.ajaxSetup({cache: true});
        $.getScript('http://connect.facebook.net/en_US/sdk.js', function () {
            // $.getScript('js/sdk.js', function(){
            FB.init({
                appId: '1725168737759736',
                url: 'http://www.oursort.co.za/splitmusicchallenge/index.html',
                version: 'v2.6' // or v2.0, v2.1, v2.2, v2.3
            });
            // console.log("init");
            $('#loginbutton,#feedbutton').removeAttr('disabled');
            // console.log("init 2 ");
            // FB.getLoginStatus(function(response){ alert("response " + response.status) });
            FB.getLoginStatus(function (response) {
                updateStatusCallback(response)
            });
            //api.facebook.com
            // api-read.facebook.com
            // https":"graph.facebook.com
            // http":"staticxx.facebook.com",
            // https:\/\/connect.facebook.net\/rsrc.php\
            // https:\/\/fbstatic-a.akamaihd.net\/rsrc.php
            // console.log("init 3");
        });
    }catch(e){
        alert("Error 1 " + e);
    }

//                  alert(window.plugins);

});

// Viewport Specific stuff
function handleViewport(chosenFont){
    // alert($(window).width());
    var viewport = {
        width  : $(window).width(),
        height : $(window).height()
    };

    if(viewport.width > 1200) { // laptop
        if(typeof (chosenFont) != "undefined") {
            fontSize = chosenFont;
            font = fontWide.replace("15", chosenFont);
        }else {
            font = fontWide;
            fontSize = fontSizeWide;
        }
        $("#top").css("display", "none");
        $("#page").center();
        $("#header").css("font", font).css("font-size", fontSize+"pt");
        $("#optionsImg").prop("size", "20");
        $("select").css("font", font).css("font-size","10pt");
        $(".buttonTrack").css("font-size", (fontSize-3)+"pt").css("width", (chosenFont)+"pt");
        $(".buttonTrack:disabled").css("font-size", (fontSize-3)+"pt");
    }else if(viewport.width > 600){  // Ipad
        if(typeof (chosenFont) != "undefined") {
            fontSize = chosenFont;
            font = fontMedium.replace("14", chosenFont);
        }else {
            font = fontMedium;
            fontSize = fontSizeMedium;
        }
        $("#top").css("display", "block").css("width", viewport.width);
        $("#page").css("width","80%").css("background-size", "100%").center();
        $("#serverData").css("width", "100%");
        $("#header").css("font", font).css("font-size", fontSize+"pt");
        $("#optionsImg").prop("size", "18");
        $("select").css("font", font).css("font-size","8pt");
        $(".buttonTrack").css("font-size", (fontSize-3)+"pt").css("width", (chosenFont)+"pt");
        $(".buttonTrack:disabled").css("font-size", (fontSize-3)+"pt");
    }
    else{ // iPhone
        $("#page, #connection").css("background", "url('img/musicimageiphone.jpg') no-repeat").css("background-size", "100% 100%")
        $("#splash").css("background", "url('img/splashiphone.jpg') no-repeat").css("background-size", "100%")
        if(typeof (chosenFont) != "undefined") {
            fontSize = chosenFont;
            font = fontNarrow.replace("11", chosenFont);
        }else {
            font = fontNarrow;
            fontSize = fontSizeNarrow;
        }
        $("#top").css("display", "block").css("width", viewport.width);
        $("#page").css("width", viewport.width).css("height", viewport.height).css("top", "100px").center();
        $("#serverData").css("width", viewport.width);
        $("#optionsImg").prop("size", "10");
        $("select").css("font", font).css("font-size", "7pt").css("color", "black");
        $("#splash").css("font-size", "15pt");
        $(".buttonTrack").css("font-size", (fontSize)+"pt").css("width", (chosenFont*2)+"px");
        $(".buttonTrack:disabled").css("font-size", (fontSize)+"pt");
    }
    $("#pause").center();

    message(11, font);
//    message(12, fontSize);
    $("select").css("background", "#455e9c").css("border", "1px solid #455e9c");
    $("#splash").css("width", viewport.width).css("height", viewport.height).css("line-height", viewport.height + "px");
    $("#winsplash").css("width", viewport.width).css("height", viewport.height).css("line-height", viewport.height + "px");
    $("#wideViewport").css("font", font);
    $("#subHeader").css("font", font);
    $("input").css("font-size", fontSize+"pt");
    $(".info").css("font", font);
    $("select").css("font-size", (fontSize*1-1)+"pt");
    $("#subHeader").css("font-size", (fontSize*1+2)+"pt");
//    $("#runIntro6").center();
    if(TEST){
        $("#page").css("background", "");
    }
    
    return viewport;
}
function refreshTotalScore(){
    document.getElementById("pointsTD").innerHTML = "Total Score: " + Math.floor(overall_score) + "<br>Level: " + rank;
}
function getTotalPoints() {
    found = getCookie("overall_score");
    if (found == "" || found == "NaN") {
        found = 0;
    }
    return getRank(found);
}
function getRank(found){
    duration = 2000;
    rank = rankoptions[0];
    if((found*1) < 10000){
        duration = 3000;
        rank = rankoptions[0];
    }else if((found*1) < 50000){
        duration = 2700;
        rank = rankoptions[1];
    }else if((found*1) < 100000){
        duration = 2400;
        rank = rankoptions[2];
    }else if((found*1) < 200000){
        rank = rankoptions[3];
    }else if((found*1) < 500000){
        rank = rankoptions[4];
    }else{
        duration = 1500;
        rank = rankoptions[5];
    }
    return found;
}
function audioReady(){
    var okay = 0;
    for(var i = 0; i<10; i++){
        okay+= numberReady[i];
    }
   return okay == 10;
//      return okay == 6;
}
function checkSong(e, ev){
    fieldWithFocus = e;
    ev = ev || window.event;
    var charCode = ev.keyCode || ev.which || ev.charCode;

    // Tab and shift must do nothing
    if(charCode == 9 || charCode == 16 || charCode == 13) return false;

    bits=e.name.split("_");
    var number = bits[1];

    // Get all the fields in the name of the song and artist
    var es = document.getElementById("row" + number).getElementsByTagName("input");

    // If a key was pressed but the field was empty and is still empty, presume backspace was pressed
    if(e.value == "" && (typeof(e.oldvalue) == "undefined" || e.oldvalue == "")){
        var focusField = "";
        $("#backicon").hide();

        var foundNext = false;
        // If user presses backspace at beginning of row, check previous rows for field to focus on
        if(e == es[0]){
            for(var jj=number-1; jj>0; jj--){
                var ess = document.getElementById("row" + jj).getElementsByTagName("input");
                for(var i=ess.length-1; i>=0; i--){
                    if(ess[i].disabled == false) {
//                        $(ess[i]).focus();
                        focusField = ess[i];
                        foundNext = true;
                        break;
                    }
                }
                if(foundNext) break;
            }
        }else {
            var keepLooping = "false";
            for (var i = es.length - 1; i > 0; i--) {
                if (e == es[i] || keepLooping == "true") {
                    if (es[i - 1].disabled == false) {
//                        $(es[i - 1]).focus();
                        focusField = es[i - 1];
                        break;
                    }
                    keepLooping = "true";
                }
            }
        }
        if(focusField != ""){
            if(typeof(e.count) == "undefined" || e.count == 0){
                var rect = e.getBoundingClientRect();
                e.count = 1;
                $("#backicon").removeAttr("disabled").css("font-size", "5px").css("top", (rect.top - 22)+"px").css("left", (rect.left - 0)+"px").show();
                console.log(e.count + " " + typeof(e.count));
                return;
            }else{
                e.count = 0;
                focusField.focus();
            }
            return;
        }
    }

    e.oldvalue = e.value;
    var correct = 0;

    var indexOfCurrent = 0;
    var total = 0;
    deductPoints(Tracks[number-1].score);
    for(var i=0; i<es.length; i++){
        total += Tracks[number-1].answersText[i].length;
        if(e == es[i]){
            indexOfCurrent = i;
        }
        if(es[i].value.toUpperCase() == Tracks[number-1].answersText[i].toUpperCase()) {
            correct += Tracks[number-1].answersText[i].length;
        }
    }
    // If correct answer automatically focus on next field
    var correctAnswer = Tracks[number-1].answersText[indexOfCurrent].toUpperCase();
    var entered = es[indexOfCurrent].value.toUpperCase().substr(0,correctAnswer.length);
    message(13, entered);
    if(entered == correctAnswer){
        // Correct, so make it green and disable it
        if(indexOfCurrent < (es.length -1)){
            // Focus on the next empty field on the same line
            for(var jj=indexOfCurrent +1; jj<(es.length); jj++){
                // message(11, jj + " " + es[jj].disabled + " " + (es.length-1));
                if(!es[jj].disabled){
                    $(es[jj]).select();
                    $(es[jj]).focus();
                    // message(11, "Going to " + jj);
                    break;
                }
            }
            es[indexOfCurrent].value = Tracks[number-1].answersText[indexOfCurrent];
//        }else if(number < 10){
//            $(document.getElementsByName(randomNumber + "~answer_" + (number*1+1*1))[0]).focus();
        }
        es[indexOfCurrent].style.background = "#9dffc3";
        es[indexOfCurrent].disabled = true;
    }else if (entered.length >= correctAnswer.length){
        es[indexOfCurrent].style.background = "indianred";
        es[indexOfCurrent].value = es[indexOfCurrent].value.substr(0, correctAnswer.length);
    }else{
//        es[indexOfCurrent].style.background = "#99ccff";
        es[indexOfCurrent].style.background = "#99ccff";
    }
    var scoreForSong = Math.ceil(correct / total * 100);
    if (scoreForSong >= 100){
        scoreForSong = 100;
        for(var i=0; i<es.length; i++){
            es[i].disabled = true;
        }
        if (number != 10){
            $(document.getElementsByName(randomNumber + "~answer_" + (number*1+1*1))[0]).focus();
        }
        totalCorrect++;
        $("#ajaxResult").load("http://www.oursort.co.za/splitmusicchallenge/ajax.php", { option: "updatePopular", track: Tracks[number-1].trackId},
            function(){  }) ;
        addPoints(100);
        // message(12, "Total right " + totalCorrect);
    }
    Tracks[number-1].score = scoreForSong;
    addPoints(scoreForSong);

    // Fix the overall_score
    if (totalCorrect == 10){
        e.blur();
        addPoints(20000);
        $("#page").toggle('swirl',{spins:2},1000, function(){unswirl()});
        document.getElementById("surrender_all").style.display = "none";
        document.getElementById("getNext").style.display = "table";

    }
    showPoints();

}

function winsplashClicked(){
    $("#winsplash").toggle('swirl',{spins:2},1000, function() {
                           $("#page").toggle('swirl',{spins:4},1000 ) } );
}
function unswirl(){
    $("#winsplash").center().toggle('swirl',{spins:3},1000, function() { setTimeout(winsplashClicked, 1000) } );
}

function stopPlay(track){
    document.getElementById("row" + (next)).style.background = "";
    Tracks[track-1].stop();

}

function getCookie(name){
    var name = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}
function addCookie(cname, cvalue){
    try {
        var d = new Date();
        d.setFullYear(2116);
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }catch (e){
        document.getElementById("debug").innerHTML = "";
    }
}

function deleteCookie(cname){
    try {
        var d = new Date();
        d.setFullYear(2000);
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=0; " + expires;
    }catch (e){
        document.getElementById("debug").innerHTML = "";
    }
}

function slotIn(sequence){
    
    var track = Load[sequence];
    track.fetching = 0;
//    if(sequence == 0){
//        message(13, (new Date() - startDate)/1000);
//    }
    track.percent = 90;
    var idTrack = sequence * 1 + 1;
    message(idTrack, "slotin");
    
    var hindex = idTrack - 1;
    e = track.getAudio();
    numberReady[sequence] = 1;

    $("#infoRow" + idTrack).hide();

    var fields = track.inputSong;

    if(fields[0].value.toUpperCase() == "BONUS") addPoints(1000);
    var ename = randomNumber + "~answer_" + idTrack;
    for(var j=0; j<fields.length; j++){
        fields[j].setAttribute("name", ename);
        $("#answerContainer"+idTrack).append(fields[j]);
    }
    message(idTrack, "slotin 2");
    track.percent = 100;

    $("#answerContainer" + idTrack).html($("#answerContainer"+idTrack).html() + "by"); // byTag
    fields = track.inputArtist;
    for(var j=0; j<fields.length; j++){
        fields[j].setAttribute("name", ename);
        $("#answerContainer"+idTrack).append(fields[j]);
    }
    message(idTrack, "slotin3");
    $("#row" + idTrack).show();
    var eles = document.getElementsByName(ename);
    for(j=0; j<eles.length;j++){
        eles[j].onkeyup = function(event){ checkSong(this, event) };
    }
    $("#page").center();
    Tracks[hindex] = track;
    
}
function increasePercent(track, value, max){
    if (Load[track].percent <= max){
     Load[track].percent += value;
    }else{
        Load[track].percent = max;
    }
//    message((track*1+1), "");
}

function replayFull(){
    if(playInProgress) return false;
    message(13, "playedUpTo " + playedUpTo);
//    Tracks[playedUpTo].getAudio.currentTime = Tracks[playedUpTo].snippetNumber * 1 + 1;
//    if (playedUpTo == 0) playedUpTo = -1; // If we need to start at the first track;
    nextSnippet(playedUpTo*1+1);
}

function confirmWarning(response, snippet){
//    alert(response + " " + snippet);
    if (!response) return false;
    addCookie("been_warned", "true");
    beenWarned = "true";
    replay(snippet);
}
function replay(snippet){
    if(beenWarned == "false" && playFull == "false" && introRun == "true"){
        messageUser("Using these replay buttons will cost you points", "That's ridiculous!", confirmWarning, snippet);
        return;
    }
    if(playFull == "false") {
        if(playInProgress) return false;
        if(introRun == "true") if(!deductPoints(50)) return;
        document.getElementById("row" + (snippet)).style.background = "#455e9c";
        
        Tracks[snippet-1].play();
        playInProgress = true;
        setTimeout(function () {
            playInProgress = false;
            Tracks[snippet-1].stop();
            document.getElementById("row" + (snippet)).style.background = "";
        }, duration );
        var es = document.getElementsByName(randomNumber + "~answer_" + snippet)[0];
        if(introRun == "true") $(es).focus();

    }else{
        // Game over and user has requested to play the full song

        // If a track is already playing, stop it
        if(storePlayingFull != -1){
            Tracks[storePlayingFull-1].stop();
        }
        if(storePlayingFull == snippet){
            storePlayingFull = -1;
            return;
        }
        Tracks[snippet-1].playFull();
        storePlayingFull = snippet;
    }

}

function showPoints(){
    $("#score").html("Credits: " + Math.ceil(points));
}
function purchaseCredits(response){
    points+=500;
    showPoints();
}

function offerToPurchase(response){
    if(response){
        messageUser("Good choice! We are feeling generous today, extra credits are on us.", "", purchaseCredits);
    }
}
function deductPoints(number){
    if((points - number) < 0){
        messageUser("You do not have enough credits. Purchase more?", "No Thanks", offerToPurchase);
//        messageUser("Using these replay buttons will cost you points", "That's ridiculous!", confirmWarning, snippet);
        
        return false;
    }
    points -= number;
    showPoints();
    return true;
}
function addPoints(number){
    points += number;
    showPoints();
}
function playAgain(){
    playClick();
    addCookie("overall_score", (overall_score * 1 + points));
    if(points > highScore){ addCookie("highscore", points) };
    var pause = 0;
    if(points > 0){
        coinAudio.currentTime = 0;
        coinAudio.muted = false;
        coinAudio.play();
        var sub = points / (coinAudio.duration*10);
    }
    animateScore(sub, points, (overall_score*1+points));
    return false;
}

function playClick(){
    clickAudio.play();

}
function animateScore(sub, score, finalScore) {
    if (score > 0) {
        if((overall_score * 1 + sub) > finalScore){
            overall_score = finalScore;
        }else{
            overall_score = overall_score * 1 + sub;
        }
        score-=sub;
        points = score;
        refreshTotalScore();
        if (score > 0) {
            showPoints();
        }
        setTimeout(animateScore, 100, sub, score, finalScore);
    }else{
        $("#page").hide();
        $("#splash").show();
        nextGame();
    }
}

function nextGame(){
    $("#play").hide();
    $("#splash").center().show();
    window.location.href = "index.html?rand=" + Math.random();
}

function trapError(e, obj){
    alert("trap error " + obj.currentSrc + " " + e.code + " " +obj.error.code);
    $("#errorResult").load("http://www.oursort.co.za/splitmusicchallenge/ajax.php", { option: "logError", track: obj.id.substr(4), reason: 5,
            info: "file does not exist", timesnippet: 0, detail: "None"},
        function(){ cleanupErrorDiv() }) ;

}
// In test mode, presents the next 10 tracks
function getNextSet(){
    $("#splash").html("Tuning Our Instruments").show();
    $("#play").hide();
    f.start.value = f.start.value * 1 + ( 10 * 1);
    window.location.href="index.html?test=true&start=" + f.start.value;
    return true;
}

function surrenderAll(e){
    // playClick();
//    alert(playedUpTo);
    document.getElementById("lifeline").disabled = true;
    if (playedUpTo != -1) Tracks[playedUpTo].stop();
    pausePlaying=true;
    for(var i=1; i<=10;i++){
        fields = document.getElementsByName(randomNumber + "~answer_"+i)

//        $("input:text").prop("disabled", "true");
        for(var j=0;j<fields.length;j++){
            if(fields[j].value == Tracks[i-1].answersText[j]){
                $(fields[j]).css("background", "#9dffc3");
            }else{
                $(fields[j]).css("background", "indianred").css("color", "black").css("opacity", "1");
            }
            fields[j].value = Tracks[i-1].answersText[j];
            fields[j].disabled = true;
//            $(fields[j]).css("border-radius", "9px").css("color", "beige");
        }
    }
    e.style.display = "none";
    document.getElementById("getNext").style.display = "table";
    // $("#loser").center().fadeToggle(1000).fadeToggle(500);
    duration = 120000;
    playFull = "true";
    pausePlaying = true;
    showedPlayAllMessage = "true";

}
function submitError(){
    try{
        bits = f.songError.value.split("_");

        if(bits.length == 1){
            bits[1] = "-1";
        }

        var error = "false";
        f.songError.style.background = "";
        f.reasonError.style.background = "";

        if(f.reasonError.value < 0){
            error = "true";
            f.reasonError.style.background = "pink";
        }

        var timeslice = -1;
        if(f.reasonError.value <= 2){
            if(f.songError.value == -1){
                f.songError.style.background = "pink";
                error = "true";
            }else{
                timeslice = Tracks[bits[0]-1].timeSnippet;
            }
        }
        if(error == "true") return false;
        allDetails = "";
        for (i=0; i<10; i++){
            allDetails += " " + Tracks[i].id + ":" + Tracks[i].timeSnippet;
        }
        $("#errorResult").load("http://www.oursort.co.za/splitmusicchallenge/ajax.php", { option: "logError", track: bits[1], reason: f.reasonError.value,
                info: f.errorReason.value, timesnippet: timeslice, detail: allDetails},
            function(){ cleanupErrorDiv() }) ;
        document.getElementById("songErrorTr").style.display = "none";
    }
    catch (e){
        alert ("Submiterrpr " +e);
        return false;
    }
}


function changeError(i){
    if (i == 1 && f.reasonError.value == -1) {
        document.getElementById("songErrorTr").style.display = "none";
        return;
    }
    if (i == 2 && f.songError.value == -1) return;
    if (i == 1){
        if(f.reasonError.value >=0 && f.reasonError.value < 4) {
            document.getElementById("songErrorTr").style.display = "table-row";
        }else{
            document.getElementById("songErrorTr").style.display = "none";
        }
        if(f.reasonError.value == 4){ // Something else
            $(f.errorReason).focus();
        }
        return;
    }
    if (i == 2 && f.songError.value == 0) { // Not song related
    }

}
function defaultCallBack(){

}
function useLifeline(e){
    if(e.value == 0) return true;
//    alert(playedUpTo);
    if(e.value == 99){
        messageUser("You've already used up this life line", "", defaultCallBack);
        e.value = 0;
        return;
    }

    // replay full set of snippets - free
    if(e.value == 1){
        replayFull();

        // Play different snippet
    }else if (e.value == 3){
        if(!deductPoints(500)) return;

        loadSnippets();
        // Remove from the list of lifelines
        $(e[e.selectedIndex]).remove();
        if(playedUpTo > 0 && playedUpTo < 10){
            document.getElementById("row" + (++playedUpTo)).style.background = "";
        }
//        nextSnippet(0);

        // Play longer snippet
    }else if (e.value == 2){
        if(!deductPoints(Math.ceil(duration / 25))) return;
        duration = duration * 1 + 500;
        if(duration > 4000){ // Remove from the list of lifelines
            $(e[e.selectedIndex]).remove();
        }
        if(playedUpTo > 0 && playedUpTo < 10){
            document.getElementById("row" + (++playedUpTo)).style.background = "";
        }
//        nextSnippet(0);
    }
    e.selectedIndex = 0;
    return;
}

function loadSnippets(){
    console.log("snippy before " + Tracks[0].timeSnippet);
    for(var loopy=0; loopy<10;loopy++) {
        var e = Tracks[loopy].getAudio();
        random = Math.random();
        var snippy = Math.floor(random * (e.duration - 6)) + 2; // Need to make sure we have enough seconds to play
        Tracks[loopy].timeSnippet = snippy;
        e.currentTime = snippy;
    }
    console.log("snippy after " + Tracks[0].timeSnippet);
    
}
/**
 * Created by Tim on 3/13/16.
 */
jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) +
            $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +
            $(window).scrollLeft()) + "px");
    return this;
}
jQuery.fn.visible = function() {
    return this.css('visibility', 'visible');
};

jQuery.fn.invisible = function() {
    return this.css('visibility', 'hidden');
};

jQuery.fn.visibilityToggle = function() {
    return this.css('visibility', function(i, visibility) {
        return (visibility == 'visible') ? 'hidden' : 'visible';
    });
};


function fetchSource(url, idx){
    var i = idx;
    prefetch_file(url, function(url) { fetched(url, idx) },
                  function(pc, idx) { progress(pc, i) }, function(e,idx) { error(e, url) });
}
function populatePage(data){
    if(data.substr(0,5) == "ERROR"){
        alert("ERROR: " + data.substr(7));
        deleteCookie("decade");
        deleteCookie("genre")
        playAgain();
        // window.location.href = "index.html?rand=" + Math.random();
        return;
    };
    message(12, (new Date() - startDate)/1000);
    
    
    var songErrorOptions = "<option value='-1'>Select</option>";
    var selectedRowsValue = "";
    var line = data.split("~~~");
    // message(12, line[10]);
    
    for(var i=0; i<10;i++){
        var music = new Music();
        music.sequence = i;
        var snippetNumber = (i*1+1);
        var bits = line[i].split("~!~");
        //        addAudioSrcHTML(snippetNumber, mp3Url + bits[1]);
        //        fetched(mp3Url + bits[1], snippetNumber);
        //        addAudioHTML(snippetNumber, mp3Url + bits[1]);
        //        document.getElementById("loadSnip" + snippetNumber).src = bits[1];
        
        music.trackId = bits[0];
        music.fileName = bits[1];
        music.id = "loadSnip" + snippetNumber;
        
        music.songName = bits[2];
        music.artist = bits[3];
        var random = Math.random();
        var snippy = Math.floor(random * 55); // Need to make sure we have enough seconds to play
        music.timeSnippet = snippy;
        if(bits[2].toUpperCase().indexOf("BONUS") >= 0){
            music.fileName = "res/Coins.mp3";
            music.timeSnippet = 0;
        }
        music.audio = document.getElementById(music.id);
        songErrorOptions += "<option value='" + snippetNumber + "_" + music.trackId + "'>" + snippetNumber + "</option>";
        
        Load[i] = music;
        increasePercent(i,5,100);
        message(snippetNumber, "loaded Load");
        populateLoadMusicList(i, music);
        layoutAnswerGrid(i, music);
        selectedRowsValue +=  music.trackId +  " ";
        
    }
    fetchSources(0);
    $("#songError").html(songErrorOptions);
    $("#splash").hide();
    $("#page").show();
    
}


function layoutAnswerGrid(i, track){
    var pad = 2;
    var bits = track.songName.split(" ");
    var showValue = false;
    var value = "";
    var index = (i*1+1);
    increasePercent(i,5,100);
    message(index, "answer grid");
    
    if(bits[0] == "Bonus") {
        showValue = true;
//        addPoints(1000);
    };
    for(var ii=0; ii<bits.length;ii++) {
        var newInput = document.createElement("input");
        newInput.setAttribute("type", "text");
        newInput.setAttribute("class", "track");
        $(newInput).css("font", font);
        $(newInput).css("fontSize", fontSize+"pt");
        $(newInput).css("width", getWidthOfText(bits[ii]));
        if(showValue) {
            newInput.setAttribute("value", bits[ii]);
            newInput.setAttribute("disabled", "true");
        }

        newInput.setAttribute("name", randomNumber + "_answer_" + index);
        newInput.onkeyup = function(event){ checkSong(this, event) };
        track.inputSong[ii] = newInput;
    }
    
    bits = track.artist.split(" ");
    for(var ii=0; ii<bits.length;ii++) {
        var newInput = document.createElement("input");
        newInput.setAttribute("type", "text");
        newInput.setAttribute("class", "track");
        // newInput.setAttribute("size", (bits[ii].length*1+pad) + "em");
        $(newInput).css("font", font);
        $(newInput).css("width", getWidthOfText(bits[ii]));
        if(showValue) {
            newInput.setAttribute("value", bits[ii]);
            newInput.setAttribute("disabled", "true");
        }
        if(bits[ii].trim().toUpperCase() == "AND" || bits[ii].trim() == "&"){
            newInput.setAttribute("value", "&");
            newInput.setAttribute("disabled", "true");
            bits[ii] = "&";
        }
        newInput.setAttribute("name", randomNumber + "_answer_" + index);
        newInput.onkeyup = function(event){ checkSong(this, event) };
        track.inputArtist[ii] = newInput;
    }
    return;
}
function populateLoadMusicList(i, music){
    bits = (music.songName + " " + music.artist).split(" ");
    for(var ii=0; ii<bits.length;ii++){
        music.answersText[ii] = bits[ii].trim();
    }
}
function tilt(x){
    alert(x + " " + y);
}

function noInternet(){
    handleViewport();
    $("#splash").hide();

    $("#connection").center();
    $("#connection").show();
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);

}
function setUp(){
    var viewport = handleViewport();

    $("#splash").center();
    $("#splash").css("position", "absolute").css("top", "20px").css("bottom", "20px");
    if(!TEST) $(".buttonInfo").css("visibility", "hidden");
    $("#splash").show();
    $("#runIntro3").css("right", "8em");
    $("#runIntro4").css("top", "5.5em").css("right", "7em");
    $("#runIntro5").css("top", "7em").css("right", "7em");
    $("#runIntro6").center();
    
    // document.getElementById("splash").style.display = "block";
    getGenre();
    getDecade();
    getHighScore();

    beenWarned = getCookie("been_warned");
    if (beenWarned == ""){
        beenWarned = "false";
    }

//    introRun = getCookie("intro_run");
//    if (introRun == ""){
//        introRun = "false";
//    }
    
    overall_score = getTotalPoints();

    refreshTotalScore();
    showPoints();


//    $("#reportMistake").click(function(){
//        $("#reportProblem").center().fadeIn(1000);
//        $("#errorResult").html("");
//        $("#songError").focus();
//        return false;
//    });
//    $("#showRules").click(function(){
//        $("#rules").center().fadeIn(1000);
//        $("#about").fadeOut(1000);
//        return false;
//    });
}

function Music() {
    this.sequence = "";
    this.source = "";
    this.timeSnippet = 0;
    this.answersText = [];
    this.inputSong = [];
    this.inputArtist = [];
    this.id = "";
    this.fileName = "";
    this.songName = "";
    this.artist = "";
    this.score = 0;
    this.audio = "";
    this.percent = 0;
    this.history = "";
    this.audio;
    this.canPlay = 0;
    this.bufferEmpty = 0;
    this.resetCount = 0;
    this.fetching = 0;
    this.addHistory = function(h){
        this.history += "\n" + h.replace(/'"'/,"").replace(/"'"/,"");
    }

    this.getAudio = function() {
        return document.getElementById(this.id);
    }
    this.play = function(){
        try{
            this.getAudio().muted = false;
        this.getAudio().play();
        }catch(e){
            console.log("play error " + e);
        }
    }
    this.stop = function(){
        this.getAudio().pause();
        this.getAudio().currentTime = this.timeSnippet;
    }
    this.playFull = function(){
        var obj = this.getAudio();
        obj = document.getElementById(this.id);
        obj.currentTime = 0;
        obj.play();
    }
    this.showAudioDetails = function(obj) {
        console.log("currentSrc " + obj.currentSrc);
        console.log("ended " + obj.ended);
        console.log("error " + obj.error);
        console.log("muted " + obj.muted);
        console.log("networkState " + obj.networkState);
        console.log("paused " + obj.paused);
        console.log("buffered " + obj.buffered.start(0) + " - " + obj.buffered.end(0));
        console.log("played " + obj.played.length);
        console.log("readyState " + obj.readyState);
        console.log("seeking " + obj.seeking);
        console.log("currentTime " + obj.currentTime);
        console.log("duration " + obj.duration);
    }
}
function showOptions(){
    DISABLESWIPE = !DISABLESWIPE;
    pausePlaying = !pausePlaying;
    $( "#options" ).toggle("slide", {direction:"right"}, "fast");
}
function showAbout(){
    $( "#options" ).toggle("slide", {direction:"right"}, "fast")
    $( "#about" ).toggle("slide", {direction:"left"}, "fast")
}
function showReport(){
    $( "#options" ).toggle("slide", {direction:"right"}, "fast")
    $( "#reportProblem" ).toggle("slide", {direction:"left"}, "fast")
}

function cleanupErrorDiv(){
//    $( "#options" ).toggle("slide", {direction:"right"}, "slow")
    $( "#reportProblem" ).toggle("slide", {direction:"left"}, "slow")
    f.songError.value = "-1";
    f.reasonError.value = "-1";
    f.errorReason.value = "";
}

function cleanupAboutDiv(){
    $( "#options" ).toggle("slide", {direction:"right"}, "slow")
    $( "#about" ).toggle("slide", {direction:"left"}, "slow")
}

function runIntro(){
    if(introRun == "true") return true;
    $("#runIntro1").css("display", "table-row");
    $("button").attr("disabled", "true");
    $("select").attr("disabled", "true");
    $("input").attr("readonly", "true");
    var classes = document.getElementsByClassName("trackTD");
    flicker(classes,0);
    return false;

}
function flicker(c,i){
    return;
    if(i > 0){
        $(c-1).css("background-image", "url('img/dimgreenplay.gif')")
    }
    if(c == 9) return;
    $(c).css("background-image", "url('img/lightgreenplay.gif')")
    setTimeout(flicker, 1000, (c, i*1+1));

}

function chooseGenre(ele){
    if(ele.value == "0"){
        deleteCookie("genre");
    }else {
        addCookie("genre", ele.value);
    }
    playAgain();
    // window.location.href = "index.html?rand=" + Math.random();
    return;
}

function getHighScore(){
    highScore = getCookie("highscore");
    if (highScore == ""){
        highScore = 0;
    }
}

function getGenre(){
    var genre = getCookie("genre");
    if (genre == ""){
        genre = 0;
    }
    f.genre.value = genre;
}

function chooseDecade(ele){
    if(ele.value == "0"){
        deleteCookie("decade");
    }else {
        addCookie("decade", ele.value);
    }
    playAgain();
    // window.location.href = "index.html?rand=" + Math.random();
    return;
}

function getDecade(){
    var decade = getCookie("decade");
    if (decade == ""){
        decade = 0;
    }
    f.decade.value = decade;
}

function getWidthOfText(text) {
    // alert(text)
    var tmp = document.createElement("span");
    tmp.className = "input-element tmp-element";
    $(tmp).css("font", fontSize + "pt Lucida Console");
    $(tmp).css("visibility", "hidden");
    tmp.innerHTML = text;
    document.body.appendChild(tmp);
    var theWidth = Math.ceil(tmp.getBoundingClientRect().width);
    message(13, " width " + theWidth + " " + text + " " + fontSize);
    document.body.removeChild(tmp);
    return theWidth + "px";
}

var xDown = null;
var yDown = null;

function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
};

function handleTouchMove(evt) {
    if(DISABLESWIPE)
        return;
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 4 ) {
            biggerFont();
        } else if ( xDiff < -4) {
            smallerFont();
        }
    } else {
        if ( yDiff > 4 ) {
            swipePause();
        } else if ( yDiff < -4 ){
            swipePlay();
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;
};

function swipePause(){
    if(typeof(fieldWithFocus) != "undefined") fieldWithFocus.blur();
    if(!playInProgress || playedUpTo == 10) return;
    pausePlaying = true;
    $("#pause").css("opacity", 0.0);
    $("#pause").css("display", "block");
    
    evolve(document.getElementById("pause"), 0);
    if(introRun == "false"){
        $("#runIntro6").hide();
        setTimeout(slideSwipebox, 2000, 2);
    }
}
function swipePlay(){

    if(typeof(fieldWithFocus) != "undefined"){
        fieldWithFocus.blur();
    }
    if(fieldWithFocus){
        fieldWithFocus.blur();
    }
    // If no internet connection, swipe reloads the game
    if(typeof (Tracks[0]) == "undefined"){
        // console.log("replay");
        playAgain();
        return false;
    }

    if(playInProgress || showedPlayAllMessage == "true") return;
//    message(12, document.getElementById("pause").style.display);
    if(document.getElementById("pause").style.display != "none") {
        // message(11, document.getElementById("pause").style.display);
        disolve(document.getElementById("pause"), 1);
    }
    if(introRun == "false"){
        $("#runIntro6").hide();
        setTimeout(slideSwipebox, 3000, 1);
    }
    replayFull();
}

function disolve(ele, opac){
    // ele.style.display = "inline";
    $(ele).css("zIndex", 0);

//    $("#page").css("opacity", 1);
    if(opac > 0){
        opac -= 0.20;
        ele.style.opacity = opac;
        $("#page").css("opacity", (1-opac));
        setTimeout(disolve, 100, ele, opac);
        return;
    }
    $(ele).css("display", "none");
}
function evolve(ele, opac){
    if(opac < 1){
        opac += 0.10;
        ele.style.opacity = opac;
        $("#page").css("opacity", (1-opac));
        setTimeout(evolve, 100, ele, opac);
        return;
    }
//    $(ele).css("zIndex", -1);
//    $(ele).css("display", "none");
    //    $("#page").css("opacity", 0.7);
     setTimeout(disolve,1000,ele,1);
}
function biggerFont(){
    if(fontSize == "15") return;
    fontSize = fontSize*1+1;
//    font = fontSize;
    adjustInputSizes();
    handleViewport(fontSize);
    $("#page").center();
    if(introRun == "false"){
        $("#runIntro6").hide();
        setTimeout(slideSwipebox, 1000, 3);
    }
    
}
function smallerFont(){
    if(fontSize == "6") return;
    fontSize = fontSize*1-1;
    font = fontSize;
    adjustInputSizes();
    handleViewport(fontSize);
    $("#page").center();
    if(introRun == "false"){
        $("#runIntro6").hide();
        setTimeout(slideSwipebox, 1000, 4);
    }
}

function shareToTwitter(){
    var storeRank = rank;
    getRank(points * 1 + overall_score * 1);
    var message = "Can you recognise a song in just a couple of seconds? Play the Split Music Challenge and find out.";

    if (rank != storeRank) {
        message = "I've reached the level of " + rank + " on the Split Music Challenge!"
    } else if (points > highScore) {
        message = "I'v reached a personal new best on the Split Music Challenge! " + points + " points."
    }

    alert(message);
    open("https://twitter.com/home?status=" + message +
        "%26url=http%3A//www.oursort.co.za/splitmusicchallenge/index.html");

}
function shareToFaceBook(){
    // Method 1
//    alert(window.plugins);
//    window.plugins.socialsharing.share('Message, subject, image and link', 'The subject', 'https://www.google.nl/images/srpr/logo4w.png', 'http://www.x-services.nl');
//
//    return;
    
    // Method 2
    try {
//       FB.ui({
//           method: 'feed',
//           name: title,
////           link: 'http://www.oursort.co.za/splitmusicchallenge/index.html',
//             link: 'za.co.oursort.splitmusicchallenge',
//           picture: 'http://www.oursort.co.za/splitmusicchallenge/img/musicimage2.jpg',
//           caption: 'Split Music Challenge',
//           description: "message"
//       });
//        return;
    
    // Method 3
//        open("https://www.facebook.com/sharer/sharer.php?u=http://www.oursort.co.za/splitmusicchallenge/index.html");
//              // https://www.facebook.com/sharer/sharer.php?u=http://www.oursort.co.za/splitmusicchallenge/index.html
//        return;
//    
//        // Method 4
//        open("https://www.facebook.com/dialog/share?app_id=1725168737759736&display=popup&href=http://www.oursort.co.za/splitmusicchallenge/index.html&redirect_uri=splitmusicchallenge:");
//        
//        return;
        
        // Method 5
        FB.login(function(response){ alert("response: " + response.status)});
        return;
        
        
        var storeRank = rank;
        getRank(points * 1 + overall_score * 1);
        var message = "Can you recognise a song in just a couple of seconds? Play the Split Music Challenge and find out.";
        var title = 'Split Music Challenge.'

        if (rank != storeRank) {
            message = "Congratulations, you've reached the level of " + rank + " on the Split Music Challenge!"
            title = "Promoted to level: " + rank;
        } else if (points > highScore) {
            message = "Congratulations! Youv'e reached a personal new best on the Split Music Challenge! " + points + " points."
            title = "Personal new best :" + points;
        }


//        window.plugins.socialsharing.share('Message only')
                                         
        addPoints(500);
    }catch (e){
        alert("share to FB Error " + e);
    }
}

function adjustInputSizes(){
    e = document.getElementsByTagName("input");
    var row = 0;
    var saveRow = 0;
    var field = -1;
    for(var i=0; i<e.length; i++){
        if(e[i].name.indexOf("answer") <= 0) continue;
        row = (e[i].name.split("_")[1])-1;
        if(row != saveRow) field = -1;
        field++;
        saveRow = row;
//        e[i].style.fontSize = fontSize;
        $(e[i]).css("width", getWidthOfText(Tracks[row].answersText[field]));
    }
}

                                         

function messageUser(message, cancel, callBack, parm){
    $("#alertsMessage").html(message);
    var cancelButton = "";
    if(cancel != ""){
        cancelButton = "<button class='alerts' type='button' onClick='returnInput(false, " + callBack +  ", " + parm + ")'>" + cancel + "</button>";
    }
    var okayButton = "<button class='alerts' type='button' onClick='returnInput(true, " + callBack + ", " + parm + ")'>Okay</button>";
    $("#alertsButtons").html(cancelButton + "&nbsp;&nbsp;" + okayButton);
    $("#alerts").center();
    //    $(".alerts, #alerts").show();
    $("#alerts").show();
    
}
function returnInput(response, callBack, parm){
    $("#alerts").hide();
    callBack(response, parm);

}


function message(r, mess){
    try {

        var fullmess = "";
        
        var now = new Date();
        var lapsed = ((now - startDate)/1000);
        lapsed = Math.floor(lapsed);
        var loading = "Loading...";
        if (TEST || r > 10) {
//            if(lapsed > 20 && r<=10){
//                mess = "<a target=_new href='mp3/" + Load[r-1].fileName + "'>"+Load[r-1].fileName+"</a>";
//            }
          $("#info" + r).html(r + "<input type='text' class='info' size=1 value='" + r + "' style='visibility:hidden;font:" + font + "'/> " +
                              "<div class='progress'>" + mess + "</div>");
        }else{
          Load[r - 1].addHistory(mess);
          // console.log(mess);
          fullmess = Load[r - 1].history;
          
        var perc = Load[r - 1].percent;
        if(lapsed > 1){
            if(lapsed > 10 && lapsed % 2 == 0){
                loading = "Slow connection ";
            }else {
                loading = "&nbsp;&nbsp;&nbsp;&nbsp;Loading...&nbsp;&nbsp;&nbsp;";
            }
        }
            if(lapsed > 30){
                loading = "<a target=_new href='mp3/" + Load[r-1].fileName + "'>"+Load[r-1].fileName+"</a>";
            }
                // loading = lapsed;
          var inside = "<table style='width:100%'><tr><td onclick='alert(\"" + fullmess + "\")' style='width:" + perc +
          "%;background:indianred;text-align:center; display:block; overflow:hidden;white-space:nowrap'>" + loading +
          // "%;background:#455e9c;text-align:center'>" +
          "</td><td>&nbsp</td></tr></table>";
          $("#info" + r).html(inside);
          // if (perc < 90) {
          //     Load[r - 1].percent = perc * 1 + 10;
          // }
          // alert("");
        }
    }catch(e){
          alert("Error : " + e  + " r = " + r + " mess = " + mess);
          }
          
}

function prefetch_file(url,
                       fetched_callback,
                       progress_callback,
                       error_callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    
    xhr.addEventListener("load", function () {
                         if (xhr.status === 200) {
                            var URL = window.URL || window.webkitURL;
                            var blob_url = URL.createObjectURL(xhr.response);
                            fetched_callback(blob_url);
                         } else {
                            error_callback(xhr.status, url);
                         }
                         }, false);
    
    var prev_pc = 0;
    xhr.addEventListener("progress", function(event) {
                         if (event.lengthComputable) {
                            var pc = Math.round((event.loaded / event.total) * 100);
                            if (pc != prev_pc) {
                                prev_pc = pc;
                                progress_callback(pc);
                            }
                         }
                         });
    xhr.send();
}

function checkIfCanPlayTriggered(idx){
    if(numberReady[idx] != 1){
        alert("Can play not triggered yet " + idx + " " + document.getElementById("loadSnip" + idx).buffered.length);
//        resetSrc(Load[idx].audio);
    }
}
//function fetched(url, idx){
//    var e = document.getElementById("loadSnip" + idx)
//    console.log(idx + " fetched " + url);
//    e.src = url;
////    $(e).bind("canplaythrough", function(){setCanPlay(this) });
//    $(e).bind("waiting", function(){waiting(this) });
//    $(e).bind("stalled", function(){stalled(this) });
//    e.load();
//    setTimeout(checkIfCanPlayTriggered, 5000, idx-1);
//    //    setCanPlay(e);
//}
//function waiting(el){
//    console.log("waiting " + e.id);
//    message(12, e.id + " waiting");
//}
//function stalled(el){
//    console.log("stalled " + e.id);
//    message(12, e.id + " stalled");
//}
function error(e, url){
    alert("prefetch error " + url);
}
function progress(pc, idx){
    console.log(idx + " = " + pc);
}

var source1;
var source2;
function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    
    var loader = this;
    
    request.onload = function() {
        // Asynchronously decode the audio file data in request.response
        loader.context.decodeAudioData(
                                       request.response,
                                       function(buffer) {
                                       if (!buffer) {
                                       alert('error decoding file data: ' + url);
                                       return;
                                       }
                                       loader.bufferList[index] = buffer;
                                       if (++loader.loadCount == loader.urlList.length)
                                       loader.onload(loader.bufferList);
                                       },
                                       function(error) {
                                       console.error('request.onload: decodeAudioData error', error);
                                       }
                                       );
    }
    
    request.onerror = function() {
        alert('BufferLoader: XHR error');
    }
    
    request.send();
}

BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i)
        this.loadBuffer(this.urlList[i], i);
}


function createAudios(i) {
    // Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
    
    var bufferLoader = new BufferLoader(
                                    context,
                                    [
                                     Load[i].fileName,
                                     ],
                                    function() {finishedLoading(bufferList,i)}
                                    );
//    console.log("loading buffer");
    bufferLoader.load();
}

function finishedLoading(bufferList, i) {
//    console.log("finishedLoading " + i);
    return;
    // Create two sources and play them both together.
    for(var i=0; i<1; i++){
        Load[i].source = context.createBufferSource();
        Load[i].source.buffer = bufferList[i];
        Load[i].source.connect(context.destination);
    }
//    console.log("loaded");
    Load[0].source.start(0,30, 5);
}


function nextBubble(i, skip){
    playClick();
    if(typeof(skip) == "undefined"){
    switch (i){
            // Use individual buttons to replay a snippet.
        case 1: replay(3);
            break;
        case 2:
            f.lifeline.click();
            break;
        case 3:
            break;
        case 4:
            break;
        case 5:
            f.genre.size = 0;
            if(isMobileDevice){
                DISABLESWIPE = false;
                // Listen for swipe to replay
                document.removeEventListener('touchstart', handleTouchStart, false);
                document.removeEventListener('touchmove', handleTouchMove, false);
                document.addEventListener('touchstart', handleTouchStart, false);
                document.addEventListener('touchmove', handleTouchMove, false);
                slideSwipebox(0);
                break;
            }
        case 6:
            $("input").removeAttr("readonly");
            $("select").removeAttr("disabled");
            $("#runIntro" +i).hide();
            introRun = "true";
            addCookie("intro_run", "true");
            nextSnippet(0);
            return;
            break;
    }
    }
    $("#runIntro" +i).hide();
    i++;
    $("#runIntro" +i).css("display", "block");
    message(13, "runintro" + i);
}

function slideSwipebox(count){
    $("#runIntro6").show();
    switch (count){
        case 0: // Swipe down to resume play
            $("#endHints").html("")
            $("#swipeHint").html("Swipe down to resume play<br>");
            break;
        case 1: // Swipe up
            $("#swipeHint").html("Swipe up to pause play<br>");
            break;
        case 2: // Left
            $("#swipeHint").html("Swipe left to increase font<br>");
            break;
        case 3: // Right
            $("#swipeHint").html("Swipe Right to decrease font<br>");
            break;
        case 4: // Finished
            $("#swipeHint").html("Walkthrough Complete.");
            $("#endHints").html("Begin");
            introRun = "true";
            break;
    }
}
function walkThrough(){
    $( "#options" ).toggle("slide", {direction:"right"}, "fast");
    introRun="false";
    runIntro();
}

var IAP = {
list: [ "1148656369", "additionalLife", "za.co.oursort.additionalLife", "za.co.oursort.AccessDecade", "AccessDecade" ] };


IAP.load = function () {
    alert("IAP.onload");
    // Check availability of the storekit plugin
    if (!window.storekit) {
        console.log("In-App Purchases not available");
        return;
    }
    
    // Initialize
    storekit.init({
                  debug:    true, // Enable IAP messages on the console
                  ready:    IAP.onReady,
                  purchase: IAP.onPurchase,
                  restore:  IAP.onRestore,
                  error:    IAP.onError
                  });
};

// StoreKit's callbacks (we'll talk about them later)
IAP.onReady = function () {};
IAP.onPurchase = function () {};
IAP.onRestore = function () {};
IAP.onError = function () {};

IAP.onReady = function () {
    alert("IAP.onready");
    storekit.verbosity = storekit.DEBUG;
    // Once setup is done, load all product data.
    storekit.load(IAP.list, function (products, invalidIds) {
                  console.log("Products length " + products.length);
                  for (var j = 0; j < products.length; ++j) {
                    var p = products[j];
                    console.log('Loaded IAP(' + j + '). title:' + p.title +
                                ' description:' + p.description +
                                ' price:' + p.price +
                                ' id:' + p.id);
                    IAP.products[p.id] = p;
                  }
//                  IAP.products = products;
                  IAP.loaded = true;
                  for (var i = 0; i < invalidIds.length; ++i) {
                    console.log("Error: could not load " + invalidIds[i]);
                  }
    });
};


var renderIAPs = function (el) {
    alert("renderfunction");
    if (IAP.loaded) {
        var life  = IAP.products["additionalLife"];
        var html = "<ul>";
        for (var id in IAP.products) {
            var prod = IAP.products[id];
            html += "<li>" +
            "<h3>" + prod.title + "</h3>" +
            "<p>" + prod.description + "</p>" +
            "<button type='button' " +
            "onclick='IAP.buy(\"" + prod.id + "\")'>" +
            prod.price + "</button>" +
            "</li>";
        }
        html += "</ul>";
        el.innerHTML = html;
    }else {
        el.innerHTML = "In-App Purchases not available.";
    }
};




// New code for add ons
//
//define([], function () {
//       'use strict';

//       var IAP = {
//        list: [ "additionalLife", "za.co.oursort.additionalLife", "za.co.oursort.AccessDecade", "AccessDecade" ],
//        products: {}
//       };
//       var localStorage = window.localStorage || {};
//       
//       IAP.initialize = function () {
//           // Check availability of the storekit plugin
//           if (!window.storekit) {
//               console.log('In-App Purchases not available');
//               return;
//           }
//       
//           // Initialize
//           storekit.init({
//                     ready:    IAP.onReady,
//                     purchase: IAP.onPurchase,
//                     restore:  IAP.onRestore,
//                     error:    IAP.onError
//                     });
//        };
//       
//       IAP.onReady = function () {
//       // Once setup is done, load all product data.
//           storekit.load(IAP.list, function (products, invalidIds) {
//                     console.log('IAPs loading done:');
//                     for (var j = 0; j < products.length; ++j) {
//                        var p = products[j];
//                        console.log('Loaded IAP(' + j + '). title:' + p.title +
//                                 ' description:' + p.description +
//                                 ' price:' + p.price +
//                                 ' id:' + p.id);
//                        IAP.products[p.id] = p;
//                     }
//                     IAP.loaded = true;
//                     for (var i = 0; i < invalidIds.length; ++i) {
//                        console.log('Error: could not load ' + invalidIds[i]);
//                     }
//            });
//       };
//       
//       IAP.onPurchase = function (transactionId, productId/*, receipt*/) {
//           var n = (localStorage['storekit.' + productId]|0) + 1;
//           localStorage['storekit.' + productId] = n;
//           if (IAP.purchaseCallback) {
//               IAP.purchaseCallback(productId);
//               delete IAP.purchaseCallbackl;
//           }
//       };
//       
//       IAP.onError = function (errorCode, errorMessage) {
//           alert('Error: ' + errorMessage);
//       };
//       
//       IAP.onRestore = function (transactionId, productId/*, transactionReceipt*/) {
//           var n = (localStorage['storekit.' + productId]|0) + 1;
//           localStorage['storekit.' + productId] = n;
//       };
//       
//       IAP.buy = function (productId, callback) {
//           IAP.purchaseCallback = callback;
//           storekit.purchase(productId);
//       };
//       
//       IAP.restore = function () {
//           storekit.restore();
//       };
//       
//       IAP.fullVersion = function () {
//           return localStorage['storekit.babygooinapp1'];
//       };

//       return IAP;
//       });
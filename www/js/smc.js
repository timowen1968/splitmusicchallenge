/**
 * Created by Tim on 3/9/16.
 */
TESTNUMBER = 10;
var totalCorrect = 0;
var duration = 1500;
var points = 0;
var overall_score = 0;
var beenWarned = "false";
var f;
// Used in named fields to prevent broweser from auto-populating
var randomNumber = Math.ceil((Math.random() * 999999999));

var rankoptions = ["BAMBI", "BAMBI'S MOM", "SUPERMAN", "CHUCK NORRIS", "BATMAN", "JEDI"];
var rank;
var store = [0,0,0,0,0,0,0,0,0,0]; // stores timeframe for each track
var trackIds = []; // Stores the track_id for each song
var numberReady = [0,0,0,0,0,0,0,0,0,0]; // To check when all tracks are ready to play
var playFull = "false";
var storePlayingFull = -1;
var showedPlayAllMessage = "false";
var user = "";
var coinAudio;
var startDate = new Date();
var test = true;

var fontWide = " 16pt Lucida Console";
var fontSizeWide = "21";
// var fontWide = " 7pt Lucida Console";
// var fontSizeWide = "3pt";
var fontMedium = " 12pt Lucida Console";
var fontSizeMedium = "17";
var fontNarrow = " 9pt Lucida Console";
var fontSizeNarrow = "7";

var fontSize = fontSizeMedium;
var font = fontMedium;

var mp3Url = "http://www.oursort.co.za/splitmusicchallenge/mp3/";
var holdingPosition = 1;
var Load = [];
var Tracks = [];
var introRun = true;
var holdString = "";
var genre;
var decade;
var playInProgress = false;
var abortSong = false;
var playedUpTo = 0;var levelChanged = false;
var highScore;

$(document).ready(function(){
    if(!navigator.onLine){
        alert("No internet connection");
        return false;
    }

    f = document.forms[0];

    setUp();

    $.get("http://www.oursort.co.za/splitmusicchallenge/smc.php?genre=" + f.genre.value + "&decade=" + f.decade.value, function(data) {
        populatePage(data);  });

    if(!test)
    {
        $("#infoRow11").css("display", "none");
        $("#infoRow12").css("display", "none");
    }
    // facebook.login( function(success) { alert(success); }, function(error) { alert(error); } );
    coinAudio = document.getElementById("coinAudio");
    // coinAudio.play;
     
    $(window).on('resize orientationChange', function(event) { handleViewport(); });


});

// Viewport Specific stuff
function handleViewport(chosenFont){
    // alert($(window).width());
    var viewport = {
        width  : $(window).width(),
        height : $(window).height()
    };

    if(typeof (chosenFont) != "undefined"){
        fontSize = chosenFont + "pt";
        font = fontWide.replace("16", chosenFont);
    }else if(viewport.width > 1200) { // laptop
        font = fontWide;
        fontSize = fontSizeWide + "pt";
        $("#top").css("display", "none");
        $("#page").center();
        $("#header").css("font", font).css("font-size", fontSize);
        $("#optionsImg").prop("size", "20");
        $("select").css("font", font).css("font-size","10pt");
    }else if(viewport.width > 600){
        font = fontMedium;
        fontSize = fontSizeMedium + "pt";
        $("#top").css("display", "block").css("width", viewport.width);
        $("#page").css("width","53%").center();
        $("#header").css("font", font).css("font-size", fontSize);
        $("#optionsImg").prop("size", "18");
        $("select").css("font", font).css("font-size","8pt");
    }
    else{
        font = fontNarrow;
        fontSize = fontSizeNarrow + "pt";
        $("#top").css("display", "block").css("width", viewport.width);
        $("#page").css("width", viewport.width).css("position", "absolute").css("top", "100px").center();
        $("#header").css("font", font).css("font-size", fontSizeMedium);
        // $("#page").center();
        $("#optionsImg").prop("size", "10");
        $("select").css("font", font).css("font-size", "7pt").css("color", "black");
        $("#splash").css("font-size", "16pt");
        // $("#pause").css("width", viewport.width).css("height", viewport.height).css("line-height", viewport.height + "px").center();
    }
    $("#pause").center();
    $("#resume").center();

    message(11, font);
    message(12, font);
    $("select").css("background", "#455e9c").css("border", "1px solid #455e9c");
    // $("#splash").css("width", viewport.width).css("height", viewport.height).css("line-height", viewport.height + "px").css("font", font)
    //     .center();
    $("#splash").css("width", viewport.width).css("height", viewport.height).css("line-height", viewport.height + "px");
        // .css("font", font);
    $("#wideViewport").css("font", font);
    $("#subHeader").css("font", font);
    $("input").css("font", font);
    $(".info").css("font", font);
    $(".buttonTrack").css("font-size", (fontSize)+"pt").css("width", (chosenFont*2));
    $(".buttonTrack:disabled").css("font-size", (fontSize-2)+"pt").css("width", (chosenFont*2));
    return viewport;
}
function refreshTotalScore(){
    document.getElementById("pointsTD").innerHTML = "Total Score: " + overall_score + "<br>Level: " + rank;
}
function getTotalPoints() {
    found = getCookie("overall_score");
    if (found == "" || found == "NaN") {
        found = 0;
    }
    return getRank(found);
}
function getRank(found){
    rank = rankoptions[0];
    if((found*1) < 10000){
        rank = rankoptions[0];
    }else if((found*1) < 22900){
        rank = rankoptions[1];
    }else if((found*1) < 50000){
        rank = rankoptions[2];
    }else if((found*1) < 100000){
        rank = rankoptions[3];
    }else if((found*1) < 500000){
        rank = rankoptions[4];
    }else{
        rank = rankoptions[5];
    }
    return found;
}
function audioReady(){
    var okay = 0;
    for(var i = 0; i<10; i++){
        okay+= numberReady[i];
    }
//    return okay == 10;
     return okay == 6;
}
function checkSong(e, ev){
    ev = ev || window.event;
    var charCode = ev.keyCode || ev.which || ev.charCode;

    // Tab and shift must do nothing
    if(charCode == 9 || charCode == 16 || charCode == 13) return false;

    bits=e.name.split("_");
    var number = bits[1];

    // Get all the fields in the name of the song and artist
    var es = document.getElementById("row" + number).getElementsByTagName("input");

    if(charCode == 8 && e.value == "" && (typeof(e.oldvalue) == "undefined" || e.oldvalue == "")){

        var foundNext = false;
        // If user presses backspace at beginning of row, check previous rows for field to focus on
        if(e == es[0]){
            for(var jj=number-1; jj>0; jj--){
                var ess = document.getElementById("row" + jj).getElementsByTagName("input");
                for(var i=ess.length-1; i>=0; i--){
                    if(ess[i].disabled == false) {
                        $(ess[i]).focus();
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
                        $(es[i - 1]).focus();
                        break;
                    }
                    keepLooping = "true";
                }
            }
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
    if(es[indexOfCurrent].value.toUpperCase() == Tracks[number-1].answersText[indexOfCurrent].toUpperCase()){
        // Correct, so make it green and disable it
        if(indexOfCurrent < (es.length -1)){
            // Focus on the next empty field
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
        }else if(number < 10){
            $(document.getElementsByName(randomNumber + "~answer_" + (number*1+1*1))[0]).focus();
        }
        es[indexOfCurrent].disabled = true;
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
        points += 5000;
        alert("Congratulations! You got it.")
        document.getElementById("surrender_all").style.display = "none";
        document.getElementById("getNext").style.display = "table";

    }
    showPoints();

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
        message(11, cname + " = " + cvalue);
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

// Once metadata has loaded, this selects a random timesnippet to play
function setSnippet(audioIndex, count){

    // alert(audioElement + " " + audioElement.src);
    var track = Load[audioIndex];
    if(typeof(track) == "undefined"){
        alert("shold never happen 1");
        message(idTrack, "Track is undefined");
        setTimeout(setSnippet, 100, audioIndex);
        return;
    }
    var audioElement = track.getAudio();

    idTrack = audioIndex*1+1;
    message(idTrack, "Start loading " + count + " "  + audioElement.src);
    if(typeof(count) == "undefined"){
        count=0;
    }
    message(idTrack, "Have Load object");

    if(track.timeSnippet != 0){ // A snippet has already been generated for this one
        alert("shold never happen 2");
        return;
    }
    track.percent = 30;
    message(idTrack, "");
    if(audioElement.readyState != 4){
        message(idTrack, "readystate " + audioElement.readyState);
        if(track.percent < 60) track.percent += 5;
        setTimeout(setSnippet, 500, audioIndex, ++count);
        return;
    }

    track.percent = 60;
    // message(idTrack, "");
    message(idTrack, "Selecting time snippet");
    // Generate a time snippet and store it
    random = Math.random();
    var snippy = Math.floor(random * (audioElement.duration - 6))+2; // Need to make sure we have enough seconds to play

    // A duration this small indicates the file is invalid
    if(audioElement.duration < 30) {
        alert(audioElement.src + " is not a valid audio file")
        message(idTrack, " SIZE PROBLEM setSnippet " + random + " * (" + (audioElement.duration) + " - 20) + 15 = " + snippy + " " + audioElement.src);
        return;
    }
    Load[audioIndex].timeSnippet = snippy;

    setTimeout(monitorLoad, 1000, audioIndex); // Give it a second to begin buffering
}


function slotIn(sequence){
    var track = Load[sequence];
    track.percent = 90;
    var idTrack = sequence * 1 + 1;
    message(idTrack, "");
    var savePosition = holdingPosition++ ;
    holdString += " " + savePosition;
    var hindex = savePosition - 1;
    e = track.getAudio();
    e.pause();
    numberReady[sequence] = 1;
    // Shift everything for the new position
    // $(e).prop("id", "snip" + holdingPosition);

    $("#infoRow" + idTrack).hide();

    var fields = track.inputSong;

    if(fields[0].value.toUpperCase() == "BONUS") addPoints(1000);
    var ename = randomNumber + "~answer_" + savePosition;
    for(var j=0; j<fields.length; j++){
        fields[j].setAttribute("name", ename);
        $("#answerContainer"+savePosition).append(fields[j]);
    }
    $("#answerContainer" + savePosition).html($("#answerContainer"+savePosition).html() + "by"); // byTag
    fields = track.inputArtist;
    for(var j=0; j<fields.length; j++){
        fields[j].setAttribute("name", ename);
        $("#answerContainer"+savePosition).append(fields[j]);
    }
    $("#row" + savePosition).show();
    var eles = document.getElementsByName(ename);
    for(var j=0; j<eles.length;j++){
        eles[j].onkeyup = function(event){ checkSong(this, event) };
    }
    $("#page").center();
    Tracks[hindex] = track;

    // holdingPosition++;
    
}
// Monitors the buffer until the selected snippet is in one of the ranges
function monitorLoad(sequence, c){
    var calls = c;
    if(typeof(c) == "undefined"){
        calls=0;
    }
    var track = Load[sequence];
    message((sequence*1+1), "monitorload " + sequence);
    if(typeof(track) == "undefined"){
        setTimeout(monitorLoad, 1000, sequence, ++calls);
        return;
    }
    // alert(track + " " + track.audio);
    e = track.getAudio();
    var idTrack = e.id.substr(8);

    // If this one is ready, skip it
    message(idTrack, "Ready to check buffer (call # " + calls + ")");
    // message(idTrack,50);
    if(numberReady[sequence] == 1){
        message(idTrack, "Finished");
        return;
    }
    // message(idTrack,50);
    var buffLen = e.buffered.length;
    message(idTrack, " Buffer exists length " + buffLen);
    // Wait for the buffer to have contents
    var count=0;
    if(e.buffered.length == 0){
        message(idTrack, " Buffer is empty - count " + ++calls)
        setTimeout(monitorLoad, 2000, sequence, ++calls);
        return;
    }
    // Give the buffer time to load
    // while(buffLen <= 0 && count < 1000){
    //     message(idTrack, " Buffer is empty - count " + count)
    //     // message(idTrack,50);
    //
    //     count++;
    //     buffLen = e.buffered.length;
    // }
    // Should have started by now. If not there is a problem, so try reseting the audio tag
    if(count >= 1000) {
        message(idTrack," moitorload Buffer is still empty");
        resetSrc(e);
        return;
    }
    track.percent = 70;
    message(idTrack, "");
    // If the snippet we need has been buffered, then release it
    var min = track.timeSnippet - 1; // 1 second back for safety
    var max = (track.timeSnippet + 3) * 1 // 3 seconds ahead to give room to play
    var buffercount=0;
    // while(buffercount++ < 100000) {
        for (i = 0; i < buffLen; i++) {
            if (e.buffered.start(i) <= min && e.buffered.end(i) >= max) {
                slotIn(sequence);

                // All loaded? Start the game!
                // message(12, holdString);
                if (audioReady() && introRun) {
                    // Listen for swipe to replay
                    document.addEventListener('touchstart', handleTouchStart, false);
                    document.addEventListener('touchmove', handleTouchMove, false);
                    // $("#page").css("width", "auto");
                    // $("#page").center();
                    var endDate = new Date();
                    message(11, (endDate - startDate)/1000);
                    // message(11,50);
                    nextSnippet(0);
                }

                return;
            }
            message(idTrack, i + ": " + track.timeSnippet + " not in buffer " + e.buffered.start(i) + "-" + e.buffered.end(i));
        }
    calls++;
    setTimeout(monitorLoad, 1000, sequence, calls);
    return;
    // }
    return;
// Sometimes buffer does not finish loading for some reason
    if(e.buffered.end(0) > 30){
        message(idTrack, "Changing snippet " + e.buffered.start(0) + " - " + e.buffered.end(0) + " ( " + track.timeSnippet
                + " ) duration " + e.duration);
        Load[sequence].timeSnippet = e.buffered.end(0) - 8;
        monitorLoad(sequence);
        return;
    }
// Sometimes the audio tag NEVER fires a canplay, in which case we remove the tag and replace it.
    message(idTrack, "Not in buffer " + e.buffered.start(0) + " - " + e.buffered.end(0) + " ( " + track.timeSnippet
        + " ) duration " + e.duration + " buffer length " + e.buffered.length + " resetting");
    resetSrc(e);

}
function message(r, mess){
    try {
        var fullmess = "";
        if (test || r > 10) {
            mess = (""+mess).replace(/'/g, "").replace(/"/g, "");
            // var fullmess = mess.replace(/'/g, "").replace(/"/g, "");
            if (r <= 10) {
                Load[r - 1].addHistory(mess);
                fullmess = Load[r - 1].history;
                // mess = fullmess;
            }
            // $("#info" + r).html(r + "<input type='text' class='info' size=1 value='" + r + "' style='visibility:hidden;font:" + font + "'/> " +
            //     "<div onclass='progress'>" + mess + "</div>");
            $("#info" + r).html(r + "<input type='text' class='info' size=1 value='" + r + "' style='visibility:hidden;font:" + font + "'/> " +
                "<div onclick='alert(\"" + fullmess + "\")' onclass='progress'>" + mess + "</div>");

        } else {
            Load[r - 1].addHistory(mess);
            var fullmess = Load[r - 1].history;

            var perc = Load[r - 1].percent;
            var inside = "<table style='width:100%'><tr><td onclick='alert(\"" + fullmess + "\")' style='width:" + perc +
                "%;background:indianred;text-align:center'>" +
                // "%;background:#455e9c;text-align:center'>" +
                "</td><td>&nbsp</td></tr></table>";
            $("#info" + r).html(inside);
            // if (perc < 90) {
            //     Load[r - 1].percent = perc * 1 + 10;
            // }
            // alert("");
        }
    }catch(e){
        alert(e  + " r = " + r + " mess = " + mess);
    }

}
function nextSnippet(next){

    $("button").prop("disabled", true);
    $("select").prop("disabled", true);
    playInProgress = true;
    // Stop at the end of the playlist
    if(next == 10) {
        Tracks[9].stop();
        $("#row10").css("background","");

        $("button").prop("disabled", false);
        $("select").prop("disabled", false);
        playInProgress = false;
        playedUpTo = 0;
        return;
    }
    if(next != 0){
        Tracks[next-1].stop();
        document.getElementById("row" + (next)).style.background = "";

    }
    if(abortSong){
        $("button").prop("disabled", false);
        $("select").prop("disabled", false);
        playInProgress = false;
        abortSong = false;
        return;
    }
    playIfReady(next, duration);
}

function playIfReady(next, duration){
    if(typeof(Tracks[next]) == "undefined"){
        message(11, "Track " + next + " is not ready");
        setTimeout((playIfReady, 200, next, duration));
    }
    Tracks[next].play();
    next++;
    playedUpTo = next;
    document.getElementById("row" + (next)).style.background = "#455e9c";

    setTimeout(nextSnippet, duration, next);

}
// Only happens in Safari
// Sometimes the audio tag NEVER fires a canplay, in which case we remove the tag and replace it.

function resetSrcOld(e){
    i=e.id.substr(8);
    // Remove the entry in the snippet list so it will refresh
    // Tracks[i-1].timesnippet = 0;
    e.pause();
    e.currentTime = 0;
    e.load();
    e.play();
    message(i, "resetSrc");
    alert("resetSrc");
}

function resetSrc(e){
    i=e.id.substr(8);
    // message(i, "resetSrc " + e.id);
    // message(11, "resetSrc " + e.id);
//    alert("Resetting " + e.readyState + " " + e.src);
   try{
       var save = e.src;
       e.pause();
       e.src = "";
       Load[i-1].timeSnippet = 0;
       // e.load();
       e.src = save;
       e.load();
   }catch(e){
       message(11, e.message);

   }
   return
}

function replayFull(){
    if(playInProgress) return false;

    nextSnippet(playedUpTo);
}

function replay(snippet){
    // snippet=eid.substr(7);
    if(beenWarned == "false" && playFull == "false"){
        a = confirm("Using these replay buttons will cost you points");
        beenWarned = "true";
        if (!a) return false;
        addCookie("been_warned", "true");
    }
    if(playFull == "false") {
        document.getElementById("row" + (snippet)).style.background = "#455e9c";
        deductPoints(10);
        Tracks[snippet-1].play();
        setTimeout(function () {
            Tracks[snippet-1].stop();
            document.getElementById("row" + (snippet)).style.background = "";
        }, duration );
        var es = document.getElementsByName(randomNumber + "~answer_" + snippet)[0];
        $(es).focus();

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
    $("#score").html("This Game: " + points);
}

function deductPoints(number){
    points -= number;
    showPoints();
}
function addPoints(number){
    points += number;
    showPoints();
}
function playAgain(){
    addCookie("overall_score", (overall_score * 1 + points));
    if(points > highScore){ addCookie("highscore", points) };
    var pause = 0;
    if(points > 0){
        coinAudio.currentTime = 0;
        coinAudio.muted = false;
        coinAudio.play();
        pause = Math.ceil(4000/points);
    }
    animateScore(pause);
    return false;
}
function animateScore(pause) {
    if (points > 0) {
        overall_score = overall_score * 1 + 1;
        points--;
        refreshTotalScore();
        showPoints();
        setTimeout(animateScore, pause, pause);
    }else{
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
    for(i=1; i<=10;i++){
        fields = document.getElementsByName(randomNumber + "~answer_"+i)

        for(j=0;j<fields.length;j++){
            fields[j].value = Tracks[i-1].answersText[j];
            fields[j].disabled = true;
        }
    }
    e.style.display = "none";
    document.getElementById("getNext").style.display = "table";
    // $("#loser").center().fadeToggle(1000).fadeToggle(500);
    duration = 120000;
    playFull = "true";
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

        document.getElementById("songErrorTr").style.display = "none";
        var timeslice = -1;
        if(f.reasonError.value <= 2){

            timeslice = Tracks[bits[0]-1].timeSnippet;
        }
        allDetails = "";
        for (i=0; i<10; i++){
            allDetails += " " + Tracks[i].id + ":" + Tracks[i].timeSnippet;
        }
        if(error == "true") return false;
        $("#errorResult").load("http://www.oursort.co.za/splitmusicchallenge/ajax.php", { option: "logError", track: bits[1], reason: f.reasonError.value,
                info: f.errorReason.value, timesnippet: timeslice, detail: allDetails},
            function(){ cleanupErrorDiv() }) ;
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
        if(f.reasonError.value >=0 && f.reasonError.value < 3) {
            document.getElementById("songErrorTr").style.display = "inline";
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
function useLifeline(e){
    if(e.value == 0) return true;
    if(e.value == 99){
        alert("You've already used up this life line");
        e.value = 0;
        return;
    }

    // replay full set of snippets - free
    if(e.value == 1){
        replayFull();

        // Play different snippet
    }else if (e.value == 3){
        deductPoints(500);

        loadSnippets();
        e[e.selectedIndex].value = "99";
        nextSnippet(0);

        // Play longer snippet
    }else if (e.value == 2){
        duration = duration * 1 + 500;
        deductPoints(Math.ceil(duration / 25));
        if(duration > 2000)
            e[e.selectedIndex].value = "99";
        nextSnippet(0);
    }
    e.selectedIndex = 0;
    return;
}

function loadSnippets(){
    for(var loopy=0; loopy<10;loopy++) {
        var e = Tracks[loopy].audio;
        random = Math.random();
        var snippy = Math.floor(random * (e.duration - 6)) + 2; // Need to make sure we have enough seconds to play
        Tracks[loopy].timeSnippet = snippy;
    }

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

function populatePage(data){
    if(data.substr(0,5) == "ERROR"){
        alert(data.substr(7));
        deleteCookie("decade");
        deleteCookie("genre")
        playAgain();
        // window.location.href = "index.html?rand=" + Math.random();
        return;
    };
    message(11, (new Date() - startDate)/1000);


    var audioText = "";
    var songErrorOptions = "<option value='-1'>Select</option>";
    var selectedRowsValue = "";
    var line = data.split("~~~");
    // message(12, line[10]);

    for(var i=0; i<10;i++){
        var music = new Music();
        music.sequence = i;
        var snippetNumber = (i*1+1);
        var bits = line[i].split("~!~");
        music.trackId = bits[0];
        music.fileName = bits[1];
        music.songName = bits[2];
        music.artist = bits[3];
        music.id = "loadSnip" + snippetNumber;

        var audioE = document.createElement("audio");
        // $(audioE).bind("canplaythrough", function() { alert(this.src) });
        audioE.setAttribute("src", mp3Url +music.fileName);
        audioE.setAttribute("type", "audio/mpeg; codecs=mp3");
        audioE.setAttribute("id", "loadSnip" + snippetNumber);
        audioE.setAttribute("controls", true);
        audioE.setAttribute("preload", "auto");
        audioE.load();
        audioE.muted = true;
        document.getElementById("audioElements").appendChild(audioE);

        songErrorOptions += "<option value='" + snippetNumber + "_" + music.trackId + "'>" + snippetNumber + "</option>";

        Load[i] = music;
        // message((i*1+1), "<a href='" + mp3Url + music.fileName +"' target='new'>" + music.fileName + "</a>");
        message((i*1+1), music.fileName);
        // message(snippetNumber,"");
        setTimeout(setSnippet, 1000, i, 0);

    }
    for(var i=0; i<10;i++) {
        var music = Load[i];
        populateLoadMusicList(i, music);
        layoutAnswerGrid(i, music);
        selectedRowsValue +=  music.trackId +  " ";
    }
    // selectedRowsValue += "0)";
    // document.forms[0].selectedRows.value = selectedRowsValue;
    // $("#ajaxResult").load("http://www.oursort.co.za/splitmusicchallenge/ajax.php", { option: "updateSelected", tracks: selectedRowsValue},
    //     function(){  }) ;

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
    if(bits[0] == "Bonus") {
        showValue = true;
//        addPoints(1000);
    };
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
function setUp(){
    var viewport = handleViewport();

    $("#page").hide();
    $("#splash").center();
    if(!test) $(".buttonInfo").css("visibility", "hidden");
    $("#splash").show();
    // document.getElementById("splash").style.display = "block";
    getGenre();
    getDecade();
    getHighScore();

    beenWarned = getCookie("been_warned");
    if (beenWarned == ""){
        beenWarned = "false";
    }

    overall_score = getTotalPoints();

    refreshTotalScore();
    showPoints();

    runIntro();

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
    this.timeSnippet = "";
    this.answersText = [];
    this.inputSong = [];
    this.inputArtist = [];
    this.id = "";
    this.fileName = "";
    this.songName = "";
    this.artist = "";
    this.score = 0;
    this.audio = "";
    this.percent = 10;
    this.history = "";
    this.addHistory = function(h){
        this.history += "\n" + h.replace(/\"/,"");
    }

    this.getAudio = function() {
        return document.getElementById(this.id);
    }
    this.play = function(){
        this.audio = document.getElementById(this.id);
        this.audio.currentTime = this.timeSnippet;
        this.audio.muted = false;
        this.audio.play();
    }
    this.stop = function(){
        this.audio = document.getElementById(this.id);
        this.audio.pause();
        this.audio.currentTime = this.timeSnippet;
        this.audio.muted = true;
    }
    this.playFull = function(){
        this.audio = document.getElementById(this.id);
        this.audio.currentTime = 0;
        this.audio.play();
        this.audio.muted = false;
    }
}
function showOptions(){
    $( "#options" ).toggle("slide", {direction:"right"}, "fast")
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
    $( "#options" ).toggle("slide", {direction:"right"}, "slow")
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
    if(introRun) return true;
    $(".runintro1").show();
    var classes = document.getElementsByClassName("trackTD");
    flicker(classes,0);

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
    $(tmp).css("font", font);
    $(tmp).css("visibility", "hidden");
    tmp.innerHTML = text;
    document.body.appendChild(tmp);
    var theWidth = Math.ceil(tmp.getBoundingClientRect().width);
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
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            biggerFont(0);
            // alert("l");
            /* left swipe */
        } else {
            smallerFont(0);
            // alert("r");
            /* right swipe */
        }
    } else {
        if ( yDiff > 4 ) {
            swipePause();
            // alert("d");
            /* up swipe */
        } else if ( yDiff < -4 ){
            swipePlay();
            /* down swipe */
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;
};

function swipePause(){
    if(!playInProgress) return;
    abortSong = true;
    evolve(document.getElementById("pause"), 0);
}
function swipePlay(){
    // evolve(document.getElementById("resume"), 0);
    if(document.getElementById("pause").style.display == "none") return;
    disolve(document.getElementById("pause"), 0.8);
    replayFull();
}

function disolve(ele, opac){
    ele.style.display = "inline";
    if(opac > 0){
        opac -= 0.10;
        ele.style.opacity = opac;
        setTimeout(disolve, 100, ele, opac);
        return;
    }
    ele.style.display = "none";
}
function evolve(ele, opac){
    ele.style.display = "inline";
    if(opac < 0.8){
        opac += 0.10;
        ele.style.opacity = opac;
        setTimeout(evolve, 100, ele, opac);
        return;
    }
    // disolve(ele,1);
}
function biggerFont(){
    if(fontSize == "15pt") return;
    fontSize = fontSize.replace("pt", "")*1+1;
    handleViewport(fontSize);
}
function smallerFont(){
    if(fontSize == "6pt") return;
    fontSize = fontSize.replace("pt", "")*1-1;
    handleViewport(fontSize);
}

function shareToFaceBook(){
    try {
        alert("shareFB");
        var storeRank = rank;
        getRank(points * 1 + overall_score * 1);
        var message = "Can you recognise a song in just a couple of seconds? Play the Split Blits Impossible Music Challenge and find out.";
        var title = 'Split Blits Impossible Music Challenge.'

        if (rank != storeRank) {
            message = "Congratulations, you've readed the level of " + rank + " on the Split Blitz Impossible Music Challenge!"
            title = "Promoted to level: " + rank;
        } else if (points > highScore) {
            message = "Congratulations! Youv'e reached a personal new best on the Split Blits Impossible Music Challenge! " + points + " points."
            title = "Personal new best :" + points;
        }


        FB.ui({
            method: 'feed',
            name: title,
            link: 'http://www.oursort.co.za/splitmusicchallenge/index.html',
            picture: 'http://www.oursort.co.za/splitmusicchallenge/img/musicimage2.jpg',
            caption: 'Split Blits Music Challenge',
            description: message
        });
        addPoints(500);
    }catch (e){
        alert("Error " + e);
    }
}
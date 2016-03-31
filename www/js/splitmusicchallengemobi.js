/**
 * Created by Tim on 3/9/16.
 */
TESTNUMBER = 10;
var totalCorrect = 0;
var duration = 1500;
var points = 0;
var best_score = 0;
var overall_score = 0;
var beenWarned = "false";
var f;
// Used in named fields to prevent broweser from auto-populating
var randomNumber = Math.ceil((Math.random() * 999999999));

var rankoptions = ["BAMBI", "BAMBI'S MOM", "SUPERMAN", "CHUCK NORRIS", "BATMAN", "JEDI"]; // CHUCK NORRIS, BATMAN, TIM  depends on points
var rank;
var next = 0;
var store = [0,0,0,0,0,0,0,0,0,0]; // stores timeframe for each track
var loadStore = [0,0,0,0,0,0,0,0,0,0]; // stores timeframe for each track as theh are loading
var trackIds = []; // Stores the track_id for each song
var loadTrackIds = []; // Stores the track_id for each song whilst loading
var track_score = [0,0,0,0,0,0,0,0,0,0]; // store score per track
var numberReady = [0,0,0,0,0,0,0,0,0,0]; // To check when all tracks are ready to play
var answerlist = []; // Contains the list of answers in the correct order. This gets populated in the order that the tracks
// Contains the list of answers in the correct order. This gets populated in the order that the tracks become ready to play
var loadAnswerlist = []; // The original list sent from the server
var playFull = "false";
var storePlayingFull = -1;
var showedPlayAllMessage = "false";
var user = "";
var showSplash = "true";
var coinAudio;
var startDate = new Date();
var test = "false";
var font = "bold 8pt Lucida Console";
var mp3Url = "http://www.oursort.co.za/splitmusicchallenge/mp3/"
var holdingPosition = 1;
var audios = []; //
var loadAudios = [] // Holds the audio elemts while they load
var inputArtists = [];
var inputSongs = [];

$(document).ready(function(){
   // coinAudio = document.getElementById("coinAudio");
//    $(coinAudio).load().prop("muted", "true")

//    coinAudio.play();
    // facebook.login( function(success) { alert(success); }, function(error) { alert(error); } );
    $("#splash").center();

    $(window).on('resize orientationChange', function(event) { handleViewport(); })

    var bits = window.location.href.split("?");
    var parms = "";
    if (bits.length > 1){
        parms="?" + bits[1];
    }
    // alert("parms " + parms);
    // else{
    //     parms="?test=true"
    // }

//    data="26!!!01 White Riot!!!White Riot!!!The Clash~~~";
//    data+="63!!!10 Sleep Together!!!Sleep Together!!!Garbage~~~";
//    data+="286!!!18 Breathing!!!Breathing!!!Jason Derulo~~~";
//    data+="342!!!18 Should I Stay Or Should I Go!!!Should I Stay Or Should I Go!!!The Clash~~~";
//    data+="389!!!2-08 Please, Please, Please, Let Me Get What I Want!!!Let Me Get What I Want!!!The Smiths~~~";
//    data+="429!!!01 White Riot!!!White Riot!!!The Clash~~~";
//    data+="484!!!01 White Riot!!!White Riot!!!The Clash~~~";
//    data+="490!!!01 White Riot!!!White Riot!!!The Clash~~~";
//    data+="643!!!01 White Riot!!!White Riot!!!The Clash~~~";
//    data+="709!!!01 White Riot!!!White Riot!!!The Clash";
    setUp();
//    populatePage(data);
//    return;
    // debug(parms);
    // $.get("http://localhost:8080/www/splitmusicchallengemobi.php" + parms, function (data)
                  $.get("http://www.oursort.co.za/splitmusicchallenge/splitmusicchallengemobi.php?new=true" + parms, function(data) {
                        populatePage(data) });

});

// Viewport Specific stuff
function handleViewport(){
    var viewport = {
        width  : $(window).width(),
        height : $(window).height()
    };
//     alert("height: " + viewport.height + " width: " + viewport.width);


    // Widescreen device like an iPad
    if(viewport.width > 800){
        font = "bold 12pt Lucida Console";
        $("#page").css("width", "800px");
        $("input").css("font", font);
        $(".info").css("font", font);
        $("#songsTable2").prop("cellpadding", "2px");
        $("#page").center();

        // $("input").each(function(){ this.size = (this.size + 20)});
    }
    else{
        $("#songsTable2").prop("cellpadding", "0").prop("cellspacing", "0");
        $("#page").center();
        $("#page").css("width", viewport.width).css("position", "absolute").css("top", "0");
    }

}
function refreshTotalScore(){
    document.getElementById("pointsTD").innerHTML = "Total Score: " + overall_score + "<br>Level: " + rank;
}
function getTotalPoints(){
    rank = rankoptions[0];
    if(user == ""){
        found = getCookie("overall_score");
        if(found == ""){
            return 0;
        }
        if((found*1) < 1000){
            rank = rankoptions[0];
        }else if((found*1) < 2000){
            rank = rankoptions[1];
        }else if((found*1) < 3000){
            rank = rankoptions[2];
        }else if((found*1) < 4000){
            rank = rankoptions[3];
        }else if((found*1) < 5000){
            rank = rankoptions[4];
        }else{
            rank = rankoptions[5];
        }
        return found;

    }
}
function audioReady(){
    var okay = 0;
    for(var i = 0; i<10; i++){
        okay+= numberReady[i];
    }
    return okay == 10;
}
function countReady(){
    var okay = 0;
    for(var i = 0; i<numberReady.length; i++){
        okay+= numberReady[i];
    }
    return okay;
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
//    var es = document.getElementsByName(randomNumber + "~answer_" + number);

    if(charCode == 8 && e.value == "" && (typeof(e.oldvalue) == "undefined" || e.oldvalue == "")){
        var keepLooping = "false";

        for(var i=es.length-1; i>0; i--){
            if(e == es[i] || keepLooping == "true"){
                if(es[i-1].disabled == false) {
                    $(es[i-1]).focus();
                    break;
                }
                keepLooping = "true";
            }
        }
    }

    e.oldvalue = e.value;
    var correct = 0;

    // Loop through all fields in answer
    var indexOfCurrent = 0;
    var total = 0;
    message(11, number)
    for (var i=0; i<answerlist[number-1].length; i++){
        total += answerlist[number-1][i].length;
    }
// Loop through each field for song
    deductPoints(track_score[number-1]);
    for(var i=0; i<es.length; i++){
        if(e == es[i]){
            indexOfCurrent = i;
        }
        // loop through characters in each field in answer

        // number is the track number - need to subtract 1 for the array
        // i is the field number starting at 0
        // ii is the character in the field
         message(11, es[i].value.toUpperCase() + " = " +answerlist[number-1][i].toUpperCase());
        if(es[i].value.toUpperCase() == answerlist[number-1][i].toUpperCase()) {
            for (var ii = 0; (ii < es[i].value.length && ii < answerlist[number - 1][i].length); ii++) {
                if (es[i].value[ii].toUpperCase() == answerlist[number - 1][i][ii].toUpperCase()) {
                    correct++;
                }
            }
        }
    }

    // If correct answer automatically focus on next field
    if(es[indexOfCurrent].value.toUpperCase() == answerlist[number-1][indexOfCurrent].toUpperCase()){
        // Correct, so make it green and disable it
        if(indexOfCurrent < (es.length -1)){
            // Because AND is automatically filled in, we need to skip fields with AND in them
            if(es[indexOfCurrent+1].value == "&"){
                $(es[indexOfCurrent+2]).focus();
            }else {
                $(es[indexOfCurrent+1]).focus();
            }

            es[indexOfCurrent].value = answerlist[number-1][indexOfCurrent].toUpperCase();
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
        $("#ajaxResult").load("http://www.oursort.co.za/splitmusicchallenge/ajax.php", { option: "updatePopular", track: trackIds[(number*1-1*1)], trackNo: number},
            function(){  }) ;
        addPoints(100);
    }
    track_score[number-1] = scoreForSong;
    addPoints(track_score[number-1]);

    // document.getElementById("mark_" + number).innerHTML = scoreForSong + "% " + correct;

    // Fix the overall_score
    if (totalCorrect == 10){
        points += 1000;
        alert("Congratulations! You got it.")
        document.getElementById("surrender_all").style.display = "none";
        document.getElementById("getNext").style.display = "inline";

    }
    showPoints();

}


function stopPlay(track){
    var audio = audios[track - 1];
    audio.pause();
    audio.currentTime = 0;
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
        // document.getElementById("debug").innerHTML = "";
        debug("document.cookie = " + cname + " =" + cvalue + "; " + expires);
        // time() + (10 * 365 * 24 * 60 * 60)
    }catch (e){
        document.getElementById("debug").innerHTML = "";
        debug("AddCookie error " + e);
    }
}

function oops(){
    for(i=0; i<store.length;i++) {
        if (store[i] == 0) { // already loaded this one
            debug(i + " " + document.getElementsByTagName("audio")[i].src)
        }
    }
    return false;
}

// Called by onplay on the audio tag
// Chooses the snippet to play and stores it on store[]
// Then calls monitorLoad
function setSnippet(e){
//    e = this;
//    return;
    var subs = 8;
    var index = e.id.substr(8);
    idTrack = index;
    index = index - 1;
    if(e.src.indexOf("Coins.mp3") > 0){
        slotIn(e);
        alert("coins");
        return;
    }
    if(loadStore[index] != 0){ // A snippet has already been generated for this one
        return;
    }
    // Wait until it is ready
    if(e.readyState != 4){
        message(idTrack,"Wasting time - readystate " + e.readyState);
        setTimeout(setSnippet, 100, e);
        return;
    }

    message(idTrack, "Selecting time snippet");
//    debug("added snippet for " + e.id);
    // Generate a time snippet and store it
    random = Math.random();
    var snippy = Math.floor(random * (e.duration - 6))+2; // Need to make sure we have enough seconds to play

    // A duration this small indicates the file is invalid
    if(e.duration < 30) {
        message(idTrack, " SIZE PROBLEM setSnippet " + random + " * (" + (e.duration) + " - 20) + 15 = " + snippy + " " + e.src);
    }
    loadStore[index] = snippy;
    setTimeout(monitorLoad, 500, e); // Give it a second to begin buffering
}


function slotIn(e){
    var idTrack = e.id.substr(8);
    var index = idTrack - 1;
    var hindex = holdingPosition - 1;
    e.pause();
    numberReady[hindex] = 1;
    // Shift everything for the new position
    $(e).prop("id", "snip" + holdingPosition);
//    document.getElementById("audioContainer").appendChild(e);

    $("#info" + idTrack).hide();
//    var content = document.getElementById("answerContainer" + idTrack).innerHTML.replace(/"_"+ idTrack/g, "_"+holdingPosition);
    // Need to fix the names of the field for their new position
    
    var fields = inputSongs[index];
    
    for(var j=0; j<fields.length; j++){
        fields[j].setAttribute("name", randomNumber + "~answer_" + holdingPosition);
        $("#answerContainer"+holdingPosition+"song").append(fields[j]);
    }
    fields = inputArtists[index];
    for(var j=0; j<fields.length; j++){
        fields[j].setAttribute("name", randomNumber + "~answer_" + holdingPosition);
        $("#answerContainer"+holdingPosition+"artist").append(fields[j]);
    }
//    alert("Juist moved container " + idTrack + " to " + holdingPosition);
//    var content = document.getElementById("answerContainer" + idTrack).innerHTML;
//    $("#row" + holdingPosition).html(content);
    // Remove dupliacte
//    document.getElementById("answerContainer" + idTrack).innerHTML = "";
    $("#row" + holdingPosition).show();
    store[hindex] = loadStore[index];
    answerlist[hindex] = loadAnswerlist[index];
    trackIds[hindex] = loadTrackIds[index];
    audios[hindex] = loadAudios[index];
    message(11, answerlist[hindex]);

    holdingPosition++;
    
}
// Monitors the buffer until the selected snippet is in one of the ranges
function monitorLoad(e){
    var subs = 8;
    var idTrack = e.id.substr(subs);
    var index = idTrack - 1;
    // If this one is ready, skip it
    message(idTrack, "Ready to check buffer")
    if(numberReady[holdingPosition] == 1){
        return;
    }
    if(e.duration < 60){
        message(idTrack, e.id + " Error with duration " + e.duration);
        resetSrc(e);
    }
    message(idTrack, e.id + " Buffer exists")
    var buffLen = e.buffered.length;
    // Wait for the buffer to have contents
    var count=0;
    // Give the buffer time to load
    while(buffLen <= 0 && count < 100){
        message(idTrack, e.id + " Buffer is empty - count " + count)

        count++;
        buffLen = e.buffered.length;
    }
    // Should have started by now. If not there is a problem, so try reseting the audio tag
    if(count >= 100) {
        message(idTrack, e.id + " Buffer did not fill")
//        console.log(e.id + " Buffering problem " + buffLen);
//        debug(e.id + " Buffering problem " + buffLen);
        // setTimeout(resetSrc, 2000, e);
        return;
    }
    // If the snippet we need has been buffered, then release it
    var min = loadStore[index] - 1; // 1 second back for safety
    var max = (loadStore[index] + 3) * 1 // 3 seconds ahead to give room to play
    var buffercount=0;
    while(buffercount++ < 200) {
        for (i = 0; i < buffLen; i++) {
            if (e.buffered.start(i) <= min && e.buffered.end(i) >= max) {
                slotIn(e);

//                $("#splash").html("Tuning Our Instruments: " + (countReady() / 10 * 100) + "%");
                // All loaded? Start the game!
                if (audioReady()) {
                    var endDate = new Date();
                    message(11, (endDate - startDate)/1000);
                    nextSnippet();
                    $("#splash").hide();
                    $("#page").show();
                }

                return;
            }
        }
        // console.log("Buffering count " + buffercount);
    }
// Only happens in Safari
// Sometimes the audio tag NEVER fires a canplay, in which case we remove the tag and replace it.
    message(idTrack, "Not in buffer " + e.buffered.start(0) + " - " + e.buffered.end(0) + " ( " + loadStore[index] + " ) duration " + e.duration);
    resetSrc(e);
    // console.log("Calling monitor here A")
    // setTimeout(monitorLoad, 100, e);

}
function message(r, mess){
//    document.getElementById("info" + r).innerHTML = r + " " + mess;
    $("#info" + r).html("<input type='text' class='info' size=1 value='" + r + "' style='font:" + font + "'/> " + mess);
//    alert(r + " " + mess);
}
function nextSnippet(track){
//    if(document.forms[0].test.value != "true") {
//        $("button").prop("disabled", true);
//    }else{
//        $("button").prop("disabled", false);
//    }
    $("select").prop("disabled", true);
//    $("input").prop("disabled", true);
//    $("input").css("background", "#99ccff");


    // If number provided, replay the snippet for a song, or the whole snippet
    if(typeof(track) == "number"){
        if(track == 0){
            next = 0;
        }else{
            // Just this one song
            var audio = audios[next - 1];
            audio.currentTime = store[next-1];
            audio.muted = false;
            audio.play();
            setTimeout(stopPlay, duration, track);
        }
    }
    // Stop at the end of the playlist
    if(next == 10) {
        var audio = audios[9];
        audio.pause();
        audio.currentTime = 0;
        $("#row10").css("background","");

        $("button").prop("disabled", false);
        $("select").prop("disabled", false);
        var inputs = document.getElementsByName(randomNumber + "~answer_1")
        inputs[0].focus();
        return;
    }
    var snippy = store[next];
    var audio = audios[next]
    audio.currentTime = snippy;
    next++;
//    document.getElementById("snip" + next).currentTime = snippy;
    if(next > 1){
        stopPlay(next-1);
        document.getElementById("row" + (next-1)).style.background = "";
    }
//    var audio = document.getElementById("snip" + next);
    audio.muted = false;
    audio.play();
    document.getElementById("row" + (next)).style.background = "#455e9c";
    // document.getElementById("row" + (next)).style.background = "#69C0A0";

    setTimeout(nextSnippet, duration);
}


// Only happens in Safari
// Sometimes the audio tag NEVER fires a canplay, in which case we remove the tag and replace it.
// I know, right?!
function resetSrc(e){
    e.pause();
    e.load();
    return
    i=e.id.substr(4);
    // Remove the entry in the snippet list so it will refresh
    store[i-1] = 0;
    debug("resetSrc play() "+ i + " " + e.src);
    console.log("resetSrc play() "+ i + " " + e.src);
    // e.timefr
    e.play();
}

function replayFull(){
    next = 0;
    nextSnippet(0);
}

function replay(snippet){
    if(beenWarned == "false" && playFull == "false"){
        a = confirm("Using these replay buttons will cost you points");
        beenWarned = "true";
        if (!a) return false;
        addCookie("been_warned", "true");
    }
    if(playFull == "false") {
        var e = audios[snippet-1]
        // e.style.display = "inline";
        deductPoints(10);
        e.currentTime = store[snippet - 1]
        e.play();
        setTimeout(function () {
            e.pause()}, duration );
        var es = document.getElementsByName(randomNumber + "~answer_" + snippet)[0];
        $(es).focus();

    }else{
        // Game over and user has requested to play the full song

        // If a track is already playing, stop it
        if(storePlayingFull != -1){
            e.pause();
        }
        if(storePlayingFull == snippet) return;
        e.currentTime = 0;
        // console.log("replay play()" + 2);
        e.play();
        storePlayingFull = snippet;
    }

}

function showPoints(){
    document.getElementById("score").innerHTML = "This Game: " + points;
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
    var pause = 0;
    if(points > 0){
        coinAudio.currentTime = 0;
        coinAudio.muted = false;
        coinAudio.play();
        pause = Math.ceil(4500/points);
    }
    debug(points);
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
        $("#play").hide();
        $("#splash").html("Tuning Our Instruments").show();
        window.location.href = "index.html?rand=" + Math.random();
    }
}


function trapError(e, obj){
    alert("trap error " + obj.currentSrc + " " + e.code + " " +obj.error.code);
    $("#errorResult").load("http://www.oursort.co.za/splitmusicchallenge/ajax.php", { option: "logError", track: obj.id.substr(4), reason: 5,
            info: "file does not exist", timesnippet: 0, detail: "None"},
        function(){ cleanupErrorDiv() }) ;

}
function startTest(){

    audio_files = document.getElementsByTagName("audio");
    alert("(audio_files.length " +audio_files.length);
    for (var i = 0; i < audio_files.length; i++) {
        var audFile = audio_files[i];
        var clue = audFile.id;
        alert("clue " +clue);
        //document.getElementById("progress").innerHTML = "Processing " + clue;
        audFile.addEventListener("error", function(e) { trapError(e, this) } );
        //audFile.addEventListener("loadeddata", function() { alert("loaded")});
        //audFile.addEventListener("error", function(e) { document.getElementById("message").innerHTML += clue + " " + e.currentTarget.error.code + "<br>"});
        audFile.load();
    }
}

// In test mode, presents the next 10 tracks
function getNextSet(){
    $("#splash").html("Tuning Our Instruments").show();
    $("#play").hide();
    f.start.value = f.start.value * 1 + ( 10 * 1);
    window.location.href="index.html?test=true&start=" + f.start.value;
    return true;
}

function surrender(e){
    fields = document.getElementsByName(randomNumber + "~answer_"+(e+1))

    for(i=0;i<fields.length;i++){
        fields[i].value = answerlist[e][i];
    }
}

function surrenderAll(e){
    for(i=1; i<=10;i++){
        fields = document.getElementsByName(randomNumber + "~answer_"+i)

        for(j=0;j<fields.length;j++){
            fields[j].value = answerlist[i-1][j];
        }
    }
    e.style.display = "none";
    document.getElementById("getNext").style.display = "inline";
    $("#loser").center().fadeToggle(1000).fadeToggle(500);
    duration = 120000;
    playFull = "true";
    // if(showedPlayAllMessage = "false") alert("Selecting the replay button next to a song will now play the full track. Click it again to make it stop if you hate it");
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

        //if(bits[1] < 0){
        //    error = "true";
        //    f.songError.style.background = "pink";
        //}

        if(f.reasonError.value < 0){
            error = "true";
            f.reasonError.style.background = "pink";
        }

        document.getElementById("songErrorTr").style.display = "none";
        var timeslice = -1;
        if(f.reasonError.value <= 2){

            timeslice = store[bits[0]-1];
        }
        allDetails = "";
        for (i=0; i<10; i++){
            allDetails += " " + store[i] + ":" + trackIds[i];
        }
        //console.log("error " + error + " " + timeslice);
        if(error == "true") return false;
        // Do ajax call to log the data
        //return;
        $("#errorResult").load("http://www.oursort.co.za/splitmusicchallenge/ajax.php", { option: "logError", track: bits[1], reason: f.reasonError.value,
                info: f.errorReason.value, timesnippet: timeslice, detail: allDetails},
            function(){ cleanupErrorDiv() }) ;
    }
    catch (e){
        alert ("Submiterrpr " +e);
        return false;
    }
}

function cleanupErrorDiv(){
    $("#reportProblem").fadeOut(2000);
    f.songError.value = "-1";
    f.reasonError.value = "-1";
    f.errorReason.value = "";
}

function cleanupAboutDiv(){
    $("#about").fadeOut(2000);
    f.songError.value = "-1";
    f.reasonError.value = "-1";
    f.errorReason.value = "";
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
        deductPoints(Math.ceil(duration / 50));
        if(duration > 2000)
            e[e.selectedIndex].value = "99";
        nextSnippet(0);
    }
    e.selectedIndex = 0;
    return;
}

function loadSnippets(){
    audio_files = document.getElementsByTagName("audio");
    for(var loopy=0; loopy<10;loopy++) {
        var e = audio_files[loopy];
        random = Math.random();
        var snippy = Math.floor(random * (e.duration - 6)) + 2; // Need to make sure we have enough seconds to play
        // A duration this small indicates the file is invalid
        if (e.duration < 30) {
            debug(e.id.substr(4) + " SIZE PROBLEM setSnippet " + random + " * (" + (e.duration) + " - 20) + 15 = " + snippy + " " + e.src);
        }
        // debug("(setSnippet) Generated snippet " + e.id + " readystate = " + e.readyState);
        store[loopy] = snippy;
    }

}
function debug(t){
    if(test == "true")
        document.getElementById("debug").innerHTML += t + "<br>";
    document.getElementById("splash").innerHTML += t + "<br>";
    $("splash").css("fontSize","10pt").css("background", "initial");
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
function fakeClick(fn) {
    var $a = $('<a href="#" id="fakeClick"></a>');
    $a.bind("click", function(e) {
        e.preventDefault();
        fn();
    });

    $("body").append($a);

    var evt,
        el = $("#fakeClick").get(0);

    if (document.createEvent) {
        evt = document.createEvent("MouseEvents");
        if (evt.initMouseEvent) {
            evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            el.dispatchEvent(evt);
        }
    }

    $(el).remove();
}


// NOTES TO ME

// Change references to songsTable2 to songsTable

//data="26!!!01 White Riot!!!White Riot!!!The Clash~~~";
function populatePage(data){

    var audioText = "";
    var songErrorOptions = "<option value='-1'>Select</option>";
    var selectedRowsValue = "(";
    var line = data.split("~~~");
    for(var i=0; i<10;i++){
        var snippetNumber = (i*1+1)
        var bits = line[i].split("!!!");
        var trackId = bits[0];
        var file = bits[1];
        var song = bits[2];
        var artist = bits[3];
        // alert("Track: " + track +  " file: " + file + " name: " + song + " Artist: " + artist);
        populateLoadAnswerList(i, trackId, song + " " + artist)
        // Prepare the input grid
        layoutAnswerGrid(i, song, artist);

        // Layout audio
        loadAudios[i] = document.createElement("audio");
        loadAudios[i].setAttribute("src", mp3Url +file);
        loadAudios[i].setAttribute("id", "loadSnip" + snippetNumber);
        loadAudios[i].setAttribute("preload", "auto");
        loadAudios[i].addEventListener("canplaythrough", setSnippet(loadAudios[i]) );
        loadAudios[i].muted = true;
        loadAudios[i].load();
//        audios[i].load();
        
//        audioText += "<audio id='loadSnip" + snippetNumber + "' src='" +
//            mp3Url + file + ".mp3' preload='auto' oncanplaythrough='setSnippet(this)'></audio>";

        songErrorOptions += "<option value='" + snippetNumber + "_" + trackId + "'>" + snippetNumber + "</option>";

        selectedRowsValue +=  trackId +  ",";
    }
    selectedRowsValue += "0)";
    document.forms[0].selectedRows.value = selectedRowsValue;
    $("#songError").html(songErrorOptions);
}

function layoutAnswerGrid(i, song, artist){
    inputSongs[i] = [];
    inputArtists[i] = [];
    var pad = 2;
    var bits = song.split(" ");
    var showValue = false;
    var value = "";
    if(bits[0] == "Bonus") showValue = true;;
    for(var ii=0; ii<bits.length;ii++) {
        if(showValue) value = bits[ii];
        var newInput = document.createElement("input");
        newInput.setAttribute("type", "text");
        newInput.setAttribute("value", value);
        newInput.setAttribute("size", (bits[ii].length*1+pad) + "em");
        newInput.setAttribute("name", randomNumber + "_answer_" + index);
        newInput.onkeyup = function(event){ checkSong(this, event) };
//        newInput.addEventListener("keyup", checkSong(this, event));
        inputSongs[i][ii] = newInput;
    }
    
    bits = artist.split(" ");
    for(var ii=0; ii<bits.length;ii++) {
        if(showValue) value = bits[ii];
        var newInput = document.createElement("input");
        newInput.setAttribute("type", "text");
        newInput.value = value;
        newInput.setAttribute("size", (bits[ii].length*1+pad) + "em");
        newInput.setAttribute("name", randomNumber + "_answer_" + index);
        newInput.onkeyup = function(event){ checkSong(this, event) };
//        newInput.addEventListener("keyup", "return checkSong(this, event");
        inputArtists[i][ii] = newInput;
    }
    return;
    
    
    var index = (i*1+1);
    var sc = document.getElementById("answer" + index + "song");
    var ac = document.getElementById("answer" + index + "artist");

    // Song titles
    var layoutText = "<div style='white-space: nowrap; display:inline; vertical-align:top'>";
    var bits = song.split(" ");
    var showValue = false;
    var value;
    if(bits[0] == "Bonus") showValue = true;;
    for(var ii=0; ii<bits.length;ii++) {
        if(showValue) value = " value='" + bits[ii] + "' ";
        layoutText += "<input type='text'  style='font: bold 12pt Lucida Console;' onkeyup='return checkSong(this, event)' size='" +
            (bits[ii].length*1+pad) + "em' "+ value + " name='" + randomNumber + "_answer_" + index + "'>";
    }
    layoutText += "</div>";
    $(sc).html(layoutText);

    // Artist
    layoutText = "<div style='white-space: nowrap; display:inline; vertical-align:top'>";
    bits = artist.split(" ");
    for(var ii=0; ii<bits.length;ii++) {
        if(showValue) value = " value='" + bits[ii] + "' ";
        layoutText += "<input type='text'  style='font: bold 12pt Lucida Console;' onkeyup='return checkSong(this, event)' size='" +
            (bits[ii].length*1+pad) +" em' " + value + " name='" + randomNumber + "_answer_" + index + "'>";
    }
    layoutText += "</div>";
    $(ac).html(layoutText);


}
// This populates global arrays
function populateLoadAnswerList(i, trackId, details){
    loadTrackIds[i] = trackId;
    loadAnswerlist[i] = [];
    bits = details.split(" ");
    for(var ii=0; ii<bits.length;ii++){
        loadAnswerlist[i][ii] = bits[ii].trim();
    }
}

function processDataOriginal(data){
        alert("DATA: " + data);
        var prep = data.replace(/REPMES/g, "title='Replay this snippet. It will cost you points, though' " +
            " type='button' class='smooth' disabled><img style='padding:0' src='img/replay.jpg' height=15></button>");

        prep = prep.replace(/AUDSRC/g,
            "oncanplaythrough='setSnippet(this)' preload='auto' src=\"http://www.oursort.co.za/splitmusicchallenge/");

        prep += "<br><button type='button' id='showAbout'>About</button>" +
            "<button type='button' id='reportMistake'>Report a problem</button> " +
            "<button type='button' id='Oops' onclick='oops(); return false'>Oops</button>";

        $("#serverData").html(prep);

        // See if staggering the load improves performance and reliability
        // best = 8 secomnds
//        var audios = $("audio");
//        for(var loop=0; loop<10; loop++){
//          setTimeout(function(loop) { message(loop*1+1, "Loading"); audios[loop].load(); audios[loop].muted = true; }, 500, loop);
//        }
        $("audio").load().prop("muted", "true");
}

function setUp(){
    handleViewport();

    f = document.forms[0];

    if(f.test.value != "") showSplash = "false";
//        if(showSplash == "false"){
    $("#splash").hide();
    $("#page").show();
//        }


    beenWarned = getCookie("been_warned");
    if (beenWarned == ""){
        beenWarned = "false";
    }

    overall_score = getTotalPoints();

    refreshTotalScore();
    showPoints();

    $("#reportMistake").click(function(){
        $("#reportProblem").center().fadeIn(1000);
        $("#errorResult").html("");
        $("#songError").focus();
        return false;
    });
    $("#showAbout").click(function(){
        $("#about").center().fadeIn(1000);
        $("#about").center().fadeIn(1000);
        return false;
    });
    $("#ajaxResult").load("http://www.oursort.co.za/splitmusicchallenge/ajax.php", { option: "updateSelected", tracks: f.selectedRows.value},
        function(){  }) ;
}
/**
 * Created by Tim on 9/3/16.
 *
 */
// Once metadata has loaded, this checks the track is ready to play
function setSnippet(audioIndex, count){

    // alert(audioElement + " " + audioElement.src);
    var track = Load[audioIndex];
    var audioElement = track.getAudio();

    var idTrack = audioIndex*1+1;
//    console.log(idTrack + " is it null? ae " + audioElement + " src " + audioElement.src + " " + " track = " + track);
    message(idTrack, "Start loading " + count + " "  + audioElement.src);
    if(typeof(count) == "undefined"){
        count=0;
    }
    message(idTrack, "Have Load object " + track.fetching);

    increasePercent(audioIndex, 30, 80);
    if(audioElement.readyState < 3){
        if(count >= 10){
            message(13, "Fetch ? " + track.fetching);
            if(track.fetching > 4){
//                track.fetching++;
                resetSrc(audioElement);
                return;
            }
        }
        message(idTrack, "readystate " + audioElement.readyState + " " + track.canPlay + " " + count);
        setTimeout(setSnippet, 200, audioIndex, ++count);
        return;
    }
    if(track.canPlay == 1){
        message(idTrack, "canplay = " + track.canPlay + " " + audioElement.readyState);
//        console.log(idTrack + "canplay = " + track.canPlay + " " + audioElement.readyState);
        track.canPlay = 2;
//        track.getAudio().currentTime = track.timeSnippet;
        setTimeout(setSnippet, 1000, audioIndex, count);
        return;
    }

    
    track.getAudio().currentTime = track.timeSnippet;
    monitorLoad(audioIndex, 0);
}


// Monitors the buffer until the selected snippet is in one of the ranges
function monitorLoad(sequence, c){
//    console.log("monitor " + sequence + " " + c);
    var calls = c;
    calls++;
    var track = Load[sequence];
    var idTrack = sequence*1+1;

    increasePercent(sequence, 5, 80);

    message(idTrack, "monitorload " + sequence + " " + calls);
    var e = track.getAudio();
    if(typeof(c) == "undefined"){
        calls=0;
//        e.load();
//    }else{
//        e.pause();
    }
    
    // If this one is ready, skip it
    message(idTrack, "Ready to check buffer (call # " + calls + ")");
    // message(idTrack,50);
    if(numberReady[sequence] == 1){
        message(idTrack, "Finished");
        return;
    }
    // message(idTrack,50);
    var buffLen = e.buffered.length;
    message(idTrack, " Buffer exists length " + buffLen + " calls " + calls);
    // Wait for the buffer to have contents
    var count=0;
    if(e.buffered.length == 0){
        if(calls > 5){
            track.bufferEmpty++;
            resetSrc(e);
            return;
        }
        message(idTrack, " Buffer is empty " + track.fileName + " " + calls + " BE " + track.bufferEmpty);
//        console.log(" Buffer is empty " + track.fileName + " " + calls);
        setTimeout(monitorLoad, 500, sequence, calls);
        return;
    }
    // alert("percent " + track.percent);
    // if(track.percent < 80) track.percent += 20;
    increasePercent(sequence, 10, 100);

    // If the snippet we need has been buffered, then release it
    var min = track.timeSnippet - 1; // 1 second back for safety
    if(min <0) min=0;
    var max = (track.timeSnippet + 3) * 1 // 3 seconds ahead to give room to play
//    max = e.duration;
    var buffercount=0;
    var amountLoaded =0;
    for (i = 0; i < buffLen; i++) {
        amountLoaded+=(e.buffered.end(i) - e.buffered.start(i));
        message(idTrack, amountLoaded + " of " + e.duration + " " + calls);
//        if (e.buffered.start(i) <= min && e.buffered.end(i) >= max) {
        if(amountLoaded == e.duration){
            slotIn(sequence);

            // All loaded? Start the game!
            if (audioReady()){
                var endDate = new Date();
                message(11, (endDate - startDate)/1000);
                if(runIntro()) {
                    // Listen for swipe to replay
                    document.addEventListener('touchstart', handleTouchStart, false);
                    document.addEventListener('touchmove', handleTouchMove, false);
                    var endDate = new Date();
                    nextSnippet(0);
                }
            }

            return;
        }
    }
//    if(calls == 10 || calls ==20 || calls == 30 || calls == 40){
    if(calls == 1){
        e.load();
    }
    message(13, "FetchA ? " + countLoading());
    if(calls < 40 || countLoading() > 20){
        setTimeout(monitorLoad, 100, sequence, calls);
        return;
    }
// Sometimes the audio tag NEVER fires a canplay, in which case we remove the tag and replace it.
//    return;
    message(idTrack, "Not in buffer " + e.buffered.start(0) + " - " + e.buffered.end(0) + " ( " + track.timeSnippet
        + " ) resetting X " + calls);
    message(13, "Fetch ? " + countLoading());
//    track.fetching++;
    track.resetCount++;
    resetSrc(e);
    return;

}

// plays all the tracks
function nextSnippet(next){

    $("#startGame").hide();
    $("button").prop("disabled", true);
    $("select").prop("disabled", true);
    $("#surrender_all").prop("disabled", false);
    // Stop at the end of the playlist
    // Stop previous track playing if this is not the first one
    if(next != 0){
        // If time did not change since play started then it did not play - figure out what to do about it
        if(Tracks[next-1].timeSnippet == Tracks[next-1].getAudio().currentTime && Tracks[next-1].artist != "1000 Points"
        && !pausePlaying && playInProgress){
            if(Tracks[next-1].timeSnippet > 0){
                Tracks[next-1].timeSnippet--;
//                Tracks[next-1].stop();
//                Tracks[next-1].getAudio().currentTime = (Tracks[next-1].timeSnippet);
            }
            Tracks[next-1].stop();
            message(13, (next -1) + " did not play " + Tracks[next-1].getAudio().currentTime);
//            alert([next-1] + " did not play ")
            playIfReady(next-1);
//            nextSnippet(next);
            return;
        }
        Tracks[next-1].stop();
        
        if(!pausePlaying || playFull === "true")
        document.getElementById("row" + (next)).style.background = "";

        if(next == 10) {
            $("button").prop("disabled", false);
            $("select").prop("disabled", false);
            playInProgress = false;
            playedUpTo = -1;
            return;
        }
    }
    if(pausePlaying){
        $("button").prop("disabled", false);
        $("select").prop("disabled", false);
        playInProgress = false;
        pausePlaying = false;
        return;
    }
    playInProgress = true;
    playIfReady(next);
}

function playIfReady(next){
    if(typeof(Tracks[next]) == "undefined"){
        message(11, "Track " + next + " is not ready");
        setTimeout((playIfReady, 200, next));
        return;
    }
//    message(11, Tracks[next].getAudio().readyState);
    playedUpTo = next;
    Tracks[next].play();
    next++;
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
    e.pause();
    var trackNo=e.id.substr(8);
    var i = trackNo -1;
    Load[i].canPlay = 0;
    e.load();
    if(!isMobileDevice){
        e.muted = true;
        e.play();
    }
    return;
}

// Not used
function getSongSrc(snippetNumber, source){
    $("#loadSnip"+snippetNumber).prop("src", source);
    if(isMobileDevice){
//        document.getElementById("loadSnip" + snippetNumber).load();
        document.getElementById("loadSnip" + snippetNumber).play();
    }else{
        document.getElementById("loadSnip" + snippetNumber).muted = true;
        document.getElementById("loadSnip" + snippetNumber).play();
    }
//    $("#loadSnip"+snippetNumber).play();
}

function fetchSources(i){
    // Set can play on the previous one
    if(i > 0){
        Load[i-1].getAudio().load();
        if(!isMobileDevice){
            Load[i-1].getAudio().muted = true;
            Load[i-1].getAudio().play();
        }
    }
    if(i == 10){
        return;
    }
    // Adding "source" vie Element
        if(Load[i].fileName == "res/Coins.mp3"){
            addAudioSrcHTML(Load[i].fileName,++i);
        }else{
            addAudioSrcHTML(mp3Url + Load[i].fileName, ++i);
        }
    Load[i-1].fetching = 1;
    if(countLoading() > CONCURRENTLIMIT){
        stall(i);
        return;
    }
    fetchSources(i);
//    setTimeout(fetchSources, 200, i);
}

// Ios imposes a limit of 5 concurrent connections

function stall(i){
    if(countLoading() > CONCURRENTLIMIT){
        setTimeout(stall, 200, i);
        return;
    }
//    setTimeout(fetchSources, 200, i);
    fetchSources(i);
}
 
function addAudioElement(src, trackNo){
    var ele = document.createElement("audio");
    ele.setAttribute("controls", "true");
    ele.setAttribute("id", "loadSnip"+trackNo);
    ele.setAttribute("type", "audio/mpeg");
    ele.addEventListener("canplay", function(){ setCanPlay(this, "a") });
    ele.setAttribute("src", src);
    document.getElementById("audioElements").appendChild(ele);
    ele.load();
//    $("#loadSnip"+trackNo).play();
}

function addAudioSrcHTML(src, idx){
    var audioE = document.getElementById("loadSnip"+idx);
    audioE.setAttribute("src", src);
    //    audioE.load(); // Too soon
}

function setCanPlay(e, al){
//    if(typeof(al) != "undefined"){
//     alert(e.id);
//    }
//    alert(e);
    var i=e.id.substr(8);
    console.log(i + " can play");
    var idx = i-1;
    increasePercent(idx,10,70);
    if(typeof(Load[idx]) == "undefined"){
        console.log(i + " can play timeout");
        setTimeout(setCanPlay, 1000, e);
        return;
    }
    if(Load[idx].canPlay >= 1){
        return;
    }
    Load[idx].canPlay = 1;
    setTimeout(setSnippet, 500, idx, 0);
}

function countLoading(){
    var count = 0;
    for (var i=0; i<10; i++){
        count+=Load[i].fetching;
    }
    return count;
}


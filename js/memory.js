"use strict";
/* Total number of trials. Must be multiple of 6 */
var MaxTrials = 150;
/* Tone starts Delays[0] ms after start click or resting has completed;
    Memory Set appears Delays[1] ms after Tone;
    Fixation Dot appears Delays[2] ms after Memory Set;
    Probe Set appears Delays[3] ms after Fixation Dot;
    Rest Screen appears Delays[4] ms after Probe Set;
    NextTrial starts Delays[5] ms after Rest Screen; */

var Delays = [0,1000,1000,2800,10000,2000];

function whichTaskVersion() {
    var url = document.createElement('a');
    url.href = location.href;
    url = url.search.slice(1); //to cut "?" char
    var params = {};
    url = url.split("&"); // ['this=true','that=good']
    for(var i = 0; i<url.length; i++){

	var split_cache = url[i].split("="); // ['this','true']
	params[split_cache[0]] = split_cache[1]; // {this:true}

    }
    for (var prop in params) {
	if (params.hasOwnProperty("presStyle")) {
	    presStyle = params.presStyle;
	}
    }
    console.log(params);
}

var testType = "single"; 
/* This variable determines the type of probe to be displayed: single or group
   letters*/

var presStyle = "sequential";
/* This variable determines if memory set is presented as a sequence or simultaneously */

var timehandle;

/* Prepare sound stuff */
function init() {
    /* First section initializes sound library */
    /* if initializeDefaultPlugins returns false, we cannot play sound in this browser*/
    if (!createjs.Sound.initializeDefaultPlugins()) {return;}

    var audioPath = "sound/";
    var sounds = [
        {id:"Music", src:"A-Tone-His_Self-1266414414.wav"}
    ];

    createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.registerSounds(sounds, audioPath);

    /* Second section determines task details */
    whichTaskVersion();
}

/* Sample without replacement from an array */
function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}

/* Shuffle an array */
function shuffleArray(arr) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled;
}

/* Remove subarray from original array*/
function removeElements(arr0,arr1) {
    var shortarr = arr0.slice(0);
    for (var i = 0; i < arr1.length; i++) {
        var j = shortarr.indexOf(arr1[i]);
        shortarr.splice(j,1);
    }
    return shortarr;
}

/* Generate false probes*/
function createFalseProbes(arr0,arr1) {
    var arr2 = removeElements(arr0,arr1);
    var probe = getRandomSubarray(arr2,arr1.length);
    return probe;
}

/* Create data array with all trials to be displayed */
function createDataArray(ntrials) {

    var Data = new Array(ntrials);
    for (var i=0; i<ntrials; i++) {
        Data[i] = new Array();
        for (var j=0; j<2; j++) {
            Data[i][j] = new Array(6).fill('#');
        }
	Data[i][2] = " ";
    }
    return Data;
}

/* Fill with 2-letter trials*/
function fillDataArrayTwo(arr,cons) {
    /* True probes */
    for (var i = 0; i < arr.length/6; i++) {
        var tmpMem =  getRandomSubarray(cons,2);

        for (var j = 0; j < 2; j++) {
            arr[i][0][j+2] = tmpMem[j];
            arr[i][1][j+2] = tmpMem[j];
        }
	arr[i][2] = getRandomSubarray(tmpMem,1);
    }

    /* False probes */
    for (var i = arr.length/6; i < 2*arr.length/6; i++) {
        var tmpMem =  getRandomSubarray(cons,2);
        var tmpPrb = createFalseProbes(cons,tmpMem);

        for (var j = 0; j < 2; j++) {
            arr[i][0][j+2] = tmpMem[j];
            arr[i][1][j+2] = tmpPrb[j];
        }
	arr[i][2] = getRandomSubarray(tmpPrb,1);       
    }
}

/* Fill with 4-letter trials*/
function fillDataArrayFour(arr,cons) {
    /* True probes */
    for (var i = 2*arr.length/6; i < 3*arr.length/6; i++) {
        var tmpMem =  getRandomSubarray(cons,4);

        for (var j = 0; j < 4; j++) {
            arr[i][0][j+1] = tmpMem[j];
            arr[i][1][j+1] = tmpMem[j];
        }
	arr[i][2] = getRandomSubarray(tmpMem,1);
    }

    /* False probes */
    for (var i = 3*arr.length/6; i < 4*arr.length/6; i++) {
        var tmpMem =  getRandomSubarray(cons,4);
        var tmpPrb = createFalseProbes(cons,tmpMem);

        for (var j = 0; j < 4; j++) {
            arr[i][0][j+1] = tmpMem[j];
            arr[i][1][j+1] = tmpPrb[j];
        }
	arr[i][2] = getRandomSubarray(tmpPrb,1);
    }
}

/* Fill with 6-letter trials*/
function fillDataArraySix(arr,cons) {
    /* True probes */
    for (var i = 4*arr.length/6; i < 5*arr.length/6; i++) {
        var tmpMem =  getRandomSubarray(cons,6);

        for (var j = 0; j < 6; j++) {
            arr[i][0][j] = tmpMem[j];
            arr[i][1][j] = tmpMem[j];
        }
	arr[i][2] = getRandomSubarray(tmpMem,1);
    }

    /* False probes */
    for (var i = 5*arr.length/6; i < arr.length; i++) {
        var tmpMem =  getRandomSubarray(cons,6);
        var tmpPrb = createFalseProbes(cons,tmpMem);

        for (var j = 0; j < 6; j++) {
            arr[i][0][j] = tmpMem[j];
            arr[i][1][j] = tmpPrb[j];
        }
	arr[i][2] = getRandomSubarray(tmpPrb,1);
    }
}

/* Array with all consonants */
var consonants = ['b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','x','y','z'];

/* Set up data for trials */
var Data = createDataArray(MaxTrials);
fillDataArrayTwo(Data,consonants);
fillDataArrayFour(Data,consonants);
fillDataArraySix(Data,consonants);

var Trials = shuffleArray(Data);
var available = false;
var TrialNumber = 0;


var TrialStart = new Array(MaxTrials);
var Presentation = new Array(MaxTrials);
var Fixation = new Array(MaxTrials);
var ResponseWindow = new Array(MaxTrials);
var Responded = new Array(MaxTrials);
var Rest = new Array(MaxTrials);
var Interrupted = new Array(MaxTrials).fill(0);

function DrawCircle(){
    $.post("/circle");
    Fixation[TrialNumber] = DisplayCallTime("Circle");
    available = false;

    document.getElementById("circle").style.display = "block";
    document.getElementById("first").style.display = "none";
    document.getElementById("second").style.display = "none";
    document.getElementById("third").style.display = "none";
    document.getElementById("fourth").style.display = "none";
    document.getElementById("fifth").style.display = "none";
    document.getElementById("sixth").style.display = "none";

    document.getElementById("single").style.display = "none";

    document.getElementById("options").style.display = "none";
    document.getElementById("match").style.display = "none";
    document.getElementById("nomatch").style.display = "none";
}

function DisplayMemorySet(trialnumber,trialarray) {
    $.post("/memset");
    Presentation[TrialNumber] = DisplayCallTime("MemSet");
    available = false;

    document.getElementById("circle").style.display = "none";

    if (presStyle == "sequential") {

	var presdelays = [0,300,300,300,300,300];

	document.getElementById("first").style.display = "none";
	document.getElementById("second").style.display = "none";
	document.getElementById("third").style.display = "none";
	document.getElementById("fourth").style.display = "none";
	document.getElementById("fifth").style.display = "none";
	document.getElementById("sixth").style.display = "none";
	document.getElementById("single").style.display = "inline";
	document.getElementById("single").innerHTML = " ";

	var ix = 0;
	while(trialarray[trialnumber][0][ix] == "#") {ix++;}

	var dataMEM = trialarray[trialnumber][0].slice(ix,6-ix);
	var currItem = document.getElementById("single");
	console.log(dataMEM);
	function updateCurrItem(k) {currItem.innerHTML = dataMEM[k];}
	Delays[2] = 300*(dataMEM.length);

	(function chainElements(i) {
	    if (i > dataMEM.length ){
		currItem.innerHTML = " ";
		return;
	    }
	    $.post("/indlett");
	    timehandle = window.setTimeout(function() {
		    updateCurrItem(i);
		    chainElements(i + 1);
		},presdelays[i]);
	}(0));
    }
    else {
	document.getElementById("single").style.display = "none";
	
	document.getElementById("first").style.display = "inline";
	document.getElementById("second").style.display = "inline";
	document.getElementById("third").style.display = "inline";
	document.getElementById("fourth").style.display = "inline";
	document.getElementById("fifth").style.display = "inline";
	document.getElementById("sixth").style.display = "inline";
	
	document.getElementById("first").innerHTML = trialarray[trialnumber][0][0];
	document.getElementById("second").innerHTML = trialarray[trialnumber][0][1];
	document.getElementById("third").innerHTML = trialarray[trialnumber][0][2];
	document.getElementById("fourth").innerHTML = trialarray[trialnumber][0][3];
	document.getElementById("fifth").innerHTML = trialarray[trialnumber][0][4];
	document.getElementById("sixth").innerHTML = trialarray[trialnumber][0][5];
    }
    document.getElementById("options").style.display = "none";
    document.getElementById("match").style.display = "none";
    document.getElementById("nomatch").style.display = "none";
}

function DisplayProbe(trialnumber,trialarray) {
    $.post("/probe");
    ResponseWindow[TrialNumber] = DisplayCallTime("Probe");
    available = true;

    document.getElementById("circle").style.display = "none";
    document.getElementById("single").style.display = "none";

    document.getElementById("first").style.display = "inline";
    document.getElementById("second").style.display = "inline";
    document.getElementById("third").style.display = "inline";
    document.getElementById("fourth").style.display = "inline";
    document.getElementById("fifth").style.display = "inline";
    document.getElementById("sixth").style.display = "inline";

    document.getElementById("first").innerHTML = trialarray[trialnumber][1][0];
    document.getElementById("second").innerHTML = trialarray[trialnumber][1][1];
    document.getElementById("third").innerHTML = trialarray[trialnumber][1][2];
    document.getElementById("fourth").innerHTML = trialarray[trialnumber][1][3];
    document.getElementById("fifth").innerHTML = trialarray[trialnumber][1][4];
    document.getElementById("sixth").innerHTML = trialarray[trialnumber][1][5];

    document.getElementById("options").style.display = "block";
    document.getElementById("match").style.display = "inline";
    document.getElementById("nomatch").style.display = "inline";
}

function DisplaySingle(trialnumber,trialarray) {
    $.post("/single");
    ResponseWindow[TrialNumber] = DisplayCallTime("Probe");
    available = true;
    
    document.getElementById("circle").style.display = "none";
    document.getElementById("single").style.display = "inline";

    document.getElementById("first").style.display = "none";
    document.getElementById("second").style.display = "none";
    document.getElementById("fourth").style.display = "none";
    document.getElementById("fifth").style.display = "none";
    document.getElementById("sixth").style.display = "none";

    document.getElementById("single").innerHTML = trialarray[trialnumber][2];

    document.getElementById("options").style.display = "block";
    document.getElementById("match").style.display = "inline";
    document.getElementById("nomatch").style.display = "inline";    
}

function ClearScreen(){
    $.post("/cls");
    DisplayCallTime("CLS");
    available = false;

    document.getElementById("container").style.backgroundColor="white";

    document.getElementById("circle").style.display = "none";
    document.getElementById("single").style.display = "none";
    document.getElementById("first").style.display = "none";
    document.getElementById("second").style.display = "none";
    document.getElementById("third").style.display = "none";
    document.getElementById("fourth").style.display = "none";
    document.getElementById("fifth").style.display = "none";
    document.getElementById("sixth").style.display = "none";

    document.getElementById("options").style.display = "none";
    document.getElementById("match").style.display = "none";
    document.getElementById("nomatch").style.display = "none";
}

function RestScreen(){
    $.post("/rest");
    Rest[TrialNumber] = DisplayCallTime("REST");
    available = false;

    document.getElementById("container").style.backgroundColor="grey";

    document.getElementById("single").style.display = "none";
    document.getElementById("circle").style.display = "none";
    document.getElementById("first").style.display = "none";
    document.getElementById("second").style.display = "none";
    document.getElementById("third").style.display = "none";
    document.getElementById("fourth").style.display = "none";
    document.getElementById("fifth").style.display = "none";
    document.getElementById("sixth").style.display = "none";

    document.getElementById("options").style.display = "none";
    document.getElementById("match").style.display = "none";
    document.getElementById("nomatch").style.display = "none";
}

function DisplayCallTime(eventID) {
    var t = new Date().getTime();
    console.log(eventID+": "+t);
    return t;
}

function playTone() {
    $.post("/tone");
    available = false;
    DisplayCallTime("Tone");
    createjs.Sound.play("Music");
}

function SetUpTrial(trialnumber,trialset,delay) {
    if (trialnumber >= trialset.length) {
	var data2send = prepData(TrialNumber);
	$.post("/dataMemory",data2send);
        return;
    }
    ClearScreen();
    console.log("Trial Number: "+trialnumber);
    TrialNumber = trialnumber+1;
    if (testType == "single") {
	var seq = [function() {playTone();},
		   function() {DisplayMemorySet(trialnumber,trialset);},
		   function() {DrawCircle();},
		   function() {DisplaySingle(trialnumber,trialset);},
		   function() {RestScreen();},
		   function() {SetUpTrial(TrialNumber,Trials,Delays)}];
    }
    else {
	var seq = [function() {playTone();},
		   function() {DisplayMemorySet(trialnumber,trialset);},
		   function() {DrawCircle();},
		   function() {DisplayProbe(trialnumber,trialset);},
		   function() {RestScreen();},
		   function() {SetUpTrial(TrialNumber,Trials,Delays)}];
    }

    (function chain(i) {
        if (i >= 6 || typeof seq[i] !== 'function')
            return;
        timehandle = window.setTimeout(function() {
            seq[i]();
            chain(i + 1);
        }, delay[i]);
    }(0));
}

function prepData(currentTrial) {
    var myarray = [];
    var myJSON = [];
    
    if (testType == "single") {
	for (var i = 0; i <=currentTrial; i++) {
	    var item = {
		"TrialNumber": i,
		"MemorySet":Trials[i][0],
		"Probe":Trials[i][2],
		"TrialStarTime":TrialStart[i],
		"TrialPresentation":Presentation[i],
		"TrialFixation":Fixation[i],
		"ResponseWindow":ResponseWindow[i],
		"ResponseTime":Responded[i],
		"Rest":Rest[i],
		"Interrupt":Interrupted[i],
	    };
	    myarray.push(item);
	}
    }
    else {
	for (var i = 0; i <= currentTrial; i++) {
	    var item = {
		"TrialNumber": i,
		"MemorySet":Trials[i][0],
		"Probe":Trials[i][1],
		"TrialStarTime":TrialStart[i],
		"TrialPresentation":Presentation[i],
		"TrialFixation":Fixation[i],
		"ResponseWindow":ResponseWindow[i],
		"ResponseTime":Responded[i],
		"Rest":Rest[i],
		"Interrupt":Interrupted[i],
	    };
	    myarray.push(item);
	}
    }
    myJSON = JSON.stringify({data: myarray});
    return myJSON;
};

var main = function() {

    $ ("#container").click(function() {
        var t = new Date().getTime();

        $.post("/memoryF");
        console.log('Should not have clicked! '+t);
    });

    document.getElementById("match").addEventListener("click",hclick,false);
    document.getElementById("nomatch").addEventListener("click",hclick,false);

    function hclick(event) {
        var t = new Date().getTime();

        if (available==false) {
            $.post("/memoryF");
            console.log('Should not have clicked! '+t);
        }

        else {
            available=false;
            $.post("/memoryR");
	          Responded[TrialNumber] = t;
            console.log("Response: "+t+" Start Break");
	          clearTimeout(timehandle);
	          RestScreen();
	          timehandle = setTimeout(function(){
		            SetUpTrial(TrialNumber,Trials,Delays);
		        },Delays[5]);
	      }
    }

    $("#StartStop").click(function() {
	    available=false;
	    var t = new Date().getTime();
	    var button = document.getElementById("StartStop");
	    var msg = document.getElementById("ctrl");
	    clearTimeout(timehandle);

	      if (msg.innerHTML === "Stop") {
		        $.post("/memoryI");
		        Interrupted[TrialNumber] = t;
		        msg.innerHTML = "Start";
		        button.style.backgroundColor = "green";
		        ClearScreen();
		        document.getElementById("container").style.display = "none";
		        document.getElementById("SaveData").style.display = "block";
		        var whathappened = "Paused Trials";
	      }
	      else {
            msg.innerHTML = "Stop";
		        button.style.backgroundColor = "red";
		        document.getElementById("container").style.display = "block";
		        document.getElementById("SaveData").style.display = "none";
		        ClearScreen();
		        setTimeout(function(){
			          SetUpTrial(TrialNumber,Trials,Delays);
		        },500);
		        var whathappened = "Started Trials";
	      }
	      console.log(whathappened+": "+t);
	  });

    $("#SaveData").click(function() {
        available =false;
	      var t = new Date().getTime();
	      var data2send = prepData(TrialNumber);
	      $.post("/dataMemory",data2send);
        document.getElementById("send").style.innerHTML = "Data sent";
	  });

    ClearScreen();
}
$(document).ready(main);

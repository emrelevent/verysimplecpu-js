/**
 * Created by tdgunes, huyumaz on 3/13/14.
 */






Array.prototype.contains = function ( needle ) {
    for (i in this) {
        if (this[i] == needle) return true;
    }
    return false;
}

//FIXME ALL MEMORY ACCESSES REQUIRES ERROR HANDLING
var evaluation = {};
var defined_zeros = []; //explicitly defined

evaluation.LT = function LT(A, B){
    if ( MEMORY[A] < MEMORY[B]){
        MEMORY[A] = 1;
    }
    else {
        MEMORY[A] = 0;
    }
}
evaluation.LTi = function LTi(A, B){
    if ( MEMORY[A] < B){
        MEMORY[A] = 1;
    }
    else {
        MEMORY[A] = 0;
    }
}
evaluation.ADD = function ADD(A, B){
    MEMORY[A] = MEMORY[A] + MEMORY[B];
}
evaluation.ADDi = function ADDi(A,B){
    MEMORY[A] = MEMORY[A] + B;
}
evaluation.NAND = function NAND(A,B){
    MEMORY[A] = ~(MEMORY[A] & MEMORY[B]);
}
evaluation.NANDi = function NANDi(A,B){
    MEMORY[A] = ~(MEMORY[A] & B);
}
evaluation.SRL = function SRL(A,B){
    if(MEMORY[B] < 32)
        MEMORY[A] = MEMORY[A] >> MEMORY[B];
    else
        MEMORY[A] = MEMORY[A] << (MEMORY[B]-32);
}
evaluation.SRLi = function SRLi(A,B){
    if(B < 32)
        MEMORY[A] = MEMORY[A] >> B;
    else
        MEMORY[A] = MEMORY[A] << (B-32);

}
evaluation.CP = function CP(A,B){
    MEMORY[A] = MEMORY[B];
}
evaluation.CPi = function CPi(A,B){
    MEMORY[A] = B;
}
evaluation.CPI = function CPI(A,B){
    MEMORY[A] = MEMORY[MEMORY[B]];
}
evaluation.CPIi = function CPIi(A,B){
    MEMORY[MEMORY[A]] = MEMORY[B];
}
evaluation.BZJ = function BZJ(A,B){
    if (MEMORY[B]==0){
        setPC(prevPC,PC,parseInt(MEMORY[A])); 
    }else{
        setPC(prevPC,PC,PC+1);
    }
}
evaluation.BZJi = function BZJi(A,B){
    setPC(prevPC,PC,parseInt(MEMORY[A])+B);
}
evaluation.MUL = function MUL(A,B){
    MEMORY[A] = MEMORY[A] * MEMORY[B];
}
evaluation.MULi = function MULi(A,B){
    MEMORY[A] = MEMORY[A] * B;
}


var beforePrevPC=0;
var prevPC = 0;
var PC = 0;

var prevEditedRow = 0;

var MEMORY = [];
var MEMORY_SIZE = 2000;
var editor;

function setPC(newBeforePrevPC,newPrevPC,newPC){
    beforePrevPC=newBeforePrevPC;
    prevPC=newPrevPC;
    PC = newPC;
    $("#PC").text(PC);
}
function fillMemory(){
    for (var i=0; i<MEMORY_SIZE; i++){
        MEMORY[i] = 0;

    }
}
function showMemory(){
    for (var i=0; i<MEMORY_SIZE; i++){
        if (MEMORY[i]!=undefined){
            $("#val-"+i).text(""+MEMORY[i]);
        }

    }
}
function updateMemory(){
    for(var i=0; i<MEMORY_SIZE;i++){
        if (MEMORY[i]!==0 )
            $("#loc-"+i).show();
        if (MEMORY[i]===0 ){
            $("#loc-"+i).hide();
        }
        if (defined_zeros.contains(i) == true){
            $("#loc-"+i).show();
        }

    }
}

function parseMemoryLocation(memoryToken){
    var _tokenized = memoryToken.split(":");
    return parseInt(_tokenized[0]);
}
function parseToken(token){
    var _pieces = $.trim(token).split(" ");
    var _memoryLocation = parseMemoryLocation(_pieces[0]);
    if (_pieces.length == 4){
        MEMORY[_memoryLocation] = _pieces[1] + " " +
            _pieces[2] + " " +
            _pieces[3];
    }
    else if (_pieces.length == 2){
        defined_zeros.push(_memoryLocation);
        MEMORY[_memoryLocation] = parseInt(_pieces[1]);

    }
    else {
        alert("parseToken(token) failed! [" + _pieces +"]");
    }
}

function parse(text){

    //(^ *[0-9]+: *[A-z]+ +[0-9]+ +[0-9]+ *)|(^ *[0-9]+: *[0-9]+ *)
    var lines = text.split("\n");
    for (var i = 0; i < lines.length; i++) {
        _line = lines[i].replace(/\s\s+/g, ' ');
        if (_line && _line.substr(0,2)!="//"){ //if a comment line ignore or blank

            var re = /(^ *[0-9]+: *[A-z]+ +[0-9]+ +[0-9]+ *)|(^ *[0-9]+: *[0-9]+ *)/
            //console.log(_line);
            _tokens = _line.match(re);
            if (_tokens){
                _token = _tokens[0];
                parseToken(_token);

            }
            else {
               alert("Parse error on line="+(i+1));
                setPC(0,0,0);
                fillMemory();
                showMemory();
                for (var i = 0; i < MEMORY_SIZE; i++) {
                    $("#loc-"+(i)).removeClass('active');
                    $("#loc-"+i).removeClass('success');
                }
                updateMemory();

            }
        }



    }

}



$( document ).ready(function() {
    fillMemory();
    //16384
    for (var i=0; i<2000; i++){
       $('#memory').find('tr:last').after('<tr id=\'loc-'+i+'\' > <td >'+i+'</td><td id=\'val-'+i+'\'>0</td></tr>');
    }




    define("VerySimpleCPUHighlightRules", [], function(require, exports, module){
        "use strict";

        var oop = require("ace/lib/oop");

        var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

        var VerySimpleCPUHighlightRules = function() {
            var keywords = (
                "CP|CPi|BZJ|BZJi|LT|LTi|SRL|SRLi|" +
                "NAND|NANDi|MUL|MULi|ADDi|ADD"
                );
            var builtinTypes = ("");
            var builtinFunctions = ("");
            var builtinConstants = ("");

            var keywordMapper = this.createKeywordMapper({
                "keyword": keywords,
                "constant.language": builtinConstants,
                "support.function": builtinFunctions,
                "support.type": builtinTypes
            }, "identifier");

            this.$rules = {
                "start" : [
                    {
                        token : "comment", //keywords
                        regex : "\\/\\/.*$"
                    },
                    {
                        token : "constant.numeric", // memory address with :
                        regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b[:]"
                    },
                    {
                        token : "text", // memory address without :
                        regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
                    },

                    {
                        token : keywordMapper, //special very simple cpu commands
                        regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
                    }
                ]

            };

        };
        oop.inherits(VerySimpleCPUHighlightRules, TextHighlightRules);

        exports.VerySimpleCPUHighlightRules = VerySimpleCPUHighlightRules;
    });






    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    var TextMode = require("ace/mode/text").Mode;
    var verySimpleCPUMode = new TextMode();
    verySimpleCPUMode.HighlightRules = require("VerySimpleCPUHighlightRules").VerySimpleCPUHighlightRules;

    editor.session.setMode(verySimpleCPUMode);
    //editor.getSession().setMode("ace/mode/javascript");

    editor.commands.addCommand({
        name: 'build',
        bindKey: {win: 'Ctrl-B',  mac: 'Command-B'},
        exec: function(editor) {
            $('#build-message').text("Parsing...");
//            $("#loc-"+num).attr('class', 'success');
            parse(editor.getValue());

            showMemory();

//            num++;
        },
        readOnly: false // false if this command should not apply in readOnly mode
    });

    editor.commands.addCommand({
        name: 'run',
        bindKey: {win: 'Ctrl-R',  mac: 'Command-R'},
        exec: function(editor) {
            alert("Run!");
        },
        readOnly: false // false if this command should not apply in readOnly mode
    });



    updateMemory();
    $.getJSON("https://api.github.com/repos/tdgunes/verysimplecpu-js/commits", function(data) {

        $("#last-commit").html("Latest commit:</br> by <kbd>"+
            data[0].commit.committer.name +
            "</kbd> says <code>"+
            data[0].commit.message +
            "</code>  at  <code>" +
            data[0].commit.committer.date +"</code>" +
            " ");

    });
});



$("#build").click( function(){
    setPC(0,0,0);
    fillMemory();
    showMemory();
    for (var i = 0; i < MEMORY_SIZE; i++) {
        $("#loc-"+(i)).removeClass('active');
        $("#loc-"+i).removeClass('success');
    }

    $('#build-message').text("Parsing...");
    parse(editor.getValue());
    $('#build-message').text("Preparing Memory...");
    showMemory();
    $('#build-message').text("Build Done.");
    updateMemory(); 
});

$("#reset").click( function(){
    defined_zeros = [];
    setPC(0,0,0);
    fillMemory();
    showMemory();
    for (var i = 0; i < MEMORY_SIZE; i++) {
        $("#loc-"+(i)).removeClass('active');
        $("#loc-"+i).removeClass('success');
        $("#loc-"+i).removeClass('warning');
    }
    updateMemory();



});
$('#run').click( function(){
    setPC(0,0,0);
    fillMemory();
    $('#build-message').text("Parsing...");
    parse(editor.getValue());
    $('#build-message').text("Preparing Memory...");
    $('#build-message').text("Build Done.");
    var isFirstStep=true;
    while((prevPC!==PC) || isFirstStep || editor.getValue().length<1){
       var _memoryBlock = MEMORY[PC];
        if (_memoryBlock != 0){
            var _commands = _memoryBlock.split(" ");
            //ADDi 10 10
            //alert(_commands);
            var command = _commands[0];
            var A = parseInt(_commands[1]);
            var B = parseInt(_commands[2]);
            var _fun = evaluation[command];
            _fun(A,B);
            if(command!=="BZJ" && command!=="BZJi" )
                setPC(prevPC,PC,PC+1);
            isFirstStep=false;
        }
        else {
            break;
        }
    }
    showMemory();
    updateMemory();
})
$("#step").click( function(){
    var _memoryBlock = MEMORY[PC];
    $("#loc-"+(beforePrevPC)).removeClass('active');
    $("#loc-"+(beforePrevPC)).removeClass('success');
    $("#loc-"+(prevPC)).attr('class', 'active');
    $("#loc-"+PC).attr('class', 'success');


    //alert(_memoryBlock);
    var _commands = _memoryBlock.split(" ");

    //ADDi 10 10
    //alert(_commands);

    var command = _commands[0];
    var A = parseInt(_commands[1]);
    var B = parseInt(_commands[2]);
    var _fun = evaluation[command];

    $("#loc-"+prevEditedRow).removeClass('warning');
    $("#loc-"+A).attr('class','warning');
    prevEditedRow=A;

    _fun(A,B);
    if(command!=="BZJ" && command!=="BZJi" )
        setPC(prevPC,PC,PC+1);

    showMemory();
    updateMemory();
});





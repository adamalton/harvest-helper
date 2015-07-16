// ==UserScript==
// @name       Harvest Timesheets UI Improvements
// @namespace  adamalton.co.uk
// @version    0.1
// @description  Make the Harvest timesheet interface less painful
// @match      https://*.harvestapp.com/time/week*
// @copyright  2014+, Adam Alton
// ==/UserScript==

;(function(){

    //***************************************************************************************************************
    //************************************************ COLOURS ******************************************************
    //***************************************************************************************************************
    var textToDigit = function(text){
        // Takes a string of text and returns a digit 0-9.
        // Logic is meaningless but deterministic, i.e. the same text always return the same digit
        var result = 0;
        var i, char;
        var alphabet = "abcdefghijklmnopqrstuvwxyz";

        text = String(text).toLowerCase().replace(/[^a-z0-9]/g, "z"); // make sure we have a lowercase string with only alphanum
        for(i=0; i<text.length; i++){
            char = text[i];
            if(char.match(/\d/)){ // if it's already a digit then just append it
                result += parseInt(char);
            }else{
                result += alphabet.indexOf(text[i]);
            }
        }
        // Now we have a string like "48202733", which we want to reduce to a single digit.
        // we want a digit 0-9, but because adding digits will almost never produce 0, we aim for
        // numbers 1-10 and then convert 10 to 0 aftewards
        while(result > 10){
            result = String(result);
            sum = 0;
            for(i=0; i<result.length; i++){
                sum += parseInt(result[i]);
            }
            result = sum;
        }
        if(result === 10){
            result = 0;
        }
        return result;
    };

    var getColour = function(text){
        // Given a string of text, return a colour value.
        // The value is meaningless but deterministic, so the same text always returns the same colour
        // Given our textToDigit function, we must have exactly 10 colours
        var colours = ['FFFFDD', 'FFDDFF', 'DDFFFF', 'FFDDDD', 'DDFFDD', 'DDDDFF', 'BBFFDD', 'DDFFBB', 'BBDDFF', 'DDBBFF'];
        return colours[textToDigit(text)];
    };

    var setColours = function(){
        // For each row in the timesheet, set its colour based on the first part of the project name
        $("tr.week-view-entry").each(
            function(index){
                var $row = $(this);
                var project = $row.find(".project").text();
                var project_name = project.match(/.+(?= - )/);
                // var bracketed_name = project.match(/\[.+\]/);
                // var prefix = bracketed_name || project;
                var prefix = project_name || project;
                prefix = (typeof prefix === "object") ? prefix[0] : prefix; // if it's an array (from regex) take first item
                var colour = getColour(prefix);
                $row.css('background-color', '#' + colour);
            }
        );
    };
    setColours();
    // Make sure that the colours are set when new rows are added and/or the week is changed
    // this is dirty, but it's easier than trying to detect all of the possible events that change things
    setInterval(setColours, 1000);
})();


(function(){
    //***************************************************************************************************************
    //****************************************** KEYBOARD NAVIGATION ************************************************
    //***************************************************************************************************************
    var UP = 38, DOWN = 40, RIGHT = 39, LEFT = 37;
    var keypress = function(e){
        var isNavEvent = false;
        if([UP, DOWN].indexOf(e.keyCode) != -1){
            var $this = $(this);
            var col_num = $this.closest("td").index(); //Note this includes the column of project names
            var $row = $this.closest("tr");
            var $new_row = e.keyCode == UP ? $row.prev() : $row.next();
            $new_row.find("td").eq(col_num).find("input.js-compound-entry").focus();
            isNavEvent = true;
        }else if(e.keyCode == RIGHT){
            $(this).closest("td").next().find("input.js-compound-entry").focus();
            isNavEvent = true;
        }else if (e.keyCode == LEFT){
            $(this).closest("td").prev().find("input.js-compound-entry").focus();
            isNavEvent = true;
        }
        if(isNavEvent){
            $(".test-week-view-save").click(); // save the form
            return false;
        }
    };
    $(document).on("keydown", "input.js-compound-entry", keypress);

})();


(function(){
    //***************************************************************************************************************
    //***************************************** DUPLICATE THE BUTTONS ***********************************************
    //***************************************************************************************************************
    // The 'save' button doesn't work if we duplicate it (well, it might do with enough tinkering)
    var $bottom_td = $("table.week-view-table tfoot td.name");
    var $top_td = $("table.week-view-table thead td.name");
    $bottom_td.children(".button-new-row").clone().appendTo($top_td);
}); //();

(function(){
    //***************************************************************************************************************
    //******************************************* RESTYLE THE TABLE *************************************************
    //***************************************************************************************************************
    var $table = $(".week-view-table");
    var $tbody = $table.find("tbody");
    var $thead = $table.find("thead");
    var $tfoot = $table.find("tfoot");
    $table.css({
        "display": "block",
        "height": String(document.body.clientHeight - $table[0].getBoundingClientRect().top - 10) + "px",
        "position": "relative",
    });
    $tbody.css({
        "display": "block",
        "overflow": "auto",
        "position": "absolute",
        "top": String($thead.height()) + "px",
        "bottom": String($tfoot.height()) + "px"
    });
    $thead.css({
        "position": "absolute",
        "top": "0"
    });
    $tfoot.css({
        "position": "absolute",
        "bottom": "0"
    });

})();

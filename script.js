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
    var setColours = function(){
        var colours = ['FFFFDD', 'FFDDFF', 'DDFFFF', 'FFDDDD', 'DDFFDD', 'DDDDFF'];
        var $rows = $("tr.week-view-entry");
        var prefixes = [];
        for(var i=0; i<$rows.length; i++){
            var $row = $rows.eq(i);
            var project = $row.find(".project").text();
            var bracketed_name = project.match(/\[.+\]/);
            var prefix = bracketed_name || project;
            prefix = (typeof prefix === "object") ? prefix[0] : prefix; // if it's an array (from regex) take first item
            if(prefix){
                var position = prefixes.indexOf(prefix);
                if(position == -1){
                    position = prefixes.length; //the 1-indexing of length gives us the position that it will be in
                    prefixes.push(prefix);
                }
                var colour = colours[position];
                while(colour === undefined){
                    //if we got to the end of our list of colours then loop around
                    position -= colours.length;
                    colour = colours[position];
                }
                $row.css('background-color', '#' + colour);
            }
        }
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
        if([UP, DOWN].indexOf(e.keyCode) != -1){
            var $this = $(this);
            var col_num = $this.closest("td").index(); //Note this includes the column of project names
            var $row = $this.closest("tr");
            var $new_row = e.keyCode == UP ? $row.prev() : $row.next();
            $new_row.find("td").eq(col_num).find("input.js-compound-entry").focus();
            return false;
        }else if(e.keyCode == RIGHT){
            $(this).closest("td").next().find("input.js-compound-entry").focus();
            return false;
        }else if (e.keyCode == LEFT){
            $(this).closest("td").prev().find("input.js-compound-entry").focus();
            return false;
        }
    };
    $(document).on("keydown", "input.js-compound-entry", keypress);

})();

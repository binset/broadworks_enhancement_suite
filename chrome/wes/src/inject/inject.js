var util = 
{
    debug:function(debug_string)
    {
        var debugging = true;
        if (debugging)
        {
            console.log("DEBUG: " + debug_string);
        }
    },

    pixels_to_int:function(a)
    {
        var pixels = parseInt(a);
        
        if ( pixels >= 0)
        {
            return pixels;
        } else 
        {
            util.debug("Invalid pixel value here: " + a);
            return null;
        }
    },
    
    pixels_addition:function(a, b)
    {
        var pixels_a = util.pixels_to_int(a);
        var pixels_b = util.pixels_to_int(b);
        
        return pixels_a + pixels_b;
    },
    
    pixels_subtraction:function(a, b)
    {
        var pixels_a = util.pixels_to_int(a);
        var pixels_b = util.pixels_to_int(b);
        
        return pixels_a - pixels_b;
    },
};

var wiki_toc=
{
    toc_toggle_left:function(o)
    {
        /**toggle TOC to LHS
        */
        
        var toc_height = window.innerHeight.toString() + "px";
        //var toc_width = $("#content").offsetLeft + "px";
        //var toc_width =  $("#mw-head-base").css('margin-left');
        var toc_width = null; //db.get_wikitoc_margin_position(); 
        if (toc_width == null)
        {
            //toc_width = $("#toc").css('width');
            toc_width = $("#p-namespaces")[0].getBoundingClientRect().left ;
        }
        
     
        //$("#lhs_toc").css({"z-index": "9999", height: toc_height, width: toc_width, overflow: 'auto', border: '1px solid black', position: 'fixed', left:'2px', top: '0px' });
        var lhs_mwpanel_yposition = $("#mw-panel").position()['top'];
        var lhs_panel_yposition = $("#p-lang").position()['top'];
        var lhs_panel_height = $("#p-lang").height();
        lhs_toc_position = util.pixels_addition(lhs_panel_height, lhs_panel_yposition);
        lhs_toc_position += "px";


        if ($("#lhs_toc").length == 0)
        {
            //lhs_toc doesn't exist, we can recreate it

            var cloned_toc = $("#toc").clone().attr('id', 'lhs_toc');
            cloned_toc.find('#toctitle').attr('id', 'lhs_toctitle');
            cloned_toc.insertAfter("#p-lang");

            var that = this;
            $('#lhs_toc').resizable({
              handles: "e",
              stop: function(e, ui){
                  //that.event_update_content_margin(o);
                },
            });
        }

        $("#lhs_toc").css({"z-index": "1", height: toc_height, width: toc_width, overflow: 'auto', position: 'absolute', left:'0px', top: lhs_toc_position });
        $("#lhs_toc").css("display", "block");
        $("#lhs_toc").css("padding-left", "0px");
        $("#lhs_toc").css("padding-right", "0px");

        //db.set_wikitoc_on_lhs(true);
        
        //resize the main content section on RHS on fit the size of the TOC on LHS
        //this.event_update_content_margin(o);
        //this.event_toc_scroll_lock(o);
    },
};

chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

        $("#toc").click();
        
        console.log("inject.js loaded completed.");
        var toc_height = window.innerHeight.toString() + "px";
        
        wiki_toc.toc_toggle_left();
        util.debug(toc_height);
	}
	}, 10);
});


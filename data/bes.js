
var process_search_button_exclusions_rules = [
        // You can configure your own Javascript exception URLS to NOT click on the search button
        // Use ".*" to match any string
        // You probably want your rule in the format of .*SERVER.*BROADWORKSPAGE.*
        // e.g. ".*vnlo-bws.*Operator/Groups/" would match http://vnlo-bws.broadworks.com/Operator/Users/
        //
        // Please remember that the last item should NOT have a comma (Javascript Arrays)
       
        ".*vnlo-bws.*Operator/ServiceProviders/index.jsp.*",  //PROD, Search by Enterprise page
        ".*vnlo-bws.*Operator/Groups/",         //PROD, Search by Groups page
        ".*vnlo-bws.*Operator/Users/",                  //PROD, Search by Users page
       
        ".*ews-stl.*Operator/ServiceProviders/index.jsp.*",  //PROD, Search by Enterprise page
        ".*ews-stl.*Operator/Groups/",         //PROD, Search by Groups page
        ".*ews-stl.*Operator/Users/",                  //PROD, Search by Users page

        ".*ews\.digi.*Operator/ServiceProviders/index.jsp.*",  //PROD, Search by Enterprise page
        ".*ews\.digi.*Operator/Groups/",            //PROD, Search by Groups page
        ".*ews\.digi.*Operator/Users/"              //PROD, Search by Users page
]
 
 
/*
Broadworks Enhancement Suite User Guide
 
For users of Broadworks web interface (aka commpilot), a common task is to locate a user based on the user's Phone Number.
To do so, it currently takes 9 mouse clicks (I've actually counted!).
 
If this has annoyed you or if you are wondering if there is a faster way of doing things (plus reduce RSI), there is now!
 
Broadworks Enhancement Suite is a script that enhances the User Experience on the web-based Broadworks Device Management System (aka Commpilot).
It does so by preselecting sensible search criteria (e.g. "contains" instead of "starts with").
It is also smart enough not to override any of your pre-configured search filters.
So as an example, the number of clicks needed to locate a user based on the Phone number can be cut down from 9 to 3.
 
Functionalities:
        On the "Searching for User" pages, the interface will autoselect the "Phone Number" field
        On all search pages, the Interface will autoselect the "Contains" field if available
        The script will auto click on search if you don't have any previous search result (or if URL is not in your exclusions list)
        If you already have a search filter in the search box, it is smart enough not to overwrite what's in your search filter
 
Versions:
        2015/03/03 Version 1.0d Initial Production Version
        2015/03/05 Version 1.0e Improved keyboard focus handling
 
*/
 
/*
Main algorithm:
        if has id=mainForm and id=findValue0 (textbox)
                if findValue0 has existing text typed n
                        select text on textbox findValue0
                else if findValue0 is blank
                        if the URL allows greasemonkey to click on the search button
                                try to click on the search button if there is no previous result
                        if has findKey0 and has option Dn
                                select findKey0.Dn
                        if has findOp0
                                select CONTAINS
 
                        select text on textbox findValue0
        else
                no textbox, do nothing
*/
 
var debug_mode = true
 
function debug(msg) {
        if (debug_mode == true)
        {
                console.log("bes debug:" + msg);
        }
}
 
function setfocus() {
        /* you need a load event for focus, because you need to wait for the page to finish loading before focusing your keyboard on the text*/
        var textboxvalue = document.getElementById('findValue0').value;
       
        document.getElementById('findValue0').focus();
        document.getElementById('findValue0').value = "";
        document.getElementById('findValue0').value = textboxvalue;
        debug('\tfindValue0 - textbox focused');
}
 
function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {

    window.onload = func;
  } else {
      debug('\tAAAAAAAAAAAAA');
    window.onload = function() {
      debug('\tBBBBBBBBBBxxx');
      if (oldonload) {
        oldonload();
      }
      debug('\tBBBBBBBBBBBB');
      func();
    }
  }
}
 
function process_search_button_exclusions() {
        /**
        Given a URL, it will return true if browser should NOT click on the search button
        The rules for exceptions are stored in a regex array "process_search_button_exclusions_rules"
        */
        var url = "" + window.location; //you need to create a new string
        for (var i = 0; i < process_search_button_exclusions_rules.length; i++)
        {
                var regex_rule = process_search_button_exclusions_rules[i];
                var re = new RegExp(regex_rule);
                if (url.match(re)) {
                        return true; //regex match
                }
        }
        return false; //no regex match
}
 
function process_search_button_click() {
        /**
        Helper function that will auto-click on the search button if user has yet to have a search result.
        If there already is an existing search result, or too may results for BW to present, then this function will NOT perform the click.
       
        Algorithm:
        Look for "Failed to read" with too many results. "Please narrow your search".. if exist, that means there are too many results. don't click.
        Look for table id "searchTable" if there is a next sibling table, that means don't click on search, because results are already listed
        */
       
        var htmltext = document.getElementById('mainForm').innerHTML;
        if ( htmltext.indexOf("Failed to read") == -1 &&
                 htmltext.indexOf("Error 4027") == -1 &&
                 htmltext.indexOf("Please narrow your search") == -1) {
        } else {
                debug("\tDon't click because there are too many results for bw to list. User will need to narrow down the search");
                return;
        }
       
        searchtable = document.getElementById('searchTable');
        if ( searchtable == null) {
                debug("\tDon't click because I can't find searchTable");
                return;
        }
        var sibling = searchtable.nextSibling.nextSibling;
        if (sibling == null) {
                debug("\tClick on search");
                document.getElementById('search0').click();
        } else {
                debug("\tDon't click because it seems like you already have results.");
        }
       
}
 
function process_commpilot_webpage()
{
        if (document.getElementById('findValue0').value == "")
        {
                debug('\tfindValue0 Textbox is empty, lets help user with the selection');
               
                debug('\t If user is visiting a new search page, then help the user click on the search button');
                var exclude_clicking = process_search_button_exclusions();
                if (exclude_clicking == false) {
                        debug("\t Click ON SEARCH BUTTON");
                        process_search_button_click();
                }
               
                debug('\ttry to select FNN field');
                javascript:(function(){
                        var d=document;
                        var s=d.getElementsByTagName('SELECT')[0];
                        var o=s.getElementsByTagName('OPTION');
                        var S='selected';
                        var v='Dn';
                        var i;
                       
                        for(i=0;O=o[i];i++){
                                if(O.value==v){
                                O.setAttribute(S,S);O.selected=true
                                debug('\tselected:' + O.value);
                                }else{
                                //debug('removing ' + O.value);
                                //O.removeAttribute(S);O.selected=false;
                                }
                        }
                })();
                debug('\t');
                debug('\ttry to select CONTAINS field');
                javascript:(function(){
                        var d=document;
                        var s=d.getElementsByTagName('SELECT')[1];
                        var o=s.getElementsByTagName('OPTION');
                        var S='selected';
                        var v='CONTAINS';
                        var i;
                       
                        for(i=0;O=o[i];i++){
                                if(O.value==v){
                                O.setAttribute(S,S);O.selected=true
                                debug('\tselected: ' + O.value);
                                }else{
                                //O.removeAttribute(S);O.selected=false;
                                //debug('removing ' + O.value);
                                }
                        }
                })();
                debug('\t');
                debug('\tfindValue0 - try to focus on textbox');
                setfocus();
        } else
        {
                debug('\tUser has selected some settings, Im not going to modify any selection.');
                setfocus();
        }
}


self.port.on('alert', function(message) {
  let is_bes_active = message;
  if (is_bes_active == true) { 
    if (document.getElementById('findValue0') != null &&
      document.getElementById('mainForm') != null) {
      //this looks like a Broadworks Commpilot webpage with findValue0 textbox
      process_commpilot_webpage()
    } else {
      debug('this does NOT looks like a Broadworks Commpilot webpage, or has no findValue0 textbox. I am not going to modify anything');
    }
  } else {
    debug('bes is not active');
  }
});
 


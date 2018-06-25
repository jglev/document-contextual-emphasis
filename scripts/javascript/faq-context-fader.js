// Note: This requires the use of jQuery and list.js

//////////////////////////////////////
// Fading elements when a question is clicked
//////////////////////////////////////
jQuery(document).ready(function($) {
    
    // Now that we know that javascript is enabled, change some display options that were preset for in case js was not enabled:
    $(".hide-without-javascript").css("display", "inherit");
    $(".hide-with-javascript").css("display", "none"); // Remove the "display: hidden" CSS element that is set by default on the list-of-questions div, now that we know that javascript is enabled.
    
    //////////////////////////////////////
    // List of questions fuzzy search
    //////////////////////////////////////
    
    // Initialize the list.js list.
    // For list.js fuzzy search demo and documentation, see http://listjs.com/examples/fuzzy-search/
    var ListOfQuestions = new List('list-of-questions', { 
        valueNames: ['question']
    });
    
    var fade_time = 400; // Number of ms for fade animations.
    
    // NOTE WELL: The below need to be of the form 'rgb(0, 0, 0)' (not in hex form, and with a space after each comma):
    var light_color = "rgb(203, 202, 202)"; // Light grey (See, e.g., http://htmlcolorcodes.com/)
    var dark_color = "rgb(0, 0, 0)"; // Black
    
    var link_clicked_color = "rgb(149, 0, 26)";
    
    $('div#faq-searchable-content').css("color", dark_color); // Set a default color for the container.
    //$('div#faq-searchable-content').removeAttr("aria-activedescendant"); // Tell screen-readers that this is not hidden.
    
    var dom_elements_relevant_to_current_question; // This will get filled in later. It will allow us to reset DOM elements from previous quesiton-selections on each new click of a question.
    var dom_elements_relevant_to_previous_question;
    var previously_clicked_link;
    var previously_clicked_color;
    
    function find_relevant_dom_elements(question_id_marker){
        
        //$('div#faq-searchable-content').css('color', 'red');
        
        dom_elements_relevant_to_current_question = $('div#faq-searchable-content').find("[data-relevant-to-question~='" + question_id + "']"); // Overwrite the variable with whatever DOM elements are relevant to the *new* question that was clicked.
            // '~=' means "contains" (instead of just '=', which means "equals").
        
        //alert(dom_elements_relevant_to_current_question.html()); // Useful for debugging.
        
        if(dom_elements_relevant_to_previous_question == null){ // If this is the user's first time clicking a question, dom_elements_relevant_to_previous_question won't have anything in it, so we can skip the animations below.
            $( dom_elements_relevant_to_current_question ).animate({
                color: dark_color
            }, fade_time );
            
            $(dom_elements_relevant_to_current_question).each(function(){
                var html_of_this_element = $(this).html();
                
                // Replace each relevant element with a copy of itself, so that screen-readers (prompted by the aria-live setting above) will read it:
                // TODO: Confirm that using 'html' instead of 'text' here and below does not break screen-reader usage. The change was made to prevent a bug whereby sub-span elements get wiped out upon the text() replacement.
                $(this).html("").html(html_of_this_element);
                //$(this).text("grizzly bears");  // Useful for debugging, if 'aria-relevant' above is set to "additions"
            });
            //$( dom_elements_relevant_to_current_question ).attr("aria-activedescendant", "true"); // Tell screen-readers that these are not hidden.
        } else { // If this *isn't* the user's first time clicking a question, animate the previous question's elements first, and then animate the current question's.
            //$( dom_elements_relevant_to_previous_question ).animate({
            //  color: $('div#faq-searchable-content').css("color")
            //  }, fade_time,
            //  function(){
                    $( dom_elements_relevant_to_previous_question ).css("color", ""); // Remove any color styling on the elements that were relevant to the last-clicked-on-question.
                    
                    //$( dom_elements_relevant_to_previous_question ).removeAttr("aria-activedescendant"); // Tell screen-readers that these ARE hidden.
                    
                    $(dom_elements_relevant_to_current_question).each(function(){
                        var html_of_this_element = $(this).html();
                        
                        // Replace each relevant element with a copy of itself, so that screen-readers (prompted by the aria-live setting above) will read it:
                        $(this).html("").html(html_of_this_element);
                        //$(this).text("black bears"); // Useful for debugging, if 'aria-relevant' above is set to "additions"
                    });
                    //$( dom_elements_relevant_to_current_question ).attr("aria-activedescendant","true"); // Tell screen-readers that these are not hidden.
                    
                    $( dom_elements_relevant_to_current_question ).animate({
                        color: dark_color
                    }, fade_time );
                //}
            //);
        };
        
    };
    
    $( "a.question" ).click(function(event) {

        event.preventDefault(); // Stop the link from doing anything that it normally would.
        
        if(previously_clicked_link != null){ // If this is the user's first time clicking a question, previously_clicked_link won't have anything in it, so we can skip the animation below.
            $( previously_clicked_link ).animate({
                color: previously_clicked_color
            }, fade_time);
        };
        
        previously_clicked_link = $(this);
        previously_clicked_color = $(this).css("color");
        
        $( this ).animate({
            color: link_clicked_color
        }, fade_time );
        
        dom_elements_relevant_to_previous_question = dom_elements_relevant_to_current_question;
        
        question_id = $(this).attr('question-id');
        //alert("Question ID is " + question_id); // Useful for debugging
        
            // Fade all text to light grey, then fade relevant text to black:
            if($('div#faq-searchable-content').css("color") === dark_color){
                
                //$('div#faq-searchable-content').find("*").removeAttr("aria-activedescendant"); // Traverse down through all levels of the DOM below faq-searchable-content, and tell screen-readers it's not hidden.
                
                $('div#faq-searchable-content').animate({
                    color: light_color
                    }, fade_time,
                        find_relevant_dom_elements(question_id)
                );
            } else {
                find_relevant_dom_elements(question_id);
            };
    });
    
    $( "#question-highlight-reset-button" ).click(function(event) {

        event.preventDefault(); // Stop the link from doing anything that it normally would.
        
        if(previously_clicked_link != null){ // If this is the user's first time clicking a question, previously_clicked_link won't have anything in it, so we can skip the animation below.
            $( previously_clicked_link ).animate({
                color: previously_clicked_color
            }, fade_time);
        };

        $('div#faq-searchable-content').animate({
            color: dark_color
            }, 400,
            function(){
                $( dom_elements_relevant_to_current_question ).css("color", ""); // Remove any color styling on the elements that were relevant to the last-clicked-on-question.
                
                //$('div#faq-searchable-content').find("*").removeAttr("aria-activedescendant"); // Traverse down through all levels of the DOM below faq-searchable-content, and tell screen-readers it's not hidden.
            }
        );
    });

}); // End document ready function

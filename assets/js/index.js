/**
 * Main JS file for Casper behaviours
 */

/*globals jQuery, document */
(function ($) {
    "use strict";

    $(document).ready(function(){

        $(".post-content").fitVids();
        
        // Calculates Reading Time
        $('.post-content').readingTime({
            readingTimeTarget: '.post-reading-time',
            wordCountTarget: '.post-word-count',
        });
        
        // Optionally create captions from image title (not alt)
        // Using title avoids showing file names like "image.png" when alt is present for accessibility.
        $(".post-content img").each(function() {
            var title = $(this).attr("title");
            if(title && !$(this).hasClass("emoji")) {
              $(this)
                .wrap('<figure class="image"></figure>')
                .after('<figcaption>'+ title +'</figcaption>');
            }
        });
        
    });

}(jQuery));

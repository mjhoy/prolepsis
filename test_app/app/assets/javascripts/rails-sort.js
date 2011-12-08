/*
 * rails-sort.js
 * a wrapper to jquery ui's sort that works with some common
 * rails patterns I use to persist sort state to the server.
 *
 * mjhoy | 2011
 */

// requires jQuery and underscore
(function ( $, _ ) {

  $.fn.railsSort = function ( opts ) {

    if ( opts === undefined || opts === null ) opts = {};

    return this.each( function() {
      var el = $(this),
         url = el.data('sort-url'),
         defaultOptions = {
           axis : 'y',
           dropOnEmpty : false,
           cursor : 'crosshair',
           items : 'li',
           scroll : true
         },
         opts = _.extend( defaultOptions, opts );

      // call the `sortable` method on the element
      el.sortable( opts ); 

      el.bind( 'sortupdate', function() {
        $.ajax( {
          type : 'post',
          data : el.sortable( 'serialize' ),
          dataType : 'script',
          url : url,
          complete : function() {
            $(el).effect( 'highlight' );
          }
        } );
      } );
    } );
  };
})( jQuery, _ );

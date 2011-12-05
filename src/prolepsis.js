/*
 * prolepsis.js
 * mjhoy | 2011
 * [beta]
 */

// Requires jQuery, Backbone, and Underscore.
(function ( $, Backbone, _, undefined ) {

  var root       = this,
      Model      = Backbone.Model,
      Collection = Backbone.Collection,
      View       = Backbone.View,
      _sync,
      getUrl, urlError, renderForm,
      PrModel, PrCollection, PrCollectionView, PrModelView;

   getUrl = function ( o ) {
     if ( !( o && o.url ) ) return null;
     if ( _.isFunction( o.url ) ) return o.url();
     return o.url;
   };

   urlError = function() {
     throw new Error('A "url" property or function must be specified');
   };

   PrModel = Model.extend( {
     // For models that are referred to on the server by their 'param'
     // attribute rather than their 'id'.
     param : function() {
       var p = this.get( 'param' );
       if ( typeof p !== "undefined" && p !== null ) {
         return this.get( 'param' );
       }
       return this.id;
     },

     // We want to use the "param" variable if available.
     url : function() {
       var base = getUrl( this.collection ) || this.urlRoot || urlError();
       if ( this.isNew() ) return base;
       return base + 
         ( base.charAt( base.length - 1 ) === '/' ? '' : '/' ) +
         encodeURIComponent( this.param() );
     }
   } );

   PrCollection = Collection.extend( {
     url : function() {
       var pattern, 
           b = this.belongsTo,
           c = this.collectionName;
       if ( typeof c === "undefined" || c === null ) { 
         throw 'PrCollection: collectionName must be set.';
       }
       // Get the collection's url based on the current url.
       // Example: if the collection name is 'employees', and the
       // belongs_to relation is 'companies', the url might 
       // be: '/companies/1'; the collection url should be
       // '/companies/1/employees'.
       if ( typeof b !== "undefined" && b !== null ) {
         pattern = new RegExp( "/" + b + "/[^\/]+" );
         return window.location.pathname.match( pattern ) + c;
       }
       return '/' + c;
     },

     initialize : function() {
       this.bind( 'destroy', this._modelWasDestroyed, this );
     },

     // Fetch the collection if a model was destroyed.
     _modelWasDestroyed : function() {
       this.fetch();
     }
   } );

   // Common form rendering code for both the CollectionView
   // and the ModelView.
   renderForm = function ( html, sel ) {
     var self = this,
         form;
     if ( typeof html !== 'undefined' && html !== null ) {
       this.form = form = $( html ).hide().appendTo( this.$( sel ) );
       $( this.el ).addClass( 'with-form' );
       // Render the datepicker jQuery UI plugin if there is
       // a date-field present.
       $( '.date-field', form ).datepicker();
       form.slideDown();
     } else {
       // Remove the form.
       form = this.form;
       if ( form ) {
         form.slideUp( function() {
           form.remove();
           self.form = undefined;
           $( self.el ).removeClass( 'with-form' );
         } );
       }
     }
   };

   PrCollectionView = View.extend( {
     tagName   : 'section',
     className : 'collection',
     events : {
       'click a.new'                : 'requestNew',
       'click a.cancel'             : 'cancelNew',
       'click input[type="submit"]' : 'submitNew'
     },

     renderForm : renderForm,

     initialize : function() {
       var mV = this.modelView,
           tS = this.templateSelector;
       if ( typeof mV === "undefined" || mV === null ) throw 'CollectionView: modelView must be set.';
       if ( typeof tS === "undefined" || tS === null ) throw 'CollectionView: templateSelector must be set.';
       _.bindAll( this, 'render' );
       this.collection.bind( 'reset', this.render );
       this.template = _.template( $( tS ).html() );
     },

     render : function() {
       var models,
           el = this.el,
           template = this.template,
           collection = this.collection;
       $( el ).html( template( {} ) );
       models = this.$( '.models' );
       if ( collection.length > 0 ) {
         collection.each( function ( m ) {
           view = new this.modelView( {
             model : m,
             collection : collection
           } );
           models.append( view.render().el );
         } );
       } else {
         models.append( "<p>No"+collection.collectionName+" yet, please add some!</p>" );
       }
       if ( $.fn.rails_sort ) {
         this.$( '.sortable' ).rails_sort( { items : 'li.model-view' } );
       }
       return this;
     },

     submitNew : function ( e ) {
       var self = this,
           form = this.form;
       $.ajax( {
         url : form.attr( 'action' ),
         type : form.attr( 'method' ),
         data : form.serializeArray(),
         dataType : 'json',
         success : function() {
           self.renderForm();
           self.collection.fetch();
         }
       } );

       e.preventDefault();
       return false;
     },

     cancelNew : function ( e ) {
       var self = this,
           form = this.form;
       if ( form ) this.renderForm(); 
       e.preventDefault();
       return false;
     },

     requestNew : function ( e ) {
       var self = this,
           form = this.form,
           target = e.target;

       if ( form ) {
         $.ajax( {
           type : 'get',
           url : $( target ).attr( 'href' ),
           dataType : 'json',
           success : function ( data ) {
             if ( self.form ) self.form.remove();
             self.renderForm( data.html, '.new-form-container' );
           }
         } );
       }
       e.preventDefault();
       return false;
     }

   } );

   PrModelView = View.extend( {
     renderForm : renderForm,
     tagName : 'li',
     className : 'model-view',
     id : function() {
       return this.collection.model_name + '_' + this.model.id;
     },
     events : {
       'click .edit' : 'edit',
       'click .delete' : 'destroy',
       'click .cancel' : 'cancel',
       'click .send-top' : 'sendToTop',
       'click .send-bottom' : 'sendToBottom',
       'click input[type="submit"]' : 'submitUpdate'
     },
     sendToTop : function() {
       var el = this.el,
           sortable = $( el ).parents( '.sortable' );
       sortable.prepend( $( el ) );
       sortable.tragger( 'sortupdate' );
       return false;
     },
     sendToBottom : function() {
       var el = this.el,
           sortable = $( el ).parents( '.sortable' );
       sortable.append( $( el ) );
       sortable.tragger( 'sortupdate' );
       return false;
     },
     checkEnabled : function() {
       var disable = this.disable;
       return disable && _.include( disable, key ) ? false : true;
     },
     initialize : function() {
       var tS = this.templateSelector;
       if ( typeof tS === "undefined" || tS === null ) {
         throw 'ModelView: templateSelector must be set.';
       }
       _.bindAll( this, 'render' );
       this.model.bind( 'change', this.render );
       this.template = _.template( $( tS ).html() );
     },
     render : function() {
       $( this.el ).html( this.template( this.model.toJSON() ) );
       return this;
     },
     edit : function ( e ) {
       var self = this,
           form = this.form;
       if ( !this.checkEnabled('edit') ) return true;
       if ( !form ) {
         $.ajax( {
           type : 'get',
           url : this.collection.url() + '/' + this.model.param() + '/edit',
           dataType : 'json',
           success : function ( data ) {
             if ( self.form ) self.form.remove();
             self.renderForm( data.html, '.edit-form-container' );
           }
         } );
       }
     },
     submitUpdate : function ( e ) {
       var self = this,
           form = this.form;
       if ( form ) {
         $.ajax( {
           url : form.attr( 'action' ),
           type : form.attr( 'method' ),
           data : form.serializeArray(),
           dataType : 'json',
           success : function() {
             self.renderForm();
             self.collection.fetch();
           }
         } );
       }
       e.preventDefault();
       return false;
     },
     cancel : function ( e ) {
       var self = this,
           form = this.form;
       if ( form ) {
         this.renderForm();
       }
       e.preventDefault();
       return false;
     },
     destroy : function ( e ) {
       var self = this,
           form = this.form;
       if ( !this.checkEnabled('edit') ) return true;
       if ( $.rails.allowAction( $( e.target ) ) ) {
         this.model.destroy();
       }
       e.preventDefault();
       return false;
     }

   } );

   // Send all requests appended with '.json'.
   // This is to avoid confusing the browser on collection
   // pages; a user might visit '/projects', which may then make
   // a request to '/projects' for JSON data, and this causes
   // weirdness (at least in Chrome).
   _sync = Backbone.sync;
   Backbone.sync = function ( method, model, options ) {
     if ( !options.url ) {
       options.url = getUrl( model ) || urlError();
       if ( !options.url.match( /\.[a-zA-Z]+$/ ) ) {
         options.url = options.url + '.json';
       }
     }
     return _sync( method, model, options );
   };

   // Export some variables.
   root.Prolepsis = {
     Model : PrModel,
     Collection : PrCollection,
     CollectionView : PrCollectionView,
     ModelView : PrModelView
   };

} ( jQuery, Backbone, _ ) );

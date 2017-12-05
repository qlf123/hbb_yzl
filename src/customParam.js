(function($) {
    var r20 = /%20/g,
        rbracket = /\[\]$/;

    $.extend({
        customParam: function( a ) {
            var s = [],
                add = function( key, value ) {
                    value = jQuery.isFunction( value ) ? value() : value;
                    s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
                };

            if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
                jQuery.each( a, function() {
                    add( this.name, this.value );
                });

            } else {
                for ( var prefix in a ) {
                    buildParams( prefix, a[ prefix ], add );
                }
            }
            return s.join( "&" ).replace( r20, "+" );
        }
    });

    function buildParams( prefix, obj, add ) {
        if ( jQuery.isArray( obj ) ) {
            jQuery.each( obj, function( i, v ) {
                if (rbracket.test( prefix ) ) {
                    add( prefix, v );

                } else {
                    buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, add );
                }
            });

        } else if (obj != null && typeof obj === "object" ) {
            for ( var name in obj ) {
                buildParams( prefix + "." + name, obj[ name ], add );
            }

        } else {
            add( prefix, obj );
        }
    };
})(jQuery);
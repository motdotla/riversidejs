(function($) {

    var callback = function() { };
    // [up, up, down, down, left, right, left, right, b, a];
    var code = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    var i = 0;

    $.fn.konami = function(f) {
        if (typeof f == 'function') callback = f;
        return this.keydown(function(e) {
            console.log(e.keyCode)
            i = (e.keyCode == code[i]) ? i + 1 : 0;
            if (i == 10) { callback(); i = 0; }
        });
    };

})(jQuery);
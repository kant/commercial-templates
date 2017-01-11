import capiMultiple from '../../_shared/js/capi-multiple.js';
import { write } from '../../_shared/js/dom.js';

capiMultiple("hosted")
    .then(() => addColourContrastClass());


function addColourContrastClass () {
    // todo: move to common module
    var div = document.getElementsByClassName('creative--hosted')[0];
    var brandColour = div.getAttribute('data-brand-color');
    if(isDark(brandColour)){
        return write(() => {
            div.classList.add('hosted-bright')
        });
    }
}

function isDark(hex) {
    var colour = (hex.charAt(0) == '#') ? hex.substring(1, 7) : hex;
    var R = parseInt(colour.substring(0, 2), 16);
    var G = parseInt(colour.substring(2, 4), 16);
    var B = parseInt(colour.substring(4, 6), 16);

    var min = Math.min(Math.min(R, G), B);
    var max = Math.max(Math.max(R, G), B);
    var lightness = (min + max) / 510;
    return lightness < 0.5;
}
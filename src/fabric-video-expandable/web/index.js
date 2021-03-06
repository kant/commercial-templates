import { getIframeId, getWebfonts, resizeIframeHeight } from '../../_shared/js/messages';
import { enableToggles } from '../../_shared/js/ui';
import { write } from '../../_shared/js/dom';

let showLabel = '[%ShowLabel%]';
let labelHeight = 22;
let video = document.getElementById('YTPlayer');
let videoContainer = document.getElementById('video');
let videoOptions = '[%VideoOptions%]';
let isWide = window.matchMedia('(min-width: 1300px)').matches;

getIframeId()
.then(() => {
    if( showLabel === 'yes' ) resizeIframeHeight();

    getWebfonts(['GuardianTextSansWeb']);
    handleToggle();
});

function handleToggle() {
    enableToggles(document, true, onToggle);
}

function onToggle(isOpen, toggle, target) {
    resizeIframeHeight((isOpen ? 500 : 250) + (showLabel === 'yes' ? labelHeight : 0));
    setTimeout((() => {
        if (video.src.indexOf('autoplay') === -1) {
            video.src += '&amp;autoplay=1';
        } else {
            video.src = video.src.replace(
                isOpen ? 'autoplay=0' : 'autoplay=1',
                isOpen ? 'autoplay=1' : 'autoplay=0'
            );
        }
    }), 1000);
}

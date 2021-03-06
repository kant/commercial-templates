import { write } from '../../_shared/js/dom';
import { getIframeId, getWebfonts, resizeIframeHeight, reportClicks, onViewport } from '../../_shared/js/messages';
import { getApiBaseUrl } from '../../_shared/js/dev';
import { hideOnError, URLSearchParams } from '../../_shared/js/utils';

let container = document.getElementsByClassName('adverts__row')[0];

let ids = '[%IDs%]'.trim();
let params = new URLSearchParams();
if( ids.length ) {
    ids.split(',').forEach(id => params.append('t', id.trim()));
}

reportClicks();
getIframeId()
.then(({ host, preview }) => fetch(`${getApiBaseUrl(host, preview)}/commercial/jobs/api/jobs.json?${params}`))
.then(response => response.json())
.then(jobs => jobs.map(createAdvert).join(''))
.then(html => Promise.all([getWebfonts(), write(() => container.insertAdjacentHTML('beforeend', html))]))
.then(() => {
    let lastWidth;
    onViewport(({ width }) => {
        if( width !== lastWidth ) {
            lastWidth = width;
            resizeIframeHeight();
        }
    });
})
.catch( error => hideOnError(error, 'jobs'));

/* Outputs the HTML for a job advert */
function createAdvert(job, index) {
    return `<a class="blink advert advert--job" href="%%CLICK_URL_UNESC%%${job.listingUrl}" data-link-name="Offer ${index+1} | ${job.id}" target="_top">
        <h2 class="blink__anchor advert__title" itemprop="name">${job.title}</h2>
        <div class="advert__image-container">
            <img class="advert__image" src="${job.recruiterLogoUrl}">
        </div>
        <div class="advert__meta">
            <strong>${job.recruiterName}</strong>
        </div>
        <div class="advert__meta">
            ${job.locationDescription} - ${job.shortSalaryDescription}
        </div>
        <span class="advert__more button button--small">
            <span>Apply now</span>
            ${arrowRight}
        </span>
    </a>`;
}

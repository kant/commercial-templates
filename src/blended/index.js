import { write } from '../_shared/js/dom';
import { getIframeId, getWebfonts, resizeIframeHeight } from '../_shared/js/messages';
import { getApiBaseUrl } from '../_shared/js/dev';
import { formatPrice, formatDuration } from '../_shared/js/utils';

let container = document.getElementsByClassName('adverts__row')[0];

let params = new URLSearchParams();
['[%Offer1%]','[%Offer2%]','[%Offer3%]','[%Offer4%]'].forEach(offer => params.append('offerTypes', offer));
['[%Offer1Id%]','[%Offer2Id%]','[%Offer3Id%]','[%Offer4Id%]'].forEach(offerId => params.append('offerIds', offerId));

let createAdvert = {
    Book: createBlendedCard.bind(null, 'books', 'http://www.guardianbookshop.co.uk/', logoBookshop, createBook),
    Job:  createBlendedCard.bind(null, 'jobs', 'http://jobs.theguardian.com/', logoJobs, createJob),
    Masterclass: createBlendedCard.bind(null, 'masterclass', 'http://theguardian.com/guardian-masterclasses/', logoMasterclasses, createMasterclass),
    Soulmates: createBlendedCard.bind(null, 'soulmates', 'https://soulmates.theguardian.com/', logoSoulmates, createSoulmates),
    Travel: createBlendedCard.bind(null, 'travels', 'https://holidays.theguardian.com/', logoHolidays, createTravel)
};

let advertFooter = {
    Soulmates: createSoulmatesFooter
};

getIframeId()
.then(({ host, preview }) => fetch(`${getApiBaseUrl(host, preview)}/commercial/api/multi.json?${params}`))
.then(response => response.json())
.then(offers => offers.map(offer => createAdvert[offer.type](offer.value, advertFooter[offer.type] || null)).join(''))
.then(html => Promise.all([getWebfonts(), write(() => container.innerHTML = html)]))
.then(resizeIframeHeight);

function createBlendedCard(type, titleUrl, titleLogo, contentFn, content, footerFn = null) {
    return `<div class="advert-blended advert-blended--${ type }">
        <div class="advert-blended__title">
            <a href="%%CLICK_URL_UNESC%%${ titleUrl }"
                data-link-name="">
                ${ titleLogo }
            </a>
        </div>
        <div class="advert-blended__body">
            ${ contentFn(content) }
        </div>
        ${ footerFn ? '<div class="advert-blended__footer">' + footerFn() + '</div>' : '' }
    </div>`;
}

function createBook(book) {
    return `<a class="blink advert advert--book advert--large advert--landscape" href="%%CLICK_URL_UNESC%%${ book.buyUrl }" data-link-name="">
        <div class="advert__text">
            <h2 class="blink__anchor advert__title">${book.title}</h2>
            <div class="advert__meta">By ${book.author}</div>
            <div class="advert__meta">
                ${ book.price ? formatPrice(book.price) + '<br>' : '' }
                ${ book.offerPrice ? '<strong>Our price: ' + formatPrice(book.offerPrice) + '</strong>' : '' }
            </div>
            <span class="advert__more button button--small">
                Buy now
                ${arrowRight}
            </span>
        </div>
        <div class="advert__image-container">
            <img class="advert__image" src="${book.jacketUrl}">
        </div>
    </a>`;
}

function createJob(job) {
    return `<a class="blink advert advert--job" href="%%CLICK_URL_UNESC%%${job.listingUrl}" data-link-name="merchandising-jobs-v0_2_2014-04-30-low-job-${job.id}">
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

function createMasterclass(event) {
    return `<a class="blink advert advert--masterclass" href="%%CLICK_URL_UNESC%%${event.url}" data-link-name="">
        <div class="advert__image-container">
            <img class="advert__image" src="${location.protocol}${event.pictureUrl}" alt>
        </div>
        <div class="advert__text">
            <h2 class="blink__anchor advert__title">${event.name}</h2>
            <div class="advert__meta">
                <strong>${event.startDate}</strong> &#20; <span class="commercial--tone__highlight">${formatPrice(event.ticketPrice)}</span></span><br/>
                ${event.venue.name}, ${event.venue.city}
                ${event.ratioTicketsLeft <= 0.1 ? '<br><span class="advert__scarcity">Last few tickets remaining</span>' : '' }
            </div>
            <span class="advert__more button button--primary button--small">
                Book now
                ${arrowRight}
            </span>
        </div>
    </a>`;
}

function createSoulmates(soulmates) {
    return createMember(soulmates.member1) + createMember(soulmates.member2);
}

function createSoulmatesFooter() {
    return `<a class="button button--small" href="%%CLICK_URL_UNESC%%https://soulmates.theguardian.com" data-link-name="">
        <span>Find a Soulmate</span>
        ${arrowRight}
    </a>`;
}

function createMember(soulmate) {
    return `<a class="advert advert--soulmate blink" href="%%CLICK_URL_ESC%%${soulmate.profile_url}" data-link-name="merchandising-soulmates-v2_2_2014-03-28-profile-${soulmate.gender}">
        <h2 class="advert__title u-text-hyphenate blink__anchor" itemprop="name">${soulmate.username}</h2>
        <div class="advert__image-container">
          <img class="advert__image" src="${soulmate.profile_photo}" />
        </div>
        <div class="advert__meta">${soulmate.age}, ${soulmate.location}</div>
      </a>`;
}

function createTravel(offer) {
    return `<a class="blink advert advert--travel" href="%%CLICK_URL_UNESC%%${offer.offerUrl}" data-link-name="">
        <div class="advert__image-container">
            <img class="advert__image" src="${offer.imageUrl}">
        </div>
        <div class="advert__text">
            <h2 class="blink__anchor advert__title" itemprop="name">${offer.title}</h2>
            <div class="advert__meta">
                ${formatDuration(offer.duration)} from <strong class="advert__price">${formatPrice(offer.fromPrice)}</strong>
            </div>
            <span class="advert__more button button--small">
                See more
                ${arrowRight}
            </span>
        </div>
    </a>`;
}
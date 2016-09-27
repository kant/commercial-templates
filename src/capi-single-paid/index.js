import config from '../_shared/js/config';
import { write } from '../_shared/js/dom';
import { getIframeId, getWebfonts, resizeIframeHeight } from '../_shared/js/messages';

let container = document.getElementsByClassName('adverts__row')[0];
let params = new URLSearchParams();
let keywords = '[%SeriesUrl%]';
let customUrl = '[%CustomUrl%]';

if (typeof customUrl !== 'undefined') {
  params.append('t', customUrl);
} else {
  params.append('k', keywords);
}

// const GLABS_EDITION = {
// 	default: 'https://theguardian.com/guardian-labs',
// 	au: 'https://theguardian.com/guardian-labs-australia'
// }


getIframeId()
.then(() => getWebfonts())
.then(() => fetch(`${config.capiSingleUrl}?${params}`))
.then(response => response.json())
.then(capiData => populateCard(capiData))
.then(html => container.innerHTML = html)
.then(resizeIframeHeight);

function getValue([dfpValue, capiValue]) {
   return dfpValue || capiValue
};

/* Outputs the HTML for a travel advert */
function populateCard(responseJson) {

  var overrideData = [
     ['[%ArticleHeadline%]', responseJson.articleHeadline],
     ['[%ArticleUrl%]', responseJson.articleUrl],
     ['[%ArticleText%]', responseJson.articleHeadline],
     ['[%ArticleImage%]', responseJson.articleHeadline]
  ].map(getValue)

  checkIcon(responseJson)

    return( `<a class="blink advert advert--large advert--capi advert--media advert--inverse advert--paidfor" href="%%CLICK_URL_UNESC%%${overrideData[1]} data-link-name="merchandising | capi | single">
      <div class="advert__text">
        <h2 class="blink__anchor advert__title">${overrideData[0]}</h2>
        <p class="advert_standfirst">${overrideData[2]}</p>
      </div>
      <div class="advert__image-container">
        <img class="advert__image" src="${overrideData[3]}" alt>
      </div>
    </a>
    <a class="hide-until-mobile-landscape button button--primary button--large button--legacy-single" href="%%CLICK_URL_UNESC%%https://theguardian.com/[%SeriesUrl%]"  data-link-name="merchandising-single-more">
      [%ViewAll%]
      {{#svg}}arrow-right{{/svg}}
    </a>`)

};
//
// function checkEdition(){
//   let edition = guardian.config.page.edition;
//   let badgeLink = edition === 'AU' ? GLABS_EDITION.au : GLABS_EDITION.default;
//
//   document.querySelector('.adverts__badge__link').href = badgeLink;
// };
//
function checkIcon(responseJson) {

    if (responseJson.audioTag) {
      console.log("audio icon");
    } else if (responseJson.galleryTag) {
      console.log("gallery icon");
    } else if (responseJson.videoTag) {
      console.log("video icon");
    } else {
      console.log("no icon type");
    }

};

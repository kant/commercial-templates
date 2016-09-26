import { getIframeId, getWebfonts, resizeIframeHeight } from '../_shared/js/messages';
import { write } from '../_shared/js/dom';
import { portify } from '../_shared/js/dev';

const cardContainer = document.getElementsByClassName("adverts__row")[0];
const soulmatesGroup = '[%Subfeed%]';

getIframeId()
  .then(({host}) => fetch(`${portify(host)}${soulmatesUrl}/${soulmatesGroup}`))
  .then(response => response.json())
  .then(soulmates => soulmates.map(createSoulmateCard))
  .then(cards => addSoulmatesCards(cards))
  .then(() => getWebfonts())
  .then(resizeIframeHeight);

function createSoulmateCard(soulmate, index) {

  return `<a class="advert advert--soulmate" href="%%CLICK_URL_ESC%%${soulmate.profilePhoto}" data-link-name="merchandising-soulmates-v2_2_2014-03-28-profile-${soulmate.gender}">
      <h2 class="advert__title u-text-hyphenate" itemprop="name">${soulmate.username}</h2>
      <div class="advert__image-container">
        <img class="advert__image" src="${soulmate.profilePhoto}" />
      </div>
      <div class="advert__meta">${soulmate.age}, ${soulmate.location}</div>
    </a>`;
}

function addSoulmatesCards(cards) {
  return write(() => cardContainer.insertAdjacentHTML('afterbegin', cards.join('')));
}

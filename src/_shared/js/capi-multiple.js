import { getIframeId, getWebfonts, resizeIframeHeight } from
	'./messages.js';
import { write } from './dom.js';
import { enableToggles } from './ui.js';
import { insertImage } from './capi-images.js';

const ENDPOINT = 'https://api.nextgen.guardianapps.co.uk/commercial/api/capi-multiple.json';

// Glabs edition links.
const GLABS_EDITION = {
	default: 'https://theguardian.com/guardian-labs',
	au: 'https://theguardian.com/guardian-labs-australia',
	us: 'https://theguardian.com/guardian-labs-us'
};

const OVERRIDES = {
	urls: ['[%Article1URL%]', '[%Article2URL%]', '[%Article3URL%]',
		'[%Article4URL%]'],
	headlines: ['[%Article1Headline%]', '[%Article2Headline%]',
		'[%Article3Headline%]', '[%Article4Headline%]'],
	images: ['[%Article1Image%]', '[%Article2Image%]', '[%Article3Image%]',
		'[%Article4Image%]'],
	brandLogo: '[%BrandLogo%]'
};

// Loads the card data from CAPI in JSON format.
function retrieveCapiData () {

	let params = new URLSearchParams();
	params.append('k', '[%SeriesURL%]');

	OVERRIDES.urls.forEach(url => {

		if (url !== '') {
			params.append('t', url);
		}

	})

	let url = `${ENDPOINT}?${params}`;

	return fetch(url).then(response => response.json());

}

// Sets up media icon information on a card (SVG and class).
function setMediaIcon (card, title, mediaType) {

	title.insertAdjacentHTML('afterbegin', mediaIcons[mediaType]);
	card.classList.add('advert--media');

}

// Inserts capi headline or DFP override.
function buildHeadline (title, cardInfo, cardNumber) {

	let headline;

	if (OVERRIDES.headlines[cardNumber] !== '') {
		headline = document.createTextNode(OVERRIDES.headlines[cardNumber]);
	} else {
		headline = document.createTextNode(cardInfo.articleHeadline);
	}

	title.appendChild(headline);

}

// Constructs the title part of the card: headline and media icon.
function buildTitle (card, cardInfo, cardNumber) {

	let title = card.querySelector('.advert__title');

	if (cardInfo.videoTag) {
		setMediaIcon(card, title, 'video');
	} else if (cardInfo.galleryTag) {
		setMediaIcon(card, title, 'camera');
	} else if (cardInfo.audioTag) {
		setMediaIcon(card, title, 'volume');
	} else {
		card.classList.add('advert--text');
	}

	buildHeadline(title, cardInfo, cardNumber);

}

// Either from template, or workaround for IE (sigh).
function importCard (adType) {

	let cardTemplate = document.getElementById(`${adType}-card`);

	// Modern browsers.
	if (cardTemplate.content) {
		return document.importNode(cardTemplate.content, true);
	} else {

		// Internet Explorer doesn't support templates.
		let cardFragment = document.createDocumentFragment();
		let tempDiv = document.createElement('div');

		tempDiv.innerHTML = cardTemplate.innerHTML;
		while (tempDiv.firstChild) cardFragment.appendChild(tempDiv.firstChild);
		return cardFragment;

	}

}

// Constructs an individual card.
function buildCard (cardInfo, cardNum, isPaid) {

	let adType = isPaid ? 'paidfor' : 'supported';
	let cardFragment = importCard(adType);
	let card = cardFragment.querySelector(`.advert--${adType}`);
	let imgContainer = card.querySelector('.advert__image-container');

	buildTitle(card, cardInfo, cardNum);
	card.querySelector('a.advert').href = cardInfo.articleUrl;
	insertImage(imgContainer, cardInfo.articleImage, OVERRIDES.images[cardNum]);

	// Only first two cards show on mobile portrait.
	if (cardNum >= 2) {
		card.classList.add('hide-until-mobile-landscape');
	}

	return cardFragment;

}

// Adds branding information from cAPI or DFP override.
function addBranding (brandingCard, isPaid) {

	let imageClass = `.${isPaid ? 'adverts__' : ''}badge__logo`;
	let brandImage = document.querySelector(imageClass);

	if (OVERRIDES.brandLogo === '') {
		brandImage.src = brandingCard.branding.sponsorLogo.url;
	}

}

// Sets correct glabs link based on edition (AU/All others).
function editionLink (edition, isPaid) {

	if (isPaid) {

		let link = GLABS_EDITION.default;

		if (edition === 'AU') {
			link = GLABS_EDITION.au;
		} else if (edition === 'US') {
			link = GLABS_EDITION.us;
		}

		document.querySelector('.adverts__stamp a').href = link;

	}

}

// Uses cAPI data to build the ad content.
function buildFromCapi (cardsInfo, isPaid) {

	let cardList = document.createDocumentFragment();

	// Constructs an array of cards from an array of data.
	cardsInfo.articles.forEach((info, idx) => {
		cardList.appendChild(buildCard(info, idx, isPaid));
	});

	// DOM mutation function.
	return () => {

		// Takes branding from last possible card, in case earlier ones overriden.
		addBranding(cardsInfo.articles.slice(-1)[0], isPaid);
		let advertRow = document.querySelector('.adverts__row');
		advertRow.appendChild(cardList);
		editionLink(cardsInfo.articles[0].edition, isPaid);

	};

}

export default function capiMultiple (adType) {

	const isPaid = (adType === 'paidfor');

	getIframeId()
	.then(retrieveCapiData)
	.then(capiData => buildFromCapi(capiData, isPaid))
	.then(write)
	.then(() => {
		if (isPaid) {
			enableToggles();
		}
	})
	.then(getWebfonts)
	.then(resizeIframeHeight)
	.catch(err => {
		console.log(err);
	});

}

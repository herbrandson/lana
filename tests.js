const {equal, deepEqual} = require('assert')
const {it} = require('mocha');
const index = require('./index');

it('can get products', async () => {
	const products = await index.findProducts();

	equal(4, Object.keys(products).length);
	equal('Google Home', products['120P90'].name);
});

it('can get promotions', async () => {
	const discounts = await index.findPromotions();

	equal(3, discounts.length);
	equal(30, discounts[0].discount);
});

it('can build a cart', async () => {
	const cart = await index.expandCart({
		'120P90': 1,
		'43N23P': 2,
	});

	deepEqual(cart, {
		'120P90': {name: 'Google Home', quantity: 1, price: 49.99},
		'43N23P': {name: 'MacBook Pro', quantity: 2, price: 10799.98}
	});
});

it('each sale of a MacBook Pro comes with a free Raspberry Pi B', async () => {
	const cart = await index.expandCart({
		'43N23P': 1,
		'234234': 2,
	});

	const totals = await index.calculateTotals(cart);

	deepEqual(totals, {
		subTotal: 5459.99,
		discount: 30.00,
		total: 5429.99,
	});
});

it('buy 3 Google Homes for the price of 2', async () => {
	const cart = await index.expandCart({
		'120P90': 3,
	});

	const totals = await index.calculateTotals(cart);

	deepEqual(totals, {
		subTotal: 149.97,
		discount: 49.99,
		total: 99.98,
	});
});

it('buying more than 3 Alexa Speakers will have a 10% discount on all Alexa speakers', async () => {
	const cart = await index.expandCart({
		'A304SD': 4,
	});

	const totals = await index.calculateTotals(cart);

	deepEqual(totals, {
		subTotal: 438,
		discount: 43.8,
		total: 394.2,
	});
});

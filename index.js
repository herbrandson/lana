const express = require('express');
const bodyParser = require('body-parser')

module.exports = {expandCart, calculateTotals, findProducts, findPromotions};

const app = express();
app.use(bodyParser.json());
app.post('/checkout', checkout);
app.listen(1976);

async function checkout(req, res) {
	try {
		log('Request', req.method, req.path);
		const cart = await expandCart(req.body);
		const totals = await calculateTotals(cart);
		res.json({cart, totals});
	} catch (err) {
		log('Error in request', err);
		res.status(500).json({err: err.message});
	}
}

async function expandCart(cart) {
	const result = {};
	const products = await findProducts();

	for (const [sku, quantity] of Object.entries(cart)) {
		const {name, price} = products[sku];
		result[sku] = {name, quantity, price: price * quantity};
	}

	return result;
}

async function calculateTotals(cart) {
	const discount = await calculateDiscount(cart);
	const subTotal = Object.values(cart).reduce((a, b) => a + b.price, 0);
	const total = round(subTotal - discount);
	return {subTotal, discount, total}
}

async function calculateDiscount(cart) {
	let result = 0;

	const promotions = await findPromotions();
	for (const promo of promotions) {
		if (!matchesPromo(promo, cart)) continue;

		if (promo.type === 'flat') {
			result += promo.discount;
		}

		if (promo.type === 'percent') {
			for (const key of Object.keys(promo.products)) {
				result += cart[key].price * promo.discount;
			}
		}
	}

	return round(result);
}

function matchesPromo(promo, cart) {
	for (const [key, count] of Object.entries(promo.products)) {
		const item = cart[key];
		if (item == null || item.quantity < count) return false;
	}

	return true;
}

function round(amount) {
	return Math.round(amount * 100) / 100;
}

async function findProducts() {
	// In a real application this would likely pull data from a db
	return {
		'120P90': {name: 'Google Home', price: 49.99, quantity:10},
		'43N23P': {name: 'MacBook Pro', price: 5399.99,quantity: 5},
		'A304SD': {name: 'Alexa Speaker', price: 109.50, quantity:10},
		'234234': {name: 'Raspberry Pi B', price: 30.00,quantity: 2},
	};
}

async function findPromotions() {
	// In a real application this would likely pull data from a db
	return [
		// Each sale of a MacBook Pro comes with a free Raspberry Pi B
		{type: 'flat', products: {'43N23P': 1, '234234': 1}, discount: 30},

		// Buy 3 Google Homes for the price of 2
		{type: 'flat', products: {'120P90': 3}, discount: 49.99},

		// Buying more than 3 Alexa Speakers will have a 10% discount on all Alexa speakers
		{type: 'percent', products: {'A304SD': 3}, discount: 0.1},
	];
}

function log(message, ...args) {
	// In a real worl application we'd likely want to use something more robust for logging
	console.log(message, ...args);
}

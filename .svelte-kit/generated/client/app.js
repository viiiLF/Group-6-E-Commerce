export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18')
];

export const server_loads = [2];

export const dictionary = {
		"/": [3],
		"/Home": [15],
		"/Home/faq": [16],
		"/admin": [4,[2]],
		"/admin/analytics": [5,[2]],
		"/admin/customers": [6,[2]],
		"/admin/login": [7,[2]],
		"/admin/orders": [8,[2]],
		"/admin/products": [9,[2]],
		"/admin/products/new": [10,[2]],
		"/admin/settings": [11,[2]],
		"/api/user/login": [12],
		"/api/user/register": [13],
		"/api/user/reset": [14],
		"/shop": [17],
		"/shop/cart": [18]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';
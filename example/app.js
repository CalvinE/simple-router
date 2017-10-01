let router = simpleUIRouter;

router.registerRoute({

}, '<p>This is the default route!</p>');

router.registerRoute(null, {

}, '<p>The route you are looking for is not registered.</p>');

router.registerRoute('/home', {
	handler: (state) => {
		console.log('Hello from handler!');
		addHRToContainer();
	},
	onUnloadState: (state) => {
		console.log('onUnloadState called!', state);
	}
}, './template.html', ['./template.css', './template2.css'], './template.js');

router.registerRoute('/home/:id', {
	onPreContentLoad: (state) => {
		state.templateTextInstance = state.templateTextInstance.replace('!!replaceme!!', state.params.id);
	}
}, '<p>This was injected by the router! home with param !!replaceme!!</p>');

router.registerRoute('/about', {

}, document.querySelector("[router-template='about']"));

router.registerRoute('/contactus', {

}, '<p>This was injected by the router! contact us</p>');

router.registerRoute('/log', {
	handler: (state) => {
		console.log('/log route hit!');
	}
});

router.registerRoute('/nestedOutletTest', {

}, './nested-template.html');

router.registerRoute('/redirect', {
	onPostRoutingHandler: (state) => {
		window.location.hash = '/home/456';
	}
});

router.init();

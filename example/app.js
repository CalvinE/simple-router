let router = simpleUIRouter;

router.registerRoute({

}, '<p>This is the default route!</p>');

router.registerRoute(null, {

}, '<p>The route you are looking for is not registered.</p>');

router.registerRoute('/home', {
	handler: (state) => {
		console.log('Hello from handler!');
		addHRToContainer();
	}
}, './template.html', './template.css', './template.js');

router.registerRoute('/home/:id', {
	preContentLoad: (state) => {
		state.templateTextInstance = state.templateTextInstance.replace('!!replaceme!!', state.params.id);
	}
}, '<p>This was injected by the router! home with param !!replaceme!!</p>');

router.registerRoute('/about', {

}, document.querySelector("[router-template='about']"));

router.registerRoute('/contactus', {

}, '<p>This was injected by the router! contact us</p>');

router.init();
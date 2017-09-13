let router = new SimpleRouter();

router.registerRoute('/home', {
    handler: (state) => {
        console.log('Hello from handler!');
    }
}, '<p>This was injected by the router!</p>');

router.registerRoute('/home/:id', {
    preContentLoad: (state) => {
        state.templateTextInstance = state.templateTextInstance.replace('!!replaceme!!', state.params.id);
    }
}, '<p>This was injected by the router! home with param !!replaceme!!</p>');

router.registerRoute('/about', {

}, document.querySelector("[router-template='about']"));

router.registerRoute('/contactus', {

}, '<p>This was injected by the router! contact us</p>');
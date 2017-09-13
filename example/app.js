let router = new SimpleRouter();

router.registerRoute('/home', {
    handler: (state) => {
        console.log('Hello from handler!');
    }
}, './template.html');

router.registerRoute('/home/:id', {
    preContentLoad: (state) => {
        state.templateTextInstance = state.templateTextInstance.replace('!!replaceme!!', state.params.id);
    }
}, '<p>This was injected by the router! home with param !!replaceme!!</p>');

router.registerRoute('/about', {

}, document.querySelector("[router-template='about']"));

router.registerRoute('/contactus', {

}, '<p>This was injected by the router! contact us</p>');
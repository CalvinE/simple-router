let router = new SimpleRouter();

router.registerRoute('/home', {
    handler: (state) => {
        console.log('Hello from handler!');
    }
}, '<p>This was injected by the router!</p>');

router.registerRoute('/home/:id', {
});

router.registerRoute('/about', {
});

router.registerRoute('/contactus', {
});
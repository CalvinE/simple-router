# simple-ui-router
A simple javascript UI router

## Goals
The aim here is to have a simple pure JS UI router for applications where a full framework and the associated overhead that comes with it is unnecessary.

### What it does
* At a basic level this is just a UI router that can access templates from either elements embedded in the current HTML via a script tag with type "text/html", or from a remote source like a relative URL pointing to an HTML template. The content of the template or html file provided to the route will be injected to the target outlet in the HTML, or the main outlet if the link does not specify a target outlet.

* In addition to the html content you can also provide a link to one or multiple css or javascript files. These files are treated differently and are injected as link and script tags repectivly, and the script or link tags are only added to the DOM once even if the route is accessed multiple times. Any plumming or scripting that should occur with the route will need to be invoked in the appropriate lifecycle event.

* Additionally you can provide links to no content (html, css, or js) and use the appropriate callback to handle it however you like. An example of this could be setting up a route for simply performing a put / post to your server and handling the response in the UI that is already displayed.

### Lifecycle events in routing process.
    All lifecycle events are passed the state object as its parameters.
* onPostRouteProcessing - Called after the route is processed and any parameters are taken from the URL and added to the state object.
* onPreFetchContent - Called before the HTML content related to the route is fetched, only if content was fetched related to the route. Specifically only if an ajax call was required to get the HTML content for the route.
* onPostFetchContent - Called after the HTML content related to the route is fetched, only if content was fetched related to the route. Specifically only if an ajax call was required to get the HTML content for the route.
* onPreContentLoad - Called before content is loaded related to the route, only if content was loaded related to the route.
* onPostContentLoad - Called after content is loaded related to the route, only if content was loaded related to the route.
* handler - Called after all content related to the routing is loaded. This is a good place to set up any code related to the content that was loaded to the page.
* onPostRoutingHandler - Called at the very end of the routing process. This is after the DOM is scanned for any new links or outlets added via the routed content.
* onUnloadState - Called before subsequent routing calls on a per outlet basis so long at the route is loads content to the page. If This callback is a good place to do any clean up or plumbing for new content being loaded and the old HTML template being unloaded. Just to note this call is not executed unless the subsequent route loads content to a outlet that currently has content that was placed by routing.

### Attributes that signify links and outlets in HTML
* Links are signified by the attribute `route-url` where the value of that attribute is url to be used in routing. Links can also specify `route-target` which tells the router which outlet the link is targeting. If `route-target` is not specified for a link the it targets the main outlet by default.
* Outlets are signified by the attribute `router-outlet` where the value of that attribute is the name of the outlet used for targeting them from links. You can also not provide a name with the attribute and just load a default route to the outlet using the `default-route` attribute. A few notes on outlets are...
    * There must be an outlet with `router-outlet="main"` or the router will not start. this is the default outlet.
    * The main outlet is the only outlet that is affected by the  default route and any other outlets will not run the default route.
    * You can specify a specific route as a default route for any outlet by giving it a route as the value to the `default-route` property.

### Examples
* Run `./node_modules/http-server/bin/http-server` from the root of the project and navigate to the example folder. ex. 127.0.0.1:8080/example make sure of the correct port by reading the output form http-server.
* read the code in `example/app.js` to see how the setup for the router is done, and read `example/index.html` to see how the attributes are placed to engage the router.

### TODO List
* Add a new attribute for outlets for them to specify a default route for intitial loading.
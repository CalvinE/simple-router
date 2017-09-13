# simple-router
A simple javascript UI router

## Goals
The aim here is to have a simple pure JS UI router for applications where a full framework and the associated overhead that comes with it is unnecessary.

### What it does
* At a basic level this is just a UI router that can access either templates embedded in the current HTML back via a script tag with type "text/xml" to from a remote source like a relative URL to the page pointing to /users/index.html. The content of the template or html file provided to the route will be injected to the target outlet in the HTML.

* In addition to the html content you can also provide a link to css and even a javascript file. these files are treated differently and are injected as link and script tags repectivly, and this only happens once even if the route is accessed multiple times. Any plumming or scripting that should occur with the route wil need to be invoked in the appropriate lifecycle event.

* Additionally you can provide links to no content (html, css, or js) and use the appropriate callback to handle it however you link. An example of this could be setting up a route for simply performing a put / post to your server and handling the response in the UI that is already displayed.

### Examples
* TODO

### TODO List
* Handle back navigation.
* Handle fetching remote html templates.
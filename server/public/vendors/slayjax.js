/**
 * Creates a promise from ajax with supplied parameters
 * @param {string} type String representing type of HTTP request
 * @param {string} url String representing a url to a route on server
 * @param {*} data Payload to be passed to server
 * @returns a promise created by AJAX with given parameters
 */
function httpRequest(type, url, data) {
        return $.ajax({
                type,
                url,
                data
        })
}

/**
 * Creates a promise by passing url parameters to the httpRequest function
 * @param {string} url String representing a url to a route on server
 * @returns the returned promise created by AJAX with given parameters from httpRequest function
 */
function get(url) {
        return httpRequest('GET', url);
}

/**
 * Creates a promise by passing url and data parameters to the httpRequest function
 * Response only differs from GET as HEAD will only get a response as a header and any body information will be ignored
 * @param {string} url String representing a url to a route on server
 * @returns the returned promise created by AJAX with given parameters from httpRequest function
 */
function head(url) {
        return httpRequest('HEAD', url);
}

/**
 * Creates a promise by passing url and data parameters to the httpRequest function
 * @param {string} url String representing a url to a route on server
 * @param {*} data Payload to be passed to server on POST request
 * @returns the returned promise created by AJAX with given parameters from httpRequest function
 */
function post(url, data) {
        return httpRequest('POST', url, data);
}

/**
 * Creates a promise by passing url and data parameters to the httpRequest function
 * Response differs from POST as subsequent PUT requests with identical data will only be executed upon first reciept at target server.
 * @param {string} url String representing a url to a route on server
 * @param {*} data Payload to be passed to server on PUT request
 * @returns the returned promise created by AJAX with given parameters from httpRequest function
 */
function put(url, data) {
        return httpRequest('PUT', url, data);
}

/**
 * Creates a promise by passing url and data parameters to the httpRequest function
 * @param {string} url String representing a url to a route on server
 * @returns the returned promise created by AJAX with given parameters from httpRequest function
 */
function del(url) {
        return httpRequest('DELETE', url);
}

/**
 * Creates a promise by passing url parameter to httpRequest function
 * CONNECT requests open a two-way communication tunnel with the destination server
 * @param {*} url String representing a url to a route on server
 * @returns the returned promise created by AJAX with given parameters from httpRequest function
 */
function con(url) {
        return httpRequest('CONNECT', url);
}

/**
 * Creates a promise by passing url parameter to httpRequest function
 * OPTIONS gets a response from destination server on allowed HTTP request functions on provided route
 * @param {*} url String representing a url to a route on server
 * @returns the returned promise created by AJAX with given parameters from httpRequest function
 */
function opt(url) {
        return httpRequest('OPTIONS', url);
}

/**
 * Creates a promise by passing url parameter to httpRequest function
 * TRACE performs a message loop-back test along the path to the target resource, providing a useful debugging mechanism.
 * @param {*} url String representing a url to a route on server
 * @returns the returned promise created by AJAX with given parameters from httpRequest function
 */
function trace(url) {
        return httpRequest('TRACE', url);
}

/**
 * Creates a promise by passing url parameter to httpRequest function
 * PATCH request method applies partial modifications to a resource, response could possible have a body but is not required
 * @param {*} url String representing a url to a route on server
 * @param {*} data Payload to be passed to server on PATCH request
 * @returns the returned promise created by AJAX with given parameters from httpRequest function
 */
function patch(url, data) {
        return httpRequest('PATCH', url, data);
}

//adds all HTTP request functions to http object to be called in other js files
const slay = { get, head, post, put, del, con, trace, patch, opt };
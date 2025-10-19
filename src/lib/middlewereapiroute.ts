/**
 * routes that doesnot need authentication
 * @type {string[]}
 */

export const publicRoutes = ["/"];

/**
 * routes that is going to use for authentication
 * @type  {string[]}
 */

export const authenticationRoutes = ["/signin", "/signup"];

/**
 * api prefix , routes with this prefix of auth are going to open
 * @type {string}
 */

export const authapiPrefix = "/api/auth";

export const DEFAULT_REDIRECT_URL = "/dashboard";

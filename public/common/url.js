define('URL', function() {

	/**
	 * Return default port for `protocol`.
	 *
	 * @param  {String} protocol
	 * @return {String}
	 * @api private
	 */
	function port(protocol) {
		switch (protocol) {
			case 'http:':
				return 80;
			case 'https:':
				return 443;
			default:
				return location.port;
		}
	}

	function parse(url) {
		var a = document.createElement("a");
		a.href = url;
		var query = a.search.slice(1);
		var queryArr = [];
		if(!!query) {
			queryArr = query.split("&");
		}
		var queryObj = {};
		for(var i = 0; i < queryArr.length; i++) {
			queryObj[queryArr[i].split("=")[0]] = queryArr[i].split("=")[1];
		}
		
		return {
			href : a.href,
			host : a.host || location.host,
			port : ('0' === a.port || '' === a.port) ? port(a.protocol) : a.port,
			hash : a.hash,
			hostname : a.hostname || location.hostname,
			pathname : a.pathname.charAt(0) != '/' ? '/' + a.pathname : a.pathname,
			protocol : !a.protocol || ':' == a.protocol ? location.protocol : a.protocol,
			search : a.search,
			query : query,
			queryObj : queryObj
		};
	}

	/**
	 * Check if `url` is absolute.
	 *
	 * @param {String} url
	 * @return {Boolean}
	 * @api public
	 */
	function isAbsolute(url) {
		return 0 == url.indexOf('//') || !!~url.indexOf('://');
	}

	/**
	 * Check if `url` is relative.
	 *
	 * @param {String} url
	 * @return {Boolean}
	 * @api public
	 */
	function isRelative(url) {
		return !isAbsolute(url);
	}

	/**
	 * Check if `url` is cross domain.
	 *
	 * @param {String} url
	 * @return {Boolean}
	 * @api public
	 */
	function isCrossDomain(url) {
		url = parse(url);
		var location = parse(window.location.href);
		return url.hostname !== location.hostname || url.port !== location.port || url.protocol !== location.protocol;
	}

	return {
		parse : parse,
		isAbsolute : isAbsolute,
		isRelative : isRelative,
		isCrossDomain : isCrossDomain
	};

});

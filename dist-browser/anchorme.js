(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.anchorme = factory());
}(this, (function () { 'use strict';

function unwrapExports (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var util = createCommonjsModule(function (module, exports) {
"use strict";
exports.__esModule = true;
/**
 *
 * Options defaulting function
 *
**/
function defaultOptions(options) {
    if (!options) {
        options = {
            attributes: [],
            ips: true,
            emails: true,
            urls: true,
            files: true,
            truncate: Infinity,
            defaultProtocol: "http://",
            list: false
        };
    }
    if (typeof options.attributes !== "object")
        { options.attributes = []; }
    if (typeof options.ips !== "boolean")
        { options.ips = true; }
    if (typeof options.emails !== "boolean")
        { options.emails = true; }
    if (typeof options.urls !== "boolean")
        { options.urls = true; }
    if (typeof options.files !== "boolean")
        { options.files = true; }
    if (typeof options.list !== "boolean")
        { options.list = false; }
    if (typeof options.defaultProtocol !== "string" && typeof options.defaultProtocol !== "function")
        { options.defaultProtocol = "http://"; }
    if (typeof options.truncate !== "number" && (typeof options.truncate !== "object" || options.truncate === null))
        { options.truncate = Infinity; }
    return options;
}
exports.defaultOptions = defaultOptions;
/**
 *
 * Returns whether passed string
 * can be a valid port number or not
 *
**/
function isPort(value) {
    if (isNaN(Number(value)))
        { return false; }
    if ((Number(value)) > 65535)
        { return false; }
    else
        { return true; }
}
exports.isPort = isPort;
});

var lists = createCommonjsModule(function (module, exports) {
"use strict";
exports.__esModule = true;
exports.tlds = [];
exports.tlds.push("local"); //FB: for dev box
exports.tlds.push("com", "org", "net", "int", "edu", "gov", "mil", "arpa"); //original tlds
exports.tlds.push("uk", "io", "cc", "co", "ac", "ad", "ae", "af", "ag", "ai", "al", "am", "ao", "aq", "ar", "as", "at", "au", "aw", "ax", "az", "ba", "bb", "bd", "be", "bf", "bg", "bh", "bi", "bj", "bm", "bn", "bo", "br", "bs", "bt", "bv", "bw", "by", "bz", "ca", "cd", "cf", "cg", "ch", "ci", "ck", "cl", "cm", "cn", "cr", "cu", "cv", "cw", "cx", "cy", "cz", "de", "dj", "dk", "dm", "do", "dz", "ec", "ee", "eg", "er", "es", "et", "eu", "fi", "fj", "fk", "fm", "fo", "fr", "ga", "gb", "gd", "ge", "gf", "gg", "gh", "gi", "gl", "gm", "gn", "gp", "gq", "gr", "gs", "gt", "gu", "gw", "gy", "hk", "hm", "hn", "hr", "ht", "hu", "id", "ie", "il", "im", "in", "iq", "ir", "is", "it", "je", "jm", "jo", "jp", "ke", "kg", "kh", "ki", "km", "kn", "kp", "kr", "kw", "ky", "kz", "la", "lb", "lc", "li", "lk", "lr", "ls", "lt", "lu", "lv", "ly", "ma", "mc", "md", "me", "mg", "mh", "mk", "ml", "mm", "mn", "mo", "mp", "mq", "mr", "ms", "mt", "mu", "mv", "mw", "mx", "my", "mz", "na", "nc", "ne", "nf", "ng", "ni", "nl", "no", "np", "nr", "nu", "nz", "om", "pa", "pe", "pf", "pg", "ph", "pk", "pl", "pm", "pn", "pr", "ps", "pt", "pw", "py", "qa", "re", "ro", "rs", "ru", "rw", "sa", "sb", "sc", "sd", "se", "sg", "sh", "si", "sj", "sk", "sl", "sm", "sn", "so", "sr", "st", "su", "sv", "sx", "sy", "sz", "tc", "td", "tf", "tg", "th", "tj", "tk", "tl", "tm", "tn", "to", "tr", "tt", "tv", "tw", "tz", "ua", "ug", "us", "uy", "uz", "va", "vc", "ve", "vg", "vi", "vn", "vu", "wf", "ws", "ye", "yt", "za", "zm", "zw"); //country tlds
//removed ICANN-era tlds
exports.htmlAttrs = ["src=", "data=", "href=", "cite=", "formaction=", "icon=", "manifest=", "poster=", "codebase=", "background=", "profile=", "usemap="];
});

var email = createCommonjsModule(function (module, exports) {
"use strict";
exports.__esModule = true;

// pattern that an emails MUST have
var pattern = /^[a-z0-9!#$%&'*+\-/=?^_`{|}~.]+@([a-z0-9%\-]+\.){1,}([a-z0-9\-]+)?$/i;
// patterns that an email can not have
var negativePatterns = [
    /^[!#$%&'*+\-/=?^_`{|}~.]/,
    /[.]{2,}[a-z0-9!#$%&'*+\-/=?^_`{|}~.]+@/i,
    /\.@/
];
function default_1(str) {
    // general pattern recognition
    var match = str.match(pattern);
    if (match === null)
        { return false; }
    // doesn't have a negative pattern
    for (var i = negativePatterns.length - 1; i >= 0; i--) {
        if (negativePatterns[i].test(str))
            { return false; }
    }
    // valid TLD
    var tld = match[2];
    if (!tld)
        { return false; }
    if (lists.tlds.indexOf(tld) === -1)
        { return false; }
    return true;
}
exports["default"] = default_1;
});

var ip = createCommonjsModule(function (module, exports) {
"use strict";
exports.__esModule = true;

// general IP pattern https://regex101.com/r/rzUcJ4/1
var pattern = /^(\d{1,3}\.){3}\d{1,3}(:\d{1,5})?(\/([a-z0-9\-._~:\/\?#\[\]@!$&'\(\)\*\+,;=%]+)?)?$/i;
function default_1(str) {
    if (!pattern.test(str))
        { return false; }
    var IPArray = str.split(".");
    // validate oc1
    var oc1 = Number(IPArray[0]);
    if ((isNaN(oc1)) || oc1 > 255 || oc1 < 0)
        { return false; }
    // validate oc2
    var oc2 = Number(IPArray[1]);
    if ((isNaN(oc2)) || oc2 > 255 || oc2 < 0)
        { return false; }
    // validate oc3
    var oc3 = Number(IPArray[2]);
    if ((isNaN(oc3)) || oc3 > 255 || oc3 < 0)
        { return false; }
    // validate oc4
    var oc4 = Number((IPArray[3].match(/^\d+/) || [])[0]);
    if ((isNaN(oc4)) || oc4 > 255 || oc4 < 0)
        { return false; }
    // validate port
    var port = (IPArray[3].match(/(^\d+)(:)(\d+)/) || [])[3];
    if (port && (!util.isPort(port)))
        { return false; }
    return true;
}
exports["default"] = default_1;
});

var url = createCommonjsModule(function (module, exports) {
"use strict";
exports.__esModule = true;


var pattern = /^(https?:\/\/|ftps?:\/\/)?([a-z0-9%\-]+\.){1,}([a-z0-9\-]+)?(:(\d{1,5}))?(\/([a-z0-9\-._~:\/\?#\[\]@!$&'\(\)\*\+,;=%]+)?)?$/i;
function default_1(str) {
    // general pattern recognition https://regex101.com/r/RgKTA4/2
    var match = str.match(pattern);
    if (match === null)
        { return false; }
    // validate TLD
    if (typeof match[3] !== "string")
        { return false; }
    if (lists.tlds.indexOf(match[3].toLowerCase()) === -1)
        { return false; }
    // validate port
    if (match[5] && (!util.isPort(match[5])))
        { return false; }
    return true;
}
exports["default"] = default_1;
});

var fix = createCommonjsModule(function (module, exports) {
/**
 *
 * @hack
 *
 * This is a dirty hack to fix URLs that have parenthesis and quotation marks in them
 * For example take this paragraph:
 *
 * """"
 * I visited this url: "http://www.wikipedia.com/some_article(with_paranthesis)"
 * and this URL: (http://www.wikipedia.com/some_article(with_paranthesis))
 * """"
 *
 * The quotation marks `'` `"` and parenthesis `(` `)` `[` `]`
 * can be considered to be part of the URL, and as a
 * punctuation marks surrounding the URL.
 * While this hack works for the most part, it's quite dirty and
 * I may replace it with something better in the future.
 *
 *
 * Another fix is removing punctuation marks that may appear at the end of URL
 * Example:
 *
 * """"
 * I've visited google.com, facebook.com, and yahoo.com.
 * """"
 *
 * @todo: replace the following function with something cleaner.
 *
 *
**/
"use strict";
exports.__esModule = true;
function fixSeparators(arr, sep1, sep2) {
    arr.forEach(function (bit, i) {
        if ((bit.indexOf(".") > -1) &&
            (!(arr[i - 1] === sep1 && arr[i + 1] === sep2)) &&
            (arr[i + 1] === sep1 || arr[i + 1] === sep2) // the one after it, is either sep1 or sep2
        ) {
            arr[i] = arr[i] + arr[i + 1];
            if (typeof arr[i + 2] === "string")
                { arr[i] = arr[i] + arr[i + 2]; }
            if (typeof arr[i + 3] === "string")
                { arr[i] = arr[i] + arr[i + 3]; }
            if (typeof arr[i + 4] === "string")
                { arr[i] = arr[i] + arr[i + 4]; }
            arr.splice(i + 1, 4);
            fixSeparators(arr, sep1, sep2);
        }
    });
    return arr;
}
exports.fixSeparators = fixSeparators;
function default_1(arr) {
    arr = fixSeparators(arr, "(", ")");
    arr = fixSeparators(arr, "[", "]");
    arr = fixSeparators(arr, "\"", "\"");
    arr = fixSeparators(arr, "'", "'");
    return arr;
}
exports["default"] = default_1;
});

var separate_1 = createCommonjsModule(function (module, exports) {
"use strict";
exports.__esModule = true;

/**
 *
 * Split the string with word separators
 * such as punctuation marks and spaces
 *
**/
function separate(input) {
    var splitted = input
        .replace(/([\s\(\)\[\]<>"'])/g, "\0$1\0")
        .replace(/([?;:,.!]+)(?=(\0|$|\s))/g, "\0$1\0")
        .split("\0");
    var fixed = fix["default"](splitted);
    return fixed;
}
exports.separate = separate;
/**
 *
 * Join the resulting array into a string
 *
**/
function deSeparate(input) {
    return input.join("");
}
exports.deSeparate = deSeparate;
});

var hasprotocol = createCommonjsModule(function (module, exports) {
"use strict";
exports.__esModule = true;
function default_1(str) {
    str = str.toLowerCase();
    if (str.indexOf("http://") === 0)
        { return "http://"; }
    else if (str.indexOf("https://") === 0)
        { return "https://"; }
    else if (str.indexOf("ftp://") === 0)
        { return "ftp://"; }
    else if (str.indexOf("ftps://") === 0)
        { return "ftps://"; }
    else if (str.indexOf("file:///") === 0)
        { return "file:///"; }
    else if (str.indexOf("mailto:") === 0)
        { return "mailto:"; }
    else
        { return false; }
}
exports["default"] = default_1;
});

var identify = createCommonjsModule(function (module, exports) {
"use strict";
exports.__esModule = true;





function default_1(inputArr, options) {
    return inputArr.map(function (fragment, index) {
        var encoded = encodeURI(fragment);
        // quick validations
        // 1
        if (encoded.indexOf(".") < 1 && (!hasprotocol["default"](encoded)))
            { return fragment; }
        var urlObj = null;
        var protocol = hasprotocol["default"](encoded) || "";
        // remove the protocol before proceeding to any other test
        if (protocol)
            { encoded = encoded.substr(protocol.length); }
        // test 1: it's a file
        if (options.files && protocol === "file:///" && encoded.split(/\/|\\/).length - 1) {
            urlObj = {
                reason: "file",
                protocol: protocol,
                raw: fragment,
                encoded: encoded
            };
        }
        // test 2: it's a URL
        if ((!urlObj) && options.urls && url["default"](encoded)) {
            urlObj = {
                reason: "url",
                protocol: protocol ? protocol : typeof options.defaultProtocol === "function" ? options.defaultProtocol(fragment) : options.defaultProtocol,
                raw: fragment,
                encoded: encoded
            };
        }
        // test 3: it's an email
        if ((!urlObj) && options.emails && email["default"](encoded)) {
            urlObj = {
                reason: "email",
                protocol: "mailto:",
                raw: fragment,
                encoded: encoded
            };
        }
        // test 4: it's an IP
        if ((!urlObj) && options.ips && ip["default"](encoded)) {
            urlObj = {
                reason: "ip",
                protocol: protocol ? protocol : typeof options.defaultProtocol === "function" ? options.defaultProtocol(fragment) : options.defaultProtocol,
                raw: fragment,
                encoded: encoded
            };
        }
        if (!urlObj)
            { return fragment; }
        else {
            if ((inputArr[index - 1] === "'" || inputArr[index - 1] === '"') && ~lists.htmlAttrs.indexOf(inputArr[index - 2]))
                { return fragment; }
            return urlObj;
        }
    });
}
exports["default"] = default_1;
});

var transform = createCommonjsModule(function (module, exports) {
"use strict";
exports.__esModule = true;


var separate_2 = separate_1;
function default_1(str, options) {
    var arr = separate_2.separate(str);
    var identified = identify["default"](arr, options);
    // custom filtering-out function
    if (options.exclude) {
        for (var index = 0; index < identified.length; index++) {
            var element = identified[index];
            if (typeof element === "object" && options.exclude(element))
                { identified[index] = element.raw; }
        }
    }
    // return the current list (with words being filtered out)
    if (options.list) {
        var listed = [];
        for (var i = 0; i < identified.length; i++) {
            var fragment = identified[i];
            if (typeof fragment !== "string")
                { listed.push(fragment); }
        }
        return listed;
    }
    // transform objects to HTML tags
    identified = identified.map(function (fragment) {
        if (typeof fragment === "string")
            { return fragment; }
        return url2tag(fragment, options);
    });
    // join and return
    return separate_1.deSeparate(identified);
}
exports["default"] = default_1;
function url2tag(fragment, options) {
    var href = fragment.protocol + fragment.encoded;
    var original = fragment.raw;
    if (typeof options.truncate === "number") {
        if (original.length > options.truncate)
            { original = original.substring(0, options.truncate) + "..."; }
    }
    if (typeof options.truncate === "object") {
        if (original.length > (options.truncate[0] + options.truncate[1]))
            { original = original.substr(0, options.truncate[0]) + "..." + original.substr(original.length - options.truncate[1]); }
    }
    if (options.attributes === undefined)
        { options.attributes = []; }
    return "<a href=\"" + href + "\" " + options.attributes.map(function (attribute) {
        if (typeof attribute === 'function') {
            var name = (attribute(fragment) || {}).name;
            var value = (attribute(fragment) || {}).value;
            if (name && !value)
                { return " name "; }
            if (name && value)
                { return " " + name + "=\"" + value + "\" "; }
        }
        else
            { return " " + attribute.name + "=\"" + attribute.value + "\" "; }
    }).join("") + ">" + original + "</a>";
}
});

var index = createCommonjsModule(function (module, exports) {
"use strict";
exports.__esModule = true;






var anchorme = function (str, options) {
    options = util.defaultOptions(options);
    var result = transform["default"](str, options);
    return result;
};
// exposing few functions for extra uses
anchorme.validate = {
    ip: ip["default"],
    url: function (input) {
        // simple wrapper that does what "identify.ts" does initially
        // remove the protocal
        var protocol = hasprotocol["default"](input) || "";
        input = input.substr(protocol.length);
        input = encodeURI(input);
        return url["default"](input);
    },
    email: email["default"]
};
exports["default"] = anchorme;
});

var index$1 = unwrapExports(index);

return index$1;

})));

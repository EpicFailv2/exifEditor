// import { PHOTOS_SECTIONS, PHOTO_ERR_CONV, PHOTO_ERR_EXT, PHOTO_ERR_SIZE } from "./constants";

export default { minX, maxX, minY, maxY, isIOS };
export function minX(imageData) {
  let w = imageData.width,
    h = imageData.height;
  for (let x = 0; x < w; x++) for (let y = 0; y < h; y++) if (imageData.data[(y * w + x) * 4 + 3] > 0) return x;
}
export function maxX(imageData) {
  let w = imageData.width,
    h = imageData.height;
  for (let x = w; x >= 0; x--) for (let y = 0; y < h; y++) if (imageData.data[(y * w + x) * 4 + 3] > 0) return x;
}
export function minY(imageData) {
  let w = imageData.width,
    h = imageData.height;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (imageData.data[(y * w + x) * 4 + 3] > 0) return y;
}
export function maxY(imageData) {
  let w = imageData.width,
    h = imageData.height;
  for (let y = h; y >= 0; y--) for (let x = 0; x < w; x++) if (imageData.data[(y * w + x) * 4 + 3] > 0) return y;
}
export function isIOS() {
  let userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
}

/**
 * Copies object values to another making destination object structure as source
 * Does not remove unique dest keys.
 * Cant handle Arrays!
 * @param {Object} srcObj object to use values from
 * @param {Object} destObj object to set values of
 */
export function mapObjectsAsSrc(srcObj, destObj) {
  for (let key in srcObj) {
    if (key in srcObj) {
      if (typeof srcObj[key] === "object") {
        if (typeof destObj[key] !== "object") destObj[key] = {};
        mapObjectsAsSrc(srcObj[key], destObj[key]);
      } else destObj[key] = srcObj[key];
    }
  }
  return destObj;
}

/**
 * Copies object values to another maintaining destination object structure
 * Does not override object with primitives.
 * @param {Object} srcObj object to use values from
 * @param {Object} destObj object to set values of
 * @returns {Object} mapped destObj
 */
export function mapObjectsAsDest(srcObj, destObj) {
  for (let key in destObj) {
    if (Object.prototype.hasOwnProperty.call(destObj, key) && Object.prototype.hasOwnProperty.call(srcObj, key)) {
      // console.log(`from ${key}=${srcObj[key]}(${typeof srcObj[key]}) to ${key}=${destObj[key]}(${typeof destObj[key]})`);
      if (Array.isArray(destObj[key]) && Array.isArray(srcObj[key])) {
        destObj[key].length = 0;
        srcObj[key].forEach(val => destObj[key].push(val));
      } else if ((typeof destObj[key] === "object" || destObj[key] === null) && srcObj[key] && typeof srcObj[key] === "object")
        mapObjectsAsDest(srcObj[key], destObj[key]);
      else destObj[key] = srcObj[key];
    }
  }
  return destObj;
}

/**
 * Copies object values to another maintaining destination object structure. Shallow version.
 * Does not override object with primitives.
 * @param {Object} srcObj object to use values from
 * @param {Object} destObj object to set values of
 * @returns {Object} mapped destObj
 */
export function mapObjectsAsDestShallow(srcObj, destObj) {
  for (let key in destObj) {
    if (Object.prototype.hasOwnProperty.call(destObj, key) && Object.prototype.hasOwnProperty.call(srcObj, key)) {
      if (destObj[key] === null || typeof destObj[key] !== "object" || Array.isArray(destObj[key]))
        destObj[key] = srcObj[key];
    }
  }
  return destObj;
}

/**
 * Nulls all primitives, removes all from arrays, keeps object structure
 * WARNING: does not work for $store.state objects?
 * @param {Object} srcObj Object to clear
 */
export function clearObject(srcObj) {
  if (typeof srcObj !== 'object') { console.warn('clearObject accepts only objects!'); return; }
  for (let key in srcObj) {
    if (Object.prototype.hasOwnProperty.call(srcObj, key)) {
      if (!srcObj[key]) { continue; }
      else if (typeof srcObj[key] === "object") { clearObject(srcObj[key]); }
      else if (Array.isArray(srcObj[key])) { srcObj[key].length = 0; }
      else { srcObj[key] = null; }
    }
  }
}

/**
 * Useful to make ids out of objects and such
 * @param {String/Any} str string to hash
 * @returns hash of string
 */
export function hash(str) {
  if (typeof str !== 'string') str = JSON.stringify(str);
  var hash = 0;
  if (str.length == 0) return hash;
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
}


/**
 * Helper for easy vue component property mutation
 * @param {String} propname name of property in component, binds to "value" if not provided
 * @returns {Object} required functions for "computed" to operate on
 * @
 */
export function computeProp(propname) {
  if (propname)
    return {
      get() {
        return this[propname];
      },
      set(newVal) {
        this.$emit(propname, newVal); // this is nonsense; parent would need to listen for the event with prop name
        return newVal;
      }
    };
  else
    return {
      get() {
        return this.value;
      },
      set(newVal) {
        this.$emit("input", newVal);
      }
    };
}

/**
 * Helper to insert stuff into string
 * @param {String} src source string to insert text into
 * @param {String} input text to insert
 * @param {Number} idx index of insertion location
 * @returns modified string
 */
export function insertString(src, input, idx) {
  return [src.slice(0, idx), input, src.slice(idx)].join('');
}

/**
 * Just centralized state-connection update
 * @param {Array} disclaimers disclaimers array from EID.vue
 */
export function updateStateWithDisclaimers(disclaimers) {
  let wsConnInit = localStorage.getItem("state-connection");
  if (wsConnInit) {
    wsConnInit = JSON.parse(wsConnInit);
    wsConnInit.disclaimers = disclaimers;
    localStorage.setItem("state-connection", JSON.stringify(wsConnInit));
  }
}

/**
 * Random integer generator
 * @param {number} max upper limit for integer
 * @returns random integer
 */
export function rInt(max = 1e10) {
  return Math.floor(Math.random() * max);
}

/**
 * Random ID generator
 * @param {String} pre static text before number
 * @param {number} max upper limit for integer
 * @returns random integer
 */
export function rId(pre = "id", max = 1e10, min = 0) {
  return pre + (Math.floor(Math.random() * max) + min);
}

/**
 * Add leading zeroes to a number (if needed) and force integer length
 * @param {String|Number} val actual value
 * @param {Number} digits how long should the number be
 * @returns {String} number string with leazing zeroes if any
 */
export function addLeadingZeroes(val, digits) {
  return (new Array(digits).join("0") + val).slice(digits * -1);
}

/**
 * Ripped from ScrollPicker NPM package and used in its rewrite
 */
export function debounce(handle, delay) {
  let timeout = null;
  return function () {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    const self = this;
    const args = arguments;
    timeout = setTimeout(() => handle.apply(self, args), delay);
  };
}

// /**
//  * Cleans up fotos from state that are not present in DMZ
//  * @param {Object} state handle to this.$store.state
//  * @param {Array} currentPhotos response from currentPhotos() DMZ call
//  */
// export function clearNonDmzPhotos(state, currentPhotos) {
//   for (let s = 0; s < PHOTOS_SECTIONS.length; s++) {
//     for (let i = 0; i < PHOTOS_SECTIONS[s].max; i++) {
//       // if no dataURL then no subsequent image should have dataURL - so skip:
//       if (!state.imagesA[s][i].dataURL && !state.imagesB[s][i].dataURL) break;

//       // if exists in JS memory and not in DMZ then clear data:
//       if (!!state.imagesA[s][i].dataURL && !currentPhotos.filter(im => im.setIndex === s && im.imageIndex === i && im.userA).length) {
//         state.imagesA[s][i].dataURL = null;
//         state.imagesA[s][i].inDMZ = false;
//       }
//       if (!!state.imagesB[s][i].dataURL && !currentPhotos.filter(im => im.setIndex === s && im.imageIndex === i && !im.userA).length) {
//         state.imagesB[s][i].dataURL = null;
//         state.imagesB[s][i].inDMZ = false;
//       }
//     }
//   }
// }

/**
 * Makes first letter in string into uppercase
 * @param {String} string string to process
 * @returns processed string
 */
export function capitalizeFirst(string) {
  if (!string || typeof string !== "string") return "";
  if (string.length < 2) return string.toLocaleUpperCase();
  return string.charAt(0).toLocaleUpperCase() + string.slice(1);
}

/**
 * First letter to uppercase and the rest to lowercase
 * @param {String} param0 string to caitalize first letter of
 * @param {*} locale optional conversion locale thing
 * @returns transformed string
 */
export const capitalizeFirstLetter = ([first, ...rest], locale = navigator.language) => (first === undefined ? "" : first.toLocaleUpperCase(locale) + rest.join("").toLocaleLowerCase());
/**
 * Capitalizes first letters of words in string.
 * @param {String} str String to be modified
 * @param {Boolean} lower Whether all other letters should be lowercased
 * @return {String}
 */
export const capitalizeFirstLetterOfEveryWord = (str, lower = false) => (lower ? str.toLocaleLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toLocaleUpperCase());


/**
 * Cut parameter from address
 * @param {String} paramName query parameter name in address
 * @returns value of requested parameter
 */
export function cutFromQuery(paramName) {
  let query = Object.assign({}, window.vue.$route.query);
  let val = query[paramName];
  delete query[paramName];
  window.vue.$router.replace({ query });
  return val;
}

/**
 * I dislike how try catch looks, and ofter dont need to catch anything, so this is a oneline helper
 * @param {Function} execFunc function to execute
 * @param {Function} catchFunc (Optional) function to execute when error is cought
 * @returns result from provided function/functions
 */
export function inlineTry(execFunc, catchFunc) {
  try {
    return execFunc();
  } catch (e) {
    if (catchFunc) return catchFunc(e);
  }
}

/**
 * Scrolls to input with an error
 * Credit: Almantas Moliusis - for the concept (near nothing left of the original...)
 * @param {HTMLElement} scope (optional) DOM element to search in; full document when not provided
 * @param {Array} queries (optional) query for any additional HTML elements
 */
export function scrollToError(scope, queries = []) {
  setTimeout(() => {
    let highest, top;
    [".v-messages.error--text", ...queries].forEach(query => {
      Array.prototype.forEach.call((scope || document).querySelectorAll(query), (el) => {
        if (!top || top > el.getBoundingClientRect().top) {
          top = el.getBoundingClientRect().top;
          highest = el;
        }
      });
    });
    if (highest) scrollToElement(highest);
  });
}
export function scrollToElement(el, align) { if (el) el.scrollIntoView({ behavior: "smooth", block: align || "center" }); }
export function scrollToTop(el) { (el || window).scrollTo(0, 0); }
export function scrollToNearTop(el) { if (el) window.scrollBy({ top: el.getBoundingClientRect().y - 82, left: 0, behavior: "smooth" }); }
export function scrollTo(el, x) { if (el) el.scrollTo(0, x); }

/**
 * Spam scroll to element (needed due to keyboard appearance animation on mobiles, and no event notifying of it...)
 * @param {HTMLElement} input input element to scroll into view
 */
export function scrollToInput(input) {
  setTimeout(() => scrollToNearTop(input));
  setTimeout(() => scrollToNearTop(input), 128);
  setTimeout(() => scrollToNearTop(input), 256);
  setTimeout(() => scrollToNearTop(input), 500);
}

/**
 * Validation helper - sometimes data changes, and form does not revalidate, still lies about it being invalid - this should be the workaround
 * P.S. placed here with the idea that it might not be centralized, but for now it is... (2022-09-15)
 * @param {HTMLElement} scope parent element to search for inputs in
 */
export function canForceValidate(scope) {
  let inpts = scope.getElementsByTagName("input");
  return inpts.length && Array.from(inpts).every(inpt => {
    return !!inpt.value;
  });
}

/**
 * JSF*ck encoder i found in https://youtu.be/sRWE5tnaxlI
 * Just for fun
 * @param {String} codeString code to encode
 */
export function JSF(codeString) {
  const zero = '+[]';
  const one = '+!![]';
  const number = n => {
    if (n === 0) return zero;
    return Array.from({ length: n }, () => one).join(' + ');
  };
  const map = {};
  const fromString = s => s.split('').map(x => {
    if (!(x in map)) {
      const charCode = x.charCodeAt(0);
      return `([]+[])[${fromString('constructor')}][${fromString('fromCharCode')}](${number(charCode)})`;
    }
    return map[x];
  }).join('+');
  map.a = `(+{}+[])[${number(1)}]`;
  map.b = `({}+[])[${number(2)}]`;
  map.o = `({}+[])[${number(1)}]`;
  map.e = `({}+[])[${number(4)}]`;
  map.c = `({}+[])[${number(5)}]`;
  map.t = `({}+[])[${number(6)}]`;
  map[' '] = `({}+[])[${number(7)}]`;
  map.f = `(![]+[])[${number(0)}]`;
  map.s = `(![]+[])[${number(3)}]`;
  map.r = `(!![]+[])[${number(1)}]`;
  map.u = `(!![]+[])[${number(2)}]`;
  map.i = `((+!![]/+[])+[])[${number(3)}]`;
  map.n = `((+!![]/+[])+[])[${number(4)}]`;
  map.S = `([]+([]+[])[${fromString('constructor')}])[${number(9)}]`;
  map.g = `([]+([]+[])[${fromString('constructor')}])[${number(14)}]`;
  map.p = `([]+(/-/)[${fromString('constructor')}])[${number(14)}]`;
  map['\\'] = `(/\\\\/+[])[${number(1)}]`;
  map.d = `(${number(13)})[${fromString('toString')}](${number(14)})`;
  map.h = `(${number(17)})[${fromString('toString')}](${number(18)})`;
  map.m = `(${number(22)})[${fromString('toString')}](${number(23)})`;
  map.C = `((()=>{})[${fromString('constructor')}](${fromString('return escape')})()(${map['\\']}))[${number(2)}]`;
  return `(()=>{})[${fromString('constructor')}](${fromString(codeString)})()`;
}

/**
 * There is no universaly supported way to remove event listeners from elements, so this is a helper that recreates element, thus removing its event listeners.
 * @param {HTMLNode} el element to remove event listeners from
 * @param {Boolean} withChildren should child elements have events removed too?
 */
export function removeAllEvents(el, withChildren) {
  if (withChildren) el.parentNode.replaceChild(el.cloneNode(true), el);
  else {
    var newEl = el.cloneNode(false);
    while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
    el.parentNode.replaceChild(newEl, el);
  }
}

/**
 * Used in few places so centralized user data check
 * @param {Object} user authenticated user object
 * @returns true/false indicating if it has ok data
 */
export function okUser(user) {
  return !!user && !!user.firstname && !!user.lastname && !!user.birthDate;
}

/**
 * atob is not supported by Node.js so this is a function that does what it does...
 * @param {String} base64 base64 encoded string
 * @returns String representation of the encoded value
 */
export const atob = (base64) => {
  return Buffer.from(base64, 'base64').toString('binary');
};
/**
 * btoa is not supported by Node.js so this is a function that does what it does...
 * @param {String} string string to encode
 * @returns base64 encoded string
 */
export const btoa = (string) => {
  return Buffer.from(string).toString('base64');
};

/**
 * Helper function for modifying address bar query part without page reload
 * @param {Function} modifier function that modifies URLSearchParams provided by this
 */
export function modifyQuery(modifier) {
  if (!modifier || typeof modifier !== "function") return;
  let searchParams = new URLSearchParams(window.location.search);
  modifier(searchParams);
  if (!searchParams.toString().length && !window.location.search.length) return;
  let newPath = window.location.pathname + "?" + searchParams.toString();
  let oldPath = window.location.pathname + window.location.search;
  if (newPath !== oldPath) window.vue.$router.replace(window.location.pathname + "?" + searchParams.toString());
}


/**
 * Returns true if arr1[] and arr2[]
 * contain same elements.
 */
export function areArrayEqual(arr1, arr2, key) {
  // array are not equal
  if (arr1.length != arr2.length)
    return false;

  arr1.sort((a, b) => a[key] - b[key]);
  arr2.sort(((a, b) => a[key] - b[key]));

  for (let i = 0; i < arr1.length; i++)
    if (arr1[i][key] != arr2[i][key]) {
      return false;
    }
  // If all elements were same.
  return true;
}

// ====================================================== IMAGE PROCESSING =========================================================================================================
export function handleRotation(imageData) {
  // imageData - ImageData object to resolve into landscape ImageData
  let w = imageData.width;
  let h = imageData.height;
  return new Promise(resolve => {
    if (w > h) resolve(imageData);
    else {
      let hh = h / 2;
      let tc = document.createElement("canvas");
      let tcctx = tc.getContext("2d");
      tc.width = w;
      tc.height = h;
      tcctx.putImageData(imageData, 0, 0);
      let imgData = tc.toDataURL("image/png");
      tcctx.clearRect(0, 0, tc.width, tc.height);
      tc.width = h;
      tc.height = w;

      let img = new Image();
      img.onload = function () {
        tcctx.translate(hh, hh);
        tcctx.rotate(Math.PI / 2);
        tcctx.translate(-hh, -hh);
        tcctx.drawImage(img, 0, 0);
        tcctx.setTransform(1, 0, 0, 1, 0, 0);
        resolve(tcctx.getImageData(0, 0, h, w));
        img.onload = null;
      };
      img.src = imgData + "";
    }
  });
}

/**
 * Image rotation method from https://gist.github.com/Zyndoras/6897abdf53adbedf02564808aaab94db converted for use with Promises
 * @param {String} srcBase64 base64 encoded image
 * @param {Number} degrees rotation degrees
 */
var rotCanvas;
var rotCtx;
export function rotateBase64Image(srcBase64, degrees = 90) {
  return new Promise(resolve => {
    if (!degrees) resolve(srcBase64);
    else {
      if (!rotCanvas) { rotCanvas = document.createElement('canvas'); rotCtx = rotCanvas.getContext('2d'); }
      const image = new Image();
      image.onload = function () {
        rotCanvas.width = degrees % 180 === 0 ? image.width : image.height;
        rotCanvas.height = degrees % 180 === 0 ? image.height : image.width;

        rotCtx.translate(rotCanvas.width / 2, rotCanvas.height / 2);
        rotCtx.rotate(degrees * Math.PI / 180);
        rotCtx.drawImage(image, image.width / -2, image.height / -2);

        resolve(rotCanvas.toDataURL());
      };
      image.src = srcBase64;
    }
  });
}

/**
 * Trim image whitespace. Adjusted from: https://github.com/orangeable/javascript-crop-image-whitespace/blob/master/index.html
 * @param {String} srcBase64 base64 encoded image with and the JS mimetype headers
 * @returns promise of base64 encoded image with all the JS mimetype headers with "trimmed" whitespace around
 */
var trimCanvas;
var trimCtx;
export function trimImageWhitespace(srcBase64) {
  if (!trimCanvas) { trimCanvas = document.createElement('canvas'); trimCtx = trimCanvas.getContext('2d'); }
  return new Promise(resolve => {
    let image = new Image();
    image.onload = function () {
      trimCanvas.width = this.width;
      trimCanvas.height = this.height;
      trimCtx.drawImage(this, 0, 0, image.width, image.height);
      let data = trimCtx.getImageData(0, 0, image.width, image.height);
      let top = scanY(data, true) - 10;
      let bottom = scanY(data, false) + 10;
      let left = scanX(data, true) - 10;
      let right = scanX(data, false) + 10;
      let new_width = right - left;
      let new_height = bottom - top;
      trimCanvas.width = new_width;
      trimCanvas.height = new_height;
      trimCtx.drawImage(image, left, top, new_width, new_height, 0, 0, new_width, new_height);
      resolve(trimCanvas.toDataURL());
    };
    image.src = srcBase64;
  });
}
function scanY(data, top) {
  var offset = (top) ? 5 : -5;
  for (var y = ((top) ? 0 : data.height - 1); ((top) ? (y < data.height) : (y > -1)); y += offset)
    for (var x = 0; x < data.width; x++)
      if (!isEmpty(getRGBA(data, x, y)))
        return y;
  return null;
}
function scanX(data, left) {
  var offset = (left) ? 5 : -5;
  for (var x = ((left) ? 0 : data.width - 1); ((left) ? (x < data.width) : (x > -1)); x += offset)
    for (var y = 0; y < data.height; y++)
      if (!isEmpty(getRGBA(data, x, y)))
        return x;
  return null;
}
function getRGBA(data, x, y) {
  return {
    red: data.data[((data.width * y) + x) * 4 + 0],
    green: data.data[((data.width * y) + x) * 4 + 1],
    blue: data.data[((data.width * y) + x) * 4 + 2],
    alpha: data.data[((data.width * y) + x) * 4 + 3],
  };
}
function isEmpty(rgb) {
  return rgb.alpha === 0 || rgb.red == 255 && rgb.green == 255 && rgb.blue == 255;
}
// =================================================================================================================================================================================
// =========== SCHEME TRIGONOMETRY =================================================================================================================================================

export function distanceBetweenPoints(p1, p2) {
  const pow1 = Math.pow(p2[0] - p1[0], 2);
  const pow2 = Math.pow(p2[1] - p1[1], 2);
  return Math.sqrt(pow1 + pow2);
}
export function angleBetweenPoints(p1, p2) {
  return (Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * 180) / Math.PI;
}


export function Point(x = null, y = null) { return { x, y }; }
export function line(p1 = Point(), p2 = Point()) { return { p1, p2 }; }
function onLine(/*line*/ l1, /*Point*/ p) {
  // Check whether p is on the line or not
  return p.x <= Math.max(l1.p1.x, l1.p2.x) && p.x <= Math.min(l1.p1.x, l1.p2.x) && (p.y <= Math.max(l1.p1.y, l1.p2.y) && p.y <= Math.min(l1.p1.y, l1.p2.y));
}
function direction(/*Point*/ a, /*Point*/ b, /*Point*/ c) {
  let val = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
  if (val == 0) return 0; // Colinear
  else if (val < 0) // Anti-clockwise direction
    return 2;
  return 1; // Clockwise direction
}
function isIntersect(/*line*/ l1, /*line*/ l2) {
  // Four direction for two lines and points of other line
  let dir1 = direction(l1.p1, l1.p2, l2.p1);
  let dir2 = direction(l1.p1, l1.p2, l2.p2);
  let dir3 = direction(l2.p1, l2.p2, l1.p1);
  let dir4 = direction(l2.p1, l2.p2, l1.p2);
  if (dir1 != dir2 && dir3 != dir4) return true; // When intersecting
  if (dir1 == 0 && onLine(l1, l2.p1)) return true; // When p2 of line2 are on the line1
  if (dir2 == 0 && onLine(l1, l2.p2)) return true; // When p1 of line2 are on the line1
  if (dir3 == 0 && onLine(l2, l1.p1)) return true; // When p2 of line1 are on the line2
  if (dir4 == 0 && onLine(l2, l1.p2)) return true; // When p1 of line1 are on the line2
  return false;
}
export function checkInside(/*Point array*/ poly, /*Point*/ p) {
  if (!poly || !Array.isArray(poly) || poly.length < 3) return false; // When polygon has less than 3 edge, it is not polygon
  let exline = line(p, Point(9999, p.y)); // Create a point at infinity, y is same as point p
  let count = 0;
  let i = 0;
  do {
    let side = line(poly[i], poly[(i + 1) % poly.length]); // Forming a line from two consecutive points of poly
    if (isIntersect(side, exline)) { // If side intersects exline
      if (direction(side.p1, p, side.p2) == 0) return onLine(side, p);
      count++;
    }
    i = (i + 1) % poly.length;
  } while (i != 0);

  return count & 1; // count is odd == inside
}

const RAD_MULT = Math.PI / 180;
export function coordAtDistAndAngle(coords, distance, angle) {
  return [coords[0] + distance * Math.cos(angle * RAD_MULT), coords[1] + distance * Math.sin(angle * RAD_MULT)];
}

export function diff(c1, c2) {
  return [c2[0] - c1[0], c2[1] - c1[1]];
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}
/**
 * https://stackoverflow.com/questions/29864022/drawing-parts-of-circles-circumference-in-svg
 * @param {Number} x center X
 * @param {Number} y center Y
 * @param {Number} radius
 * @param {Number} startAngle
 * @param {Number} endAngle
 * @returns {String} SVG path string
 */
export function describeArc(x, y, radius, startAngle, endAngle) {
  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);
  var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
  var d = [
    "M", start.x, start.y,
    "A", radius, radius, 0, arcSweep, 0, end.x, end.y,
    // "L", x, y,
    // "L", start.x, start.y
  ].join(" ");
  return d;
}

export function limitB(min, current, max) {
  if (current < min) return -1;
  if (current > max) return 1;
  return 0;
}
export function limitV(min, current, max) {
  if (current < min) return min;
  if (current > max) return max;
  return current;
}


export function repositionKlass(klass, x, y, a, s) {
  if (!klass) return;
  klass.left = x || klass.left;
  klass.top = y || klass.top;
  klass.angle = a || klass.angle;
  klass.scale(s || klass.scaleX);
  klass.setCoords();
}
export function shiftKlassX(klass, dx) {
  if (!klass) return;
  if (dx) {
    klass.left = klass.left + dx;
    klass.setCoords();
  }
}
export function shiftKlassY(klass, dy) {
  if (!klass) return;
  if (dy) {
    klass.top = klass.top + dy;
    klass.setCoords();
  }
}
export function shiftTPX(tp, dx) {
  if (!tp || !tp.group) return;
  if (dx) {
    if (tp.group) { tp.group.left = tp.group.left + dx; tp.prev.gx += dx; tp.group.setCoords(); }
    if (tp.arrow) { tp.arrow.left = tp.arrow.left + dx; tp.prev.ax += dx; tp.arrow.setCoords(); }
    if (tp.trail) { tp.trail.left = tp.trail.left + dx; tp.prev.tx += dx; tp.trail.setCoords(); }
  }
}
export function shiftTPY(tp, dy) {
  if (!tp || !tp.group) return;
  if (dy) {
    if (tp.group) { tp.group.top = tp.group.top + dy; tp.prev.gy += dy; tp.group.setCoords(); }
    if (tp.arrow) { tp.arrow.top = tp.arrow.top + dy; tp.prev.ay += dy; tp.arrow.setCoords(); }
    if (tp.trail) { tp.trail.top = tp.trail.top + dy; tp.prev.ty += dy; tp.trail.setCoords(); }
  }
}
// =================================================================================================================================================================================

/**
 * Read file as base64 string
 * @param {File} newFile file pulled from DOM
 * @returns Promise of base64 representation of the file
 */
export function getBase64String(newFile, clean) {
  let reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onerror = () => {
      reader.abort();
      reject(new DOMException("Problem converting to base64."));
    };
    reader.onload = e => {
      resolve(clean ? e.target.result.replace(/^data:.*;base64,/, "") : e.target.result);
    };
    reader.readAsDataURL(newFile);
  });
}

// /**
//  * Read file as base64 string
//  * @param {File} newFile file pulled from DOM
//  * @returns Promise of base64 representation of the file
//  */
// export function getDataURL(newFile) {
//   let reader = new FileReader();
//   return new Promise((resolve, reject) => {
//     reader.onerror = () => {
//       reader.abort();
//       reject(new DOMException("Problem converting to base64."));
//     };
//     reader.onload = e => {
//       resolve(clean ? e.target.result.replace(/^data:.*;base64,/, "") : e.target.result);
//     };
//     reader.readAsDataURL(newFile);
//   });
// }


// // AB: AI generated this...
// /**
//  * Converts a string with UTF-8 characters into an ASCII-only string.
//  *
//  * @param {string} text - The string to convert.
//  * @returns {string} An ASCII-only version of the input string.
//  */
// export function convertToAscii(text) {
//   // Normalize the string to decompose any UTF-8 characters into their combining forms.
//   const normalized = text.normalize("NFD");
//
//   // Remove any combining diacritical marks.
//   const stripped = normalized.replace(/[\u0300-\u036f]/g, "");
//
//   // Remove any remaining non-ASCII characters.
//   const asciiOnly = stripped.replace(/[^\x00-\x7F]/g, "");
//
//   // Return the resulting ASCII-only string.
//   return asciiOnly;
// }
// // AB: ...so i reformated like i do things an voilia:

/**
 * Converts a string with UTF-8 characters into an ASCII-only string.
 * @param {string} text - The string to convert.
 * @returns {string} An ASCII-only version of the input string.
 */
export function convertToAscii(input) {
  return input.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\0-\x7F]/g, "");
}

/**
 * Simple binary file download helper
 * messageTypes:
 *   0 - PDF su password
 *   2 - PDF be password
 *   69 - images bucket
 *   anything else - docs bucket
 * @param {String} cuid file identifying cuid
 * @param {String} filename name of downloaded file (including extension)
 * @param {Number} messageType check above
 */
export function downloadFile(cuid, filename, messageType = 0) {
  if (!window.backendHost) window.backendHost = window.vue.$store.state.backendHost.startsWith("http") ? window.vue.$store.state.backendHost : window.location.origin + window.vue.$store.state.backendHost
  window.open(window.backendHost + "/getFile?cuid=" + cuid + "&fileName=" + filename + "&type=" + messageType);
}

/**
 * Helper for file download form JS RAM
 * @param {String} dataURI base64 encoded file data
 * @param {String} fileName file name
 */
export function downloadBase64DataURI(dataURI, fileName) {
  // Create a dummy anchor element
  const anchor = document.createElement('a');
  anchor.href = dataURI;
  anchor.download = fileName;

  // Programmatically trigger a click event on the anchor element
  const clickEvent = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
  anchor.dispatchEvent(clickEvent);

  // Cleanup the anchor element
  anchor.remove();
}

/**
 * Add script from some URL, not from withing application.
 * @param {String} url where script should be loaded from
 * @param {Function} callback load success callback function
 * @param {Function} failCallback callback if script could not be loaded
 */
export function loadScript(url, callback = () => { }, failCallback = () => { }) {
  if (!window.manuallyLoadedScripts) window.manuallyLoadedScripts = [];
  if (window.manuallyLoadedScripts.includes(url)) return callback();
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.onload = function () {
    window.manuallyLoadedScripts.push(url);
    callback();
  };
  script.onerror = function (e) {
    failCallback(e);
  };
  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
}

/**
 * Get webpage available screenspace
 * @returns {Object} x and y of the available screenspace
 */
export function viewportXY() {
  return {
    x: [window.outerWidth, window.innerWidth, window.screen.width, window.screen.availWidth].find(x => x > 0),
    y: [window.outerHeight, window.innerHeight, window.screen.height, window.screen.availHeight].find(x => x > 0)
  };
}
export function viewportMinEdge() {
  let v = viewportXY()
  return v.x < v.y ? v.x : v.y;
}
export function clamp(val, max) {
  return val > max ? max : val;
}
export function googleBtnWidth() {
  let maxAvail = viewportMinEdge() - 44 * 2; // 32px is dialog padding, 8px due to google internal paddings
  // let maxAvail = viewportMinEdge() - 32 * 2 + 8 * 2; // 32px is dialog padding, 8px due to google internal paddings
  return clamp(maxAvail, 300);
}

export function okOriginalLocation() {
  return window.vue.$store.state.originalLocation && window.vue.$store.state.originalLocation.longitude && window.vue.$store.state.originalLocation.latitude ? window.vue.$store.state.originalLocation : null;
}
export function okCorrectedLocation() {
  return window.vue.$store.state.correctedLocation && window.vue.$store.state.correctedLocation.longitude && window.vue.$store.state.correctedLocation.latitude ? window.vue.$store.state.correctedLocation : null;
}

/**
 * pull file extension
 * @param {String} filename file name
 * @returns lowercase extension of the file name
 */
export function getExt(filename) {
  return filename.split(".").pop().toLocaleLowerCase();
}

// /**
//  * Centralized handler for photo processing error parsing
//  * @param {Object} err emptyPhotoError() object
//  * @returns array of 3 elements: error text, internal error tracking code, GTM error tracking code
//  */
// export function photoErrorHandler(err) {
//   if (err)
//     switch (err.key) {
//       case PHOTO_ERR_CONV:
//         return ["Nepavyko įkelti nuotraukos. Bandykite įkelti nuotrauką dar kartą.", "imgInputErrConversion", "photoInputError - conversion"];
//       case PHOTO_ERR_EXT:
//         return ["Netinkamas pateiktos nuotraukos plėtinys. Kelkite JPG, PNG arba HEIC nuotraukas.", "imgInputErrExtension", "photoInputError - extension"];
//       case PHOTO_ERR_SIZE:
//         return ["Leidžiama kelti nedidesnes nei 20MB nuotraukas.", "imgInputErrSize", "photoInputError - size"];
//       default:
//         return ["Galima įkelti tik nuotraukas.", "imgInputErrOther", "photoInputError - other"];
//     }
//   return [];
// }

/**
 * Quick JSON based deep copy wrapper for easier readabilty
 * @param {Any} thing any object to deep copy
 * @returns copy of provided object
 */
export function jsonClone(thing) {
  return JSON.parse(JSON.stringify(thing));
}

/**
 * Quick helper for joint name whitespace trimming
 * @param {String|Object} name nullable name String or Object containing 'name' and 'surname' parameters
 * @param {String} surname nullabe surname
 * @returns {String} "formatted" names
 */
export function makeName(name, surname) {
  if (typeof name === 'string' || !name)
    return `${name || ""} ${surname || ""}`.trim();
  return `${name.name || ""} ${name.surname || ""}`.trim();
}

/**
 * Used in few places so centralized logic in here
 * @param {Array} respInsurers insurers returned from rpc.getDrk()
 * @returns {Array} returns input
 */
export function mapResponsibleInsurers(respInsurers) {
  if (respInsurers && respInsurers.length) {
    window.vue.$store.state.responsibleInsurerA = respInsurers[0];
    window.vue.$store.state.responsibleInsurerB = respInsurers[1];
  }
  return respInsurers;
}

/**
 * ISO date puller from Date object
 * @param {Date} date Date to get ISO date from
 * @returns {String} ISO date (YYYY-MM-DD)
 */
export function dateToISODate(date) {
  return date.toISOString().substring(0, 10)
}

/**
 * Check if two arrays have any matching elements
 * @param {Array} a first array
 * @param {Array} b second array
 * @returns matching element in arrays or undefined when no match
 */
export function arraysInclude(a, b) {
  return a.find(x => b.includes(x));
}

/**
 * Simple safe quiet helper to trim shallow strings in object
 * @param {Object} obj object to look for strings in (not deep)
 */
export function trimStrings(obj) {
  inlineTry(() => {
    for (let key in obj)
      if (typeof obj[key] === 'string')
        obj[key] = obj[key].trim();
  });
}

/**
 * Universal thing for making numbers out of strings
 * @param {any} obj something to convert strings into numbers of
 */
export function makeNumberType(obj) {
  if (Array.isArray(obj)) obj.forEach((val, index) => (obj[index] = makeNumberType(val)));
  else if (typeof obj === "object" && obj !== null) Object.keys(obj).forEach(key => (obj[key] = makeNumberType(obj[key])));
  else if (typeof obj === "string") return parseFloat(obj) || obj;
  return obj;
}
/**
 * Common helper functions and uncategorized stuff
 */

/**
 * Helper for easy vue component property mutation
 * @param {String} propname name of property in component, binds to "value" if not provided
 * @returns {Object} required functions for "computed" to operate on
 * @
 */
export function computeProp(propname) {
  if (propname)
    return {
      get() { return this[propname]; },
      set(newVal) {
        // if (withSet) this[propname] = newVal;
        this.$emit(propname, newVal); // this is nonsense (for Objects at least); parent would need to listen for the event with prop name
        return newVal;
      }
    };
  else
    return { // the useful part
      get() { return this.value; },
      set(newVal) { this.$emit("input", newVal); }
    };
}

/**
 * Formats value into currency string
 * @param {*} inputValue any variable representing valid input for parseFloat()
 * @param {Number} decimals how many numbers after decimal point
 * @returns {String} currency string
 */
export function formatCurrency(inputValue, decimals) {
  if (!isNaN(parseFloat(inputValue)) && isFinite(inputValue)) {
    var outputValue = String(parseFloat(inputValue).toFixed(decimals ? decimals : 2)).split(".");
    return `${outputValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ")},${outputValue[1]} €`;
  } else return inputValue;
}

/**
 * Nulls all non object keys and empties arrays
 * @param {Object} obj object to empty
 */
export function emptyObject(obj) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (Array.isArray(obj[key])) obj[key].length = 0;
      else if (typeof obj[key] === "object") emptyObject(obj[key]);
      else obj[key] = null;
    }
  }
}

/**
 * Scans object keys and assigns null to empty strings
 * @param {Object} obj
 */
export function emptyStringToNull(obj) {
  for (let key in obj) if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] === "") obj[key] = null;
  return obj;
}

/**
 * When need to timeout a promise that takes too long (primarily designed to be used with fetch)
 * Browser default timeout is 2 minutes
 * @param {Number} ms timeout
 * @param {Promise} promise promise to timeout
 */
export function timedFetch(ms, promise) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(resolve, reject);
  });
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
}

/**
 * Copies object values to another maintaining destination object structure
 * Does not override object with primitives.
 * @param {Object} srcObj object to use values from
 * @param {Object} destObj object to set values of
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
 * Nulls all non object keys. Infinite depth.
 * @param {Object} srcObj object to clear
 */
export function clearObject(srcObj) {
  for (let key in srcObj) {
    if (key in srcObj) {
      if (typeof srcObj[key] === "object") {
        clearObject(srcObj[key]);
      } else srcObj[key] = null;
    }
  }
}

/**
 * Format incoming BigDecimal for representation
 * @param {String} inputValue incoming number string
 * @param {Number} decimals how many decimal numbers
 * @returns {String} formatted string
 */
export function formatNumber(inputValue, decimals) {
  if (!isNaN(parseFloat(inputValue)) && isFinite(inputValue)) {
    var outputValue = String(parseFloat(inputValue).toFixed(decimals ? decimals : 2)).split(".");
    return `${outputValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ")},${outputValue[1]}`.trim();
    // return "".concat(outputValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ').replace('.', ','), " ").trim();
  } else return inputValue;
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
 * Some helper removing specified object from array
 * @param {Object} element Object/String/Number/etc. to look for in array
 * @param {Array} array array to remove element from
 * @returns {Array} array with potentialy removed element
 */
export function removeElementFromArray(element, array) {
  const index = array.indexOf(element);
  if (index > -1) array.splice(index, 1);
  return array;
}

/**
 * Helper keep component code bloat down a bit
 * @param {String} path relative path starting with / and can include query and stuff
 * @returns {URL} url object with backend
 */
export function makeURL(path) {
  return new URL((process.env.VUE_APP_BACKEND_HOST.startsWith("http") ? "" : window.location.origin) + process.env.VUE_APP_BACKEND_HOST + path);
}

/**
 * Random ID generator
 * @param {String} pre static text before number
 * @param {number} max upper limit for integer
 * @returns random integer
 */
export function rId(pre = "id", max = 1e10) {
  return pre + Math.floor(Math.random() * max);
}
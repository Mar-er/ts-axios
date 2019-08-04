const toString = Object.prototype.toString;

export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]';
}

export function isObject(val: any): val is Object {
	return val !== null && typeof val === 'object';
}

export function isPlainObject(val: any): val is Object {
	return toString.call(val) === '[object Object]';
}

export function isURLSearchParams(val: any): val is URLSearchParams {
	return typeof val !== 'undefined' && val instanceof URLSearchParams;
}

import { isPlainObject } from './util';
import { isDate } from 'util';

function encode(val: string): string {
	return encodeURIComponent(val)
		.replace(/%40/g, '@')
		.replace(/%3A/gi, ':')
		.replace(/%24/g, '$')
		.replace(/%2C/gi, ',')
		.replace(/%20/g, '+')
		.replace(/%5B/gi, '[')
		.replace(/%5D/gi, ']');
}

export function buildURL(
	url: string,
	params?:any, 
): string {
	if (!params) return url;

	let serializedParams

	const parts: string[] = [];

	Object.keys(params).forEach(key => {
		const val = params[key];
		// 过滤掉参数值为null、undefined情况。
		if (val === null || typeof val === 'undefined') return;

		// 将val值统一处理成数组类型以便后续处理，
		// 如果val是数组将key后面添加[]最终组成 foo[]=bar&foo[]=baz 格式
		let values = [];
		if (Array.isArray(val)) {
			values = val;
			key += '[]';
		} else {
			values = [val];
		}

		// 将数组和Date类型的数据单独处理
		/**
		 * foo: ['bar', 'baz'] 处理成 foo[]=bar&foo[]=baz
		 * foo: {
		 *   bar: 'baz'
		 * } 处理成 foo: {"bar":"baz"}
		 */
		values.forEach(val => {
			if (isDate(val)) {
				val = val.toISOString();
			} else if(isPlainObject(val)) {
				val = JSON.stringify(val);
			}
			parts.push(`${encode(key)}=${encode(val)}`)
		})
	})
	
	serializedParams = parts.join('&');
	if (serializedParams) {
		// 接去掉hash之后的内容
		const markIndex = url.indexOf('#')
		if (markIndex !== -1) {
			url = url.slice(0, markIndex)
		}

		// 保留url原始参数，通过判断？来区分原始是否带有参数，
		// 如果带有则在后面添加&否则添加？
		url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
	}

	return url;
}

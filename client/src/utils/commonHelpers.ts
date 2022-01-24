import omit from 'lodash/omit';
import pick from 'lodash/pick';
import transform from 'lodash/transform';
import isObject from 'lodash/isObject';

export const pickWrapper = (object: Record<string, unknown>, keys: string[]): Record<string, unknown> => pick(object, keys);
export const omitWrapper = (object: Record<string, unknown>, keys: string[]): Record<string, unknown> => omit(object, keys);

export const replaceKeysDeep = (obj: Record<string, any>, keysMap: Record<string, string>): Record<string, any> => {
	return transform(obj, (result, value, key) => {
		const currentKey = (keysMap[key] || key) as string;
		result[currentKey] = isObject(value) ? replaceKeysDeep(value as Record<string, any>, keysMap) : value;
	});
};

export const isNotEmptyObject = (obj: Record<string, unknown>): boolean => obj && Object.keys(obj).length > 0;

import omit from 'lodash/omit';
import transform from 'lodash/transform';
import isObject from 'lodash/isObject';
import { Document } from 'mongoose';

export const replaceKeysDeep = (obj: Record<string, any>, keysMap: Record<string, string>): Record<string, any> => {
	return transform(obj, (result, value, key) => {
		const currentKey = (keysMap[key] || key) as string;
		result[currentKey] = isObject(value) ? replaceKeysDeep(value as Record<string, any>, keysMap) : value;
	});
};

export const cleanMongoObject = (obj: Document<any>, keysMap: Record<string, string> = {}): Record<string, unknown> => replaceKeysDeep(omit(obj, ['__v']), { _id: 'id', ...keysMap });

export const generateId = ({ length, isNumeric = true }: { length: number; isNumeric?: boolean }): string => {
	let result = '';
	const characters = isNumeric ? '0123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;

	for (let i = 0; i < length; i += 1) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}

	return result;
};

import omit from 'lodash/omit';
import includes from 'lodash/includes';
import clone from 'lodash/clone';
import keys from 'lodash/keys';

export const renameObjectKeys = (obj: any, key: string, newKey: string): any => {
	if (includes(keys(obj), key)) {
		obj[newKey] = clone(obj[key]);
		delete obj[key];
	}
	return obj;
};

export const cleanMongoObject = <T>(obj: any): T & { id: string } => renameObjectKeys(omit(obj, ['__v']), '_id', 'id');

export const generateId = (length: number, isNumeric = true): string => {
	let result = '';
	const characters = isNumeric ? '0123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i += 1) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

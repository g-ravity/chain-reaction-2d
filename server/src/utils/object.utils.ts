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

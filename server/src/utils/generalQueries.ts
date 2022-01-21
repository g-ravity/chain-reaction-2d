import { Document } from 'mongoose';
import { isNotEmptyObject } from './commonHelpers';

export const saveQuery = async (data: Document<unknown>): Promise<Record<string, unknown>> => {
	const mongoDoc = await data.save();
	return isNotEmptyObject(mongoDoc as unknown as Record<string, unknown>) ? mongoDoc.toObject() : null;
};

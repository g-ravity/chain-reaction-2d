import { TAvatar } from '../components/AvatarMaker';
import { TColor } from './Common';

export interface IPlayer {
	avatar: { [key in TAvatar]: number };
	color: TColor;
	name: string;
}

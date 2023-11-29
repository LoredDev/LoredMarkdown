import type { BuiltinLayouts, DeepReadonly } from './types';

type BannerObject = DeepReadonly<{
	background?: [string, string] | {
		color?: string,
		image?: string,
	} | string,
	icon?: string,
	layout?: {
		rtl: boolean,
		type: BuiltinLayouts,
	} | string,
	repository?: {
		contributors?: boolean,
		issues?: boolean,
		pull_requests?: boolean,
		starts?: boolean,
		url: string,
	} | string,
	subtitle?: string,
	text_color?: {
		icon?: string,
		subtitle?: string,
		title: string,
	} | string,
	title: string,
}>;

declare class Banner {
	public constructor(banner: BannerObject);
	public toString(): string;
}

export { Banner, type BannerObject };


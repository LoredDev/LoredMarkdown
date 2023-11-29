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
		pullRequests?: boolean,
		starts?: boolean,
		url: string,
	} | string,
	subtitle?: string,
	textColor?: {
		icon?: string,
		subtitle?: string,
		title: string,
	} | string,
	title: string,
}>;

interface BannerConfig {
	document: Document,
	fetch(info: RequestInfo | URL, init: RequestInit): Promise<Response>,
}

declare class Banner {
	public constructor(banner: BannerObject, config?: BannerConfig);
	public toString(): string;
}

export { Banner, type BannerConfig, type BannerObject };


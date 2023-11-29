type primitive = boolean | null | number | string | undefined;
/* eslint-disable no-use-before-define */
/**
 * Makes all property of a object readonly.
 *
 * @package
 * @see https://github.com/microsoft/Typescript/issues/13923#issue-comment-372258196
 * @author Dean177
 */
type DeepReadonly<T> =
	T extends primitive ? T :
		T extends (infer U)[] ? DeepReadonlyArray<U> :
			DeepReadonlyObject<T>;
/* eslint-enable */

type DeepReadonlyArray<T> = readonly DeepReadonly<T>[];

type DeepReadonlyObject<T> = {
	readonly [P in keyof T]: DeepReadonly<T[P]>
};

/**
 * Built-in banner layouts.
 *
 * @package
 */
type BuiltinLayouts = 'horizontal' | 'vertical';

export type { BuiltinLayouts, DeepReadonly };


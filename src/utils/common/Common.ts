namespace yhc
{
	/**
	 * Make all properties in T readonly
	 */
	export type _Readonly<T> = {
		readonly [P in keyof T]: T[P];
	};


	/**
	 * Make all properties in T readonly recursive
	 * see : https://segmentfault.com/a/1190000008108248
	 */
	export type _DeepReadonly<T> = {
		readonly [P in keyof T]: _DeepReadonly<T[P]>;
	};

	/**
	 * Make all properties in `_t` readonly recursive and return
	 */
	export function __DeepReadonly<T>(_t: T): _DeepReadonly<T> { return <any>_t; }


	/**
	 * Make all properties in T partial
	 */
	export type _Partial<T> = {
		[P in keyof T]?: T[P];
	};

	/**
	 * Make all properties in T partial recursive
	 */
	export type _DeepPartial<T> = {
		[P in keyof T]?: _DeepPartial<T[P]>;
	};

	/**
	 * Make all properties in T Promise
	 */
	export type _Deferred<T> = {
		[P in keyof T]: Promise<T[P]>;
	};
	
	// /**
	//  * Make all properties in T Promise recursive
	//  */
	// export type _DeepDeferred<T> = {
	// 	[P in keyof T]: Promise<_DeepDeferred<T[P]>>;
	// };

	/**
	 * Add "get" and "set" method on all properties in T
	 */
	type _Proxy<T> = {
		get(): T;
		set(value: T): void;
	}


	/**
	 * Add "get" and "set" method on all properties in T recursive
	 */
	type _Proxify<T> = {
		[P in keyof T]: _Proxy<T[P]>;
	}

	export function __Proxify<T>(orig: T): _Proxify<T> {
		let result: _Proxify<T>| any = {};
		for (let key in orig) {
			result[key] = {};
			result[key].get = () => { return orig[key]; }
			result[key].set = (value) => { orig[key] = value; }
		}
		return result;
	}

	export function __Unproxify<T>(t: _Proxy<T>): T {
		let result = {} as T;
		for (const k in t) {
			result[k] = t[k].get();
		}
		return result;
	}
}


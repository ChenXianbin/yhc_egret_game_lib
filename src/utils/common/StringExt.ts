// format String By {0} {1} ... {N}, by arguments < replacements: any[] >

interface StringConstructor {
	// string formatter
	// replace {0}, {1}, ... , {N} by replacements[1 - N]
	// example : String.format("{0} {1}", 'hello', 'world') =>  'Hello World'	
	readonly format: (fmt:string, ...replacements: any[]) => string;

	// check string empty
	// ignore empty char '\t \n \r \SPACE and etc...'
	readonly empty: (s: string) => boolean;
}

interface String {
	// string formatter
	// replace {0}, {1}, ... , {N} by replacements[1 - N]
	// example : String("{0} {1}").format('hello', 'world') =>  'Hello World'	
	format(...replacements: any[]): string;
	
	// check string empty
	// ignore empty char '\t \n \r \SPACE and etc...'
	empty(): boolean;
}

// ---------------------------- private side -----------------------------
namespace yhc {
	const GString: any = String;

	if (!GString.prototype.format) {
		GString.prototype.format = function(...replacements: any[]): string {
			return this.replace(/{(\d+)}/g, function(match, number) {
				return typeof replacements[number] != 'undefined'
				? replacements[number]
				: match
				;
			});
		};
	}

	if (!GString.format) {
		GString.format = function(fmt: string, ...replacements: any[]): string {
			return fmt.replace(/{(\d+)}/g, function(match, number) {
				return typeof replacements[number] != 'undefined'
				? replacements[number]
				: match
				;
			});
		};
	}
	
	if (!GString.prototype.empty) {
		GString.prototype.empty = function(): boolean {
			return this.trim() != '';
		};
	}

	if (!GString.empty) {
		GString.empty = function(s: string): boolean {
			return (typeof s === 'string') && (s.trim() != '');
		};
	}
}

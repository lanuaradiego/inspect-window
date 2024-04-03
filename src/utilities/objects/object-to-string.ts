export default function objectToString(obj: any, maxDepth: number, visited: any[] = []): string {
	let result: string | undefined;

	if (obj === undefined) {
		result = "undefined";
	} else if (obj === null) {
		result = "null";
	} else if (typeof obj !== 'object') {
		result = typeof obj === "string" ? "'" + obj + "'" : obj + "";
	} else if (obj instanceof HTMLElement) {
		result = obj.constructor.name;
	} else if (visited.includes(obj)) {
		result = "[Circular]";
	} else {
		visited.push(obj);
		if (maxDepth <= 0) {
			result = JSON.stringify(obj);
		} else if (Array.isArray(obj)) {
			result = '[' + obj.map(item => objectToString(item, maxDepth - 1, visited)).join(', ') + ']';
		} else {
			result = '{\n';
			for (let prop in obj) {
				const v = obj[prop];
				if (typeof v !== "function") {
					result += `"${prop}": ${objectToString(v, maxDepth - 1, visited)},\n`;
				}
			}
			result = result.slice(0, -2) + '\n}';
		}
	}
	return result || "";
}
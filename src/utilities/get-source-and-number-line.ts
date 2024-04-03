export default function getSourceAndNumberLine(): string {
	const error = new Error();
	const callerLine = error.stack?.split('\n').slice(2);
	if (callerLine && callerLine.length) {
		callerLine[0] = callerLine[0]?.trim().replace(/^at/, '');
		for (let i = 0; i < callerLine?.length; ++i) {
			callerLine[i] = callerLine[i]?.trim().replace(/^at/, '\n');
		}
		return callerLine.join();
	}
	return "Unknown";
}
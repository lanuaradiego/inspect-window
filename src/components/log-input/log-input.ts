import { LogType } from "../../enums/log-type";
import getSourceAndNumberLine from "../../utilities/get-source-and-number-line";
import createHtmlElement from "../../utilities/html/create-html-element";
import logInputLine from "./log-input-line";

export default class LogInput {
	public readonly htmlElement: HTMLDivElement;

	constructor() {
		this.htmlElement = createHtmlElement("div", function () {
			this.overflowY = "scroll";
			this.position = "absolute";
			this.top = "0";
			this.left = "0";
			this.right = "0";
			this.bottom = "0";
		});
		this.interceptLogs();
	}

	private addLog(type: LogType, color: string, source: string, ...args: any[]): void {
		const instant = new Date();
		const line = logInputLine(type, color, source, instant, args);
		this.htmlElement.appendChild(line);
	}

	private interceptLogs() {
		const log = console.log.bind(console)
		console.log = (...args) => {
			const source = getSourceAndNumberLine();
			this.addLog(LogType.Log, "black", source, args);
			log(...args)
		};

		const info = console.info.bind(console)
		console.info = (...args) => {
			const source = getSourceAndNumberLine();
			this.addLog(LogType.Info, "#0211b8", source, args);
			info(...args)
		};

		const warn = console.warn.bind(console)
		console.warn = (...args) => {
			const source = getSourceAndNumberLine();
			this.addLog(LogType.Warn, "#8a7c00", source, args);
			warn(...args)
		};

		const err = console.error.bind(console)
		console.error = (...args) => {
			const source = getSourceAndNumberLine();
			this.addLog(LogType.Error, "#8a1900", source, args);
			err(...args)
		};

		window.addEventListener("error", ev => {
			let args = ev.error instanceof Error ?
				{ name: ev.error.name, message: ev.error.message, stack: ev.error.stack } :
				ev.error;

			this.addLog(LogType.Exception, "#ba0202", `${ev.filename}:${ev.lineno}`, args);
		}, true);
	}
}
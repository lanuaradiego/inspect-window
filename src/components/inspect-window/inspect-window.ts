import Form from "../form/form";
import LogInput from "../log-input/log-input";

export default class InspectWindow {
	private form: Form;
	private logInput: LogInput;

	constructor(parent?: HTMLElement) {
		this.form = new Form();
		this.logInput = new LogInput();
		this.form.appendChild(this.logInput.htmlElement);
		this.form.attachTo(document.body);
	}

	hide(){
		this.form.hide();
	}

	show(){
		this.form.show();
	}
}
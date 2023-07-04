import { EventData, EventEmitter, EventHandler } from './events';
import { isEmpty } from '../../utils/utils';

export type DOMEvents = keyof HTMLElementEventMap;
export type CommonElement = HTMLCustomItem<HTMLElement, DOMEvents>;
export type ContentValue = CommonElement | Node | string;
export type CustomEvent = {
	event: Event;
};

export class HTMLCustomItem<
	NodeType extends HTMLElement,
	Events extends string
> extends EventEmitter {
	protected node: NodeType;

	constructor(root: NodeType) {
		super();
		this.node = root;
	}

	render() {
		return this.node;
	}

	// # Events api
	trigger(eventName: Events, data?: object) {
		return (event: EventData) => {
			this.emit(eventName, {
				element: this,
				...event,
				...data,
			});
		};
	}

	bindEvent(sourceEvent: DOMEvents, targetEvent?: Events, data?: object) {
		this.node.addEventListener(sourceEvent, (event: Event) => {
			this.emit((targetEvent ?? sourceEvent) as Events, {
				event,
				element: this,
				...data,
			});
		});
		return this;
	}

	emit(eventName: Events, data?: object) {
		super.emit(eventName, data);
		return this;
	}

	on(eventName: Events, handler: EventHandler) {
		super.on(eventName as string, handler);
		return this;
	}

	off(eventName: Events, handler: EventHandler) {
		super.off(eventName as string, handler);
		return this;
	}

	// # Root level api

	remove() {
		this.node.remove();
		return this;
	}

	show() {
		this.node.style.removeProperty('display');
		return this;
	}

	hide() {
		this.node.style.display = 'none';
		return this;
	}

	// ## Value and attributes operations

	setText(value: string) {
		if (!isEmpty(value)) {
			if (this.node instanceof HTMLImageElement) {
				this.node.alt = value;
			} else {
				this.node.textContent = value;
			}
		}
		return this;
	}

	setLink(value: string) {
		if (!isEmpty(value)) {
			if (
				this.node instanceof HTMLImageElement ||
				this.node instanceof HTMLIFrameElement
			) {
				this.node.src = value;
			}
			if (this.node instanceof HTMLAnchorElement) {
				this.node.href = value;
			}
		}
		return this;
	}

	setValue(value: string) {
		if (this.node instanceof HTMLInputElement) {
			this.node.value = value;
		} else {
			throw new Error('Element is not HTMLInput');
		}
		return this;
	}

	getValue(): string {
		if (this.node instanceof HTMLInputElement) {
			return this.node.value;
		} else {
			throw new Error('Element is not HTMLInput');
		}
	}

	disable() {
		if (
			this.node instanceof HTMLButtonElement ||
			this.node instanceof HTMLInputElement ||
			this.node instanceof HTMLTextAreaElement ||
			this.node instanceof HTMLSelectElement
		) {
			this.node.disabled = true;
		} else {
			throw new Error('Element has not disabled state');
		}
		return this;
	}

	enable() {
		if (
			this.node instanceof HTMLButtonElement ||
			this.node instanceof HTMLInputElement ||
			this.node instanceof HTMLTextAreaElement ||
			this.node instanceof HTMLSelectElement
		) {
			this.node.disabled = false;
		} else {
			throw new Error('Element has not disabled state');
		}
		return this;
	}

	toggleDisabled(state: boolean) {
		return state ? this.disable() : this.enable();
	}

	// ## Validation

	isValid() {
		if (this.node instanceof HTMLInputElement) {
			return this.node.validity.valid;
		} else {
			throw new Error('Element has not validity state');
		}
	}

	getValidationMessage(): string | undefined {
		if (this.node instanceof HTMLInputElement) {
			return this.isValid()
				? undefined
				: this.node.dataset['validation-message'] ??
						this.node.validationMessage;
		} else {
			throw new Error('Element has not validity state');
		}
	}

	// ## CSS-class operations

	toggleClass(className: string, state?: boolean) {
		if (isEmpty(state)) {
			this.node.classList.toggle(className);
		} else if (state === true) {
			this.addClass(className);
		} else {
			this.removeClass(className);
		}
		return this;
	}

	addClass(className: string) {
		this.node.classList.add(className);
		return this;
	}

	removeClass(className: string) {
		this.node.classList.remove(className);
		return this;
	}

	hasClass(className: string): boolean {
		return this.node.className.includes(className);
	}

	// # Nested content api

	setContent(item?: ContentValue) {
		if (item) this.replace(item);
		else this.clear();
		return this;
	}

	clear() {
		this.node.replaceChildren();
		return this;
	}

	append(...items: ContentValue[]) {
		for (const item of items) {
			if (item instanceof HTMLCustomItem) {
				this.node.append(item.render());
			} else {
				this.node.append(item);
			}
		}
	}

	prepend(...items: ContentValue[]) {
		for (const item of items) {
			if (item instanceof HTMLCustomItem) {
				this.node.prepend(item.render());
			} else {
				this.node.prepend(item);
			}
		}
	}

	replace(...items: ContentValue[]) {
		for (const item of items) {
			if (item instanceof HTMLCustomItem) {
				this.node.replaceChildren(item.render());
			} else {
				this.node.replaceChildren(item);
			}
		}
	}
}

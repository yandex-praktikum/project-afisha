import { EventsMap } from './events';
import {
	bem,
	ensureElement,
	getObjectProperties,
	pascalToKebab,
} from '../../utils/utils';
import { HTMLCustomItem, ContentValue, DOMEvents } from './html';
import { EventHandler } from './events';

export type ViewElement<T extends HTMLElement = HTMLElement> = View<
	T,
	object,
	string,
	string
>;
export type ViewEvent = {
	element: ViewElement;
};

export class View<
	NodeType extends HTMLElement,
	DataType extends object,
	Events extends string,
	Modifiers extends string
> extends HTMLCustomItem<NodeType, Events> {
	[key: string]: unknown;
	['constructor']: new (root: NodeType, name?: string) => this;

	protected node: NodeType;
	protected events: EventsMap;

	readonly name: string;
	protected elements: Record<string, ViewElement>;
	readonly fieldNames: string[];

	constructor(root: NodeType, name?: string) {
		super(root);
		this.name = name ?? pascalToKebab(this.constructor.name);
		this.fieldNames = getObjectProperties(
			this,
			(_name, prop) => !!(prop.get || prop.set)
		);
		this.elements = {};
		this.init();
	}

	// Core methods
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	protected init() {}

	render(data?: DataType): NodeType {
		this.assign(data);
		return this.node;
	}

	// Factory methods

	public static factory<T extends ViewElement>(
		this: new (el: unknown, name?: string) => T,
		el: unknown,
		data?: object,
		name?: string
	): T {
		const instance = new this(el, name);
		if (data) instance.render(data);
		return instance;
	}

	static clone<T extends ViewElement>(
		templateId: string,
		data?: object,
		name?: string
	): T {
		const template = document.getElementById(templateId) as HTMLTemplateElement;
		const element = template.content.firstElementChild.cloneNode(true);
		return this.factory(element, data, name) as T;
	}

	static mount<T extends ViewElement>(
		selectorElement: HTMLElement | string,
		data?: object,
		name?: string
	): T {
		const element =
			typeof selectorElement === 'string'
				? document.querySelector(selectorElement)
				: selectorElement;
		return this.factory(element, data, name) as T;
	}

	static create<T extends HTMLElement>(
		this: new (el: unknown, name?: string) => ViewElement<T>,
		tagName: keyof HTMLElementTagNameMap,
		attributes: object = {}
	): ViewElement<T> {
		const element = document.createElement(tagName) as T;
		Object.assign(element, attributes);
		return new this(element);
	}

	// View elements api
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	assign(data?: Record<string, any> & DataType) {
		if (data)
			Object.keys(data).map((key) => {
				if (this.fieldNames.includes(key)) {
					this[key as string] = data[key];
				}
			});
		return this;
	}

	element<T extends ViewElement>(
		name: string,
		ClassType?: new (el: HTMLElement, name: string) => T
	): T {
		if (!this.elements[name]) {
			const el = this.bem(name);
			this.select<T>(name, el.class, ClassType);
		}
		return this.elements[name] as T;
	}

	select<T extends ViewElement>(
		name: string,
		selector?: string,
		ClassType?: new (el: HTMLElement, name: string) => T
	): T {
		if (!this.elements[name]) {
			const $el = ensureElement<HTMLElement>(selector, this.node);
			const el = this.bem(name);
			if (ClassType) {
				this.elements[name] = new ClassType($el, name);
			} else {
				this.elements[name] = new View<HTMLElement, object, DOMEvents, string>(
					$el,
					el.name
				);
				this.elements[name].bindEmitter(this.events);
			}
		}
		return this.elements[name] as T;
	}

	copy() {
		return new this.constructor(
			this.node.cloneNode(true) as NodeType,
			this.name
		);
	}

	// HTML helper api

	setVisibleContent(element: string, content?: ContentValue) {
		if (content) {
			this.element(element).setContent(content).show();
		} else {
			this.element(element).setContent().hide();
		}
		return this.element('header');
	}

	bem(element?: string, modifier?: string) {
		return bem(this.name, element, modifier);
	}

	toggle(modifier: Modifiers, state?: boolean) {
		const bemName = this.bem(undefined, modifier as string).name;
		this.toggleClass(bemName, state);
		return this;
	}

	on(eventName: Events, handler: EventHandler) {
		return super.on(eventName, handler) as typeof this;
	}
}

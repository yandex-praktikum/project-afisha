import { View, ViewElement } from '../base/view';

export interface IModal {
	header?: ViewElement;
	content: ViewElement;
	actions: ViewElement[];
}

export class Modal extends View<
	HTMLDivElement,
	IModal,
	'close' | 'open' | 'hide',
	'active'
> {
	protected _actions: ViewElement[] = [];

	init() {
		this.element('close').bindEvent('click', 'close');

		this.element('header').hide();
		this.element('message').hide();

		this.on('close', this.close.bind(this));
	}

	reset() {
		this.toggle('active', false);
		this.header = null;
		this.setContent = null;
		this.setMessage();
	}

	set header(content: ViewElement | null) {
		this.setVisibleContent('header', content);
	}

	set content(content: ViewElement | null) {
		this.element('content').setContent(content);
	}

	set actions(actions: ViewElement[]) {
		this._actions.map((action) => action.remove());
		this._actions = actions;
		for (const action of actions.reverse()) {
			this.element('footer').prepend(action);
		}
	}

	setActive(state: boolean) {
		if (state) {
			this.emit('open', {});
			this.toggle('active', true);
		} else {
			this.emit('hide', {});
			this.toggle('active', false);
		}
		return this;
	}

	setMessage(message?: string, error?: boolean) {
		this.setVisibleContent('message', message);
		this.element('message').toggleClass(
			this.bem('message', 'error').name,
			!!error
		);
		return this;
	}

	static configure({ modalTemplate }: { modalTemplate: string }): Modal {
		return Modal.clone<Modal>(modalTemplate);
	}

	render(modal: IModal) {
		super.render(modal);
		this.setMessage();
		if (!this.node.isConnected) {
			document.body.append(this.node);
			this.setActive(true);
		}
		return this.node;
	}

	close() {
		this.setActive(false);
		this.reset();
		this.remove();
	}
}

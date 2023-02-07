import Utils from '../utils/Utils';

export default class Modal {
  constructor(element) {
    this.element = element;
    this.modalId = this.element.dataset.modalId;

    this.init();
  }

  init() {
    this.element.addEventListener('click', this.open.bind(this));

    this.close = this.close.bind(this);
  }

  updateContent(data) {
    if (this.modalId == 'tpl-modal-tool') {
      this.modalElement.innerHTML = Utils.parseTemplate(
        this.modalElement.innerHTML,
        {
          title: this.element.dataset.modalTitle,
        }
      );
    }
  }

  open(event) {
    event.preventDefault();
    this.appendModal();
  }

  close(event) {
    if (event.key && event.key !== 'Escape') return;

    document.documentElement.classList.remove('modal-is-active');
    this.closeButton.removeEventListener('click', this.close);
    document.removeEventListener('keyup', this.close);

    // We wait 1 sec for the css transition to end on modal, then we remove it from DOM
    setTimeout(this.destroy.bind(this), 1000);
  }

  destroy() {
    this.modalElement.parentElement.removeChild(this.modalElement);
  }

  appendModal() {
    const template = document.querySelector(`#${this.modalId}`);

    // We valide that a template with this ID actually exists
    if (template) {
      this.modalElement = template.content.firstElementChild.cloneNode(true);

      // Update modal content
      this.updateContent();

      // We append the modal to the DOM
      document.body.appendChild(this.modalElement);

      // This forces the browser to redraw (and execute from A to Z the css transition)
      this.element.getBoundingClientRect();
      document.documentElement.classList.add('modal-is-active');

      // We add behavior to our close button
      this.closeButton = this.modalElement.querySelector('.js-close');
      this.closeButton.addEventListener('click', this.close);

      document.addEventListener('keyup', this.close);
    } else {
      console.log(`Le <template> avec le id ${this.modalId} n'existe pas`);
    }
  }
}

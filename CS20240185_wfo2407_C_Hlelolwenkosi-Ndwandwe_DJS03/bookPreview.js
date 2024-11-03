class BookPreview extends HTMLElement {
  constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
          <style>
              /* Your styles here */
              .preview { /* styles for book preview */ }
          </style>
          <div class="preview">
              <h2 class="title"></h2>
              <p class="author"></p>
          </div>
      `;
  }

  connectedCallback() {
      this.render();
  }

  render() {
      const title = this.getAttribute('title') || 'Unknown Title';
      const author = this.getAttribute('author') || 'Unknown Author';

      this.shadowRoot.querySelector('.title').textContent = title;
      this.shadowRoot.querySelector('.author').textContent = `by ${author}`;
  }
}

customElements.define('book-preview', BookPreview);

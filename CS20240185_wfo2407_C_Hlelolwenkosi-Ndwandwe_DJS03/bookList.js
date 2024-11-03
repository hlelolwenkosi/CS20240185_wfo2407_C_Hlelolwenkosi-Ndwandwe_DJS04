class BookList extends HTMLElement {
  constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.books = [
          { title: 'Book 1', author: 'Author 1' },
          { title: 'Book 2', author: 'Author 2' },
          // Add more books as needed
      ];
  }

  connectedCallback() {
      this.render();
  }

  render() {
      this.books.forEach(book => {
          const bookPreview = document.createElement('book-preview');
          bookPreview.setAttribute('title', book.title);
          bookPreview.setAttribute('author', book.author);
          this.appendChild(bookPreview);
      });
  }
}

customElements.define('book-list', BookList);

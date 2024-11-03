// Define the BookList class, extending HTMLElement to create a custom element
class BookList extends HTMLElement {
  // Constructor method called when the element is instantiated
  constructor() {
      super(); // Call the constructor of the parent class (HTMLElement)
      
      // Attach a shadow DOM tree to this element for encapsulation
      this.attachShadow({ mode: 'open' });
      
      // Define an array of books with title and author properties
      this.books = [
          { title: 'Book 1', author: 'Author 1' },
          { title: 'Book 2', author: 'Author 2' },
          // Add more books as needed
      ];
  }

  // Method called when the element is added to the document
  connectedCallback() {
      this.render(); // Render the component's content
  }

  // Method to generate and append book preview elements
  render() {
      // Loop through each book in the books array
      this.books.forEach(book => {
          // Create a new book-preview element
          const bookPreview = document.createElement('book-preview');

          // Set the title and author attributes for the book-preview element
          bookPreview.setAttribute('title', book.title);
          bookPreview.setAttribute('author', book.author);

          // Append the book-preview element to the shadow DOM of this component
          this.appendChild(bookPreview);
      });
  }
}

// Define the new custom element, associating it with the tag name 'book-list'
customElements.define('book-list', BookList);


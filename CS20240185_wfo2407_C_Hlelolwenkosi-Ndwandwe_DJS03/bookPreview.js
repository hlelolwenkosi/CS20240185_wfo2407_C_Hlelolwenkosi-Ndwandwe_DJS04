// Define the BookPreview class, extending HTMLElement to create a custom element
class BookPreview extends HTMLElement {
  // Constructor method called when the element is instantiated
  constructor() {
      super(); // Call the constructor of the parent class (HTMLElement)
      
      // Attach a shadow DOM tree to this element
      this.attachShadow({ mode: 'open' });

      // Define the inner HTML structure and styles for the component
      this.shadowRoot.innerHTML = `
          <style>
              /* Styles for the book preview component */
              .preview {
                  border: 1px solid #ccc; /* Light gray border */
                  border-radius: 5px; /* Rounded corners */
                  padding: 10px; /* Inner padding */
                  margin: 10px; /* Space between previews */
                  background-color: #f9f9f9; /* Light background color */
                  transition: transform 0.2s; /* Smooth scaling on hover */
              }
              .preview:hover {
                  transform: scale(1.05); /* Slightly enlarge the preview on hover */
              }
              .title {
                  font-size: 1.5em; /* Larger font size for the title */
                  font-weight: bold; /* Bold title */
              }
              .author {
                  color: #555; /* Dark gray color for the author */
              }
          </style>
          <div class="preview">
              <h2 class="title"></h2> <!-- Title placeholder -->
              <p class="author"></p> <!-- Author placeholder -->
          </div>
      `;
  }

  // Method called when the element is added to the document
  connectedCallback() {
      this.render(); // Render the component's content
  }

  // Method to update the component's content based on attributes
  render() {
      // Get the 'title' and 'author' attributes, providing defaults if they are not set
      const title = this.getAttribute('title') || 'Unknown Title';
      const author = this.getAttribute('author') || 'Unknown Author';

      // Update the text content of the title and author elements
      this.shadowRoot.querySelector('.title').textContent = title;
      this.shadowRoot.querySelector('.author').textContent = `by ${author}`;
  }
}

// Define the new custom element, associating it with the tag name 'book-preview'
customElements.define('book-preview', BookPreview);

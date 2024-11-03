// Import necessary data and constants from the external data.js module
import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";

// Utility function to create and return an HTML element with specified attributes and content
export const createElement = (tag, attributes, innerHTML) => {
  const element = document.createElement(tag); // Instantiate a new HTML element of the given tag type
  // Loop through the attributes and set them on the element
  Object.entries(attributes).forEach(([key, value]) =>
    element.setAttribute(key, value)
  );
  element.innerHTML = innerHTML; // Set the content of the element
  return element; // Return the constructed element for further use
};

// Function to dynamically populate dropdown menus with options from a given data set
export const renderOptions = (data, selector, defaultValue) => {
  const fragment = document.createDocumentFragment(); // Create a lightweight document fragment for performance
  // Add a default option to the dropdown
  fragment.appendChild(
    createElement("option", { value: "any" }, defaultValue)
  );
  // Iterate through the data entries to create option elements for the dropdown
  Object.entries(data).forEach(([id, name]) =>
    fragment.appendChild(createElement("option", { value: id }, name))
  );
  document.querySelector(selector).appendChild(fragment); // Append all created options to the specified dropdown
};

// Function to display book previews based on search results
 export const renderBooks = (matches, limit) => {
  const fragment = document.createDocumentFragment(); // Create a fragment to hold multiple book preview elements
  // Generate a preview button for each book that matches the search criteria
  matches.slice(0, limit).forEach(({ author, id, image, title }) => {
    const element = createElement(
      "button",
      { class: "preview", "data-preview": id },
      `<img class="preview__image" src="${image}" />
      <div class="preview__info">
        <h3 class="preview__title">${title}</h3>
        <div class="preview__author">${authors[author]}</div>
      </div>`
    );
    fragment.appendChild(element); // Add the button to the fragment for efficient DOM updates
  });
  document.querySelector("[data-list-items]").appendChild(fragment); // Append the fragment containing all buttons to the book list
};

// Initial setup: render the initial batch of books and populate dropdowns for genre and author selection
renderBooks(books, BOOKS_PER_PAGE); // Render a limited number of books initially
renderOptions(genres, "[data-search-genres]", "All Genres"); // Populate genre dropdown
renderOptions(authors, "[data-search-authors]", "All Authors"); // Populate author dropdown

// Function to handle the cancellation of overlay dialogs
const handleCancel = (selector) => () => {
  document.querySelector(selector).open = false; // Close the specified overlay dialog
};

// Add event listeners for the cancellation buttons in overlays
document.querySelector("[data-search-cancel]").addEventListener("click", handleCancel("[data-search-overlay]")); // Close search overlay
document.querySelector("[data-settings-cancel]").addEventListener("click", handleCancel("[data-settings-overlay]")); // Close settings overlay
// Event listener to trigger opening of the search overlay and focus the search input field
document.querySelector("[data-header-search]").addEventListener("click", () => {
  document.querySelector("[data-search-overlay]").open = true; // Open the search overlay for user input
  document.querySelector("[data-search-title]").focus(); // Set focus on the title input field for immediate typing
});
// Event listener to open the settings overlay when the settings button is clicked
document.querySelector("[data-header-settings]").addEventListener("click", () => {
  document.querySelector("[data-settings-overlay]").open = true; // Display the settings overlay for user adjustments
});
// Event listener to close the currently active book detail overlay
document.querySelector("[data-list-close]").addEventListener("click", () => {
  document.querySelector("[data-list-active]").open = false; // Hide the book preview overlay
});
// Event listener to manage the settings form submission process
document.querySelector("[data-settings-form]").addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent the default form submission behavior
  const formData = new FormData(event.target); // Collect the form data
  const { theme } = Object.fromEntries(formData); // Extract the theme selection from the form data
  // Update CSS variables according to the chosen theme
  const colorDark = theme === "night" ? "255, 255, 255" : "10, 10, 20"; // Set dark mode colors
  const colorLight = theme === "night" ? "10, 10, 20" : "255, 255, 255"; // Set light mode colors
  document.documentElement.style.setProperty("--color-dark", colorDark); // Apply dark color variable
  document.documentElement.style.setProperty("--color-light", colorLight); // Apply light color variable
  document.querySelector("[data-settings-overlay]").open = false; // Close the settings overlay after applying changes
});

// Event listener for managing search form submissions
document.querySelector("[data-search-form]").addEventListener("submit", (event) => {
  event.preventDefault(); // Stop the default form submission action
  const formData = new FormData(event.target); // Gather the data from the form
  const filters = Object.fromEntries(formData); // Convert the FormData to a standard object for easier handling
  // Filter the books based on the user input from the search criteria
  const result = books.filter(
    ({ title, author, genres }) =>
      (filters.title.trim() === "" || // Check if title is included
        title.toLowerCase().includes(filters.title.toLowerCase())) &&
      (filters.author === "any" || author === filters.author) && // Check if author matches
      (filters.genre === "any" || genres.includes(filters.genre)) // Check if genre matches
  );
  // Update the message display based on the search results
  document.querySelector("[data-list-message]").classList[result.length < 1 ? "add" : "remove"]("list__message_show");
  document.querySelector("[data-list-items]").innerHTML = ""; // Clear previous search results
  renderBooks(result, BOOKS_PER_PAGE); // Render the newly filtered book results
  document.querySelector("[data-list-button]").disabled =
    result.length <= BOOKS_PER_PAGE; // Enable or disable the "Show more" button based on results
  document.querySelector("[data-list-button]").innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${Math.max(
      result.length - BOOKS_PER_PAGE,
      0
    )})</span>
  `; // Update button text to reflect the number of remaining books
  window.scrollTo({ top: 0, behavior: "smooth" }); // Smoothly scroll to the top of the results
  document.querySelector("[data-search-overlay]").open = false; // Close the search overlay after searching
});

let page = 1; // Initialize the page counter for pagination
// Event listener to handle the "Show more" button click
document.querySelector("[data-list-button]").addEventListener("click", () => {
  const fragment = document.createDocumentFragment(); // Create a fragment to hold additional book previews
  const startIndex = (page - 1) * BOOKS_PER_PAGE; // Calculate the start index for the next set of books
  const endIndex = Math.min(page * BOOKS_PER_PAGE, books.length); // Calculate the end index for pagination
  // Create and append preview buttons for the next set of books
  for (const book of books.slice(startIndex, endIndex)) {
    const { author, id, image, title } = book;
    const element = createElement(
      "button", { class: "preview", "data-preview": id },
      `<img class="preview__image" src="${image}" />
      <div class="preview__info">
        <h3 class="preview__title">${title}</h3>
        <div class="preview__author">${authors[author]}</div>
      </div>`
    );
    fragment.appendChild(element); // Add the new button to the fragment
  }
  document.querySelector("[data-list-items]").appendChild(fragment); // Insert the fragment into the list of items
  page++; // Increment the page counter for the next click
});

// Event listener to handle interactions with book preview buttons
document.querySelector("[data-list-items]").addEventListener("click", (event) => {
  let node = event.target; // Identify the element that was clicked
  // Navigate up the DOM tree to find the corresponding preview button
  while (node && !node.dataset.preview) {
    node = node.parentNode; // Ascend through parent nodes to locate a button
  }
  if (node) {
    // If a valid preview button is found
    const book = books.find(({ id }) => id === node.dataset.preview); // Retrieve the book data associated with the clicked button
    if (book) {
      // If the book is successfully found
      // Open the detailed book preview overlay and populate it with book information
      document.querySelector("[data-list-active]").open = true; // Display the book preview overlay
      document.querySelector("[data-list-blur]").src = book.image; // Set the blurred background image for effect
      document.querySelector("[data-list-image]").src = book.image; // Display the main book image
      document.querySelector("[data-list-title]").innerText = book.title; // Show the book title
      document.querySelector("[data-list-subtitle]").innerText = `${authors[book.author]} (${new Date(book.published).getFullYear()})`; // Show author and publication year
      document.querySelector("[data-list-description]").innerText = book.description; // Present the book description
    }
  }
});

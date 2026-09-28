/* JavaScript for Responsive Navigation Menu */
// 1. Wait until the entire HTML document is loaded
document.addEventListener("DOMContentLoaded", () => {
  const hamburgerButton = document.getElementById("menu");
  const navMenu = document.querySelector("#nav-container");
  hamburgerButton.addEventListener("click", () => {
    navMenu.classList.toggle("is-open");
    hamburgerButton.classList.toggle("open");
  });
});
/*end of responsive navigation menu code*/
/*Use localStorage to keep track of the number of reviews completed by the user client by adding a counter 
to the form submission review.html page. Every time that page is loaded successfully upon form submission, 
add one to the counter. Create a count function*/
function reviewCount() {
  let reviewCounter = localStorage.getItem("reviewCounter");
  if (reviewCounter) {
    reviewCounter = parseInt(reviewCounter) + 1;
  } else {
    reviewCounter = 1;
  }
  localStorage.setItem("reviewCounter", reviewCounter);
  const reviewCountDisplay = document.getElementById("review-count");
  if (reviewCountDisplay) {
    reviewCountDisplay.textContent = reviewCounter;
  }
}
reviewCount();
//end of review count function

/*Code to display books after clicking search button
using Open Library API*/
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const resultsContainer = document.getElementById("results-container");
searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`)
      .then((response) => response.json())
      .then((data) => {
        resultsContainer.innerHTML = "";
        const books = data.docs.slice(0, 10);
        books.forEach((book) => {
          const bookDiv = document.createElement("div");
          bookDiv.classList.add("book");
          const title = book.title ? book.title : "No title available";
          const author = book.author_name
            ? book.author_name.join(", ")
            : "Unknown author";
          const firstPublishYear = book.first_publish_year
            ? book.first_publish_year
            : "N/A";
          bookDiv.innerHTML = `
            <h3>${title}</h3>
            <p><strong>Author(s):</strong> ${author}</p>
            <p><strong>First Publish Year:</strong> ${firstPublishYear}</p>
          `;
          resultsContainer.appendChild(bookDiv);
        });
      })
      .catch((error) => {
        resultsContainer.innerHTML =
          "<p>Error fetching data. Please try again later.</p>";
        console.error("Error fetching data:", error);
      });
  }
});
/*End of code to display books after clicking search button
using Open Library API*/

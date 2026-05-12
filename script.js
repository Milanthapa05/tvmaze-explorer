const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");
const loading = document.getElementById("loading");
// Search button click
searchBtn.addEventListener("click", searchShows);
// Enter key search
searchInput.addEventListener("keypress", function(event) {
if (event.key === "Enter") {
searchShows();
}
});
// Main search function
async function searchShows() {
const query = searchInput.value.trim();
// Validate input
if (!query) {
alert("Please enter a TV show name");
return;
}
// Clear previous results
results.innerHTML = "";
// Show loading spinner
loading.classList.remove("hidden");
try {
// Fetch data from TVMaze API
const response = await fetch(
`https://api.tvmaze.com/search/shows?q=${query}`
);
// Check for errors
if (!response.ok) {
throw new Error("Failed to fetch data");
}
// Convert response to JSON
const data = await response.json();
7
// Display data
displayShows(data);
} catch (error) {
results.innerHTML = `
      <p>Error: ${error.message}</p>
    `;
} finally {
// Hide loading spinner
loading.classList.add("hidden");
}
}
// Display shows on webpage
async function displayShows(shows) {
// If no results
if (shows.length === 0) {
results.innerHTML = "<p>No shows found.</p>";
return;
}
// Loop through each show
for (const item of shows) {
const show = item.show;
// Default cast text
let castNames = "Not available";
try {
// Fetch cast information
const castResponse = await fetch(
`https://api.tvmaze.com/shows/${show.id}/cast`
);
const castData = await castResponse.json();
// Get first 5 cast members
castNames = castData
.slice(0, 5)
8
.map(actor => actor.person.name)
.join(", ");
} catch (error) {
console.log("Cast fetch error:", error);
}
// Create card element
const card = document.createElement("div");
card.classList.add("card");
// Card HTML
card.innerHTML = `
      <img
        src="${
show.image
? show.image.medium
: 'https://via.placeholder.com/210x295'
}"
        alt="${show.name}"
      >
      <div class="card-content">
        <h2>${show.name}</h2>
        <p>
          <strong>Rating:</strong>
${show.rating.average || "N/A"}
        </p>
        <p>
          <strong>Genres:</strong>
${show.genres.join(", ")}
        </p>
        <p>
          <strong>Premiered:</strong>
${show.premiered || "Unknown"}
        </p>
        <p>
          <strong>Cast:</strong>
${castNames}
        </p>
9
<div>
${show.summary || "No summary available"}
</div>
</div>
`;
// Add card to page
results.appendChild(card);
}
}
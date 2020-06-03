// Import
import Search from "./modules/search";

// Create new instance of Search JS if user is logged in - search icon exists
if (document.querySelector(".header-search-icon")) {
    new Search();
}
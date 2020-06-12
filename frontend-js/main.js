// Import
import Search from "./modules/search";
import Chat from "./modules/chat";

// Create new instance of Search JS if user is logged in - search icon exists
if (document.querySelector(".header-search-icon")) {new Search();}

// Create new instance of Chat JS if wrapper DIV is found
if (document.querySelector("#chat-wrapper")) {new Chat();}
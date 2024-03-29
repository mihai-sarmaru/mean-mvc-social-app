// Import Axios and DOM Purify package
import axios from "axios";
import DOMPurify from "dompurify";

// Export Search class with constructor
export default class Search {
    // 1. Constructor - prop for selecting DOM elements
    constructor() {
        // Properties
        this.headerSearchIcon = document.querySelector(".header-search-icon");

        // Inject Search HTML and add props
        this.injectHTML();
        this.overlay = document.querySelector(".search-overlay");
        this.closeIcon = document.querySelector(".close-live-search");  // . class
        this.inputField = document.querySelector("#live-search-field"); // # id
        this.resultsArea = document.querySelector(".live-search-results");
        this.loaderIcon = document.querySelector(".circle-loader");

        this.typingWaitTimer;
        this.previousValue = "";

        // Call the events method
        this.events();
    }

    // 2. Events method
    events() {
        // Search icon click event
        this.headerSearchIcon.addEventListener("click", (e) => {
            // Prevent A default click event
            e.preventDefault();
            this.openOverlay();
        });

        // Close icon click event
        this.closeIcon.addEventListener("click", () => this.closeOverlay());

        // Add key press event
        this.inputField.addEventListener("keyup", () => this.keyPressHandler());
    }

    // 3. Methods
    openOverlay() {
        this.overlay.classList.add("search-overlay--visible");
        // Wait 50ms before attempting to focus
        setTimeout(() => this.inputField.focus(), 50);
    }

    closeOverlay() {
        this.overlay.classList.remove("search-overlay--visible");
    }

    keyPressHandler() {
        let value = this.inputField.value;

        if (value == "") {
            clearTimeout(this.typingWaitTimer);
            this.hideLoaderIcon();
            this.hideResultsArea();
        }

        if (value != "" && value != this.previousValue) {
            clearTimeout(this.typingWaitTimer);
            // Show loader icon and set 750ms timeout
            this.showLoaderIcon();
            this.hideResultsArea();
            this.typingWaitTimer = setTimeout(() => this.sendRequest(), 750);
        }

        this.previousValue = value;
    }

    sendRequest() {
        // Use axios to send POST request
        axios.post("/search", {searchTerm: this.inputField.value}).then(response => {
            console.log(response.data);
            this.renderResultsHTML(response.data);
        }).catch(() => {
            alert("Search request failed.");
        });
    }

    showLoaderIcon() {
        this.loaderIcon.classList.add("circle-loader--visible");
    }

    hideLoaderIcon() {
        this.loaderIcon.classList.remove("circle-loader--visible");
    }

    showResultsArea() {
        this.resultsArea.classList.add("live-search-results--visible");
    }

    hideResultsArea() {
        this.resultsArea.classList.remove("live-search-results--visible");
    }

    renderResultsHTML(posts) {
        if (posts.length) {
            this.resultsArea.innerHTML = DOMPurify.sanitize(`
            <div class="list-group shadow-sm">
                <div class="list-group-item active"><strong>Search Results</strong> (${posts.length > 1 ? `${posts.length} items found` : "1 item found"})</div>
                ${posts.map(post => {
                    let postDate = new Date(post.createdDate);
                    return `
                    <a href="/post/${post._id}" class="list-group-item list-group-item-action">
                        <img class="avatar-tiny" src="${post.author.avatar}"> <strong>${post.title}</strong>
                        <span class="text-muted small">by ${post.author.username} on ${postDate.getDay()}/${postDate.getMonth()}/${postDate.getFullYear()}</span>
                    </a>`
                }).join("")}
            </div>`);
        } else {
            this.resultsArea.innerHTML = `<p class="alert alert-danger text-center shadow-sm">Sorry, we could not find any result fot that search.</p>`
        }
        // Hide icon and show result area
        this.hideLoaderIcon();
        this.showResultsArea();
    }

    // Overlay HTML for Search feature
    injectHTML() {
        document.body.insertAdjacentHTML("beforeend", 
        `<!-- search feature begins -->
        <div class="search-overlay">
          <div class="search-overlay-top shadow-sm">
            <div class="container container--narrow">
              <label for="live-search-field" class="search-overlay-icon"><i class="fas fa-search"></i></label>
              <input type="text" id="live-search-field" class="live-search-field" placeholder="What are you interested in?">
              <span class="close-live-search"><i class="fas fa-times-circle"></i></span>
            </div>
          </div>
      
          <div class="search-overlay-bottom">
            <div class="container container--narrow py-3">
              <div class="circle-loader"></div>
              <div class="live-search-results"></div>
            </div>
          </div>
        </div>
        <!-- search feature end -->`);
    }
}
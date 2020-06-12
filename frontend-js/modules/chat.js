// Export Chat class
export default class Chat {
    // Constructor
    constructor() {
        this.openedYet = false;
        this.chatWrapper = document.querySelector("#chat-wrapper");
        this.openIcon = document.querySelector(".header-chat-icon");
        this.injectHTML();
        this.closeIcon = document.querySelector(".chat-title-bar-close");
        this.events();
    }

    // Events
    events() {
        // Click event on chat icon
        this.openIcon.addEventListener("click", () => this.showChat());
        // Click event on hide chat icon
        this.closeIcon.addEventListener("click", () => this.hideChat());
    }

    // Methods

    // Make chat box visible
    showChat() {
        // Prevent user spamming hide button
        if (!this.openedYet) {this.openConnection();}
        this.openedYet = true;
        this.chatWrapper.classList.add("chat--visible");
    }
    // Hide chat box
    hideChat() {
        this.chatWrapper.classList.remove("chat--visible");
    }

    openConnection() {
        // Call IO function from footer IO JS
        this.socket = io();
    }

    injectHTML() {
        this.chatWrapper.innerHTML = `
        <div class="chat-title-bar">Chat <span class="chat-title-bar-close"><i class="fas fa-times-circle"></i></span></div>
        <div id="chat" class="chat-log"></div>

        <form id="chatForm" class="chat-form border-top">
            <input type="text" class="chat-field" id="chatField" placeholder="Type a message…" autocomplete="off">
        </form>
        `;
    }
}
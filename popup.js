import { getCurrentTab } from "./utils.js";

const addNewBookmark = (bookmark, bookmarksElement) => {
    const bookmarkTitleElement = document.createElement("div");
    const newBookmarkElement = document.createElement("div");
    const controlsElement = document.createElement("div");
    bookmarkTitleElement.textContent = bookmark.desc;
    bookmarkTitleElement.className = "bookmark-title";

    controlsElement.className = "bookmark-title";

    newBookmarkElement.id = "bookmark-" + bookmark.time;
    newBookmarkElement.className = "bookmark";
    newBookmarkElement.setAttribute("timestamp", bookmark.time);

    setBookmarkAttributes("play", onPlay, controlsElement);
    setBookmarkAttributes("delete", onDelete, controlsElement);

    newBookmarkElement.appendChild(bookmarkTitleElement);
    newBookmarkElement.appendChild(controlsElement);
    bookmarksElement.appendChild(newBookmarkElement);

};


const viewBookmark = (currentBookmarks = []) => {
    const bookmarksElement = document.getElementById("bookmarks");
    bookmarksElement.innerHTML = "" ;
    if (currentBookmarks.length > 0){
        for (let i = 0; i < currentBookmarks.length; i++){
            const bookmark = currentBookmarks[i];
            addNewBookmark(bookmarksElement, bookmark);
        }
    }
    else{
        bookmarksElement.innerHTML = '<i class = "row">No Bookmarks to Show</i>'
    }
};


const onPlay = async e => {
    const timpeStamp = e.target.parentNode.parentNode.getAttribute("timestamp");
    const activeURL = await getCurrentTab();

    chrome.tabs.sendMessage(activeURL.id,{
        type : "PLAY",
        value : timpeStamp
    });
};


const onDelete = async e => {
    
    const timpeStamp = e.target.parentNode.parentNode.getAttribute("timestamp");
    const activeURL = await getCurrentTab();
    const bookmarkElementToDelete = document.getElementById("bookmark-" + timpeStamp);
    bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);

    chrome.tabs.sendMessage(activeURL.id,{
        type : "DELETE",
        value : timpeStamp
    }, viewBookmark);
};

const setBookmarkAttributes = (src, eventListener, controlParentElement) => {
    const controlElement = document.createElement("img");
    controlElement.src = "./assets/" + src + ".png";
    controlElement.title = src;
    controlElement.addEventListener("click", eventListener);
    controlParentElement.appendChild(controlElement);
};

document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = getCurrentTab();
    const queryParameters = activeTab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    const currentVideo = urlParameters.get("v");

    if (activeTab.url.includes("youtube.com/watch") && currentVideo){
        chrome.storage.sync.get([currentVideo], (data) => {
            const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];
            viewBookmark(currentVideoBookmarks)
        })
    }else{
        const container = document.getElementsByClassName("container")[0];

        container.innerHTML = '<div class = "title">This is not a youtube video page.</div>';
    }
})
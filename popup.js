import { getCurrentTab } from "./utils.js";

const addNewBookmark = () => {};


const viewBookmark = () => {};


const onPlay = e => {};


const onDelete = e => {};

const setBookmarkAttributes = () => {};

document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = getCurrentTab();
    const queryParameters = activeTab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    const currentVideo = urlParameters.get("v");

    if (activeTab.url.includes("youtube.com/watch") && currentVideo){
        chrome.storage.sync.get([currentVideo], (data) => {
            const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];

        })
    }else{
        const container = document.getElementsByClassName("container")[0];

        container.innerHTML = '<div class = "title">This is not a youtube video page.</div>';
    }
})
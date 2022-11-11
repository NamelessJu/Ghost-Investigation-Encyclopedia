window.addEventListener("DOMContentLoaded", () => {

    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        
        let promptEvent = e;

        bookmarkInstall.style.display = "";
        
        bookmarkInstall.addEventListener("click", () => {
            if (promptEvent != null) {
                promptEvent.prompt();

                promptEvent.userChoice.then(result => {
                    if (result.outcome == "accepted") {
                        promptEvent = null;
                        bookmarkInstall.style.display = "none";
                    }
                });
            }
        });
    });

    
    const bookmarkUpdate = id("bookmark-update");
    const bookmarkCopylink = id("bookmark-copylink");
    const bookmarkInstall = id("bookmark-install");

    const pages = Array.from(classes("page"));
    const errorPage = id("page-error");
    const updatePage = id("page-update");
    
    pages.forEach((e, i) => {
        if ([errorPage.id].includes(e.id))
            pages.splice(i, 1);
    });

    const pageNumberLeft = id("page-number-left");
    const pageNumberRight = id("page-number-right");
    const btnPagePrevious = id("btn-page-previous");
    const btnPageNext = id("btn-page-next");
    

    bookmarkInstall.style.display = "none";

    bookmarkCopylink.addEventListener("animationend", () => {
        bookmarkCopylink.classList.remove("success-icon");
    })
    bookmarkCopylink.addEventListener("click", () => {
        navigator.clipboard.writeText(window.location.href);
        bookmarkCopylink.classList.add("success-icon");
    });


    btnPagePrevious.addEventListener("click", () => {
        openPage(getOpenedPageIndex() - 1);
    });

    btnPageNext.addEventListener("click", () => {
        openPage(getOpenedPageIndex() + 1);
    });


    window.addEventListener("hashchange", openHashPage)



    const titleBase = document.title;



    openPage(0, false);
    openHashPage();

    let lastViewedUpdate = window.localStorage.getItem("lastViewedUpdate");
    if (lastViewedUpdate != null && compareVersions(lastViewedUpdate, updatePage.dataset.updateversion) <= 0) 
        disableUpdateHighlight();



    function openPage(index, pushState = true) {
        if (pages.length <= 0) return;

        if (index >= pages.length) index = -1;
        let page = index == -1 ? errorPage : pages[index];

        errorPage.classList.remove("page-opened")
        pages.forEach(element => element.classList.remove("page-opened"));
        page.classList.add("page-opened");

        if (page == updatePage) {
            disableUpdateHighlight();

            let version = updatePage.dataset.updateversion;
            window.localStorage.setItem("lastViewedUpdate", version);
        }


        if (index == -1) {
            pageNumberLeft.innerText = "";
            pageNumberRight.innerText = "";
        }
        else {
            pageNumberLeft.innerText = index * 2 + 1;
            pageNumberRight.innerText = index * 2 + 2;
        }

        let pageBody = page.getElementsByClassName("page-body")[0];
        if (pageBody != undefined)
            pageBody.scrollTop = 0;
        
        btnPagePrevious.removeAttribute("disabled");
        btnPageNext.removeAttribute("disabled");
        if (index <= 0) btnPagePrevious.setAttribute("disabled", "disabled");
        if (index >= pages.length - 1 || index == -1) btnPageNext.setAttribute("disabled", "disabled");

        let pageHeading = getOpenedPageHeading();
        document.title = (index > 0 ? pageHeading.innerText + " - " : "") + titleBase;

        if (pushState)
            window.history.pushState(null, "", index > 0 ? "#" + getOpenedPageHash() : window.location.pathname + window.location.search);
    }

    function getOpenedPageIndex() {
        for (let i = 0; i < pages.length; i ++) {
            if (pages[i].classList.contains("page-opened")) return i;
        }
        return -1;
    }

    function getHashPageIndex() {
        if (window.location.hash.length < 2) return 0;

        let hash = window.location.hash.substring(1);

        let hashNumber = Number.parseInt(hash);
        if (!isNaN(hashNumber)) return Math.floor((hashNumber - 1) / 2);

        let currentElement = document.getElementById(hash);
        while (currentElement != undefined && currentElement != document.body) {
            let pageIndex = pages.indexOf(currentElement);
            if (pageIndex >= 0) return pageIndex;

            if (currentElement.parentElement != null) currentElement = currentElement.parentElement;
            else currentElement = undefined;
        }
        
        return -1;
    }

    function getOpenedPageHash() {
        let pageHeading = getOpenedPageHeading();
        
        if (pageHeading != null)
            return pageHeading.id;
        else
            return (index * 2 + 1);
    }

    function getOpenedPageHeading() {
        let index = getOpenedPageIndex();
        let page = pages[index];
        if (page == undefined) return null;
        
        let mainHeadings = page.getElementsByTagName("h1");
        
        if (mainHeadings.length > 0 && mainHeadings[0].id.length > 0)
            return mainHeadings[0];
        
        return null;
    }


    function openHashPage() {
        openPage(getHashPageIndex(), false);
    }



    function disableUpdateHighlight() {
        bookmarkUpdate.classList.remove("bookmark-special");
        Array.from(classes("fa", bookmarkUpdate)).forEach((e) => {
            e.classList.remove("fa-beat");
        });
    }


    /* Utility functions */

    function id(id) {
        return document.getElementById(id);
    }

    function classes(classes, container = null) {
        return (container != null ? container : document).getElementsByClassName(classes);
    }
    
    function compareVersions(from, to) {
        function getComparableVersion(version) {
            version = version.replaceAll(/[,_\\-\\+]/g, ".");
            
            previousCharacterIsNumerical = false;
            previousCharacterIsDot = false;
            for (let i = 0; i < version.length; i ++) {
                c = version[i];
                
                if (c != ".") {
                    isNumerical = "0" <= c && c <= "9";
                    
                    if (i > 0 && !previousCharacterIsDot && previousCharacterIsNumerical != isNumerical) {
                        version = version.substring(0, i) + "." + version.substring(i);
                        i ++;
                    }
                    
                    previousCharacterIsNumerical = isNumerical;
                    previousCharacterIsDot = false;
                }
                else previousCharacterIsDot = true;
            }
            
            return version;
        }

        from = getComparableVersion(from);
        to = getComparableVersion(to);
        
        fromParts = from.split(".");
        toParts = to.split(".");
        
        for (let i = 0; (i < fromParts.length || i < toParts.length); i ++) {
            
            fromInt = -1;
            toInt = -1;
            fromString = null;
            toString = null;
            
            
            if (i < fromParts.length) {
                if (fromParts[i].length == 0) fromInt = 0;
                else {
                    let intval = parseInt(fromParts[i]);
                    if (!isNaN(intval))
                        fromInt = intval;
                    else
                        fromString = fromParts[i];
                }
            }
            
            if (i < toParts.length) {
                if (toParts[i].length == 0) toInt = 0;
                else {
                    let intval = parseInt(toParts[i]);
                    if (!isNaN(intval))
                        toInt = intval;
                    else
                        toString = toParts[i];
                }
            }
            
            // from or to empty
            if (fromInt < 0 && fromString == null) return 1;
            else if (toInt < 0 && toString == null) return -1;
            
            // both ints or both strings
            else if (fromInt >= 0 && toInt >= 0 && fromInt != toInt) return Math.sign(toInt - fromInt);
            else if (fromString != null && toString != null && fromString != toString) return toString < fromString;
            
            // string and int mixed
            else if (fromInt >= 0 && toString != null) return -1;
            else if (fromString != null && toInt >= 0) return 1;
        }
        
        return 0;
    }
});


if (window.location.protocol.startsWith("http") && "serviceWorker" in navigator) {
    navigator.serviceWorker.register("serviceworker.js", {scope: "."}).then(null,
        error => console.error("Service Worker registration failed: " + error)
    );
}
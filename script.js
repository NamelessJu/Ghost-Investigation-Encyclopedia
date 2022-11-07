

window.addEventListener("load", () => {

    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        
        const promptEvent = e;

        bookmarkInstall.style.display = "";
        
        bookmarkInstall.addEventListener("click", (e) => {
            promptEvent.prompt();
        });
    });

    
    const bookmarkCopylink = id("bookmark-copylink");
    const bookmarkInstall = id("bookmark-install");

    const pages = Array.from(classes("page"));
    pages.forEach((e, i) => {
        if (["error-page"].includes(e.id))
            pages.splice(i, 1);
    });
    
    const errorPage = id("error-page");

    const pageNumberLeft = id("page-number-left");
    const pageNumberRight = id("page-number-right");
    const btnPagePrevious = id("btn-page-previous");
    const btnPageNext = id("btn-page-next");
    

    bookmarkInstall.style.display = "none";


    bookmarkCopylink.addEventListener("click", () => {
        navigator.clipboard.writeText(window.location.href);
    });


    btnPagePrevious.addEventListener("click", () => {
        openPage(getOpenedPageIndex() - 1);
    });

    btnPageNext.addEventListener("click", () => {
        openPage(getOpenedPageIndex() + 1);
    });


    window.addEventListener("hashchange", openHashPage)



    openPage(0, false);
    openHashPage();



    function openPage(index, pushState = true) {
        if (pages.length <= 0) return;

        if (index >= pages.length) index = -1;
        let page = index == -1 ? errorPage : pages[index];

        errorPage.classList.remove("page-opened")
        pages.forEach(element => element.classList.remove("page-opened"));
        page.classList.add("page-opened");

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

        if (pushState)
            window.history.pushState(null, "", "#" + getOpenedPageHash());
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

        let currentElement = document.querySelector("[id=" + hash + "]");
        while (currentElement != undefined && currentElement != document.body) {
            let pageIndex = pages.indexOf(currentElement);
            if (pageIndex >= 0) return pageIndex;

            if (currentElement.parentElement != null) currentElement = currentElement.parentElement;
            else currentElement = undefined;
        }
        
        return -1;
    }

    function getOpenedPageHash() {
        let index = getOpenedPageIndex();
        let page = pages[index];
        let mainHeadings = page.getElementsByTagName("h1");
        
        if (mainHeadings.length > 0 && mainHeadings[0].id.length > 0)
            return mainHeadings[0].id;
        else
            return (index * 2 + 1);
    }


    function openHashPage() {
        openPage(getHashPageIndex(), false);
    }


    function id(id) {
        return document.getElementById(id);
    }

    function classes(classes) {
        return document.getElementsByClassName(classes);
    }
});

    
if (window.location.protocol.startsWith("http") && "serviceWorker" in navigator) {
    navigator.serviceWorker.register("cache.js", {scope: "."}).then(
        function (result) {
            console.log ("Service Worker registered - scope: " + result.scope);
        },
        function (error) {
            console.log ("Service Worker registration failed: " + error);
        }
    );
}
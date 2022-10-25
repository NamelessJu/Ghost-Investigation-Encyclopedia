

window.addEventListener("load", () => {

    const pages = Array.from(document.getElementsByClassName("page"));
    const pageNumberLeft = document.getElementById("page-number-left");
    const pageNumberRight = document.getElementById("page-number-right");
    const btnPagePrevious = document.getElementById("btn-page-previous");
    const btnPageNext = document.getElementById("btn-page-next");


    btnPagePrevious.addEventListener("click", () => {
        openPage(getOpenedPageIndex() - 1);
        window.location.hash = "";
    });

    btnPageNext.addEventListener("click", () => {
        openPage(getOpenedPageIndex() + 1);
        window.location.hash = "";
    });


    window.addEventListener("hashchange", openHashPage)


    openPage(0);
    openHashPage();



    function openPage(index) {
        if (pages.length <= 0 || index < 0 || index >= pages.length) return;
        
        pages.forEach(element => element.classList.remove("page-opened"));
        pages[index].classList.add("page-opened");

        pageNumberLeft.innerText = index * 2 + 1;
        pageNumberRight.innerText = index * 2 + 2;
    }

    function getOpenedPageIndex() {
        for (let i = 0; i < pages.length; i ++) {
            if (pages[i].classList.contains("page-opened")) return i;
        }
        return -1;
    }

    function getHashPageIndex() {
        if (window.location.hash.length < 2) return -1;

        let hash = window.location.hash.substring(1);

        let currentElement = document.querySelector("[reference=" + hash + "]");
        while (currentElement != undefined && currentElement != document.body) {
            let pageIndex = pages.indexOf(currentElement);
            if (pageIndex >= 0) return pageIndex;

            if (currentElement.parentElement != null) currentElement = currentElement.parentElement;
            else currentElement = undefined;
        }
        
        return -1;
    }


    function openHashPage() {
        // Save current page index to go back to if direct next hash change is = ""
        openPage(getHashPageIndex());
    }
});
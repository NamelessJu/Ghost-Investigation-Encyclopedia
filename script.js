

window.addEventListener("load", () => {

    const pages = Array.from(document.getElementsByClassName("page"));
    const pageNumberLeft = document.getElementById("page-number-left");
    const pageNumberRight = document.getElementById("page-number-right");
    const btnPagePrevious = document.getElementById("btn-page-previous");
    const btnPageNext = document.getElementById("btn-page-next");


    btnPagePrevious.addEventListener("click", () => {
        window.location.hash = "";
        openPage(getOpenedPageIndex() - 1);
    });

    btnPageNext.addEventListener("click", () => {
        window.location.hash = "";
        openPage(getOpenedPageIndex() + 1);
    });


    window.addEventListener("hashchange", openHashPage)


    openPage(0, false);
    openHashPage();



    function openPage(index, replaceHash = true) {
        if (pages.length <= 0 || index < 0 || index >= pages.length) return;
        
        pages.forEach(element => element.classList.remove("page-opened"));
        pages[index].classList.add("page-opened");

        pageNumberLeft.innerText = index * 2 + 1;
        pageNumberRight.innerText = index * 2 + 2;

        let pageBody = pages[index].getElementsByClassName("page-body")[0];
        if (pageBody != undefined)
            pageBody.scrollTop = 0;
        
        btnPagePrevious.removeAttribute("disabled");
        btnPageNext.removeAttribute("disabled");
        if (index <= 0) btnPagePrevious.setAttribute("disabled", "disabled");
        else if (index >= pages.length - 1) btnPageNext.setAttribute("disabled", "disabled");

        if (window.location.hash.length <= 1 && replaceHash)
            window.history.replaceState(null, "", "#" + (index * 2 + 1));
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


    function openHashPage() {
        openPage(getHashPageIndex());
    }
});



function searchFunction() {
    const input = document.getElementById("searchInput");
    const filter = input.value.toUpperCase();
    const list = document.getElementById("itemList");
    const items = list.getElementsByTagName("li");

    for (let i = 0; i < items.length; i++) {
        const text = items[i].textContent || items[i].innerText;
        if (text.toUpperCase().indexOf(filter) > -1) {
            items[i].style.display = "";
        } else {
            items[i].style.display = "none";
        }
    }
}

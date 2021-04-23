function changeTab(evt, category) {
    var tabContent = document.getElementsByClassName("tabContent");
    var tabLinks = document.getElementsByClassName("tabLinks");

    [...tabContent].forEach(element => { element.style.display = "none"; });
    [...tabLinks].forEach(element => { element.className = element.className.replace(" active", ""); })
    document.getElementById(category).style.display = "block";
    evt.currentTarget.className += " active";
    window.scrollTo(0, 0)
}

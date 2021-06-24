function filterTable(category) {
    var input = document.getElementById(category + "Input")
    var filter = input.value.toUpperCase();
    var table = document.getElementById(category).lastElementChild;
    var tr = table.getElementsByTagName("tr");
    var column = 0;
    var price = 0;
    var priceSearch = 1;

    if (filter.startsWith("CATEGORY:") && category == "items") {
        filter = filter.substring("category".length + 1).trimLeft();
        column = 2;
    }

    if (filter.startsWith("KARMA:") && category == "events") {
        filter = filter.substring("karma".length + 1).trimLeft();
        column = 2;
    }


    if (category != "traits") {
        if (filter.startsWith("BELOW:")) {
            filter = filter.substring("below".length + 1).trimLeft();
            column = 1;
            price = parseInt(filter);
            priceSearch = -1;
        }
        if (filter.startsWith("ABOVE:")) {
            filter = filter.substring("above".length + 1).trimLeft();
            column = 1;
            price = parseInt(filter);
            priceSearch = 1;
        }

        if (filter.startsWith("EQUALS:")) {
            filter = filter.substring("equals".length + 1).trimLeft();
            column = 1;
            price = parseInt(filter);
            priceSearch = 0;
        }
    } else {
        if (filter.startsWith("ADDBELOW:")) {
            filter = filter.substring("addbelow".length + 1).trimLeft();
            column = 2;
            price = parseInt(filter);
            priceSearch = -1;
        }
        if (filter.startsWith("ADDABOVE:")) {
            filter = filter.substring("addabove".length + 1).trimLeft();
            column = 2;
            price = parseInt(filter);
            priceSearch = 1;
        }

        if (filter.startsWith("ADDEQUALS:")) {
            filter = filter.substring("addequals".length + 1).trimLeft();
            column = 2;
            price = parseInt(filter);
            priceSearch = 0;
        }

        if (filter.startsWith("REMOVEBELOW:")) {
            filter = filter.substring("removebelow".length + 1).trimLeft();
            column = 3;
            price = parseInt(filter);
            priceSearch = -1;
        }
        if (filter.startsWith("REMOVEABOVE:")) {
            filter = filter.substring("removeabove".length + 1).trimLeft();
            column = 3;
            price = parseInt(filter);
            priceSearch = 1;
        }

        if (filter.startsWith("REMOVEEQUALS:")) {
            filter = filter.substring("removeequals".length + 1).trimLeft();
            column = 3;
            price = parseInt(filter);
            priceSearch = 0;
        }
    }

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[column];

        if (td) {
            txtValue = td.textContent || td.innerText;

            if ((category != "traits" && column != 1) || (category == "traits" && column < 2)) {
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            } else {
                intValue = parseInt(txtValue);

                switch (priceSearch) {
                    case 0:
                        tr[i].style.display = (intValue == price) ? "" : "none";
                        break;
                    case 1:
                        tr[i].style.display = (intValue > price) ? "" : "none";
                        break;
                    case -1:
                        tr[i].style.display = (intValue < price) ? "" : "none";
                        break;
                }
            }
        }
    }
}

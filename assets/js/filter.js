function filterTable(category) {
    let input = document.getElementById(category + "Input")
    let table = document.getElementById(category);

    if (table === null) {
        return;
    }

    table = table.lastElementChild;

    let tr = table.getElementsByTagName("tr");
    let params = getSearchParams(table, input.value.toUpperCase());

    for (i = 0; i < tr.length; i++) {
        let td = tr[i].getElementsByTagName("td")[params.column];

        if (td) {
            let txtValue = td.textContent || td.innerText;
            let isVisible = true;

            if (params.numeric !== null) {
                let numeric = Number.parseInt(txtValue);

                switch (params.comparison) {
                    case ">":
                        isVisible = numeric > params.numeric;
                        break;
                    case "<":
                        isVisible = numeric < params.numeric;
                        break;
                    case "<=":
                        isVisible = numeric <= params.numeric;
                        break;
                    case ">=":
                        isVisible = numeric >= params.numeric;
                        break;
                    default:
                        isVisible = numeric === params.numeric;
                        break;
                }
            } else {
                isVisible = txtValue.toUpperCase().includes(params.query);
            }

            tr[i].style.display = isVisible ? "" : "none";
        }
    }
}

function getSearchParams(table, query) {
    let response = { "column": 0, "query": query, "comparison": "=", "numeric": null };
    let tHead = table.firstElementChild;
    let tRow = tHead.firstElementChild;
    let headers = [];

    for (let i = 0; i < tRow.childNodes.length; i++) {
        let node = tRow.childNodes[i];

        if (node.nodeName !== "TH") {
            continue;
        }

        let text = node.innerText || node.textContent;
        headers.push(text.toUpperCase().replace(" ", ""));
    }

    for (let i = 0; i < headers.length; i++) {
        let header = headers[i];

        if (query.startsWith(header)) {
            response.query = response.query.substring(header.length + 1).trimLeft();
            response.column = i;
        }
    }

    switch (response.query.substring(0, 1)) {
        case ">":
        case "<":
        case "=":
            let result = processComparison(response.query);
            response.comparison = result.comparison;
            response.numeric = result.numeric;

            console.log(response);
            break;
    }

    return response;
}

function processComparison(query) {
    let response = { "comparison": "=", "numeric": 0 };
    let first = query.substring(0, 1);
    let second = query.substring(1, 1);

    response.comparison = first;

    if (second === "=") {
        response.comparison = response.comparison + second;
    }

    let stripped = query.substring(response.comparison.length).trimLeft();

    if (stripped.length <= 0) {
        response.numeric = 0;
    } else {
        response.numeric = Number.parseInt(stripped);
    }

    return response;
}

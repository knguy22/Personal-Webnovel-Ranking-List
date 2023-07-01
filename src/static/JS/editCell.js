document.querySelectorAll('td')
        .forEach(e => e.addEventListener('keydown', editCell));

async function editCell(evt){
    if (evt.key === "Enter") {
        console.log("Enter pressed!");
        $('div[contenteditable="true"]').trigger('focus').trigger('blur');
        
        var row = evt.target.parentElement;
        let url = row.cells[2].children[0].children[0].getAttribute("href");
        let val;
        let col;
        let date_val = row.cells[8].children[0].innerHTML;

        for (let i = 0; i < row.cells.length; i++) {
            if (row.cells[i] == evt.target) {
                val = row.cells[i].children[0].innerHTML;
                col = row.parentElement.parentElement.rows[0].cells[i].innerHTML;
                break;
            }
        }
        const server_success = await sendDataToServer(url, col, val, date_val);

        if (server_success == 'true') {
            old_date_div = row.cells[8].children[0];
            new_date_div = getDivCurrDate()
            row.cells[8].replaceChild(new_date_div, old_date_div);        
        }
    }
}

async function sendDataToServer(url, col, val, date_val) {
    const send_post = await fetch(`/editCell`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            url: url,
            col: col,
            val: val,
            date_val: date_val})
        })
        .then(response => response.json());

    if (send_post['result'] == 'false') {
        console.log("friend");
        return 'false';
    }

    const send_get = await fetch(`/editCell`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then(response => response.json());
    return send_get['result'];
}

function getDivCurrDate() {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    if (String(month).length == 1) {
        month = `0${month}`
    }
    let currentDate = `${year}-${month}-${day}`;

    var div = document.createElement('div');
    div.setAttribute('class', "scrollable");
    div.innerHTML = currentDate;
    return div;
}

// update row in DB
// maybe includes using the URL method to automatically populate genre tags
// delete rows
// delete cell, double click to edit?
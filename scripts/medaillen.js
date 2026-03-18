function fetchAndProcessExcelFile(url,discipline) {
    fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => {
            var workbook = XLSX.read(data, { type: 'array' });

            // Get the first sheet
            /*
                8 -> Medaillen
                7 -> Database - alle olympiaden
                0 -> Summe_Punkte - Gesamtwertung
                6 -> Olympiade_6
                .
                .
                1 -> Olympiade_1
            */
            //var firstSheetName = workbook.SheetNames[10];
            var worksheet = workbook.Sheets["Medaillen"];

            // Convert the sheet to JSON format
            var jsonData = XLSX.utils.sheet_to_json(worksheet);
            displayTable(jsonData,discipline)

            // Process the data (e.g., calculate sums, create new tables)
            
        })
        .catch(error => console.error('Error fetching the Excel file:', error));        
    }

function print(text){
    console.log(text)
}

function displayTable(data,discipline){
    var element = document.getElementById("auswertungen"); 
    while (element.firstChild) { 
        element.removeChild(element.firstChild); 
         
    }
    
    switch (discipline){
        case 0:
            var title = "Endplatzierungen"
            break;
        case 1:
            var title = "Flunkyball"
            break;
        case 2:
            var title = "Beerpong"
            break;
        case 3:
            var title = "Flipcup"
            break;
        case 4:
            var title = "Gesamt Medaillen"
            break;
        default:
            var title = "Medaillen"
    }
    document.getElementById("title").innerHTML = title  

    for (var i = 0; i < data.length ; i++){           
        var slot = document.createElement("tr")
        var rank = document.createElement("td")
        var pic = document.createElement("img")
        var name = document.createElement("figcaption")
        var profile = document.createElement("td")
        var first = document.createElement("td")
        var second = document.createElement("td")
        var third = document.createElement("td")
        var gesamt = document.createElement("td")
        pic.src="images/profilbilder/default.png"        
        
        var player_name = data[i].Name.toLowerCase()
        pic.src = "images/profilbilder/" + player_name +".png"

        
        if(player_name == "anna" || player_name == "jochen" || player_name == "lina" || player_name == "luisa" || player_name == "tim"){
            pic.src="images/profilbilder/default.png"
            
        }

        pic.onclick = function(){
            openModal(this);
        };

        rank.innerHTML += data[i].Platzierung
        profile.appendChild(pic)
        name.innerHTML += data[i].Name
        profile.appendChild(name) 

        switch (discipline){
            case 0:
                first.innerHTML += data[i].Platz_1st 
                second.innerHTML += data[i].Platz_2nd
                third.innerHTML += data[i].Platz_3rd
                gesamt.innerHTML +=  data[i].Platz_Gesamt
                break;
            case 1:
                first.innerHTML += data[i].Flunkyball_1st 
                second.innerHTML += data[i].Flunkyball_2nd
                third.innerHTML += data[i].Flunkyball_3rd
                gesamt.innerHTML +=  data[i].Flunkyball_Gesamt
                break;
            case 2:
                first.innerHTML += data[i].Beerpong_1st 
                second.innerHTML += data[i].Beerpong_2nd
                third.innerHTML += data[i].Beerpong_3rd
                gesamt.innerHTML +=  data[i].Beerpong_Gesamt
                break;
            case 3:
                first.innerHTML += data[i].Flipcup_1st 
                second.innerHTML += data[i].Flipcup_2nd
                third.innerHTML += data[i].Flipcup_3rd
                gesamt.innerHTML +=  data[i].Flipcup_Gesamt
                break;
            case 4:
                first.innerHTML += data[i].Gesamt_1st 
                second.innerHTML += data[i].Gesamt_2nd
                third.innerHTML += data[i].Gesamt_3rd
                gesamt.innerHTML +=  data[i].Gesamt_Gesamt
                break;
            default:
                var title = "Medaillen"
        }

        slot.appendChild(rank)
        slot.appendChild(profile)
        slot.appendChild(first)
        slot.appendChild(second)
        slot.appendChild(third)
        slot.appendChild(gesamt)
        var ausw = "auswertungen" 
        document.getElementById(ausw).appendChild(slot)

        }
    }   

function sortTable(sort){
    const table = document.getElementById("auswertungen_table")
    var sortID = ""
    var columnIndex = 0
    switch (sort){
        case 0:
            sortID="platz"
            columnIndex = 0
            break;
        case 1:
            sortID = "spieler"
            columnIndex = 1
            break;
        case 2:
            sortID = "first"
            columnIndex = 2
            break;
        case 3:
            sortID = "second"
            columnIndex = 3
            break;
        case 4:
            sortID = "third"
            columnIndex = 4
            break;
        default:
            sortID="gesamt"
            columnIndex = 5
    }
    const id = document.getElementById(sortID)
    const rows = Array.from(table.querySelectorAll('tbody tr'))
    const tbody = table.querySelector('tbody');
    
    const sortedRows = rows.sort((a, b) => {
        const aText = a.cells[columnIndex].textContent.trim();
        const bText = b.cells[columnIndex].textContent.trim();
        
        // Convert text content to number if possible
        const aValue = isNaN(aText) ? aText : parseFloat(aText);
        const bValue = isNaN(bText) ? bText : parseFloat(bText);
        if (sort == 0 || sort == 1){
            return aValue > bValue ? 1 : (aValue < bValue ? -1 : 0);
        }
        else{
            return aValue < bValue ? 1 : (aValue > bValue ? -1 : 0);
        }
        
    });

    tbody.innerHTML = ' ';
    sortedRows.forEach(row => tbody.appendChild(row));
}
function loadTable(discipline){
    fetchAndProcessExcelFile("./auswertungen/olympiaden.xlsx",discipline)
    sortTable(2)
}
loadTable(0)
function fetchAndProcessExcelFile(url) {
    fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => {
            var workbook = XLSX.read(data, { type: 'array' });

            // Get the first sheet
            /*
                7 -> Database - alle olympiaden
                0 -> Summe_Punkte - Gesamtwertung
                6 -> Olympiade_6
                .
                .
                1 -> Olympiade_1
            */
            var firstSheetName = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[firstSheetName];

            // Convert the sheet to JSON format
            var jsonData = XLSX.utils.sheet_to_json(worksheet);
            displayTable(jsonData)

            // Process the data (e.g., calculate sums, create new tables)
            
        })
        .catch(error => console.error('Error fetching the Excel file:', error));        
    }

function print(text){
    console.log(text)
}

function displayTable(data){
    var element = document.getElementById("auswertungen"); 
    while (element.firstChild) { 
        element.removeChild(element.firstChild); 
         
    }
    document.getElementById("title").innerHTML = "Gesamtauswertung"  

    for (var i = 0; i < data.length ; i++){           
        var slot = document.createElement("tr")
        var rank = document.createElement("td")
        var pic = document.createElement("img")
        var name = document.createElement("figcaption")
        var profile = document.createElement("td")
        var flunkyball = document.createElement("td")
        var beerpong = document.createElement("td")
        var flipcup = document.createElement("td")
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
        flunkyball.innerHTML += data[i].Flunkyball 
        beerpong.innerHTML += data[i].Beerpong
        flipcup.innerHTML += data[i].Flipcup
        gesamt.innerHTML +=  data[i].Gesamtpunkte 

        slot.appendChild(rank)
        slot.appendChild(profile)
        slot.appendChild(flunkyball)
        slot.appendChild(beerpong)
        slot.appendChild(flipcup)
        slot.appendChild(gesamt)
        var ausw = "auswertungen" 
        document.getElementById(ausw).appendChild(slot)


        }
    }   
function loadTable(){
    fetchAndProcessExcelFile("./auswertungen/olympiaden.xlsx")
}
loadTable()

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
            sortID = "flunkyball"
            columnIndex = 2
            break;
        case 3:
            sortID = "beerpong"
            columnIndex = 3
            break;
        case 4:
            sortID = "flipcup"
            columnIndex = 4
            break;
        default:
            sortID="platz"
            columnIndex = 0
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
        if (columnIndex == 0 || columnIndex == 1){
            return aValue > bValue ? 1 : (aValue < bValue ? -1 : 0);
        }
        else{
            return aValue < bValue ? 1 : (aValue > bValue ? -1 : 0);
        }
        
    });

    tbody.innerHTML = ' ';
    sortedRows.forEach(row => tbody.appendChild(row));
}

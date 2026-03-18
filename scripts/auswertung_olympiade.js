function fetchAndProcessExcelFile(url,olympiade) {
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
            var firstSheetName = workbook.SheetNames[olympiade];
            var worksheet = workbook.Sheets[firstSheetName];

            // Convert the sheet to JSON format
            var jsonData = XLSX.utils.sheet_to_json(worksheet);
            displayTable(jsonData,olympiade)

            // Process the data (e.g., calculate sums, create new tables)
            
        })
        .catch(error => console.error('Error fetching the Excel file:', error));        
    }

function print(text){
    console.log(text)
}

function displayTable(data,olympiade){
    var element = document.getElementById("auswertungen"); 
    while (element.firstChild) { 
        element.removeChild(element.firstChild); 
         
    }
    document.getElementById("title").innerHTML = "Olympiade " +  olympiade.toString()

    for (var i = 0; i < data.length ; i++){           
        var slot = document.createElement("tr")
        var rank = document.createElement("td")
        var pic1 = document.createElement("img")
        var pic2 = document.createElement("img")
        var name = document.createElement("figcaption")
        var profile = document.createElement("td")
        var flunkyball = document.createElement("td")
        var beerpong = document.createElement("td")
        var flipcup = document.createElement("td")
        var gesamt = document.createElement("td")
        pic1.src="images/profilbilder/default.png"        
        
        var player1_name = data[i].Name.toLowerCase()
        name.innerHTML += data[i].Name
        i = i+1
        var player2_name = data[i].Name.toLowerCase()
        name.innerHTML += " & " + data[i].Name
        pic1.src = "images/profilbilder/" + player1_name +".png"
        pic2.src = "images/profilbilder/" + player2_name +".png"
        
        if(player1_name == "anna" || player1_name == "jochen" || player1_name == "lina" || player1_name == "luisa" || player1_name == "tim"){
            pic1.src="images/profilbilder/default.png"
        }
        if(player2_name == "anna" || player2_name == "jochen" || player2_name == "lina" || player2_name == "luisa" || player2_name == "tim"){
            pic2.src="images/profilbilder/default.png"
        }
        if (olympiade == 2 && i == 5){
            i = i+1
            var pic3 = document.createElement("img")
            var player3_name = data[i].Name.toLowerCase()
            pic3.src = "images/profilbilder/" + player2_name +".png"
            if(player3_name == "anna" || player3_name == "jochen" || player3_name == "lina"){
                pic3.src="images/profilbilder/default.png"
            }
            name.innerHTML += " & " + data[i].Name
            pic3.onclick = function(){
                openModal(this);
            }
        }

        pic1.onclick = function(){
            openModal(this);
        };
        pic2.onclick = function(){
            openModal(this);
        };

        rank.innerHTML += data[i].Platzierung
        profile.appendChild(pic1)
        profile.appendChild(pic2)
        if (olympiade == 2 && i == 5){
            i = i+1
            var pic3 = document.createElement("img")
            var player3_name = data[i].Name.toLowerCase()
            pic3.src = "images/profilbilder/" + player3_name +".png"
            if(player3_name == "mo" || player3_name == "anna" || player3_name == "anton" || player3_name == "jochen" || player3_name == "bruno" || player3_name == "lina" || player3_name == "melli" || player3_name == "charlie" || player3_name == "matthias" || player3_name == "oskar" || player3_name == "basti"){
                pic3.src="images/profilbilder/default.png"
            }
            name.innerHTML += " & " + data[i].Name
            pic3.onclick = function(){
                openModal(this);
            }
            profile.appendChild(pic3)
        }
        //name.innerHTML += data[i].Name
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
function loadTable(olympiade){
    fetchAndProcessExcelFile("./auswertungen/olympiaden.xlsx",olympiade)
}
loadTable(8)

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

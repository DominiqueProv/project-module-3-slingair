const flightInput = document.getElementById('flight');
const seatsDiv = document.getElementById('seats-section');
const confirmButton = document.getElementById('confirm-button');
const dropDown = document.getElementById('flight-selector');
const selectElement = document.querySelector('flight-selector');

const populateDropDown = async () => {
    const response = await fetch('/flightNumber/');
    const data = await response.json();
    
    data.forEach((item) => {
        const menuItem = document.createElement("option");
        const menuContent = item;
        menuItem.innerText = menuContent;
        dropDown.appendChild(menuItem);
        menuItem.id = menuContent;
        
        
    })
    
}




let selection = '';

const renderSeats = (data) => {

    document.querySelector('.form-container').style.display = 'block';

    const alpha = ['A', 'B', 'C', 'D', 'E', 'F'];
    for (let r = 1; r < 11; r++) {
        const row = document.createElement('ol');
        row.classList.add('row');
        row.classList.add('fuselage');
        seatsDiv.appendChild(row);
        for (let s = 1; s < 7; s++) {
            const seatNumber = `${r}${alpha[s - 1]}`;
            const seat = document.createElement('li')
            const seatOccupied = `<li><label class="seat" id="${"seat" + seatNumber}"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`
            const seatAvailable = `<li><label class="seat" id="${"seat" + seatNumber}"><input type="radio" name="seat" value="${seatNumber}" /><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`
            seat.innerHTML = seatAvailable;
            row.appendChild(seat);

        }
    }

    data.forEach((item) => {
        if (item.isAvailable === false) {
            document.getElementById(item.id).classList.toggle('occupied');
            document.getElementById('seat' + item.id).classList.toggle('occupiedSeat');
        }
    })

    let seatMap = document.forms['seats'].elements['seat'];
    seatMap.forEach(seat => {
        seat.onclick = () => {
            selection = seat.value;
            seatMap.forEach(x => {
                if (x.value !== seat.value) {
                    document.getElementById(x.value).classList.remove('selected');
                }
            })
            document.getElementById(seat.value).classList.add('selected');
            document.getElementById('seat-number').innerText = `(${selection})`;
            confirmButton.disabled = false;
        }
    });
}

const toggleFormContent = async (event) => {
    const flightNumber = selectElement.value;
    const response = await fetch(`/seatingavailability/SA${flightNumber}`);
    const data = await response.json();
    renderSeats(data)
    //     //this is where I tell what to do with the data DOM etc. 
    //   }).then(data => renderSeats(data))
    //   .catch(err => console.log(err))

    // TODO: contact the server to get the seating availability
    //      - only contact the server if the flight number is this format 'SA###'.
    //      - Do I need to create an error message if the number is not valid?

    // TODO: Pass the response data to renderSeats to create the appropriate seat-type.
}






const handleConfirmSeat = (event) => {
    event.preventDefault();
    // TODO: everything in here!

    const seatNumber = document.getElementById('seat-number').innerHTML.slice(1, -1);
    const flightNo = `SA${document.getElementById('flight').value}`;
    const customerId = new Date();
    const firstName = document.getElementById('givenName').value;
    const lastName = document.getElementById('surname').value;
    const email = document.getElementById('email').value;

    const data = {
        id: customerId.getTime(),
        flight: flightNo,
        firstName: firstName,
        lastName: lastName,
        email: email,
        seatNumber: seatNumber
    }


    fetch('/userConfimation/', {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .then(response => {
            console.log(response)
            window.location.href = "/seat-select/confirmed.html"
        }).catch(error => console.error('Error:', error));
}

flightInput.addEventListener('blur', toggleFormContent);

populateDropDown();
const seatsDiv = document.getElementById('seats-section');
const confirmButton = document.getElementById('confirm-button');
const dropDown = document.getElementById('flight-selector');
const selectElement = document.querySelector('#flight-selector');


const populateDropDown = () => {
    fetch('/flightNumber')
        .then(function (response) {
            console.log(response)
            return response.json();
        })
        .then(function (obj) {
            console.log(obj);
            obj.flights.forEach((item) => {
                const menuItem = document.createElement("option");
                const menuContent = item;
                menuItem.innerText = menuContent;
                dropDown.appendChild(menuItem);
                menuItem.id = menuContent;
            });
        })
};


let selection = '';

const renderSeats = (data) => {
    seatsDiv.innerHTML = "";
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
    const response = await fetch(`/seatingavailability/${flightNumber}`);
    const data = await response.json();
    console.log('-------------')
    console.log(data)
    renderSeats(data[flightNumber])
}

const handleConfirmSeat = (event) => {
    event.preventDefault();

    const seatNumber = document.getElementById('seat-number').innerHTML.slice(1, -1);
    const flightNo = `${document.getElementById('flight-selector').value}`;
    const firstName = document.getElementById('givenName').value;
    const lastName = document.getElementById('surname').value;
    const email = document.getElementById('email').value;

    const data = {
        flight: flightNo,
        givenName: firstName,
        surname: lastName,
        email: email,
        seat: seatNumber
    }


    fetch('/userConfimation/', {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .then(response => {
            // console.log(response)
            const flightNo = response.reservation.flight;
            const givenName = response.reservation.givenName;
            const surname = response.reservation.surname;
            const email = response.reservation.email;
            const seat = response.reservation.seat;
            const userId = response.reservation.id;

        window.location.href = `/seat-select/confirmed.html?flight=${flightNo}&givenName=${givenName}&surname=${surname}&email=${email}&seat=${seat}&id=${userId}`
        }).catch(error => console.error('Error:', error));
}

populateDropDown();
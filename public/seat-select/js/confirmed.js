let searchParams = (window.location.search)
let url = new URL (window.location.href)

const userflight = document.getElementById('flight');
const userSeat = document.getElementById('seat');
const userEmail = document.getElementById('email');
const userName = document.getElementById('name');


searchParams = searchParams.split('?')
searchParams = searchParams[1].split(/['=' '&']/)
let filterParams = searchParams.filter((x, index ) => {
    if (index % 2 === 1){
        return x
    }
})
userflight.innerText = `${filterParams[0]}`;
userSeat.innerText = `${filterParams[4]}`;
userName.innerText = `${filterParams[1]} ${filterParams[2]} `;
userEmail.innerText = `${filterParams[3]}`;
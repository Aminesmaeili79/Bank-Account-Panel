'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};

let accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
    ['USD', 'United States dollar'],
    ['EUR', 'Euro'],
    ['GBP', 'Pound sterling'],
]);


/////////////////////////////////////////////////

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const userNames = accounts.map(account => {
    return account.owner.split(" ")[0][0].toLowerCase() + account.owner.split(" ")[1][0].toLowerCase();
});

var currentUser;
var currentUserName;

const logOut = () => {
    currentUserName = "";
    currentUser = null;
    containerApp.classList.add('hidden')
    labelWelcome.innerText = "Log in to get started"
    preemptInputs();
}

const handleCredentials = (e) => {
    e.preventDefault()
    const userName = inputLoginUsername.value;
    if (userNames.includes(userName)) {
        if (String(accounts[userNames.indexOf(userName)].pin) === inputLoginPin.value) {
            containerApp.classList.remove('hidden');
            return accounts[userNames.indexOf(userName)];
        }
    }
};

const convertToCurrency = (currencyLabel, user) => {
    return Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyLabel
    }).format(user.movements.reduce((total, movement) => total += movement, 0,));
}

const preemptInputs = () => {
    inputLoginUsername.value = "";
    inputLoginPin.value = "";
    inputTransferAmount.value = "";
    inputTransferTo.value = "";
    inputLoanAmount.value = "";
    inputClosePin.value = "";
    inputCloseUsername.value = "";
}

const requestLoan = () => {
    currentUser.movements.push(Number(inputLoanAmount.value));
    fillLabels(currentUser);
    displayMovements(currentUser);
}

const fillLabels = (user) => {
    labelBalance.innerText = convertToCurrency("USD", user);

    labelSumIn.innerText = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(user.movements.filter((movement) => {
        return movement > 0;
    }).reduce((totalIn, amount) => totalIn += amount, 0));

    labelSumOut.innerText = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(user.movements.filter((movement) => {
        return movement < 0;
    }).reduce((totalOut, amount) => totalOut += amount, 0));

    labelSumInterest.innerText = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(Math.abs(user.movements.filter((movement) => {
        return movement > 0;
    }).reduce((totalInterest, amount) => totalInterest += amount * (1 - user.interestRate), 0)));

    var hour = new Date().getHours();

    var dayGreetings = "";

    if (hour >=4 && hour < 11)
        dayGreetings = "morning";
    else if (hour < 17)
        dayGreetings = "afternoon";
    else if (hour < 21)
        dayGreetings = "evening";
    else
        dayGreetings = "night";

    labelDate.innerText = `${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`;

    labelWelcome.innerText = `Good ${dayGreetings}, ${user.owner.split(" ")[0]}.`;
}

let timerInterval;

document.querySelector('.login').addEventListener('submit', (e) => {
    currentUser = handleCredentials(e);
    console.log(currentUser)
    console.log(accounts)

    labelTimer.innerText = "5:00";

    let seconds = 60;
    let minutes = 4;

    clearInterval(timerInterval)
    timerInterval = setInterval(() => {
        seconds--;
        labelTimer.innerText = `${minutes}:${seconds < 10 ? '0'+seconds : seconds}`;
        if (seconds === 0) {
            seconds = 60;
            minutes--;
            if (minutes === 0) logOut();
        }
    }, 1000);

    preemptInputs();
    fillLabels(currentUser);
    displayMovements(currentUser);

    currentUserName = currentUser.owner.split(" ")[0][0].toLowerCase() + currentUser.owner.split(" ")[1][0].toLowerCase();
})

const displayMovements = (user) => {
    containerMovements.replaceChildren("");

   for (let i = 0; i < user.movements.length; i++){
        const movement = user.movements[ user.movements.length - i - 1]

        const movementRow = document.createElement('div');
        movementRow.classList.add('movements__row');
        let movementsType = document.createElement('div');
        movementsType.classList.add("movements__type", `${movement > 0 ? "movements__type--deposit" : "movements__type--withdrawal"}`);
        movementsType.innerText = `${user.movements.length - i}  ${movement > 0 ? "deposit" : "withdrawal"}`;
        let movementsDate = document.createElement('div');
        movementsDate.classList.add('movements__date');
        let movementsValue = document.createElement('div');
        movementsValue.classList.add('movements__value');
        movementsValue.innerText = Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(movement);

        movementRow.appendChild(movementsType);
        movementRow.appendChild(movementsDate);
        movementRow.appendChild(movementsValue);

        containerMovements.appendChild(movementRow);
    }
};

document.querySelector(".form--transfer").addEventListener("submit", (e) => {
    e.preventDefault();

    const amount = inputTransferAmount.value;
    const transferTo = inputTransferTo.value;

    if (userNames.includes(transferTo) && amount <= currentUser.movements.reduce((total, movement) => total += movement, 0,) && amount != 0)
    {
        accounts[userNames.indexOf(transferTo)].movements.push(Number(amount));
        currentUser.movements.push(Number(amount) * -1);
        fillLabels(currentUser);
        displayMovements(currentUser);
    }
});

document.querySelector(".form--loan").addEventListener("submit", (e) => {
    e.preventDefault();
    requestLoan();
})

document.querySelector(".form--close").addEventListener("submit", (e) => {
    e.preventDefault();
    if (inputClosePin.value == currentUser.pin && inputCloseUsername.value == currentUserName){
           accounts.splice(accounts.indexOf(currentUser), 1);
           userNames.splice(userNames.indexOf(currentUserName), 1)
           logOut();
           console.log(accounts)
    }
})
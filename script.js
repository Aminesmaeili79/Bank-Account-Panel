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

const accounts = [account1, account2, account3, account4];

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

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

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
})
console.log(userNames)

const handleCredentials = (e) => {
    e.preventDefault()
    const userName = inputLoginUsername.value;
    console.log(userName)
    if (userNames.includes(userName)) {
        if (String(accounts[userNames.indexOf(userName)].pin) === inputLoginPin.value) {
            containerApp.classList.remove('hidden');
            return accounts[userNames.indexOf(userName)];
        }
    }
}

const convertToCurrency = (currencyLabel, user) => {
    return Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyLabel
    }).format(user.movements.reduce((total, movement) => total += movement, 0,))
}

const preemptInputs = () => {
    inputLoginUsername.value = "";
    inputLoginPin.value = "";
}

const updateTimer = () => {
    var seconds = 59;
    var minutes = 4;

    let start = Date.now()

    setInterval(() => {
        if (seconds === 0) {
            start = Date.now();
            minutes--;
        }
        seconds = 59 - Math.floor((Date.now() - start) / 1000);
        labelTimer.innerText = `${minutes}:${seconds}`
    }, 1000)
}

const fillLabels = (user) => {
    labelSumIn.innerText = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(user.movements.filter((movement) => {
        return movement > 0;
    }).reduce((totalIn, amount) => totalIn += amount, 0))

    labelSumOut.innerText = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(user.movements.filter((movement) => {
        return movement < 0;
    }).reduce((totalOut, amount) => totalOut += amount, 0))

    labelSumInterest.innerText = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(Math.abs(user.movements.filter((movement) => {
        return movement > 0;
    }).reduce((totalInterest, amount) => totalInterest += amount * (1 - user.interestRate), 0)))

    const hour = new Date().getHours()

    let dayGreetings = "";

    switch (hour) {
        case hour > 4 && hour < 11:
            dayGreetings = "morning";
            break;

        case hour < 17:
            dayGreetings = "afternoon";
            break;
        case hour < 21:
            dayGreetings = "evening";
            break;
        default:
            dayGreetings = "night";
            break;
    }

    labelDate.innerText = `${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`

    labelWelcome.innerText = `Good ${dayGreetings}, ${user.owner.split(" ")[0]}.`

    updateTimer()
}

document.querySelector('.login').addEventListener('submit', (e) => {
    const user = handleCredentials(e);
    labelBalance.innerText = convertToCurrency("USD", user);
    preemptInputs()
    fillLabels(user)
    displayMovements(user)
})

const displayMovements = (user) => {
    user.movements.reverse().forEach((movement) => {
        const movementRow = document.createElement('div')
        movementRow.classList.add('movements__row')
        let movementsType = document.createElement('div')
        movementsType.classList.add("movements__type", `${movement > 0 ? "movements__type--deposit" : "movements__type--withdrawal"}`);
        movementsType.innerText = `${user.movements.length - user.movements.indexOf(movement)}  ${movement > 0 ? "deposit" : "withdrawal"}`
        let movementsDate = document.createElement('div')
        movementsDate.classList.add('movements__date');
        let movementsValue = document.createElement('div')
        movementsValue.classList.add('movements__value')
        movementsValue.innerText = Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(movement);

        movementRow.appendChild(movementsType);
        movementRow.appendChild(movementsDate);
        movementRow.appendChild(movementsValue);

        containerMovements.appendChild(movementRow);
    })
}
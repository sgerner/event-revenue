/* COMMON FUNCTIONS */
const createArrayFromSelector = selectorName => Array.from(document.querySelectorAll(selectorName));
const add = (a, b) => a + b;
const positiveToNegative = num => -Math.abs(num);

const sum = selectorName => createArrayFromSelector(selectorName)
    /* Check for negative element class, then returns either neg value or value */
    .map(item => (item.classList.contains('negative-value')) ? Number(positiveToNegative(item.value)) : Number(item.value) )
    /* Filter out values that are NaN */
    .filter(item => !!item)
    /* Sum all numbers in array */
    .reduce(add);

const updateCurrencyNodeAndValue = (elementID, newValue) => {
    const element = document.getElementById(elementID);
    element.firstChild.nodeValue = '$ ' + newValue.toFixed(2);
    element.value = newValue.toFixed(2);
}

/* CALCULATOR FUNCTIONS */
const calculatorCashCollected = event => {
    //Updates the box next to each denomination with the sum for that denomination
    const currencySum = document.getElementById(event.target.id).id * document.getElementById(event.target.id).value;
    updateCurrencyNodeAndValue(event.target.id + '-result', currencySum);

    //Updates the total sum
    updateCurrencyNodeAndValue('ending-cash-total', sum('.denomination-results'));
    calculatorCashEarned();

    //Update Bill & Cash Totals
    updateCurrencyNodeAndValue('bill-total', sum('.bills'));
    updateCurrencyNodeAndValue('coin-total', sum('.coins'));
}

const calculatorCashEarned = () => {
    updateCurrencyNodeAndValue('cash-total', sum('.cash-calculator'));
    calculatorTotalEarned();
}

const calculatorTotalEarned = () => {
    updateCurrencyNodeAndValue('event-revenue', sum('.total-calculator'));
    calculatorEventFee();
}

const calculatorEventFee = () => {
    // Determines fee structure (flat 10% or 10% to $500) and calculates event fee
    const eventRevenue = document.getElementById('event-revenue').value;
    if (eventRevenue <= 500 || document.getElementById('event-fee-structure').value == '10%') {
        updateCurrencyNodeAndValue('total-fee', eventRevenue * 0.10);
    } else {
        updateCurrencyNodeAndValue('total-fee', 50 + ((eventRevenue - 500) * 0.05));
    }
    calculatorCommission();
}

const calculatorCommission = () => {
    const baseHourlyPay = 10;
    const commission = document.getElementById('event-revenue').value * document.getElementById('commission-rate').value;
    // Determine if commssion is higher than guarenteed hourly minimum
    if (commission > document.getElementById('market-length').value * baseHourlyPay) {
        updateCurrencyNodeAndValue('commission-earned', commission);
    } else {
        updateCurrencyNodeAndValue('commission-earned', document.getElementById('market-length').value * baseHourlyPay);
    }
    updateCurrencyNodeAndValue('tip-earned', Number(document.getElementById('card-tips').value));
    updateCurrencyNodeAndValue('total-pay', sum('.commission-calculator'));
}

/* ON LOAD FUNCTIONS */
const createEventListeners = (selectorName, callFunction) => {
    createArrayFromSelector(selectorName).map(item => item.addEventListener('input', callFunction, false));
}

const eventListenerMap = [
    {selector: '.denomination-input', function: calculatorCashCollected},
    {selector: '.cash-calculator', function: calculatorCashEarned},
    {selector: '.total-calculator', function: calculatorTotalEarned},
    {selector: '.event-fee', function: calculatorEventFee},
    {selector: '.commission-input', function: calculatorCommission}
].map(item => createEventListeners(item.selector, item.function));


window.addEventListener('DOMContentLoaded', eventListenerMap, false);
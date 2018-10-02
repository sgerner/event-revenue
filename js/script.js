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
    .reduce(add, 0);

const updateCurrencyNodeAndValue = (elementID, newValue) => {
    const element = document.getElementById(elementID);
    element.firstChild.nodeValue = '$ ' + newValue.toFixed(2);
    element.value = newValue.toFixed(2);
}

/* SPECIFIC CALCULATOR HELPER FUNCTIONS */
const eventFee = () => {
    // Determines fee structure (flat 10% or 10% to $500) and calculates event fee
    const eventRevenue = document.getElementById('event-revenue').value;
    return (document.getElementById('event-fee-structure').value == '10%')
        ? eventRevenue * 0.10 : (eventRevenue <= 500) 
            ? eventRevenue * 0.10 : 50 + ((eventRevenue - 500) * 0.05);
}

const commission = () => {
    const baseHourlyPay = 10;
    const commission = document.getElementById('event-revenue').value * document.getElementById('commission-rate').value;
    // Determine if commssion is higher than guarenteed hourly minimum
    const marketLength = document.getElementById('market-length').value;
    return (commission > marketLength * baseHourlyPay) ? commission : marketLength * baseHourlyPay;
}

/* CALCULATORS */
const eventBasedCalculator = event => {
    // Updates the box next to each denomination with the sum for that denomination
    const currencySum = document.getElementById(event.target.id).id * document.getElementById(event.target.id).value;
    updateCurrencyNodeAndValue(event.target.id + '-result', currencySum);
    calculator();
}

const calculator = () => {
    updateCurrencyNodeAndValue('bill-total', sum('.bills')); // Sum Bills in register
    updateCurrencyNodeAndValue('coin-total', sum('.coins')); // Sum coins in register
    updateCurrencyNodeAndValue('ending-cash-total', sum('.denomination-results')); // Sum total cash in register
    updateCurrencyNodeAndValue('cash-total', sum('.cash-calculator')); // Calculate cash after modifiers
    updateCurrencyNodeAndValue('event-revenue', sum('.total-calculator')); // Calculate event revenue with alternate payment
    updateCurrencyNodeAndValue('total-fee', eventFee()); // Calculate event fee
    updateCurrencyNodeAndValue('commission-earned', commission()); // Calculate commission
    updateCurrencyNodeAndValue('tip-earned', Number(document.getElementById('card-tips').value)); // Clone tips
    updateCurrencyNodeAndValue('total-pay', sum('.commission-calculator')); // Sum commission with modifiers
}

/* ON LOAD FUNCTIONS */
const eventListenerMap = [
    {selector: '.event-based-calculator', eventType: 'input', function: eventBasedCalculator},
    {selector: '.calculator', eventType: 'input', function: calculator},
].forEach(item => createArrayFromSelector(item.selector).forEach(elem => elem.addEventListener(item.eventType, item.function, false)));

window.addEventListener('DOMContentLoaded', eventListenerMap, false);
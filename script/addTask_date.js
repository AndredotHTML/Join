/** 
 * Filters non-numeric characters from a date input, validate and reconstructs the date as dd/mm/yyyy
 * If the selected date is earlier than today, sets the date to today
 * @example 10/04/2025
*/

function customDateInput() {
    let dateInputRef = document.getElementById("date-input-add-task");
    let dateInputVal = dateInputRef.value.replace(/[^\d]/g, '');
    let dayInput = extractDay(dateInputVal)
    let monthInput = extractMonth(dateInputVal)
    let yearInput = extractYear(dateInputVal)
    dayInput = validDays(dayInput,monthInput,yearInput)
    let today = todayDate(dateInputVal)
    let dateInput = `${dayInput}` + `${monthInput}` + `${yearInput}`
    if (dateInput<today) {
        dateInput = today
    }
    dateInputRef.value = dateInput
}


/**
 * Returns today’s date in dd/mm/yyyy format if the input has 8 digits
 * @param {string} dateInputVal The raw date string
 * @returns Today's date in dd/mm/yyyy format , or null
 */

function todayDate(dateInputVal) {
     if (dateInputVal.length > 7 ) {
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        dayInput = today.getDate();
        monthInput = (today.getMonth() + 1).toString().padStart(2, '0');
        yearInput =  today.getFullYear().toString().padStart(2, '0');
        return `${dayInput}/${monthInput}/${yearInput}`
    }
    return null
}


/**
 * Checks the first two characters of the input for valid day input
 * @param {string} dateInputVal filtert input from customDateInput()
 * @returns days for the reconstruction of the date
 */

function extractDay(dateInputVal) {
    if (dateInputVal.length >= 1) {
        let day = dateInputVal.slice(0, 2)
        if (day > 31) {
            day = 31
        }
        if (day.length == 2 && +day === 0) {
            day = "01"
        }
        return day
    }
    return ""
}


/**
 * Checks the 3rd and 4th characters of the input for valid month (01-12) input
 * @param {string} dateInputVal filtered input from customDateInput()
 * @returns A "/" and a month (2 numbers) for the reconstruction of the date
 */

function extractMonth(dateInputVal) {
    if (dateInputVal.length >= 3) {
        let month = dateInputVal.slice(2, 4)
        if (month > 12) {
            month = 12
        }
        return "/" + month
    }
    return ""
}


/**
 * Validate the 5th to 8th characters of the date input for reconstruction of the year
 * @param {string} dateInputVal filtered input from customDateInput()
 * @returns A "/" and a year (4 numbers) clamped betwenn 2025 and 2100 for reconstruction of the date
 */

function extractYear(dateInputVal) {
    if (dateInputVal.length >= 5 && dateInputVal.length < 8) {
        return "/" + dateInputVal.slice(4);
    }
    if (dateInputVal.length >= 8) {
        let year = clampYear(dateInputVal.slice(4, 8))
        return "/" + year;
    }
    return ""
}


/**
 * Validates the day input for different month and for leap years
 * @param {string} dayInput The first two characters of the date input
 * @param {string} monthInput The 3rd and 4th characters of the date input
 * @param {string} yearInput The 5th to 8th characters of the date input
 * @returns {string} A corrected valid day for different months
 */

function validDays(dayInput,monthInput,yearInput) {
    let shorterMonths = ["04", "06", "09", "11"]
    let leapYear = yearInput.slice(1) % 4 === 0
    if (shorterMonths.includes(monthInput.slice(1)) && +dayInput > 30) {
        return dayInput = "30"
    } 
    if (monthInput.slice(1) == "02") {
        if (+dayInput > 29) {
            return dayInput = "29"
        } else if (!leapYear && yearInput.length >= 5) {
            return  "28"
        } 
    }
    return dayInput
}


/**
 * Clamps the year to a maximum of 2100
 * @param {string} dateInputVal filtered input from customDateInput() 
 * @returns {number} A valid year number
 */

function clampYear(dateInputVal) {
    let year = dateInputVal
    let yearNumb = +year
    if (yearNumb >= 2100) {
        yearNumb = 2100
    }
    return yearNumb;
}


/**
 * Opens the native date picker
 */

function showPicker() {
    let pickerRef = document.getElementById("nativ-date-input")
    pickerRef.showPicker()
}


/**
 * Sets the minimum selectable date of the native date picker to today.
 */

function minPickerDate(){
  const picker = document.getElementById("nativ-date-input");
  const today = new Date().toISOString().split("T")[0];
  picker.setAttribute("min", today);
};


/**
 * Transfers the selected date from the nativ picker to the custom date input in the changed format (dd/mm/yyyy)
 */

function transferFromPicker() {
    let pickerVal = document.getElementById("nativ-date-input").value
    let dateInputRef = document.getElementById("date-input-add-task")
    let formatet = pickerVal.split("-").reverse().join("/");
    dateInputRef.value = formatet
}

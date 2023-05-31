// Đặt chiều rộng của các phần tử div kết quả và thông tin bằng chiều rộng của biểu mẫu nhập liệu
window.onload = () => {
    document.querySelector("#resultsContainer").style.width = window.getComputedStyle(document.querySelector("#inputsContainer")).getPropertyValue("width");
    document.querySelector("#infoContainer").style.width = window.getComputedStyle(document.querySelector("#inputsContainer")).getPropertyValue("width");
};

const KILOGRAMS_PER_POUND = 0.4536;
const CENTIMETERS_PER_INCH = 2.54;
const CM2_PER_M2 = 10000;

const MIN_CAL_FEMALE = 1200;
const MIN_CAL_MALE = 1500;

const MALE_CAL_MODIFIER = 5;
const FEMALE_CAL_MODIFIER = -161;


function validateFormInputs(inputs) {
    inputs.age = parseInt(document.querySelector("#age").value);
    inputs.weight = parseInt(document.querySelector("#weight").value);
    inputs.height = parseInt(document.querySelector("#height").value);

    inputs.bodyFatPercent = parseInt(document.querySelector("#bodyFatPercent").value);
    inputs.bodyFatEntered = false;

    if (!isNaN(inputs.bodyFatPercent)) {
        inputs.bodyFatEntered = true;

        if (isNaN(inputs.bodyFatPercent) || inputs.bodyFatPercent < 0 || inputs.bodyFatPercent > 100) {
            alert("Please enter a valid body fat percentage!");
            return false;
        }
    }

    if (isNaN(inputs.age) || inputs.age === "" || inputs.age < 0) {
        alert("Please enter a valid age!");
        return false;
    }

    if (isNaN(inputs.weight) || inputs.weight === "" || inputs.weight < 0) {
        alert("Please enter a valid weight!");
        return false;
    }

    if (isNaN(inputs.height) || inputs.height === "" || inputs.height < 0) {
        alert("Please enter a valid height!");
        return false;
    }

    // Lấy giá trị của các dropdown
    const gender = document.querySelector("#gender");
    const weightUnit = document.querySelector("#weightUnit");
    const heightUnit = document.querySelector("#heightUnit");
    const activityLevel = document.querySelector("#activityLevel");

    inputs.gender = gender.options[gender.selectedIndex].value;
    inputs.weightUnit = weightUnit.options[weightUnit.selectedIndex].value;
    inputs.heightUnit = heightUnit.options[heightUnit.selectedIndex].value;
    inputs.activityLevel = activityLevel.options[activityLevel.selectedIndex].value;

    return true;
}


function calculateTDEEnoBF(gender, age, weight, weightUnit, height, heightUnit, activityMultiplier) {
    // Mifflin St. Jeor
    // Mifflin = (10.m + 6.25h - 5.0a) + s
    // m is mass in kg, h is height in cm, a is age in years, s is +5 for males and -151 for females

    const safeMinCalories = (gender === "M") ? MIN_CAL_MALE : MIN_CAL_FEMALE;
    const genderModifier = (gender === "M") ? MALE_CAL_MODIFIER : FEMALE_CAL_MODIFIER;

    if (weightUnit === "LBS") {
        weight *= KILOGRAMS_PER_POUND;
    }

    if (heightUnit === "IN") {
        height *= CENTIMETERS_PER_INCH;
    }

    const BMR = (10 * weight) + (6.25 * height) - (5.0 * age) + genderModifier;
    const TDEE = Math.max(safeMinCalories, Math.round(BMR * activityMultiplier));
    return TDEE ;}
function calculateTDEEwithBF(gender, weight, weightUnit, bodyFatPercent, activityMultiplier) {
    const safeMinCalories = (gender === "M") ? MIN_CAL_MALE : MIN_CAL_FEMALE;
    if (weightUnit === "LBS") {weight *= KILOGRAMS_PER_POUND;}
    const LBM = (100 - bodyFatPercent) * 0.01 * weight;
    const BMR = (21.6 * LBM) + 370;
    const TDEE = Math.round(BMR * activityMultiplier);
    return TDEE;}
function calculateBMI(weight, weightUnit, height, heightUnit) {
    if (weightUnit === "LBS") {
        weight *= KILOGRAMS_PER_POUND;
    }
    
    if (heightUnit === "IN") {
        height *= CENTIMETERS_PER_INCH;
    }
    
    const BMI = ((weight / height) / height) * CM2_PER_M2;
    
    return BMI.toFixed(1);}
function printOutput(TDEE, BMI, gender) {
    const safeMinCalories = (gender === "M") ? MIN_CAL_MALE : MIN_CAL_FEMALE;
    BMI = parseFloat(BMI);

let BMI_RANGE;
if (BMI < 18.5) {
    BMI_RANGE = "underweight";
} else if (BMI < 25) {
    BMI_RANGE = "healthy";
} else if (BMI < 30) {
    BMI_RANGE = "overweight";
} else {
    BMI_RANGE = "obese";
}

function printOutput1(age) {
    age = parseFloat(age);

    let MENU;
    if (age >= 3 && age <= 18) {
        MENU = "Kid";
    } else if (age > 18 && age <= 50) {
        MENU = "Adult";
    } else if (age > 50 && age <= 70) {
        MENU = "Elderly";
    }


    const 
    MinCalories = (gender === "M") ? MIN_CAL_MALE : MIN_CAL_FEMALE;
    let resultsHTML =
    `Your BMI is ${BMI} (${BMI_RANGE})<br/>
Your Total Daily Energy Expenditure (TDEE) is <strong>${TDEE}</strong> calories per day.<br/>
To lose 2 lbs/week, eat <strong>${Math.max(TDEE - 1000, safeMinCalories)}</strong> calories per day.<br/>
To lose 1 lbs/week, eat <strong>${Math.max(TDEE - 500, safeMinCalories)}</strong> calories per day.<br/>
To maintain weight, eat <strong>${Math.max(TDEE, safeMinCalories)}</strong> calories per day.<br/>
To gain 1 lbs/week, eat <strong>${Math.max(TDEE + 500, safeMinCalories)}</strong> calories per day.<br/>
To gain 2 lbs/week, eat <strong>${Math.max(TDEE + 1000, safeMinCalories)}</strong> calories per day.`;

document.querySelector("#results").innerHTML = resultsHTML;
}

function printOutput2() {
let resultsHTML =
    `Your Total Daily Energy Expenditure (TDEE) is <strong>${TDEE}</strong> calories per day.<br/>
To maintain weight, eat <strong>${TDEE}</strong> calories per day.`;

document.querySelector("#results").innerHTML = resultsHTML;
}

if (gender === "M") {
printOutput2();
} else {
const age = document.querySelector("#age").value;
printOutput1(age);
}}

function handleFormSubmit(event) {
event.preventDefault();
const inputs = {};

if (validateFormInputs(inputs)) {
    let TDEE;

    if (inputs.bodyFatEntered) {
        TDEE = calculateTDEEwithBF(inputs.gender, inputs.weight, inputs.weightUnit, inputs.bodyFatPercent, inputs.activityLevel);
    } else {
        TDEE = calculateTDEEnoBF(inputs.gender, inputs.age, inputs.weight, inputs.weightUnit, inputs.height, inputs.heightUnit, inputs.activityLevel);
    }

    const BMI = calculateBMI(inputs.weight, inputs.weightUnit, inputs.height, inputs.heightUnit);

    printOutput(TDEE, BMI, inputs.gender);
}}

document.querySelector("#inputForm").addEventListener("submit", handleFormSubmit);

        
        
    
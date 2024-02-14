function resolveKeyText(key) {
    return window.vue.$t("validation." + key);
}

export const required = value =>
    (!!value && typeof value === "string" && value.replace(/^[\s-_]+|[\s-_]+$/gm, "").length > 0) || typeof value === "number" || resolveKeyText("required");
export const requiredObj = value => (!!value && typeof value === "object") || resolveKeyText("required");
export const requiredFile = value => (!!value && typeof value === "object" && !!value.size && !!value.name) || resolveKeyText("required");
export const requiredArray = value => (Array.isArray(value) && value.length > 0) || resolveKeyText("required");

// // following is still to process and enable only if needed

// export const name = value => {
//     const regex = /^[a-z\u0100-\u017F\u0400-\u04FF\s-]+$/i; // for more letter blocks: http://kourge.net/projects/regexp-unicode-block
//     return regex.test(value) || "Veskite tik raides";
// };
// export const numbersOnly = value => /^[0-9]*$/.test(value) || !value || "Veskite tik skaičius";
// export const email = value => {
//     const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return pattern.test(value) || "Neteisingas el. pašto formatas";
// };
// export function minLength(min) {
//     return value => !value || value.length >= min || `Reikia ne mažiau ${min} simbolių`;
// }
// export const fullTelNum = value => !!value || value !== "+370" || "Įveskite numerį.";
// export const startPlus = value => /^\+/.test(value) || "Pradėkite nuo šalies kodo (pvz.: +370)";
// export const akvpnr = value => validateAKVPNR(value);

// export const chckBoxSet = value => value === true || value === false || "Būtina nurodyti";
// export const chckBoxTrue = value => value === true || "Būtina pasirinkti";


// export function validateAKVPNR(value) {
//     if (!value) return false;
//     // if (value.length < 6) return "Reikia ne mažiau 6 simbolių";
//     else if (value.length === 8) return /^[A-Z0-9][0-9]{7}$/.test(value) || "Neteisingai įvestas vairuotojo pažymėjimas";
//     else if (value.length === 11) return (/^[3456][0-9]{10}$/.test(value) && checkAKDate(value) && kontrolNumCheck(value)) || "Asmens kodas netinkamas";
//     else return "Duomuo neatitinka Lietuviškų šablonų";
// }
// export function validateAK(value) {
//     return !!value && value.length === 11 && /^[3456][0-9]{10}$/.test(value) && checkAKDate(value) && kontrolNumCheck(value);
// }
// function checkAKDate(val) {
//     return parseInt(val.substr(3, 2)) <= 12 && parseInt(val.substr(5, 2)) <= 31;
// }
// function kontrolNumCheck(nStr) {
//     let nArr = nStr.split("").map(Number);
//     let S = numSum(nArr, 1);
//     if (S === 10) S = numSum(nArr, 3) % 10;
//     return S === nArr[10];
// }
// function numSum(nArr, x) {
//     let S = 0;
//     for (let i = 0; i < 10; i++) {
//         S += nArr[i] * x;
//         x >= 9 ? (x = 1) : x++;
//     }
//     return S % 11;
// }
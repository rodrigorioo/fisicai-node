"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Datum = void 0;
const Wit_1 = require("./Wit");
class Datum {
    constructor(name, value, unit) {
        this.name = "";
        this.value = "";
        this.unit = "";
        this.name = (name) ? name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, "_") : "";
        this.value = (value) ? value : "";
        this.unit = (unit) ? unit : "";
        // Parse Unit
        this.parseUnit();
    }
    loadEntity(entity) {
        return new Promise((success, failure) => __awaiter(this, void 0, void 0, function* () {
            switch (entity.name) {
                case "valor":
                    this.name = this.getName(this.getUnit(entity.value));
                    this.value = this.getValue(entity.value);
                    this.unit = this.getUnit(entity.value);
                    break;
                case "wit$distance":
                    this.name = "distancia";
                    this.value = entity.value;
                    this.unit = this.unitTranslate(entity.unit);
                    break;
                case "wit$duration":
                    this.name = "tiempo";
                    this.value = entity.value;
                    this.unit = this.unitTranslate(entity.unit);
                    break;
                case "wit$datetime":
                    // Wit detects "EN UN SEGUNDO" like a DateTime
                    // For fix this we remove all ancestor words and we send this new value to Wit for extract the time
                    if (entity.grain === "second") {
                        // Create new value to send
                        const newValue = entity.body.replace(/(en)/, "");
                        // Init Wit
                        let wit;
                        try {
                            wit = new Wit_1.Wit();
                        }
                        catch (e) {
                            return failure(e.message);
                        }
                        // Process message
                        yield wit.processMessage(newValue).catch((errProcessMessage) => {
                            return failure(errProcessMessage.message);
                        });
                        return success(wit.entities);
                    }
                    else {
                        this.name = "fecha";
                        this.value = entity.value;
                        this.unit = "";
                    }
                    break;
                default:
                    return failure("Entity name not recognized");
            }
            // Parse data
            this.parseUnit();
            return success(this);
        }));
    }
    getName(value) {
        let returnName = "";
        switch (value.toLowerCase()) {
            case "m/s2":
            case "km/s2":
            case "km/h2":
                returnName = "aceleracion";
                break;
            case "m/s":
            case "km/s":
            case "km/h":
                returnName = "velocidad";
                break;
        }
        return returnName;
    }
    getUnit(value) {
        return value.replace(/\d+/g, '').replace(' ', '').toLowerCase();
    }
    unitTranslate(unit) {
        let returnUnit = "";
        switch (unit) {
            case "kilometre":
                returnUnit = "km";
                break;
            case "minute":
                returnUnit = "min";
                break;
            case "metre":
                returnUnit = "m";
                break;
            case "second":
                returnUnit = "s";
                break;
        }
        return returnUnit;
    }
    getValue(value) {
        let regexMatch = [];
        regexMatch = value.replace(',', '.').match(/([0-9.]+(\.[0-9]+)*)/);
        return (regexMatch) ? regexMatch[0] : "";
    }
    parseUnit() {
        switch (this.name) {
            case 'distancia':
                if (this.unit == 'km') {
                    this.value = (parseFloat(this.value) * 1000).toString();
                }
                this.unit = 'm';
                break;
            case 'velocidad':
                if (this.unit == 'km/h') {
                    this.value = (parseFloat(this.value) * (5 / 18)).toString();
                }
                else if (this.unit == 'km/s') {
                    this.value = (parseFloat(this.value) * 1000).toString();
                }
                this.unit = 'm/s';
                break;
            case 'tiempo':
                if (this.unit == 'min') {
                    this.value = (parseFloat(this.value) * 60).toString();
                }
                this.unit = 's';
                break;
            case 'aceleracion':
                if (this.unit == 'km/h2') {
                    this.value = (parseFloat(this.value) * 1000 * ((1 / 3600) * (1 / 3600))).toString();
                }
                this.unit = 'm/s2';
                break;
        }
    }
}
exports.Datum = Datum;

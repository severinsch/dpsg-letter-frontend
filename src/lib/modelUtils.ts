import type {LetterConfigModel} from "../api";
import templateConfigUntyped from "../config/templates.json";

interface TemplateConfig {
    langenbach: Partial<LetterConfigModel>;
    freising: Partial<LetterConfigModel>;
    moosburg: Partial<LetterConfigModel>;
}

const templateConfig: TemplateConfig = templateConfigUntyped as TemplateConfig;

function getNestedValue(obj: object, compositeKey: string): any {
    return compositeKey.split('.').reduce((acc, key) => {
        if (acc && key in acc) {
            return acc[key as keyof typeof acc];
        }
        return acc;
    }, obj);
}

export function validateModel(formData: LetterConfigModel): string | null {
    // check if all required fields are filled
    for (const field of requiredFields) {
        const value = getNestedValue(formData, field);
        if (!value) {
            const missingName = getNestedValue(fieldMapping, field);
            return `"${missingName}" is required`;
        }
    }
    if (formData.people.length < 2) return "At least 2 people are required";
    for (const person of formData.people) {
        if (!person.name || !person.role || !person.email) return "Each person must have a name, role and email";
    }
    return null;
}

// field to german name mapping
export const fieldMapping = {
    title: "Titel",
    content: "Inhalt",
    logo: "Logo",
    organizationName: "Stammes Name",
    place: "Ort",
    address: "Addresse",
    bankInformation: {
        bankName: "Bank Name",
        iban: "IBAN",
        orgName: "Org Name",
    },
    date: "Datum",
    includeFrontPage: "Titelseite anfügen",
    includeHolidayLawPage: "Feiertagsgesetz anfügen",
    includeSignUp: "Anmeldung anfügen",
    signUpIncludeAbroadClause: "Auslandsaufenthalt",
    people: "Personen",
}

const requiredFields = [
    "title",
    "content",
    "organizationName",
    "place",
    "address",
    "bankInformation.bankName",
    "bankInformation.iban",
    "bankInformation.orgName",
    "people",
]

export const emptyModel: LetterConfigModel = {
    title: "",
    content: "",
    logo: "DPSG",
    organizationName: "",
    place: "",
    address: "",
    bankInformation: {
        bankName: "",
        iban: "",
        orgName: "",
    },
    date: new Date().toISOString().split('T')[0],
    includeFrontPage: true,
    includeHolidayLawPage: false,
    includeSignUp: false,
    signUpIncludeAbroadClause: false,
    people: [],
}

// Function to apply a template to the form
export function applyTemplate(templateName: string | unknown, formData: LetterConfigModel): LetterConfigModel {
    if (typeof templateName !== "string") return formData;
    const selectedTemplate = templates[templateName] || {};
    return {
        ...emptyModel,
        ...selectedTemplate,
        content: formData.content,
        title: formData.title,
        includeSignUp: formData.includeSignUp,
    }
}

// this is temporary until proper authentication and user management is implemented
const langenbachTemplate = templateConfig["langenbach"]
const freisingTemplate = templateConfig["freising"]
const moosburgTemplate = templateConfig["moosburg"]

const defaultTemplate: Partial<LetterConfigModel> = {
    logo: "DPSG",
    organizationName: "DPSG",
}

const templates: { [key: string]: Partial<LetterConfigModel> } = {
    Langenbach: langenbachTemplate,
    Freising: freisingTemplate,
    Moosburg: moosburgTemplate,
    Custom: defaultTemplate,
};
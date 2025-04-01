const connection = new Postmonger.Session();
let eventDefinitionKey;
let createdData = {};
let authTokens = {};

connection.trigger("ready");
connection.trigger("requestSchema");
connection.trigger("requestTokens");
connection.trigger("requestTriggerEventDefinition");
connection.trigger("updateButton", { button: "next", text: "done", enabled: false });

const schema = {};
let dataExtensionFields = [];

/* Configuração do front sobre erros na Atividade */
const inputOptin = document.querySelector("#select-optin");
inputOptin.addEventListener("focusout", function (event) {
    SetErrorMessage(event);
});
inputOptin.addEventListener("change", function (event) {
    SetErrorMessage(event);
});

const inputLocale = document.querySelector("#select-localeField");
inputLocale.addEventListener("focusout", function (event) {
    SetErrorMessage(event);
});
inputLocale.addEventListener("change", function (event) {
    SetErrorMessage(event);
});

const inputPhone = document.querySelector("#select-phoneField");
inputLocale.addEventListener("focusout", function (event) {
    SetErrorMessage(event);
});
inputLocale.addEventListener("change", function (event) {
    SetErrorMessage(event);
});

function SetErrorMessage(event) {
    if (!event.target.value) {
        event.target.classList.add("slds-has-error");
    } else {
        event.target.classList.remove("slds-has-error");
    }

    ValidateFields(document.querySelectorAll("[required]"));
}

function ValidateFields(fields) {
    let allFieldsFull = true;

    for (let i = 0; i < fields.length; i++) {
        if (fields[i].value == "" || fields[i].value == undefined)
        allFieldsFull = false;
    }

    if (allFieldsFull) {
        connection.trigger("updateButton", { button: "next", text: "done", enabled: true });
    } else {
        connection.trigger("updateButton", { button: "next", text: "done", enabled: false });
    }
}

/**
 * Gera uma lista de opções dentro de um select.
 * @param {Node} selectInput
 * @param {Array} optionList [{name: 'Opção1', value: 1}, {name: 'Opção2', value: 2}]
 */
function CreateOptions(selectInput, optionList) {
    console.log('Gerando opções do input "' + selectInput.id + '"...');

    let firstOption = selectInput.querySelector("option");
    for (let i = 0; i < optionList.length; i++) {
        let newOption = document.createElement("option");
        newOption.value = optionList[i].value;
        firstOption.after(newOption);
        newOption.innerText = optionList[i].name;
    }

    if (optionList.length == 1) {
        selectInput.value = optionList[0].value;
        selectInput.parentElement.parentElement.style.display = 'none';
    }
}

/* Execução dos eventos */
connection.on("requestedTriggerEventDefinition", (eventDefinitionModel) => { // * Executado quando a ação "requestTriggerEventDefinition" ocorrer. Atualmente ao abrir a atividade.
    console.log("Avaliando o Entry Source...");
    if (eventDefinitionModel) {
        eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
    }
});
connection.on("requestedSchema", (response) => { // * Executado quando a ação "requestSchema" ocorrer. Atualmente ao abrir a atividade.
    console.log("Trazendo dados do Entry Source...");
    console.log(response);
    
    for (let item of response.schema) {
        schema[item.name] = "{{" + item.key + "}}";
        dataExtensionFields.push({ name: item.name, type: item.type, value: item.name });
    }

    schema.ContactKey = "{{Contact.Key}}";
    schema.ContactID = "{{Contact.ID}}";

    CreateOptions(inputLocale, dataExtensionFields.filter((option) => option.type === "Locale")); // * Foi colocado dessa forma, pois a adição do campo só pode ser feita após a inserção dos dados de "schema"
    CreateOptions(inputPhone, dataExtensionFields.filter((option) => option.type === "Phone"));

    if (createdData.metaData.optStatus) // * Precisa ser executado após a criação das opções nos seletores
        inputOptin.value = createdData.metaData.optStatus; 
    if (createdData.metaData.localeField)
        inputLocale.value = createdData.metaData.localeField;
    if (createdData.metaData.phoneField)
        inputPhone.value = createdData.metaData.phoneField;

    ValidateFields(document.querySelectorAll("[required]"));
});
connection.on("initActivity", (data) => { // * Executado quando a atividade é aberta no Journey Builder
    console.log("Iniciando a atividade...");
    createdData = { ...createdData, ...data };
    createdData.isConfigured = false;
    createdData.arguments.execute.inArguments = [];
});
connection.on("requestedTokens", (tokens) => { // * Executado quando a ação "requestTokens" ocorrer. Atualmente ao abrir a atividade.
    console.log("Obtendo tokens...");
    authTokens = tokens;
});
connection.on("clickedNext", () => { // * Executado quando o botão de Next/Done for clicado
    /* Dados que serão lembrados pela Custom Activity */
    createdData.metaData.isConfigured = true;
    createdData.isConfigured = true;
    createdData.metaData.optStatus = inputOptin.value;
    createdData.metaData.localeField = inputLocale.value;
    createdData.metaData.phoneField = inputPhone.value;

    /* Dados enviados quando a ação de execução é chamada */
    createdData.arguments.execute.inArguments.push(schema);
    createdData.arguments.execute.inArguments.push({ optinStatus: inputOptin.value });
    createdData.arguments.execute.inArguments.push({ usedLocaleField: inputLocale.value });
    createdData.arguments.execute.inArguments.push({ usedPhoneField: inputPhone.value });
    // createdData.arguments.execute.metadata = {"teste": "teste"};

    if (schema.undefined) delete schema.undefined;

    console.log(JSON.stringify(createdData));
    connection.trigger("updateActivity", createdData);
});


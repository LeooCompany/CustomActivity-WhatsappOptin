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
let body = { metadata: {} };



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

function SetErrorMessage(event) {
    if (!event.target.value) {
        event.target.classList.add("slds-has-error"); 
    } else {
        event.target.classList.remove("slds-has-error");
    }

    ValidateRequiredFields(document.querySelectorAll('[required]'));
}

function ValidateRequiredFields(requiredFields) {
    let allFieldsFull = true;
    
    for (let i = 0; i < requiredFields.length; i++) {
        if (requiredFields[i].value == '' || requiredFields[i].value == undefined) allFieldsFull = false;
    }

    if (allFieldsFull) { connection.trigger('updateButton', { button: 'next', text: 'done', enabled: true }); }
    else { connection.trigger('updateButton', { button: 'next', text: 'done', enabled: false }); }
}



/**
 * Gera uma lista de opções dentro de um select.
 * @param {Node} selectInput 
 * @param {Array} optionList [{name: 'Opção1', value: 1}, {name: 'Opção2', value: 2}]
 */
function CreateOptions(selectInput, optionList) {
    console.log('Gerando opções do input "' + selectInput.id + '"...');

    let firstOption = selectInput.querySelector('option');
    for (let i = 0; i < optionList.length; i++) {
        let newOption = document.createElement('option');
        newOption.value = optionList[i].value;
        firstOption.after(newOption);
        newOption.innerText = optionList[i].name;
    }
}



/* Execução dos eventos */
connection.on( "requestedTriggerEventDefinition", (eventDefinitionModel) => { // ? Executado quando a ação "requestTriggerEventDefinition" ocorrer. Atualmente ao abrir a atividade.
    console.log('Avaliando o Entry Source...');
    if (eventDefinitionModel) {
        eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
    }
});
connection.on("requestedSchema", (response) => { // ? Executado quando a ação "requestSchema" ocorrer. Atualmente ao abrir a atividade.
    console.log('Trazendo dados do Entry Source...');
    for (let item of response.schema) {
        schema[item.name] = "{{" + item.key + "}}";
        dataExtensionFields.push({ name: item.name, type: item.type, value: item.name});
    }

    CreateOptions(inputLocale, dataExtensionFields.filter((option) => option.type === 'Locale')); // * Foi colocado dessa forma, pois a adição do campo só pode ser feita após a inserção dos dados de "schema"
});
connection.on("initActivity", (data) => { // * Executado quando a atividade é aberta no Journey Builder
    console.log('Iniciando a atividade...');
    createdData = { ...createdData, ...data };
    createdData.isConfigured = false;
    createdData.metaData.optStatus = null;

    body = {
        ...body,
        ...(createdData.arguments || { execute: { body: "{}" } }).execute.body,
    };
});
connection.on("requestedTokens", (tokens) => { // * Executado quando a ação "requestTokens" ocorrer. Atualmente ao abrir a atividade.
    console.log('Obtendo tokens...');
    authTokens = tokens;
});
connection.on("clickedNext", () => { // * Executado quando o botão de Next/Done for clicado
    createdData["metaData"].isConfigured = true;
    createdData["arguments"].execute.inArguments.push(schema);
    createdData.arguments.execute.body = JSON.stringify(body);

    createdData.metaData.optStatus = inputOptin.value;
    createdData.metaData.localeField = inputLocale.value;

    if (schema.undefined) delete schema.undefined;

    console.log("[createdData] ", JSON.stringify(createdData));
    connection.trigger("updateActivity", createdData);
});
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
        connection.trigger('updateButton', { button: 'next', text: 'done', enabled: false }); 
    } else {
        event.target.classList.remove("slds-has-error");
        connection.trigger('updateButton', { button: 'next', text: 'done', enabled: true });
    }
}



/* Configurar campo de seleção */
let firstOption = inputLocale.querySelector('option');
for (let i = 0; i < dataExtensionFields.length; i++) {
    let newOption = 
}


/* Execução dos eventos */
connection.on( "requestedTriggerEventDefinition", (eventDefinitionModel) => { // ? Executado quando a ação "requestTriggerEventDefinition" ocorrer. Atualmente ao abrir a atividade.
    if (eventDefinitionModel) {
        eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
        console.log("[EventDefinitionKey] " + eventDefinitionKey);
    }
});
connection.on("requestedSchema", (response) => { // ? Executado quando a ação "requestSchema" ocorrer. Atualmente ao abrir a atividade.
    console.log(JSON.stringify(response));
    for (let item of response.schema) {
        schema[item.name] = "{{" + item.key + "}}";
        dataExtensionFields.push({ name: item.name, type: item.type });
    }
});
connection.on("initActivity", (data) => { // ? Executado quando a atividade é aberta no Journey Builder
    createdData = { ...createdData, ...data };
    createdData.isConfigured = false;
    createdData.metaData.optStatus = null;

    body = {
        ...body,
        ...(createdData.arguments || { execute: { body: "{}" } }).execute.body,
    };
    console.log("[body] " + body);
});
connection.on("requestedTokens", (tokens) => { // ? Executado quando a ação "requestTokens" ocorrer. Atualmente ao abrir a atividade.
    authTokens = tokens;
});
connection.on("clickedNext", () => { // ? Executado quando o botão de Next/Done for clicado
    createdData["metaData"].isConfigured = true;
    createdData["arguments"].execute.inArguments.push(schema);
    createdData.arguments.execute.body = JSON.stringify(body);

    createdData.metaData.optStatus = inputOptin.value;
    createdData.metaData.localeField = inputLocale.value;

    if (schema.undefined) delete schema.undefined;

    console.log("[createdData] ", JSON.stringify(createdData));
    connection.trigger("updateActivity", createdData);
});
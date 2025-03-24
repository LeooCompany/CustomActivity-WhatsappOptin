const connection = new Postmonger.Session();
let eventDefinitionKey;
let createdData = {};
let authTokens = {};

connection.trigger("ready");
connection.trigger("requestSchema");
connection.trigger("requestTokens");
connection.trigger("requestTriggerEventDefinition");
connection.trigger("updateButton", {
    button: "next",
    text: "done",
    enabled: false,
});

const schema = {};
let body = { metadata: {} };

connection.on(
    "requestedTriggerEventDefinition",
    function (eventDefinitionModel) {
        if (eventDefinitionModel) {
        eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
        console.log("[EventDefinitionKey] " + eventDefinitionKey);
        }
    }
);
connection.on("requestedSchema", function (response) {
    for (let item of response.schema) {
        schema[item.name] = "{{" + item.key + "}}";
    }
});
connection.on("initActivity", (data) => {
    createdData = { ...createdData, ...data };
    createdData.isConfigured = false;
    createdData.metadata = createdData.metadata || {};
    createdData.metadata.optStatus = null;

    body = {
        ...body,
        ...(createdData.arguments || { execute: { body: "{}" } }).execute.body,
    };
    console.log("[body] " + body);
});

const inputOptin = document.querySelector("#select-optin");
const inputOptinErrorText = document.querySelector("#select-optin-error");
inputOptin.addEventListener("focusout", function (event) {
    SetErrorMessage(event);
});
inputOptin.addEventListener("change", function (event) {
    SetErrorMessage(event);
});

function SetErrorMessage(event) {
    if (!event.target.value) {
        inputOptin.classList.add("slds-has-error");
        inputOptinErrorText.style.display = "block";
        connection.trigger('updateButton', { button: 'next', text: 'done', enabled: true });
    } else {
        inputOptin.classList.remove("slds-has-error");
        inputOptinErrorText.style.display = "none";
        connection.trigger('updateButton', { button: 'next', text: 'done', enabled: false });
    }
     
    createdData.metadata.optStatus = inputOptin.value;
}

connection.on("requestedTokens", onGetTokens);
    function onGetTokens(tokens) {
    authTokens = tokens;
}

connection.on("clickedNext", () => {
    save();
});

const save = () => {
    createdData["metaData"].isConfigured = true;
    createdData["arguments"].execute.inArguments.push(schema);
    createdData.arguments.execute.body = JSON.stringify(body);

    if (schema.undefined) delete schema.undefined;

    console.log("[createdData] " + createdData);
    connection.trigger("updateActivity", createdData);
};

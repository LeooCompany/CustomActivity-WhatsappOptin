const path = require('path');
const BASE_DIR = path.resolve(__dirname, '..','..','..');

const getSave = async (request, response) => {
    return response.status(200).json();
};

const getValidate = async (request, response) => {
    return response.status(200).json();
};

const getPublish = async (request, response) => {
    return response.status(200).json();
};

const getStop = async (request, response) => {
    return response.status(200).json();
};

const executionData = async (request, response) => {
    return response.sendFile(BASE_DIR+"/backend/src/public/index.html");
};

module.exports = {
    getValidate,
    getSave,
    getPublish,
    getStop,
    executionData
}
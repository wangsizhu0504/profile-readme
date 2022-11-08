"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../utils");
const error_1 = __importDefault(require("./error"));
const card_1 = __importDefault(require("../components/card"));
const helper_1 = require("./helper");
const themes_1 = __importDefault(require("../data/themes"));
const width = 842;
const height = 350;
async function profileWidget(username, data, themeString) {
    // Set the theme
    let theme = (0, utils_1.getTheme)(themes_1.default, 'default');
    if (themeString) {
        theme = (0, utils_1.getTheme)(themes_1.default, themeString);
    }
    if (!theme) {
        theme = (0, utils_1.getTheme)(themes_1.default, 'default');
    }
    const dataOptions = data.split(',');
    // Return error if dataOptions argument is undefined
    if (dataOptions === undefined) {
        return Promise.resolve((0, error_1.default)('Profile', '-25%', `Data option is missing!`, '-24%'));
    }
    // Return error if more than 4 dataOptions were supplied
    if (dataOptions.length > 4) {
        return Promise.resolve((0, error_1.default)('Profile', '-25%', `Can't have more than 4 data-options!`, '-24%'));
    }
    try {
        const dataBoxes = await (0, helper_1.getDataOptions)(dataOptions, username);
        // If we receive a Promise, we return that
        if (typeof dataBoxes != 'string')
            return dataBoxes;
        // Create the request
        const response = await axios_1.default.get(`https://api.github.com/users/${username}`);
        // Grab the avatar
        const avatar = await (0, utils_1.requestInBase64)(response.data.avatar_url);
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                <defs>
                    <pattern id="pattern" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" viewBox="0 0 200 200">
                        <image width="200" height="200" xlink:href="data:image/jpeg;base64,${avatar}"/>
                    </pattern>
                </defs>
                ${(0, card_1.default)(width, height, theme.background)}
                ${buildUserInfo(theme.title, response.data, dataBoxes)}
                <g id="activity-card">
                    <text fill="${theme.headerTitle}" transform="translate(52 150)" font-size="20">
                        <tspan x="0" y="0"> ⚡ Recent activity</tspan>
                    </text>
                    ${await generateActivityList(username, theme.headerTitle)}
                </g>
            </svg>`;
    }
    catch (error) {
        return Promise.resolve((0, error_1.default)('Profile', '-25%', 'GitHub API-call error!', '-24%'));
    }
}
exports.default = profileWidget;
function buildUserInfo(themeTitle, data, dataBoxes) {
    return `
        <g id="profile-card">
            <rect id="profile-image" width="65" height="65" rx="30" transform="translate(52 47)" fill="url(#pattern)"/>
            <text id="text-name" fill="${themeTitle}" data-name="text-name" transform="translate(145 78)" font-size="26" font-family="Roboto-Medium, Roboto, sans-serif" font-weight="500">
                <tspan x="0" y="0">
                    ${data.name === null ? data.login : data.name}
                </tspan>
            </text>
            <text id="text-url" data-name="text-url" transform="translate(145 102)" fill="#bfbfbf" font-size="16" font-family="Roboto-Regular, Roboto, sans-serif"><tspan x="0" y="0">${data.bio}</tspan></text>
            <g id="data-boxes" transform="translate(${width - 52} 47)">
                ${dataBoxes}
            </g>
        </g>
    `;
}
async function generateActivityList(userName, headerTitle) {
    const list = await (0, helper_1.generateUserActivity)(userName);
    if (!list) {
        return '';
    }
    return list.map((item, index) => {
        return `
            <text fill="${headerTitle}" transform="translate(70 ${185 + index * 30})" font-size="15">
                <tspan x="10" y="0"> ${index + 1}.</tspan>
                <tspan x="28" y="0"> ${item}</tspan>
            </text>
        `;
    }).join("");
}
// generate('wangsizhu0504')
//# sourceMappingURL=profile.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUserActivity = exports.getDataOptions = void 0;
const user_stats_fetcher_1 = __importDefault(require("../fetchers/user-stats-fetcher"));
const error_1 = __importDefault(require("./error"));
const axios_1 = __importDefault(require("axios"));
async function getDataOptions(dataOptions, username) {
    let dataBoxes = '';
    const profile = await (0, user_stats_fetcher_1.default)(process.env.GITHUB_TOKEN, username);
    const stargazers = [];
    profile.data.user.repositories.nodes.forEach((repo, index) => {
        stargazers[index] = repo.stargazers.totalCount;
    });
    for (let i = 0; i < dataOptions.length; i++) {
        switch (dataOptions[i].toLowerCase()) {
            case 'followers':
                addDataBox('followers', i, profile.data.user.followers.totalCount, '#CAF0FF', '#00C6FF', 'M3.625,9.5A2.417,2.417,0,1,0,1.208,7.084,2.419,2.419,0,0,0,3.625,9.5Zm16.919,0a2.417,2.417,0,1,0-2.417-2.417A2.419,2.419,0,0,0,20.544,9.5Zm1.208,1.208H19.336a2.41,2.41,0,0,0-1.7.7,5.524,5.524,0,0,1,2.836,4.132h2.493a1.207,1.207,0,0,0,1.208-1.208V13.126A2.419,2.419,0,0,0,21.753,10.709Zm-9.668,0a4.23,4.23,0,1,0-4.23-4.23A4.228,4.228,0,0,0,12.085,10.709Zm2.9,1.208h-.313a5.84,5.84,0,0,1-5.174,0H9.185a4.352,4.352,0,0,0-4.351,4.351v1.088a1.813,1.813,0,0,0,1.813,1.813H17.523a1.813,1.813,0,0,0,1.813-1.813V16.269A4.352,4.352,0,0,0,14.985,11.918Zm-8.448-.506a2.41,2.41,0,0,0-1.7-.7H2.417A2.419,2.419,0,0,0,0,13.126v1.208a1.207,1.207,0,0,0,1.208,1.208H3.7A5.538,5.538,0,0,1,6.537,11.412Z');
                break;
            case 'repositories':
                addDataBox('repositories', i, profile.data.user.repositories.totalCount, '#FFCEE4', '#FF0774', 'M7.106,3A2.106,2.106,0,0,0,5,5.106V17.74a.7.7,0,0,0,.207.5,2.026,2.026,0,0,0,1.9,1.608h.7v-1.4h-.7a.7.7,0,0,1,0-1.4H17.634a1.4,1.4,0,0,0,1.4-1.4V4.4a1.4,1.4,0,0,0-1.4-1.4Zm.7,2.106h.7a.7.7,0,0,1,.7.7v.7a.7.7,0,0,1-.7.7h-.7a.7.7,0,0,1-.7-.7v-.7A.7.7,0,0,1,7.808,5.106Zm0,3.51h.7a.7.7,0,0,1,.7.7v.7a.7.7,0,0,1-.7.7h-.7a.7.7,0,0,1-.7-.7v-.7A.7.7,0,0,1,7.808,8.615Zm0,3.51h.7a.7.7,0,0,1,.7.7v.7a.7.7,0,0,1-.7.7h-.7a.7.7,0,0,1-.7-.7v-.7A.7.7,0,0,1,7.808,12.125Zm1.4,6.317v3.51l2.106-1.4,2.106,1.4v-3.51Zm5.615,0v1.4h3.51a.7.7,0,0,0,0-1.4Z');
                break;
            case 'stars':
                addDataBox('stars', i, stargazers.reduce((a, b) => a + b, 0), '#FFEFCD', '#FFA100', 'M9.6.608,7.369,5.131l-4.992.728a1.094,1.094,0,0,0-.6,1.865l3.611,3.519L4.53,16.215a1.093,1.093,0,0,0,1.585,1.151l4.465-2.347,4.465,2.347a1.094,1.094,0,0,0,1.585-1.151l-.854-4.971,3.611-3.519a1.094,1.094,0,0,0-.6-1.865l-4.992-.728L11.561.608A1.094,1.094,0,0,0,9.6.608Z');
                break;
            case 'contributions':
            case 'commits':
                addDataBox('contributions', i, profile.data.user.contributionsCollection
                    .contributionCalendar.totalContributions, '#C5FFD9', '#00F14F', `<g id="contributions-icon" transform="translate(-71 9)">
                        <path id="path1" data-name="path1" d="M0,0H20.592V20.592H0Z" fill="none"/>
                        <path id="path2" data-name="path2" d="M12.438,14.87v5.148H10.722V14.87H8.148l3.432-4.29,3.432,4.29Zm1.716,1.716h2.574V14.012h-.686L11.58,8.435,6.987,14.012H6a1.287,1.287,0,0,0,0,2.574h3V18.3H6a3,3,0,0,1-3-3V4.574A2.574,2.574,0,0,1,5.574,2H17.586a.858.858,0,0,1,.858.858V17.444a.858.858,0,0,1-.858.858H14.154ZM6.432,4.574V6.29H8.148V4.574Zm0,2.574V8.864H8.148V7.148Z" transform="translate(-0.426 -0.284)" fill="#00F14F"/>
                    </g>`);
                break;
            // Incorrect data item found
            default:
                return new Promise((res) => {
                    res((0, error_1.default)('Profile', '-25%', `Invalid data item found!`, '-26%'));
                });
        }
    }
    // Add a box with a data counter
    function addDataBox(name, index, count, color1, color2, svg) {
        dataBoxes += `<g id="${name}" transform="translate(${(dataOptions.length - 1 - index) * -108} 0)">
                <rect id="${name}-box" width="85" height="35" rx="18.5" transform="translate(-90 0)" fill="${color1}"/>
                <text id="${name}-text" data-name="${name}-text" transform="translate(${name === 'followers' ? '-43' : '-47'} 24)" fill="${color2}" font-size="16" font-family="Roboto-Regular, Roboto, sans-serif">
                    <tspan x="0" y="0">${count}</tspan>
                </text>
                ${name !== 'commits' && name !== 'contributions'
            ? `<path id="${name}-icon" transform="translate(-71 ${name === 'stars' ? '8' : '6'})" fill="${color2}" d="${svg}"/>`
            : svg}
            </g>`;
    }
    return dataBoxes;
}
exports.getDataOptions = getDataOptions;
async function generateUserActivity(username, maxEvents, token) {
    if (maxEvents == undefined)
        maxEvents = 5;
    if (token == undefined)
        token = process.env.GITHUB_TOKEN;
    const result = [];
    let page = 1;
    while (result.length < maxEvents && page <= 3) {
        const headers = token == undefined ? {} : { authorization: `Bearer ${token}` };
        const response = await axios_1.default.get(`https://api.github.com/users/${username}/events?per_page=100&page=${page}`, { headers: headers });
        const data = response.data;
        page++;
        for (const event of data) {
            if (result.length >= maxEvents)
                break;
            const type = event.type;
            const repo = `<tspan fill="#477de9"> [${event.repo.name}]</tspan>`;
            const payload = event.payload;
            const action = payload.action;
            if (type == 'ForkEvent') {
                result.push(`🔀 Forked ${repo}`);
            }
            else if (type == 'IssueCommentEvent' && action == 'created') {
                result.push(`🗣 Commented on ${issueOrPrURL(payload)} in ${repo}`);
            }
            else if (type == 'IssuesEvent' && ['opened', 'closed', 'reopened'].includes(action)) {
                result.push(`❗️ ${capitalize(action)} ${issueOrPrURL(payload)} in ${repo}`);
            }
            else if (type == 'PublicEvent') {
                result.push(`🎉 Published ${repo}`);
            }
            else if (type == 'PullRequestEvent' && ['opened', 'closed', 'reopened'].includes(action)) {
                const merged = payload.pull_request.merged;
                const emoji = action == 'opened' ? '💪' : (merged ? '🎉' : '❌');
                result.push(`${emoji} ${capitalize(merged ? 'Merged' : action)} PR ${issueOrPrURL(payload)} in ${repo}`);
            }
            else if (type == 'ReleaseEvent' && action == 'published') {
                result.push(`🏷️ Published [${payload.release.tag_name}](${payload.release.html_url}) of ${repo}`);
            }
        }
    }
    return result;
}
exports.generateUserActivity = generateUserActivity;
function issueOrPrURL(payload) {
    const item = payload.issue || payload.pull_request;
    return `<tspan fill="#477de9"> [#${item.number}]</tspan>`;
}
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
//# sourceMappingURL=helper.js.map
require('dotenv').config()

import axios from 'axios'
import { getTheme, requestInBase64 } from '../utils'
import errorWidget from './error'
import buildCard from '../components/card'
import { generateUserActivity, getDataOptions } from "./helper"
import { Theme } from "../interfaces/Theme";
import themes from '../data/themes'

const width = 842
const height = 350

export default async function profileWidget(
    username: string,
    data: string,
    themeString?: string
): Promise<string> {
    // Set the theme
    let theme: Theme = getTheme(themes, 'default')
    if (themeString) {
        theme = getTheme(themes, themeString)
    }
    if (!theme) {
        theme = getTheme(themes, 'default')
    }

    const dataOptions: Array<string> = data.split(',')

    // Return error if dataOptions argument is undefined
    if (dataOptions === undefined) {
        return Promise.resolve(errorWidget('Profile', '-25%', `Data option is missing!`, '-24%'))
    }

    // Return error if more than 4 dataOptions were supplied
    if (dataOptions.length > 4) {
        return Promise.resolve(errorWidget('Profile', '-25%', `Can't have more than 4 data-options!`, '-24%'))
    }

    try {
        const dataBoxes = await getDataOptions(dataOptions, username)
        // If we receive a Promise, we return that
        if (typeof dataBoxes != 'string') return dataBoxes

        // Create the request
        const response = await axios.get(`https://api.github.com/users/${username}`)

        // Grab the avatar
        const avatar = await requestInBase64(response.data.avatar_url)
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                <defs>
                    <pattern id="pattern" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" viewBox="0 0 200 200">
                        <image width="200" height="200" xlink:href="data:image/jpeg;base64,${avatar}"/>
                    </pattern>
                </defs>
                ${buildCard(width, height, theme.background)}
                ${buildUserInfo(theme.title, response.data, dataBoxes)}
                <g id="activity-card">
                    <text fill="${theme.headerTitle}" transform="translate(52 150)" font-size="20">
                        <tspan x="0" y="0"> ⚡ Recent activity</tspan>
                    </text>
                    ${await generateActivityList(username, theme.headerTitle)}
                </g>
            </svg>`
    } catch (error) {
        return Promise.resolve(errorWidget('Profile', '-25%', 'GitHub API-call error!', '-24%'))
    }
}

function buildUserInfo(themeTitle: string, data: any, dataBoxes: string) {

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
    `
}
async function generateActivityList(userName: string, headerTitle:string) {
    const list = await generateUserActivity(userName)
    if (!list) {
        return ''
    }
    return list.map((item, index) => {
        return `
            <text fill="${headerTitle}" transform="translate(70 ${185 + index * 30})" font-size="15">
                <tspan x="10" y="0"> ${index + 1}.</tspan>
                <tspan x="28" y="0"> ${item}</tspan>
            </text>
        `
    }).join("")
}
// generate('wangsizhu0504')

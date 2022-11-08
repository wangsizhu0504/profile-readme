import { Request, Response } from 'express'

import express from 'express'
const router = express.Router()

import flowerWidget from '../../src/widgets/flower'
import errorWidget from '../../src/widgets/error'
const githubUsernameRegex = require("github-username-regex")

// Primary profile route
router.get('/', function (req: Request, res: Response) {
    const { username, data, theme } = req.query

    // Set the header's type to svg/xml
    res.setHeader('Content-Type', 'image/svg+xml')

    // Check if username argument is not present
    if (username === undefined || username === null) {
        res.send(errorWidget('Profile', '-25%', 'Username is undefined!', '-26%'))
        return
    }

    // Check validity based on GitHub's username rules
    if (!githubUsernameRegex.test(username)) {
        res.send(errorWidget('Profile', '-25%', 'Username is invalid!', '-22%'))
        return
    }

    // Check if data argument is not present
    if (data === undefined || data === null) {
        res.send(errorWidget('Profile', '-25%', 'Data option is missing!', '-25%'))
        return
    }

    // Grab the Profile widget
    flowerWidget(String(username), String(theme)).then((response) => {
        if (response === undefined || response === null) {
            res.send(errorWidget('Profile', '-25%', 'GitHub API-call error!', '-24%'))
        } else {
            res.send(response)
        }
    }).catch(e => {
        console.log(1111, e)
    })
})

export default router

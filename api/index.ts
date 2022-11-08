require('dotenv').config()

import { Request, Response } from 'express'
import errorWidget from '../src/widgets/error'
import routes from './routes'

// Setup express
import express from 'express'
const app = express()
// Use routing on the /api prefix
app.use('/api', routes)

// Send error widget for incorrect request URL
app.use('*', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'image/svg+xml')
    res.send(errorWidget('Unknown', '-28%', 'Invalid API URL!', '-19%'))
})

// Start listening on defined port
app.listen(3101, () => {
    console.log(
        `Github-WidgetBox listening at http://localhost:3101`
    )
})

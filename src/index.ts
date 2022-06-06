import 'module-alias/register'
import 'dotenv-safe/config'

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { Server } from 'socket.io'
import http from 'http'

import auth from './api/auth'
import dex from './api/dex'
import cex from './api/cex'
import info from './api/info'
import socket from './socket'

import { connectToDB, startCronJobs } from './init'
import { allowedMethods, authenticateUser } from './config/middleware'
import { logger } from '@config/logger'

const boot = async () => {
  // init app
  await connectToDB()
  await startCronJobs()

  const app = express()
  app.use(allowedMethods)
  app.use(
    cors({
      credentials: true,
      origin: process.env.FRONTEND_URL,
    }),
  )
  app.use(bodyParser.json())
  app.use(cookieParser())

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  // init api routes
  app.use('/api/auth', auth)
  app.use('/api/cex', authenticateUser, cex)
  app.use('/api/dex', authenticateUser, dex)
  app.use('/api/info', authenticateUser, info)

  // init socket endpoint
  const server = http.createServer(app)
  const io = new Server(server, {
    cookie: true,
  })
  socket(io)

  // start
  const port = process.env.PORT
  app.listen(port, () => {
    logger.info(`App listening at http://localhost:${port}`)
  })
}

boot()

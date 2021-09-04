import swaggerJSDoc from 'swagger-jsdoc'
import { Express } from 'express'
import swaggerUi from 'swagger-ui-express'

const loader = (app: Express) => {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Xendit Marvel API',
        version: '1.0.0',
      },
    },
    apis: ['./src/routes/*.ts'] // reference from node is running
  }

  const swaggerSpec = swaggerJSDoc(options)

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}

export default loader
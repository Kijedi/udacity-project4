import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import * as uuid from 'uuid'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { generateSignedUrl, updateAttachmentUrl } from '../../helpers/todos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {

      const userId = getUserId(event)
      const todoId = event.pathParameters.todoId
      const attachmentId = uuid.v4()

      const uploadUrl = await generateSignedUrl(attachmentId)
      await updateAttachmentUrl(userId, todoId, attachmentId)
       return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({uploadUrl})
      };
      // return createsuccess({ uploadUrl })
    } catch (error) {
      return error
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )

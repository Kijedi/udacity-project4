import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {

      const userId = getUserId(event)
      const newTodo: CreateTodoRequest = JSON.parse(event.body)

      const item = await createTodo(userId, newTodo)
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          "item": item})
      };
      // return createsuccess({ item })
    } catch (error) {
      return error
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)

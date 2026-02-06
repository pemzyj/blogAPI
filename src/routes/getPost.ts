import {Router} from 'express';
import authJWT from '../middlewares/auth.js';
import { getPostsByQueryController, getPostsController } from '../controllers/getPosts.js';


export const getPostRouter = Router();
//get posts using slug

/**
 * @swagger
 * /posts/{slug}:
 *    get:
 *      tags:
 *        - Posts
 *        summary: register users
 *          responses: 
 *              "200":
 *                 description:
 *                 content: 
 *                      application/json:
 *                          schema: 
 *                            type: object
 *                            properties: 
 *                              email:
 *                                  type: 
 *                              password: 
 *                                  type:
 *                              username:
 *                                  type:
 *                              role:
 *                                  type:
 * 
 */
getPostRouter.get('/posts/:slug', authJWT, getPostsController);


//get all posts and posts by author name
export const getPostByQuery = Router();

/**
 * @swagger
 * /posts:
 *    get:
 *      operationId: getPostsByAuthor
 *      tags:
 *        - All posts by an author
 *        summary: get posts
 *        description: >
 *        parameters: 
 *          - name: author
 *            in: query
 *            description: Author name
 *            required: true
 *            schema: 
 *              type: string
 *          responses: 
 *              "200":
 *                 description:
 *                 content: 
 *                      application/json:
 *                          schema: 
 *                            type: object
 *                            properties: 
 *                              email:
 *                                  type: 
 *                              password: 
 *                                  type:
 *                              username:
 *                                  type:
 *                              role:
 *                                  type:
 * 
 */
getPostByQuery.get('/posts', authJWT, getPostsByQueryController); 


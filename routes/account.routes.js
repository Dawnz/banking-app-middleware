const router = require('express').Router()
const AccountController = require('../controllers/account.controller');
const Middleware = require('../middlewares/middleware');

router
    .route("/")
    /**
     * @openapi
     * /api/v1/accounts/:
     *  post:
     *      summary: Create a new account
     *      tags:
     *          - Accounts
     *      requestBody:
     *          description: Form data required to create a new account
     *          required: true
     *          content:
     *              application/json:
     *                  schema:
     *                      $ref: '#/components/schemas/Account'
     *      responses:
     *          201:
     *              description: SUCCESS
     *              content: 
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              status:
     *                                  type: string
     *                                  example: 201
     *                              message:
     *                                  type: string
     *                                  example: Account was created successfully
     *                              data:
     *                                  type: object
     *                                  properties:
     *                                      account:
     *                                          type: object
     *                                          $ref: '#/components/schemas/Account'
     *          400:
     *              description: FAILED
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              status:
     *                                  type: string
     *                                  example: 400
     *                              message:
     *                                  type: string
     *                                  example: Bad request
     *                              error:
     *                                  type: string
     *                                  example: Error creating account
     *          5XX:
     *              description: FAILED
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              status:
     *                                  type: string
     *                                  example: FAILED
     *                              data:
     *                                  type: object
     *                                  properties:
     *                                          error:
     *                                              type: string
     *                                              example: Server error 
     */
    .post(AccountController.createAccount)
    /**
     * @openapi
     * /api/vi/accounts/:
     *  get:
     *      tags:
     *          - Accounts
     *      summary: Get all accounts
     *      responses:
     *          200:
     *              description: SUCCESS
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              status:
     *                                  type: string
     *                                  example: 200
     *                              message:
     *                                  type: string
     *                                  example: Successfully Retrieved all accounts
     *                              data:
     *                                  type: object
     *                                  properties:
     *                                      accounts: 
     *                                          type: array
     *                                          items: 
     *                                              type: object
     *                                              $ref: "#/components/schemas/Account"
     *          400:
     *              description: FAILED
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              status:
     *                                  type: string
     *                                  example: 400
     *                              message:
     *                                  type: string
     *                                  example: Bad Request
     *                              error:
     *                                  type: string
     *                                  example: Error retrieving all accounts
     *          5XX:
     *              description: FAILED
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              status:
     *                                  type: string
     *                                  example: FAILED
     *                              data:
     *                                  type: object
     *                                  properties:
     *                                          error:
     *                                              type: string
     *                                              example: Server error
     */
    .get(Middleware.isAuthenticated, AccountController.getAccountById)

router
    .route("/:id")
    /**
     * @openapi
     * /api/v1/accounts/{id}:
     *  get:
     *      tags:
     *          - Accounts
     *      summary: Retrieve an account 
     *      parameters: 
     *          -   in: path
     *              name: id
     *              schema:
     *                  type: string
     *                  example: 63228ae60e8b432603389f39
     *              required: true
     *              description: Mongoose object id of the account to be retrieved
     *      responses:
     *          200:
     *              description: SUCCESS
     *              content: 
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              status:
     *                                  type: string
     *                                  example: 200
     *                              message: 
     *                                  type: string
     *                                  example: Account information succesfully found
     *                              data:
     *                                  type: object
     *                                  properties:
     *                                      account:
     *                                          type: object
     *                                          $ref: "#/components/schemas/Account"
     *                                          
     *            
     */
    .get(Middleware.isAuthenticated, AccountController.getAccountById)
    .patch(Middleware.isAuthenticated, AccountController.updateAccount)
    .delete(Middleware.isAuthenticated, AccountController.deleteAccount)
    


module.exports = router;
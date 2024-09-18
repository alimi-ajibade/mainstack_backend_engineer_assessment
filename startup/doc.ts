import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = process.env.NODE_ENV
    ? {
          definition: {
              openapi: "3.0.0",
              info: {
                  title: "Mainstack Store",
                  version: "0.1.0",
                  description: "Store Front",
                  license: {
                      name: "MIT",
                      url: "https://spdx.org/licenses/MIT.html",
                  },
              },
              servers: [
                  {
                      url: "https://mainstack.azurewebsites.net",
                  },
              ],
              components: {
                  securitySchemes: {
                      ApiKeyAuth: {
                          type: "apiKey",
                          in: "header",
                          name: "x-auth-token",
                      },
                  },
              },
          },
          apis: ["./docs/*.yaml"],
      }
    : {
          definition: {
              openapi: "3.0.0",
              info: {
                  title: "Mainstack",
                  version: "0.1.0",
                  description: "Inventory Management",
                  license: {
                      name: "MIT",
                      url: "https://spdx.org/licenses/MIT.html",
                  },
              },
              servers: [
                  {
                      url: "http://localhost:8000",
                  },
              ],
              components: {
                  securitySchemes: {
                      ApiKeyAuth: {
                          type: "apiKey",
                          in: "header",
                          name: "x-auth-token",
                      },
                  },
              },
          },
          apis: ["./docs/*.yaml"],
      };

const specs = swaggerJSDoc(swaggerOptions);

export default specs;

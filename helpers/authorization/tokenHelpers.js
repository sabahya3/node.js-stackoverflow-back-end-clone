// JSON Web Token Helpers

/* This function generates a token using the "generateJwtFromUser" method on the user model and sends this token to the user as a cookie through the "res.cookie" function. 
"res.cookie" is a response function from Express.js. Then the generated token is sent as JSON information. Along with the token information, the username and user e-mail are also sent.*/
const sendJwtToClient = (user, res) => {

      const {JWT_COOKIE, NODE_ENV} = process.env;

      const token = user.generateJwtFromUser();

      res.status(200).cookie("access_token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + parseInt(JWT_COOKIE) * 1000 * 60),
          secure: NODE_ENV === "development" ? false : true,
      })
      .json({
          success: true,
          access_token: token,
          data: {
              user: user.name,
              email: user.email
          }
      });
};

/* This function checks if the JSON Web Token has been sent. Token information goes as authorization in headers. */
const isTokenIncluded = (req) => {

      return (
          req.headers.authorization && req.headers.authorization.startsWith("Bearer:")
      );

};

/* This function receives the sent token information. */
const getAccessTokenFromHeader = (req) => {

      const authorization = req.headers.authorization;
      const access_token = authorization.split(" ")[1];
      return access_token;

};

module.exports = {
    sendJwtToClient,
    isTokenIncluded,
    getAccessTokenFromHeader,
};
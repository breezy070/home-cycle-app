const logRequestMiddleware = async (req, res, next) => {
    try {
      const { method, url, params, body } = req
      const date = new Date().toLocaleDateString('en-GB')
    
      //use body.email if you want to ommit the password, or hash and salt before showing it
      console.log(date, method, url, params, body.email)
    
      return next()
    } catch (err) {
      return next(err)
    }
  }
  
  export default logRequestMiddleware;
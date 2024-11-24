//custom error handling
export const errorHandler = (statusCode, message) => {
    const error = new Error(message);
    error.message = message;
    return error;
};
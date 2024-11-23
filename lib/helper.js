function getSuccessResponse(responseData) {
    return {
        statusCode: 200,
        body: JSON.stringify(responseData),
        headers: {
            "Content-Type": "application/json"
        }
    }
}

function getErrorResponse(errorMessage, statusCode = 500) {
    return {
        statusCode,
        body: {
            error: errorMessage,
        },
        headers: {
            "Content-Type": "application/json"
        }
    }
}

module.exports = { getSuccessResponse, getErrorResponse }
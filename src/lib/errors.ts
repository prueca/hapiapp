export default {
    UNEXPECTED_ERROR: {
        code: 'UNEXPECTED_ERROR',
        message: 'An unexpected error occurred.'
    },
    INTERNAL_ERROR: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred. Please try again later.'
    },
    MISSING_REQUIRED_FIELD: {
        code: 'MISSING_REQUIRED_FIELD',
        message: 'A required field is missing.'
    },
    INVALID_DATA_FORMAT: {
        code: 'INVALID_DATA_FORMAT',
        message: 'One or more provided values have an invalid format.'
    },
    DATA_CONFLICT: {
        code: 'DATA_CONFLICT',
        message: 'The data already exists and conflicts with an existing record.'
    },
    NOT_FOUND: {
        code: 'NOT_FOUND',
        message: 'The requested resource was not found.'
    },
    UNAUTHORIZED: {
        code: 'UNAUTHORIZED',
        message: 'You are not authorized to perform this transaction.'
    },
    FOREIGN_KEY_VIOLATION: {
        code: 'FOREIGN_KEY_VIOLATION',
        message:
            'The request references data that does not exist or cannot be removed because it is still in use.'
    },
    CHECK_CONSTRAINT_VIOLATION: {
        code: 'CHECK_CONSTRAINT_VIOLATION',
        message: 'The provided data does not satisfy the required constraints.'
    },
    NETWORK_ERROR: {
        code: 'NETWORK_ERROR',
        message: 'No internet connection. Please check your connection and try again.'
    },
    TYPE_ERROR: {
        code: 'TYPE_ERROR',
        message: 'Unable to connect. Please check your internet connection and try again.'
    }
}

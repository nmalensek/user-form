export const unexpectedError = 'An unexpected error occurred, please check your input or try again later.';

export const connectionError = 'Unable to contact the server, please check your connection or try again later.';

export const userAdded = 'User added successfully!';

export const userDeleted = 'User deleted successfully!';

export function getPersonalizedUserDeletedMessage(user) {
    return user + ' deleted successfully';
}
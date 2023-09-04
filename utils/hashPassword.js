const bcrypt = require('bcrypt');

function hashPassword(password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    return hashedPassword;
}

module.exports = hashPassword;

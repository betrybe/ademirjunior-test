function isEmail(email) {
    const emailRegexp = /\S+@\S+\.\S+/;

    return emailRegexp.test(email);
}

module.exports = {
    isEmail,
};
module.exports = {
    /** @param {string} caller */
    NotImplementedError: function(caller) {
        return `${caller} is not fully and properly implemented.`;
    }
}
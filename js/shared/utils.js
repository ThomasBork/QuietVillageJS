class Utils {
    static extend(source, extension) {
        const result = {};
        Object.keys(source).forEach(key => {
            if (extension.hasOwnProperty(key)) {
                result[key] = extension[key];
            } else {
                result[key] = source[key]
            }
        });
        Object.keys(extension).forEach(key => result[key] = extension[key]);
        return result;
    }
}
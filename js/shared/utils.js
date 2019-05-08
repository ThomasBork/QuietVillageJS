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

    static randomFloat (min, max) {
        return Math.random() * (max - min) + min;
    }

    static randomInt (min, max) {
        return Math.floor(Utils.randomFloat(min, max + 1));
    }

    static randomElement (array) {
        return array[Utils.randomInt(0, array.length - 1)];
    }

    static clone (objOrArray) {
        return JSON.parse(JSON.stringify(objOrArray));
    }
}
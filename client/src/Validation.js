    class Validation {
        static test() {
            console.log('test validation');
        }
        static hasStringInput(input) {
            if (!input || typeof input !== 'string' || input.length === 0) {
                return false;
            }
            return true;
        }
        static requiredValidEmail(email) {
            //from: https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
            const emailExpression = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            if (Validation.hasStringInput(email)) {
                if (email.match(emailExpression) !== null) {
                    return true;
                }
            }
            return false;
        }
        static requiredValidName(name) {
            //const nameExpression = /^[a-zA-Z][-']?/;
            if (Validation.hasStringInput(name)) {
                // let matches = name.match(nameExpression);
                // if (matches !== null && matches.length === 1) {
                    return true;
                //}
            }
            return false;
        }
        static requiredValidOrg(org) {
            //const orgExpression = /^[a-zA-Z][-'()]?/;
            if (Validation.hasStringInput(org)) {
                // let matches = org.match(orgExpression);
                // if (matches !== null && matches.length === 1) {
                    return true;
                //}
            }
            return false;
        }
    }

    module.exports = Validation;
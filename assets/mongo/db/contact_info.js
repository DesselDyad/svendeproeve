const ContactInfo = require('../../models/contact_info');

/**
 * @module DB_ContactInfo
 */
module.exports = {
    /**
     * Gets all the contact info
     * @returns {Object} - All contact info
     */
    getAll: () => {
        return new Promise((resolve, reject) => {
            ContactInfo.find({}, (err, info) => {
                if(err) reject(err);
                else {
                    resolve(info);
                }
            })
        })
    },
    /**
     * Updates the contact info
     * @param {object} req - the request object containing the body and error validator
     * @returns {String} - An error or success message
     */
    update: (req) => {
        return new Promise(async (resolve, reject) => {
            var name = req.body.name;
            var adress = req.body.adress;
            var city = req.body.city;
            var country = req.body.country;
            var phone = req.body.phone;
            var fax = req.body.fax;
            var email = req.body.email;

            // Validation
            req.checkBody('name', 'Navn er påkrævet').notEmpty();
            req.checkBody('adress', 'Adresse er påkrævet').notEmpty();
            req.checkBody('city', 'By er påkrævet').notEmpty();
            req.checkBody('country', 'Land er påkrævet').notEmpty();
            req.checkBody('phone', 'Telefon nummer er påkrævet og må kun indeholde tal').notEmpty().isNumeric();
            req.checkBody('fax', 'Fax nummer er påkrævet og må kun indeholde tal').notEmpty().isNumeric();
            req.checkBody('email', 'E-mail adresse er påkrævet og skal være en gyldig email-adresse').notEmpty().isEmail();

            var errors = req.validationErrors();

            if (errors) {
                resolve({ errors: errors });
            }
            else {
                ContactInfo.updateMany({}, {
                    name: name,
                    adress: adress,
                    city: city,
                    country: country,
                    phone: phone,
                    fax: fax,
                    email: email
                }, function (err, info) {
                    if (err) reject(err);
                });
                resolve({
                    'success_msg': 'You have updated the contact information!'
                });
            }
        })
    }
}
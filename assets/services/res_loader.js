const contact_info = require('../mongo/db/contact_info');
const categories = require('../mongo/db/categories');
const articles = require('../mongo/db/article');
const advertisements = require('../mongo/db/advertisements');
const crumbs = require('../json/crumbs');

const user = require('../mongo/db/user');
const role = require('../mongo/db/role');
const ad_prices = require('../mongo/db/sponsor');

/**
 * @module RessourceLoader
 * module responsible for delivering ressources used on nearly every page
 * reduces lines of code, makes code more maintainable and more readable
 */

module.exports = {
    /**
     * Created a role_id variable for EJS files to easily check user role (editor or admin)
     */
    populateReqUser: _user => {
        return new Promise( async(resolve, reject) => {
            try {
                let _role = await user.getUserRole(_user.role)
                resolve(_role);
  _          }
            catch (e) {
                reject(e);
            }
        })
    },
    /**
     * Loads general page ressources for user part of the page
     */
    data: () => {
        return new Promise(async (resolve, reject) => {
            try {
                let obj = {
                    sidebar: {}
                };
                obj.contact_info = await contact_info.getAll();
                obj.menu_categories = await categories.getMenuItems();
                obj.sidebar.sidebar_articles = await articles.getGeneralSideBarArticles();
                obj.sidebar.advertisements = await advertisements.getGeneralSideBarAdvertisements();
                obj.crumbs = await crumbs.getAll();
                resolve(obj);
            }
            catch (e) {
                reject(e);
            }
        })
    },
    /**
     * Loads ressources needed to populate admin page
     * Admin needs a little more than user page
     * tis speeds up performance for user page, too
     */
    admin_data: () => {
        return new Promise(async (resolve, reject) => {
            try {
                let obj = {};
                obj.contact_info = await contact_info.getAll();
                obj.menu_categories = await categories.getMenuItems();
                obj.articles = await articles.getAll();
                obj.users = await user.getAll();
                obj.adDescription = await advertisements.getDescription();
                obj.ads = await advertisements.getAllAdvertisements();
                obj.ad_prices = await ad_prices.getPrices();
                obj.roles = await role.getAll();
                obj.crumbs = await crumbs.getAll();
                resolve(obj);
            }
            catch (e) {
                reject(e);
            }
        })
    }
}
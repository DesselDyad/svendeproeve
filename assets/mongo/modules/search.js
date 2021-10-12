const search = require('../db/search');
const articles = require('../db/article');
const res_loader = require('../../services/res_loader');

/**
 * @module search
 */

module.exports = {
    /**
     * queries the databases articles by a query string entered by the user (or number)
     * @param {object} req - the request object
     * @param {object} res - the response object
     * @returns {object} - all search results, if any
     */
    search: async (req, res) => {
        try {
            let obj = await res_loader.data();
            obj.articles = await articles.getAll();
            obj.title = 'Arkiv';
            let response = await search.search(req);
			let count = obj.articles.length;
			//since search results are being shown on archive page, do some pagination
			if(req.query.page > 1) {
				let page = req.query.page;
				//based on page variable, return only part of the bikes
				while(page > 1 && obj.articles.length > 5) {
					page--;
					obj.articles.splice(0,5);
				}
				obj.pageCount = 1;
				while((count / 5) > 1) {
					obj.pageCount++;
					count = count-5;
				}
			} else {
				obj.pageCount = 1;
				while((count / 5) > 1) {
					obj.pageCount++;
					count = count-5;
				}
				obj.articles = obj.articles.splice(0,5);
			}
			//check for empty query
            if(response.errors) {
                obj.errors = response.errors;
                res.render('pages/archive', obj);
			}
			//success case
            else if(response.success_msg) {
				obj.search_results = response;
                res.render('pages/archive', obj);
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}
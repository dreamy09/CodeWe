/**
 * Express router providing index related routes
 * @module routes/index
 * @author Alexandre Dewilde
 * @date 15/11/2020
 * @version 1.0.0
 * @requires express
 * @requires ../db/MangoDB
 *
 */

const discordWebhook = require('webhook-discord');

/**
 * express module
 * @const
 */
const express = require('express');
 /**
 * MangoDB module
 * @const
 * @type {object}
 */
const db = require('../db/MongoDB');
const config = require('../config/config');
/**
 * Express router.
 * @type {object}
 * @const
 */
const router = express.Router();

const hook = config.DISCORD_WEBHOOK ? new discordWebhook.Webhook(config.DISCORD_WEBHOOK) : null;

/**
 * Route serving editorindex page
 * @name get/
 * @function
 * @memberof modules:routes/index
 * @inner
 */
router.get('/', (req, res) => {
    res.render('index.html', {production: config.PRODUCTION, client_versobe: config.CLIENT_VERBOSE});
});

/**
 * Route to create a new document
 * @name post/create_document
 * @function
 * @memberof modules:routes/index
 * @inner
 */
router.post('/create_document', async (req, res, next) => {
    try {
        //const language = req.body.language
        let documentId = await db.createDocument('python');
        if (documentId) {
            res.redirect(`/editor/${documentId}`);
        }
        else {
            res.status(500);
        }
    } catch (err) {
        next(err);
    }
});

router.post('/report-issue', async (req, res, next) => {
    try{
        const report = req.body.report;
        const agree = Boolean(req.body.agree);
        hook.info('Report', `***Share data:*** ${agree}\n***Report:***\n${report}`);
    } catch (err) {
        next(err);
    }
});

module.exports = router;

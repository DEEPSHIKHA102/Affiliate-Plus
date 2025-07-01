const Links = require('../model/Links'); 

const linksController = {
    create: async (request, response) => {
        const { campaign_title, original_url, category } = request.body;

        try {
            const link = new Links({
                campaignTitle: campaign_title,
                originalUrl: original_url,
                category: category,
                user: request.user.role === 'admin' ? request.user.id : request.user.adminId // Set by auth middleware
            });

            await link.save();

            response.json({
                data: { linkId: link._id }
            });
        } catch (error) {
            console.error(error);
            response.status(500).json({
                error: "Internal server error"
            });
        }
    },

    getAll: async (request, response) => {// GET all links created by logged-in user
        try {
            const userId = request.user.role === 'admin' ? request.user.id : request.user.adminId ;
            const links = await Links.find({  user: userId })
                .sort({ createdAt: -1 });

            response.json({
                data: links
            });
        } catch (error) {
            console.error(error);
            response.status(500).json({
                error: "Internal server error"
            });
        }
    },

    getById: async (request, response) => {// GET link by ID
        try {
            const linkId = request.params.id;
            if (!linkId) {
                return response.status(401).json({ error: 'Link ID is required' });
            }

            const link = await Links.findById(linkId);
            if (!link) {
                return response.status(404).json({ error: 'Link not found' });
            }

            const userId = request.user.role === 'admin' ? request.user.id : request.user.adminId;


            if (link.user.toString() !== userid) // Make sure the link indeed belong to the logged in user.
{
                return response.status(403).json({ error: 'Unauthorized access to link' });
            }

            response.json({ data: link });

        } catch (error) {
            console.error(error);
            response.status(500).json({
                error: "Internal server error"
            });
        }
    },

    update: async (request, response) => {
    try {
        const linkId = request.params.id;
        if (!linkId) {
            return response.status(401).json({ error: 'Link ID is required' });
        }

        let link = await Links.findById(linkId);
        if (!link) {
            return response.status(404).json({ error: 'Link ID does not exist' });
        }
const userId = request.user.role === 'admin' ?request.user.id : request.user.adminId;

        // Ownership check
        if (link.user.toString() !== userid) {
            return response.status(403).json({ error: 'Unauthorized access' });
        }

        const { campaign_title, original_url, category } = request.body;

        link = await Links.findByIdAndUpdate(
            linkId,
            {
                campaignTitle: campaign_title,
                originalUrl: original_url,
                category: category,
            },
            { new: true }  // new: true flag makes sure mongodb returns updated data after the update operation

            // returns updated document
        );

        response.json({ data: link });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Internal server error' });
    }
},
delete: async (request, response) => {
    try {
        const linkId = request.params.id;
        if (!linkId) {
            return response.status(400).json({ error: 'Link ID is required' });
        }

        let link = await Links.findById(linkId);
        if (!link) {
            return response.status(404).json({ error: 'Link ID does not exist' });
        }
        const userId = request.user.role ===
'admin' ?request.user.id :
request.user.adminId;


        if (link.user.toString() !== userid) {
            return response.status(403).json({ error: 'Unauthorized access' });
        }

        await link.deleteOne();
        response.json({ message: 'Link deleted successfully' });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Internal server error' });
    }
},
redirect: async (request, response) => {
    try {
        const linkId = request.params.id;
        if (!linkId) {
            return response.status(401).json({ error: 'Link ID is required' });
        }

        let link = await Links.findById(linkId);
        if (!link) {
            return response.status(404).json({ error: 'Link ID does not exist' });
        }

        // Track number of redirects (clicks)
        link.clickCount += 1;
        await link.save();

        return response.redirect(link.originalUrl);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Internal server error' });
    }
},

};

module.exports = linksController;

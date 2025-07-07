const Links = require("../model/Links");
const Users = require("../model/Users");

const linksController = {
  create: async (request, response) => {
    const { campaign_title, original_url, category } = request.body;

    try {
      // We're fetching user details from DB even though we have
      // it available in request object. The reason is critical operation.
      // We're dealing with money and we want to pull latest information
      // whenever we're transacting.
      const user = await Users.findById({ _id: request.user.id });

      const hasActivateSubscription = user.subscription &&
          user.subscription.status === 'active';

      if (!hasActivateSubscription && user.credits < 1) {
        return response.status(400).json({
          message: "Insufficient credit balance or no active subscription",
        });
      }

      const link = new Links({
        campaignTitle: campaign_title,
        originalUrl: original_url,
        category: category,
        user: request.user.role === "admin" ? 
              request.user.id : request.user.adminId,
      });
      await link.save();

      if(!hasActivateSubscription){
        user.credits -= 1;
        await user.save();
      }
      
      response.json({
        data: { linkId: link._id },
      });
    } catch (error) {
      console.log(error);
      response.status(500).json({
        error: "Internal server error",
      });
    }
  },

  getAll: async (request, response) => {
    try {
      const userId =
        request.user.role === "admin" ? request.user.id : request.user.adminId;
      const links = await Links.find({ user: userId }).sort({ createdAt: -1 });
      response.json({ data: links });
    } catch (error) {
      console.log(error);
      response.status(500).json({
        error: "Internal server error",
      });
    }
  },

  getById: async (request, response) => {
    try {
      const linkId = request.params.id;
      if (!linkId) {
        return response.status(401).json({ error: "Link ID is required" });
      }

      const link = await Links.findById(linkId);
      if (!link) {
        return response.status(404).json({ error: "LinkID does not exist" });
      }

      const userId =
        request.user.role === "admin" ? request.user.id : request.user.adminId;
      // Make sure the link indeed belong to the logged in user.
      if (link.user.toString() !== userId) {
        return response.status(403).json({
          error: "Unauthorized access",
        });
      }

      response.json({ data: link });
    } catch (error) {
      console.log(error);
      response.status(500).json({
        error: "Internal server error",
      });
    }
  },

  update: async (request, response) => {
    try {
      const linkId = request.params.id;
      if (!linkId) {
        return response.status(401).json({ error: "Link ID is required" });
      }

      let link = await Links.findById(linkId);
      if (!link) {
        return response.status(404).json({ error: "LinkID does not exist" });
      }

      const userId =
        request.user.role === "admin" ? request.user.id : request.user.adminId;
      // Make sure the link indeed belong to the logged in user.
      if (link.user.toString() !== userId) {
        return response.status(403).json({
          error: "Unauthorized access",
        });
      }

      const { campaign_title, original_url, category } = request.body;
      link = await Links.findByIdAndUpdate(
        linkId,
        {
          campaignTitle: campaign_title,
          originalUrl: original_url,
          category: category,
        },
        { new: true }
      ); // new: true flag makes sure mongodb returns updated data after the update operation

      // Return updated link data
      response.json({ data: link });
    } catch (error) {
      console.log(error);
      response.status(500).json({
        error: "Internal server error",
      });
    }
  },

  delete: async (request, response) => {
    try {
      const linkId = request.params.id;
      if (!linkId) {
        return response.status(401).json({ error: "Link ID is required" });
      }

      let link = await Links.findById(linkId);
      if (!link) {
        return response.status(404).json({ error: "LinkID does not exist" });
      }

      const userId =
        request.user.role === "admin" ? request.user.id : request.user.adminId;
      // Make sure the link indeed belong to the logged in user.
      if (link.user.toString() !== userId) {
        return response.status(403).json({
          error: "Unauthorized access",
        });
      }

      await link.deleteOne();
      response.json({ message: "Link deleted" });
    } catch (error) {
      console.log(error);
      response.status(500).json({
        error: "Internal server error",
      });
    }
  },

  redirect: async (request, response) => {
    try {
      const linkId = request.params.id;
      if (!linkId) {
        return response.status(401).json({ error: "Link ID is required" });
      }

      let link = await Links.findById(linkId);
      if (!link) {
        return response.status(404).json({ error: "LinkID does not exist" });
      }

      link.clickCount += 1;
      await link.save();

      response.redirect(link.originalUrl);
    } catch (error) {
      console.log(error);
      response.status(500).json({
        error: "Internal server error",
      });
    }
  },
};

module.exports = linksController;

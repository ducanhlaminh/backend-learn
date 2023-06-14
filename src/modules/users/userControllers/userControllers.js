const userServices = require("../userServices/userServices");
const userControllers = {
    getUser: async (req, res) => {
        console.log(req.user);
        const response = await userServices.getUserService(req.user?.userId);
        return res.status(200).json(response);
    },
};
module.exports = userControllers;

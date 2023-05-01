const notFound = (req, res) => {
      return res.status(404).json({
            err: 1,
            mes: "This route is not defined",
      });
};
const internalServerError = (res) => {
      return res.status(500).json({
            err: -1,
            mes: "Internal Server Error",
      });
};
module.exports = { notFound, internalServerError };

const notFound = (req, res) => {
        return res.status(404).json({
                err: 1,
                mes: "This route is not defined",
        });
};
const errHandler = (error, req, res, next) => {
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        return res.status(statusCode).json({
                success: false,
                mes: error?.message,
        });
};

module.exports = { notFound, errHandler };

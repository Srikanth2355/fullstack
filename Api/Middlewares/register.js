const register = (req, res, next) => {
    const data = req.body;
    const email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const password_regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])/;
    if(!data.name || !data.email || !data.password) {
        return res.status(400).json({ error: "Please fill all the fields" });
    }
    if(!email_regex.test(data.email)) {
        return res.status(400).json({ error: "Please enter a valid email" });
    }
    if(!password_regex.test(data.password)) {
        return res.status(400).json({ error: "Please enter a valid password" });
    }
    next();
}

module.exports = register
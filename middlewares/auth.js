const jwt = require ('jsonwebtoken');

const auth = async (req,res,next) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) return res.status(401).json({msg:'Unauthorized, acess dined'});
        const verf = jwt.verify(token, 'passwordKey');
		if (!verf) return res.status(401).json({ msg: 'Token Verification Failed, please login again' });
        req.user = verf.id;
        req.token= token;
        next();
    } catch (error) {
		res.status(500).json({ error: e.message });
    }
}

module.exports = auth;
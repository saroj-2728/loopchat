import admin from '../firebaseConfig.js'

export const authenticateFirebaseToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided'
        });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.fireUser = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(403).json({
            success: false,
            message: 'Unauthorized'
        });
    }
};

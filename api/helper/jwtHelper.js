import JWT from "jsonwebtoken";

export const signInAccessToken = (userID) => {
    return new Promise((resolve, reject) => {
        const payload = {};
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const options = {
            expiresIn: "1d",
            issuer: "lineupx.net",
            audience: userID,
        };
        JWT.sign(payload, secret, options, (err, token) => {
            if (err) reject(err);
            resolve(token);
        });
    });
}


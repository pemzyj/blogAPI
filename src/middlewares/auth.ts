import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        username: string;
        role: string;
      };
    }
  }
}

interface JwtPayload {
  id: number;
  email: string;
  username: string;
  role: string;
}



const authJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;


    if (!authHeader) {
        return res.status(401).json({msg: 'Authorization header missing'})
    };

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({msg: 'token is missing'})
    };

    try {
    // Verify token
    const JWTSecretKey = 'AuthorizationSecretKey';
    const decoded = jwt.verify(token, JWTSecretKey) as JwtPayload;


    // Validate decoded token
    if (typeof decoded === 'string') {
      return res.status(403).json({ msg: 'Invalid token format' });
    };

    // Check all required properties exist
    if (!decoded.id || !decoded.email || !decoded.username || !decoded.role) {
      return res.status(403).json({ msg: 'Invalid token payload' });
    };

    // Attach user to request
    req.user = {
        id: decoded.id,
        email: decoded.email,
        username: decoded.username,
        role: decoded.role
    };


    next();
    } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
    };

}

export default authJWT;


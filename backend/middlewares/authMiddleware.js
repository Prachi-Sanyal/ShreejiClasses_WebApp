const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }
   
    req.user = user;
    next();

  } catch (error) {
    console.error(error);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};


const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Getting the token from the Authorization header
  
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret key
    req.user = decoded;  // Add the decoded user info to the request object
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};



const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided, please log in.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); 

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next(); 
  } catch (err) {
    console.error(err);
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ msg: 'No token provided, please log in.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); 

    const user = await User.findById(decoded.userId); 
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    req.user = user;
    next(); 
  } catch (err) {
    console.error(err);
    return res.status(403).json({ msg: 'Invalid or expired token.' });
  }
};



const verifyAdmin = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. You are not an admin.' });
    }

    req.user = decoded; 
    
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token' });
  }
};






const isAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Not Authorized, no token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    console.log('Decoded Token:', decoded);

    const user = await User.findById(decoded.userId); 
    console.log('User Found:', user);

    if (!user || user.role !== 'admin') {
      console.log('User is not admin or does not exist');
      return res.status(403).json({ message: 'Not Authorized, admin access required' });
    }

    req.user = user; 
    next();
  } catch (error) {
    console.log('Token validation error:', error.message);
    res.status(401).json({ message: 'Not Authorized, token failed' });
  }
};

const excludePassword = (req, res, next) => {
  if (req.user.role !== 'admin') {
    req.body.password = undefined;  
  }
  next();
};



const isTeacherOrAdmin = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ msg: 'No token provided, please log in.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    if (user.role !== 'teacher' && user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. You must be a teacher or admin.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};


const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: 'Not authorized, token failed.' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token.' });
  }
};



const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.userId = decodedToken.userId; 
    next();
  });
};


const verifyTeacherToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    req.userId = decodedToken.userId; 
    req.role = decodedToken.role; 
    
    next();
  });
};




const verifyStudentToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; 

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.userId = decodedToken.userId; 
    next();
  });
};






const protectForAttendance = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); 

        req.user = await User.findById(decoded.userId).select("-password"); 
        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Invalid token" });
    }
};



const authMiddlewareForQuiz = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract token

    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("_id name email"); // Fetch full user object

    if (!req.user) {
      return res.status(401).json({ error: "Invalid user, authorization denied." });
    }

    console.log("Authenticated User:", req.user._id); // Debugging

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};


module.exports = {authMiddleware, authenticateToken, verifyToken, authenticate, verifyAdmin, isAdmin,
  excludePassword, isTeacherOrAdmin, protect, verifyAdminToken, verifyStudentToken, verifyTeacherToken, protectForAttendance, authMiddlewareForQuiz};

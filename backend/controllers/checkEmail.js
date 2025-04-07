const User = require('../models/User');  

const checkEmailExists = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });  
    if (user) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (err) {
    console.error("Error checking email:", err);
    return res.status(500).json({ message: "Error checking email." });
  }
};

module.exports = { checkEmailExists };

const bcrypt  = require('bcryptjs');
 bcrypt.hash('admin', 10).then(console.log);
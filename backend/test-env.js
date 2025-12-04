require('dotenv').config();
console.log('=================================');
console.log('Testing .env file loading:');
console.log('=================================');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE);
console.log('=================================');
if (!process.env.JWT_SECRET) {
    console.log('❌ ERROR: JWT_SECRET is not loaded!');
} else {
    console.log('✅ SUCCESS: JWT_SECRET is loaded!');
}

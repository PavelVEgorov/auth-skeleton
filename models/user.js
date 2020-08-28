import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  // Имя пользователя
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    match: /[A-Za-z]\w+/,
  },
  // Мы не храним пароль, а только его хэш
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

export default mongoose.model('User', UserSchema);

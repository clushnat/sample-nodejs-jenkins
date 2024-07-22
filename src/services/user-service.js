const { User } = require('../models');

const createUser = async (name, email) => {
  try {
    const newUser = await User.create({ name, email });
    console.log('User created successfully');
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

const getAllUsers = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

const getUser = async (id) => {
  try {
    const user = await User.findOne({
      where: { id }
    });
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

const updateUser = async (id, name, email) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    const updatedUser = await user.update({name: name, email: email});
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    await user.destroy();
    console.log('User deleted successfully');
    return { message: 'User deleted successfully' };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

module.exports = { createUser, getAllUsers, getUser, updateUser, deleteUser };
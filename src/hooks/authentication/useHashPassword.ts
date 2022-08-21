import bcrypt from 'bcrypt';

const useHashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export async function comparePassword(password: string, hash: string) {
  // updated
  return await bcrypt.compare(password, hash); // updated
}

export default useHashPassword;

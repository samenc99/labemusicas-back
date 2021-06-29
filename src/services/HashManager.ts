import { compareSync, genSaltSync, hashSync } from "bcryptjs";


class HashManager{
  createHash = (plainText: string) => {
    const salt = genSaltSync(Number(process.env.BCRYPT_COST));

    return hashSync(plainText, salt);
  };

  compareHash = (plainText: string, cypherText: string) => {
    return compareSync(plainText, cypherText);
  };
}

export default new HashManager()


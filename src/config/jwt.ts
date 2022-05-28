import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET as jwt.Secret
const jwtExpiryInDays = Number(process.env.JWT_EXPIRY_IN_DAYS)

export const signJwt = (user: any) => {
  if (user && process.env.JWT_SECRET) {
    const token = jwt.sign(user, secret, {
      expiresIn: `${jwtExpiryInDays}d`,
    })
    return token
  } else {
    throw new Error('Please provide user')
  }
}

export const verifyJwtAndReturnUser = ({ jwtToken }: { jwtToken: string }) => {
  try {
    const result = jwt.verify(jwtToken, secret)
    return result
  } catch (e) {
    throw new Error(e)
  }
}

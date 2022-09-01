import { Client, Entity, Schema, Repository } from 'redis-om'

const client = new Client()

async function connect() {
  if (!client.isOpen()) {
    await client.open(process.env.REDIS_URL)
  }
}

class User extends Entity {
  email: string | undefined
  activeSessions: number | undefined
  blockedUsers: string[] | undefined
  createdAt: Date | undefined
  updatedAt: Date | undefined
}
let userSchema = new Schema(
  User,
  {
    email: { type: 'string' },
    activeSessions: { type: 'number' },
    blockedUsers: { type: 'string[]' },
    createdAt: { type: 'date' },
    updatedAt: { type: 'date' },
  },
  {
    dataStructure: 'JSON',
  }
)

export async function addUserSession(email: string) {
  await connect()
  const repo = client.fetchRepository(userSchema)
  const user = await repo
    .search()
    .where('email')
    .eq(email)
    .returnFirst()
    .then((user) => {
      if (user) {
        user.activeSessions = Number(user.activeSessions) + 1
        user.updatedAt = new Date()
        return user
      }
      // create new user if not found with ActiveSessions = 1
      return repo.createEntity({
        email: email,
        activeSessions: 1,
        blockedUsers: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    })

  await repo.save(user)
  return user
}

export async function removeUserSession(email: string) {
  await connect()
  const repo = client.fetchRepository(userSchema)
  const user = await repo
    .search()
    .where('email')
    .eq(email)
    .returnFirst()
    .then((user) => {
      if (user && Number(user.activeSessions) > 0) {
        user.activeSessions = Number(user.activeSessions) - 1
        user.updatedAt = new Date()
      }
      return user
    })

  await repo.save(user)
  return user
}

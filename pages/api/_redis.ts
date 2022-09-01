import { Client, Entity, Schema, Repository } from 'redis-om'

const client = new Client()

async function connect() {
  if (!client.isOpen()) {
    await client.open(process.env.REDIS_URL)
  }
}

class PrivacyPreferences extends Entity {
  email: any
  blockedUsers: any
  createdAt: any
  updatedAt: any
}

class Message extends Entity {
  text: any
  sender: any
  receiver: any
  createdAt: any
  updatedAt: any
}

let privacyPreferencesSchema = new Schema(
  PrivacyPreferences,
  {
    email: { type: 'string' },
    blockedUsers: { type: 'string[]' },
    createdAt: { type: 'date' },
    updatedAt: { type: 'date' },
  },
  {
    dataStructure: 'JSON',
  }
)

let messageSchema = new Schema(
  Message,
  {
    text: { type: 'string' },
    sender: { type: 'string' },
    receiver: { type: 'string' },
    createdAt: { type: 'date' },
    updatedAt: { type: 'date' },
  },
  {
    dataStructure: 'JSON',
  }
)

export async function createIndex() {
  await createPrivacyPreferencesIndex()
  await createMessageIndex()
}

async function createMessageIndex() {
  await connect()
  const repository = client.fetchRepository(messageSchema)
  await repository.createIndex()
}

async function createPrivacyPreferencesIndex() {
  await connect()
  const repository = client.fetchRepository(privacyPreferencesSchema)
  await repository.createIndex()
}

export async function getMessages(email: any) {
  await connect()

  const messageRepository = client.fetchRepository(messageSchema)
  const messages = await messageRepository
    .search()
    .where('sender')
    .eq(email)
    .or('receiver')
    .eq(email)
    .returnAll()
    .catch((err: any) => {
      console.log(err)
    })

  return messages
}

export async function saveMessage(data: any) {
  await connect()
  const messageRepository = client.fetchRepository(messageSchema)
  const message = messageRepository.createEntity(data)
  await messageRepository.save(message)
}

export async function blockUser(email: string, userToBlock: string) {
  await connect()
  const privacyPreferencesRepository = client.fetchRepository(
    privacyPreferencesSchema
  )
  const privacyPreferences = await privacyPreferencesRepository
    .search()
    .where('email')
    .eq(email)
    .returnFirst()
    .then((privacyPreferences: PrivacyPreferences) => {
      if (privacyPreferences) {
        if (!privacyPreferences.blockedUsers.includes(userToBlock)) {
          privacyPreferences.blockedUsers.push(userToBlock)
        }
      } else {
        return privacyPreferencesRepository.createEntity({
          email: email,
          blockedUsers: [userToBlock],
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
      return privacyPreferences
    })
  await privacyPreferencesRepository.save(privacyPreferences)
}

export async function unblockUser(
  privacyPreferences: PrivacyPreferences,
  userToUnblock: string
) {
  await connect()
  const privacyPreferencesRepository = client.fetchRepository(
    privacyPreferencesSchema
  ) as Repository<PrivacyPreferences>
  privacyPreferences.blockedUsers = privacyPreferences.blockedUsers || []
  if (privacyPreferences.blockedUsers.includes(userToUnblock)) {
    const index = privacyPreferences.blockedUsers.indexOf(userToUnblock)
    privacyPreferences.blockedUsers.splice(index, 1)
  }
  await privacyPreferencesRepository.save(privacyPreferences)
}

export async function getBlockedUsers(email: string) {
  await connect()
  const privacyPreferencesRepository = client.fetchRepository(
    privacyPreferencesSchema
  )
  console.log('Privacy Preferences: ' + privacyPreferencesRepository)
  const blockedUsers = await privacyPreferencesRepository
    .search()
    .where('email')
    .eq(email)
    .returnFirst()
    .then((preferences: PrivacyPreferences) => {
      return preferences?.entityData?.blockedUsers || []
    })
    .catch((err: any) => {
      console.log('Oops, something went wrong', err)
    })
  return blockedUsers || []
}

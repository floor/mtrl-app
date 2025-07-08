import { FIRST_NAMES, LAST_NAMES, USER_ROLES } from './list.ts'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const USERS_DATA_FILE = join(__dirname, 'generated-users.json')

/**
 * Generate a single user with deterministic random values based on ID
 * @param id The user ID
 * @returns A user object
 */
function generateUser (id) {
  // Use the ID as seed for deterministic "random" values
  const seed = id

  // Simple seeded random function
  function seededRandom (seed, max) {
    const x = Math.sin(seed) * 10000
    return Math.floor((x - Math.floor(x)) * max)
  }

  // Generate phone number format variations
  function generatePhoneNumber (seed) {
    const areaCode = 200 + seededRandom(seed * 41, 800) // 200-999
    const exchange = 200 + seededRandom(seed * 43, 800) // 200-999
    const number = seededRandom(seed * 47, 10000) // 0-9999

    const formats = [
      `(${areaCode}) ${exchange}-${number.toString().padStart(4, '0')}`,
      `${areaCode}-${exchange}-${number.toString().padStart(4, '0')}`,
      `${areaCode}.${exchange}.${number.toString().padStart(4, '0')}`,
      `+1 ${areaCode} ${exchange} ${number.toString().padStart(4, '0')}`
    ]

    return formats[seededRandom(seed * 53, formats.length)]
  }

  const firstNameIndex = seededRandom(seed * 17, FIRST_NAMES.length)
  const lastNameIndex = seededRandom(seed * 37, LAST_NAMES.length)
  const roleIndex = seededRandom(seed * 71, USER_ROLES.length)

  const firstName = FIRST_NAMES[firstNameIndex]
  const lastName = LAST_NAMES[lastNameIndex]
  const name = `${firstName} ${lastName}`
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${id}@example.com`
  const role = USER_ROLES[roleIndex]
  const avatar = firstName.charAt(0)

  // Add phone number for ~50% of users (deterministic based on ID)
  const hasPhone = seededRandom(seed * 113, 100) < 50
  const phone = hasPhone ? generatePhoneNumber(seed) : null

  const user = {
    id: id.toString(),
    name,
    email,
    role,
    avatar
  }

  // Only add phone if it exists (creates variable height)
  if (phone) {
    user.phone = phone
  }

  return user
}

/**
 * Generate all users and save to file
 * @param totalUsers Number of users to generate
 */
function generateAllUsers (totalUsers = 1000000) {
  console.log(`Generating ${totalUsers} users...`)
  const startTime = Date.now()

  const users = []
  const batchSize = 10000 // Process in batches to avoid memory issues

  for (let i = 0; i < totalUsers; i += batchSize) {
    const batch = []
    const endIndex = Math.min(i + batchSize, totalUsers)

    for (let j = i; j < endIndex; j++) {
      batch.push(generateUser(j + 1)) // IDs start from 1
    }

    users.push(...batch)

    // Log progress every 100k users
    if ((i + batchSize) % 100000 === 0 || endIndex === totalUsers) {
      console.log(`Generated ${Math.min(i + batchSize, totalUsers)} users...`)
    }
  }

  console.log('Saving users to file...')
  writeFileSync(USERS_DATA_FILE, JSON.stringify(users, null, 0))

  const endTime = Date.now()
  console.log(
    `Generated and saved ${totalUsers} users in ${endTime - startTime}ms`
  )

  return users
}

/**
 * Load users from file or generate if file doesn't exist
 * @returns Array of all users
 */
export function loadUsers () {
  if (!existsSync(USERS_DATA_FILE)) {
    console.log('Users data file not found. Generating users...')
    return generateAllUsers()
  }

  try {
    console.log('Loading users from file...')
    const startTime = Date.now()
    const data = readFileSync(USERS_DATA_FILE, 'utf8')
    const users = JSON.parse(data)
    const endTime = Date.now()
    console.log(`Loaded ${users.length} users in ${endTime - startTime}ms`)
    return users
  } catch (error) {
    console.error('Error loading users file:', error)
    console.log('Regenerating users...')
    return generateAllUsers()
  }
}

/**
 * Force regenerate users (for testing or data updates)
 */
export function regenerateUsers () {
  console.log('Force regenerating users...')
  return generateAllUsers()
}

// Load users on module import
export const USERS = loadUsers()

// Export total count
export const TOTAL_USERS = USERS.length

export default {
  USERS,
  TOTAL_USERS,
  loadUsers,
  regenerateUsers
}

const dotenv = require('dotenv')
const readline = require('readline')
const { TwitterApi } = require('twitter-api-v2')
dotenv.config()

// helpers
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve))

;(async () => {
  const { TWITTER_API_KEY, TWITTER_SECRET_KEY } = process.env

  if (!TWITTER_API_KEY || !TWITTER_SECRET_KEY) return

  const temporaryClient = new TwitterApi({ appKey: TWITTER_API_KEY, appSecret: TWITTER_SECRET_KEY })
  try {
    const authLink = await temporaryClient.generateAuthLink('oob')

    // go to authLink.url and get the pin code
    console.log('AUTH LINK', authLink)
    
    // enter the pin code
    const pin = await prompt('enter pin: ')

    const client = new TwitterApi({
      appKey: TWITTER_API_KEY,
      appSecret: TWITTER_SECRET_KEY,
      accessToken: authLink.oauth_token,
      accessSecret: authLink.oauth_token_secret,
    })
    const { client: loggedClient, accessToken, accessSecret } = await client.login(pin)
    console.log({ loggedClient, accessToken, accessSecret })
    const postTweet = await loggedClient.v2.tweet('Hello elon musk')
    console.log({ postTweet })
  } catch (err) {
    console.log('some err', err)
  }
})()

grabs
=====

Node.js Gyazo grab server including Twitter card integration (optional).

## Installation
### On your server:

#### Step 1 - Clone the repo

```bash
git clone git@github.com:ralphholzmann/grabs.git
cd grabs
npm install
```

#### Step 2 - Edit `config.json` to your liking
```json
{
  "domain": "example.com", // Domain of your server
  "twitter_username": "jack" // Your Twitter username without the '@'
}
```

#### Step 3 - Start the server
```bash
NODE_ENV=production PORT=80 node app.js
```

### On your Mac:

#### Step 1 - Install [Gyazo](https://gyazo.com/)

#### Step 2 - Copy the [sample Gyazo script](https://raw.githubusercontent.com/ralphholzmann/grabs/master/script) to `/Applications/Gyazo.app/Contents/Resources/script`

#### Step 3 - Open `/Applications/Gyazo.app/Contents/Resources/script` and modify line 3 to match your domain:
```ruby
HOST = "example.com"
```

That's it. Now whenever you launch `Gyazo.app`, the screen grabs will be saved to your server.

### Optional Twitter cards integration
Hop over to the [Twitter cards validator](https://dev.twitter.com/docs/cards/validation/validator) in a Webkit browser (you must be logged in to your Twitter account). Click the "Photo" card from the card catalog, then flip over to the "Validate & Apply" tab. Paste in a sample grab URL and validate it. Then apply and wait for confirmation.

## Licence
MIT

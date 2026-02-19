# MOTD Generator
A simple MOTD generator. It's intended for use on you [GitHub profile README](https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme), but can be used on any Markdown supported system, I assume.

![Daily MOTD](https://motd-generator.christiandale.workers.dev/)

## How to use it for you own GitHub profile README
It's as easy as adding the following Markdown to your README:

`![Daily MOTD](https://motd-generator.christiandale.workers.dev/)`

## Configuration

### Text only
You can get text only instead of an SVG by appending `?is_text` to the end of the url.

**Example:**

`https://motd-generator.christiandale.workers.dev/?is_text`

## Technical details
The MOTD generator is intended to run on Cloudflare Workers.
Locally, a tool called [Wrangler](https://developers.cloudflare.com/workers/wrangler) is used which can easily be installed in this repo by running `npm install`. After that you can start the development server with `npx wrangler dev`.

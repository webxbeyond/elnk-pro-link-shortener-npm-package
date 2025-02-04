# elnk

`elnk` is a simple, dependency-free TypeScript package for interacting with the [elnk.pro](https://elnk.pro/) API to check for existing shortlinks and create new ones if they do not exist.

## Installation

```sh
npm install elnk-pro-shortlink
```

## Usage

```typescript
import { createLinkIfNotExist } from "elnk";

const apiKey = "your_api_key";
const longUrl = "https://example.com";
const shortUrl = "custom-alias"; // Optional
const domainId = 123; // Optional

async function generateShortlink() {
  const response = await createLinkIfNotExist({ longUrl, shortUrl, apiKey, domainId });
  console.log(response);
}

generateShortlink();
```

## API

### `createLinkIfNotExist(options: ElnkOptions): Promise<ElnkResponse>`

#### Parameters:

- `longUrl` (**string**, required): The original URL to be shortened.
- `shortUrl` (**string**, optional): A custom alias for the shortlink.
- `apiKey` (**string**, required): Your API key for authentication.
- `domainId` (**number**, optional): The domain ID to use for shortening.

#### Response:

Returns a `Promise<ElnkResponse>` with the following structure:

```typescript
interface ElnkResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}
```

## How It Works

1. Checks if a shortlink already exists for the provided `longUrl`.
2. If it exists, returns the existing shortlink details.
3. If it doesn't exist, creates a new shortlink.
4. Fetches the full details of the created shortlink and returns them.

## Error Handling

If any step fails (e.g., invalid API key, network issues, etc.), the function returns an error object with `success: false` and an `error` message.

## License

This package is licensed under the MIT License.

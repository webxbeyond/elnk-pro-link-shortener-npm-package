# SMS Kit - A Simple Bulk SMS Sender

A simple and easy-to-use SMS sender package for Bangladesh. The package allows you to send SMS messages using an API and can automatically grab API credentials from environment variables.

## Installation

```sh
npm install @anisafifi/sms-kit
```

## Importing the Module

```ts
import { sendSms } from "@anisafifi/sms-kit";
```

## Usage

You can use the package to send SMS messages by calling the `sendSms` function. This function accepts the following parameters:

### **`sendSms` function**

```typescript
sendSms({
  recipientNumbers: string[],  // Array of recipient phone numbers (in international format, e.g., '+8801712345678')
  message: string,             // The message to be sent
  apiKey?: string,             // Your API key (optional, will use environment variable if not provided)
  apiUrl?: string,             // The API URL (optional, will use environment variable if not provided)
  senderId?: string            // The sender ID (optional, will use environment variable if not provided)
});
```

### Example:

```typescript
import { sendSms } from "@anisafifi/sms-kit";

// Send an SMS message
sendSms({
  recipientNumbers: ['+8801712345678'],
  message: 'Hello from SMS Kit!'
}).then(response => {
  console.log('SMS Response:', response);
}).catch(error => {
  console.error('Error:', error);
});
```

## Environment Variables

The following environment variables are supported and will be automatically used if not passed explicitly to the `sendSms` function:

- `SMS_API_KEY`: The API key for your SMS provider.
- `SMS_API_URL`: The API URL for the SMS provider's endpoint.
- `SMS_API_SENDER_ID`: The sender ID you wish to use for sending the SMS.

You can define these variables in your `.env` file or directly in your environment.

### Example `.env` file:

```env
SMS_API_KEY=your_api_key
SMS_API_URL=https://api.smsprovider.com
SMS_API_SENDER_ID=YourSenderID
```

Make sure to install `dotenv` to load the environment variables if you're using a `.env` file:

```bash
npm install dotenv
```

or you can use any other package that will handle `.env` file.

Then, in your code:

```typescript
import dotenv from 'dotenv';
dotenv.config();

// Now you can use sendSms as usual
sendSms({
  recipientNumbers: ['8801*********'],
  message: 'Hello from SMS Kit!'
}).then(response => {
  console.log('SMS Response:', response);
}).catch(error => {
  console.error('Error:', error);
});
```

## Error Handling

The `sendSms` function will return an object with the following structure:

```typescript
{
  success: boolean;
  data?: any;
  error?: string;
}
```

- `success`: `true` if the SMS was successfully sent, `false` otherwise.
- `data`: The response data from the SMS provider if the request was successful.
- `error`: A string describing the error message if the request failed.

### Example of error response:
```typescript
{
  success: false,
  error: "Failed to send SMS. Status: 500"
}
```

## Configuration Options

You can provide the following configuration options when calling `sendSms`:

- `recipientNumbers`: A list of phone numbers (strings) to send the SMS to. The numbers should be in international format (e.g., `+8801712345678`).
- `message`: The content of the message you want to send.
- `apiKey`: (Optional) The API key for the SMS provider. If not provided, it will be fetched from the environment variable `SMS_API_KEY`.
- `apiUrl`: (Optional) The API URL for the SMS provider. If not provided, it will be fetched from the environment variable `SMS_API_URL`.
- `senderId`: (Optional) The sender ID to be used for sending the SMS. If not provided, it will be fetched from the environment variable `SMS_API_SENDER_ID`.

## License

This package is open-source and available under the MIT License.
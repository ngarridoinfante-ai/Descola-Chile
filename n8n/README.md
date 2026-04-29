# n8n - Exchange Rate Publisher

Objective: update `exchange-rate.json` on a schedule so the website can read a local, pre-published BRL to CLP rate.

## Recommended Workflow

1. `Schedule Trigger` (every 60 minutes).
2. `HTTP Request` to a rates provider.
3. `Code` node to normalize payload.
4. `GitHub` node to update `exchange-rate.json` in this repository.
5. Optional `IF` + `Slack/Email` for error alerts.

## Example Provider

- URL: `https://api.exchangerate.host/latest?base=BRL&symbols=CLP`
- Method: `GET`
- Expected field: `rates.CLP`

## Code Node (normalize)

Use this in a `Code` node after HTTP Request:

```javascript
const response = $json;
const clp = response?.rates?.CLP;

if (typeof clp !== "number") {
  throw new Error("CLP rate missing in provider response");
}

return [
  {
    json: {
      path: "exchange-rate.json",
      content: JSON.stringify(
        {
          source: "n8n + exchangerate.host",
          base: "BRL",
          target: "CLP",
          rate: Number(clp),
          updatedAt: new Date().toISOString(),
        },
        null,
        2,
      ),
      commitMessage: `chore: update BRL-CLP rate ${new Date().toISOString()}`,
    },
  },
];
```

## GitHub Node (update file)

- Resource: `File`
- Operation: `Create or Update`
- Repository: your repo
- File Path: `{{$json.path}}`
- File Content: `{{$json.content}}`
- Commit Message: `{{$json.commitMessage}}`
- Branch: `main` (or your deployment branch)

## Website Behavior

- Frontend now tries local `exchange-rate.json` first.
- If local file is unavailable, it falls back to live API.

This keeps the homepage stable, faster, and less dependent on third-party runtime availability.

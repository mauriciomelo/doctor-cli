# doctor-cli

Create a doctor command to help diagnose configuration issues of your projects.

## Usage

`title`: Title of the individual check.

`check`: Shell command that will evaluate to either success or error based on the exit code (exit 1 = error, exit 0 = success).

##### Sample

Create a JSON file named `doctor.json` with the following content:

```
{
  "checks": [
    {
      "title": "Docker is running",
      "check": "docker ps"
    },
    {
      "title": "Is online",
      "check": "ping google.com -c 1"
    },
    {
      "title": "This will fail",
      "check": "exit 1"
    }
  ]
}
```

Run `doctor`, the output should be similar to:

```
$ doctor

👩‍⚕️ Checking your system for configuration problems...

   ❌  This will fail

   ✅  Is online

   ✅  Docker is running

   🤒
```

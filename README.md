# doctor-cli

[![CircleCI](https://circleci.com/gh/mauriciomelo/doctor-cli/tree/master.svg?style=svg)](https://circleci.com/gh/mauriciomelo/doctor-cli/tree/master)

Create a doctor command to help diagnose configuration issues of your projects.

## Install

```
npm i doctor-cli -g
```

## Usage

`title`: Title of the individual check.

`check`: Shell command that will evaluate to either success or error based on the exit code (exit 1 = error, exit 0 = success).

`fix`: Show a fix hint when check fails

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
      "title": "This will pass",
      "check": "exit 0"
    },
    {
      "title": "This will fail",
      "check": "exit 1"
    },
    {
      "title": "File.txt exists",
      "check": "test -f File.txt",
      "fix": "touch File.txt"
    }
  ]
}
```

Run `doctor`, the output should be similar to:

```
$ doctor
👩‍⚕️ Checking your system for configuration problems...


  ❌  File.txt exists
        Fix:
        touch File.txt

  ❌  This will fail

  ✅  This will pass

  ✅  Docker is running

  ✅  Is online

  🤒
```

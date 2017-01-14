herodotus
===

```js
npm install herodotus
```

`herodotus` logger is wrapper over bunyan to allow for easy log management inside of projects that consist of several in house libraries. This library makes sure that logs both end up in the right place and are delivered with necessary meta information.

Behavior
---

The goal of `herodotus` is to make logging with a large number of libraries that are being used in many different situations easy. Lets consider a project with the following dependency structure:

```
foo@0.0.1
└─┬ bar@1.2.0
  └── baz@1.5.1
```

With `herodotus` this project will log out to a file called `foo.log` and will name space `foo`, `bar`, and `baz` as `foo@0.0.1`, `bar@1.2.0`, and `baz@1.5.1`. There will also be a `foo-error.log` file for error level messages. The log file will have all levels of messages (eg trace and higher) and anything info and higher will be logged to stdout.

Lets dig a little deeper, lets say that we now require `foo` in a project called `main`.

```
main@1.0.0
└─┬ foo@0.0.1
  ├ bar@1.5.0
  └── ...
```

Now `herodotus` will log to `main.log` with the same name spacing structure as before. Additionally, the log file will differentiate between `bar@1.5.0` and `bar1.2.0` making it easy to see errant behavior between different versions of libraries.

By using `herodotus` it is easy to manage log files as your libraries and services grow in complexity.

### Caution

`herodotus` will only log to a file if there is a main module for the process. If there is no main module (eg a package is included from the node REPL) then `herodotus` will only log to stdout.

Usage
---

`herodotus` is easy to set up:

```js
// preferred way:
var log = require('herodotus')(require('./package.json'));
// or
log = require('herodotus')(name, version);
```

The `log` variable is just an instance of the bunyan logger, so feel free to use it as you would any bunyan instance.

```js
log.error();
log.warn();
log.info();
log.debug();
log.trace();
```

and now your logs are ready to go!

Configuration
---

`herodotus` will look for `process.env.NODE_LOG_LOCATION` as a directory to write log files to. If this is not found then `herodotus` will default to `./`.

License
---

MIT
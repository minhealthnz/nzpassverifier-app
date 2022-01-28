# Error handling

To handle errors we use the [Neverthrow](https://github.com/supermacro/neverthrow) library. This library allows us to create interfaces that return errors as the return value. For example a function can return either a happy value or an error. And because we're using typescript, if the response is an error, we know the type and structure of the error and it forces us to deal with it. It also means we can't pretend everything was fine and continue executing as type system forces us to deal with the error case.

Exceptions still exist and can be thrown, these represent things that are unexpected and unrecoverable. Because they are unexpected errors, we don't deal with them in our functions, rather they eventually get caught and dealt with by the broader scope of the application.

We should wrap third party libraries in try/catch and map exceptions to a never throw error. See [here](https://github.com/supermacro/neverthrow/wiki/Error-Handling-Best-Practices#wrap-3rd-party-code-to-localize-exceptions)

## Never throw code style
For this project we're using a sync approach to dealing with never throw results as it's easier to grasp for newcomers to never throw.

A result value from one function call is not chained into another function. Rather the result is dealt with immediately. If it's a good value, we extract the value and pass it to the next function. If it's an error, we handle it.

```typescript
const getGreeting = (name: string): Result => {
  const appendName = (name: string): Result<string, string> => {
      if (name.length > 10) {
          return err("string too long adding name");
      }
      return ok(`Hello ${name}`)
  };

  const appendExclamation = (helloString: string): Result<string, string> => {
      if (helloString.length > 10) {
          return err("string too long when adding exclamation");
      }
      return ok(`${helloString} !`)
  };

  const appendNameResult = appendName(name);

  if (appendNameResult.isErr()) {
      return err({message: appendNameResult.error});
  }

  const appendExclamationResult = appendExclamation(appendNameResult.value);

  if (appendExclamationResult.isErr()) {
      return err({message: appendExclamationResult.error});
  }

  return ok(appendExclamationResult.value);
}
```

We also catch all exceptions and map them to results in the service layer, so that any layer consuming the service layer doesn't need to deal with exceptions.

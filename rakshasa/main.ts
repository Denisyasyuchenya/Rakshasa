import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { checkUsernameAvailability, generateRandomWord } from './domain';

export function goGet(): TE.TaskEither<Error, string> {
  return pipe(
    generateRandomWord(),
    TE.chain((randomWord: string) => {
      const randomNumber = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
      const username = `${randomWord}${randomNumber}`;
      return checkUsernameAvailability(username);
    }),
    TE.chain((result: boolean) => {
      if (result) {
        return TE.right("Username is available");
      } else {
        return TE.left(new Error("Username is not available"));
      }
    })
  );
}

// Использование
goGet()()
  .then((result: E.Either<Error, string>) => {
    if (result._tag === "Right") {
      console.log(result.right); // Username is available
    } else {
      console.error(`An error occurred: ${result.left.message}`);
    }
  })
  .catch((error: any) => console.error(error));

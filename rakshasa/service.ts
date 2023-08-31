import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { checkUsernameAvailability, generateRandomWord } from './domain';
import * as fs from 'fs/promises';

export function checkUniqueUsername(): TE.TaskEither<Error, string> {
  return pipe(
    generateRandomWord(),
    TE.chain((randomWord: string) => {
      const randomNumber = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
      const username = `${randomWord}${randomNumber}`;
      return TE.right(username);
    }),
    TE.chain((username: string) => 
      pipe(
        checkUsernameAvailability(username),
        TE.chain((result: boolean) => 
          result
            ? TE.tryCatch(
                async () => {
                  await fs.appendFile('rakshasa/files/names.txt', `${username}\n`);
                  return `${username} is available`;
                },
                (error: any) => new Error(String(error))
              )
            : TE.left(new Error(`${username} is not available`))
        )
      )
    )
  );
}

checkUniqueUsername()()
  .then((result: E.Either<Error, string>) => {
    if (result._tag === "Right") {
      console.log(result.right); // Username is available
    } else {
      console.error(`An error occurred: ${result.left.message}`);
    }
  })
  .catch((error: any) => console.error(error));

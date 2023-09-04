import axios from "axios";
import * as TE from "fp-ts/TaskEither";
import cheerio from 'cheerio';

export function checkUsernameAvailability (username: string): TE.TaskEither<Error, boolean> {
    const API_MATRIX = `https://matrix.org/_matrix/client/r0/register/available?username=${username}`;
    return TE.tryCatch(
        async () => {
            const response = await axios.get(API_MATRIX);
            return response.data.available;
        },
        (error) => new Error(String(error))
    );
};

export function generateRandomWord(): TE.TaskEither<Error, string> {
    const API_DATAMUSE = 'https://api.datamuse.com/words?ml=programming&max=10';
  
    return TE.tryCatch(
      async () => {
        const response = await axios.get(API_DATAMUSE);
        const words = response.data.map((wordObj: any) => wordObj.word);
        const randomIndex = Math.floor(Math.random() * words.length);
        return words[randomIndex];
      },
      (error) => new Error(String(error))
    );
  }

  export function generatePassword() {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+=-";
    let password = "";
    for (let i = 0; i < 13; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }
  
  async function getGuerrillaMailEmail(): Promise<string | null> {
    try {
      const response = await axios.get('https://www.guerrillamail.com/');
      const $ = cheerio.load(response.data);
    
      const emailElement = $('#email-widget');
    
      if (emailElement.length > 0) {
        const email = emailElement.text();
        return email.trim();
      } else {
        return null;
      }
    } catch (error) {
      console.error('An error occurred:', error);
      return null;
    }
  }
  
  (async () => {
    const email = await getGuerrillaMailEmail();
    if (email) {
      console.log('Guerrilla Mail Email:', email);
    } else {
      console.log('Failed to retrieve Guerrilla Mail email.');
    }
  })();

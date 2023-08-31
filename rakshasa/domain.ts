import axios from "axios";
import * as TE from "fp-ts/TaskEither";
import { TaskEither, tryCatch } from 'fp-ts/lib/TaskEither';
import puppeteer, { Page } from 'puppeteer';

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

  export function getTempEmail(): TaskEither<Error, string> {
    return tryCatch(
      async () => {
        const browser = await puppeteer.launch({
          headless: false,
        });
  
        const page: Page = await browser.newPage();
  
        await page.setUserAgent("Your User Agent String");
        await page.setViewport({ width: 1280, height: 800 });
  
        await page.goto('https://temp-mail.org/', {
          waitUntil: 'networkidle0',
          timeout: 60000,
        });
  
        await page.waitForSelector('.temp-emailbox h2');
  
        const email: string | null = await page.evaluate(() => {
          const el = document.querySelector('.temp-emailbox h2 + .input-box-col input');
          return el ? el.getAttribute('value') : null;
        });
  
        await browser.close();
  
        if (email) {
          return email;
        } else {
          throw new Error('Email not found');
        }
      },
      (error: any) => new Error(String(error))
    );
  }
  
  // Usage
  getTempEmail()()
    .then(result => {
      if (result._tag === 'Right') {
        console.log(`Temporary email: ${result.right}`);
      } else {
        console.error(`An error occurred: ${result.left.message}`);
      }
    })
    .catch(error => console.error(error));
  
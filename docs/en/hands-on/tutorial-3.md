# Three: NanoBanana Hands-on

This issue will introduce how to add Gemini Web's Cookie to make `CLIProxyAPI` support the `NanoBanana` model.

Gemini's `NanoBanana` model is highly praised for its excellent image processing capabilities. However, Google does not provide a free API for this model. Now, with `CLIProxyAPI`, we can use `NanoBanana` in the form of a free API by integrating Gemini Web.

We have two ways to obtain authentication information:

### The first method

First, log in to the Gemini official website (https://gemini.google.com/app) with your Google account. It is understood that ordinary accounts have 100 image generation quotas per day, while Pro accounts have 1000. After successful login, press F12 in the browser to open the developer tools and switch to the "Network" tab.

![](https://img.072899.xyz/2025/09/074fcf1c455e99185ceeada71a27bd8c.png)

Enter `List` in the filter box, and then hover the mouse over your user avatar. After a while, the `ListAccounts` entry should appear in the list below. If it does not appear, please refresh the page and try again.

![](https://img.072899.xyz/2025/09/7cb7104fa93a6b6a6903e0745d3b5573.png)

Click `ListAccounts`, find `Cookie` in "Headers" -> "Request Headers", and copy its value completely.

![](https://img.072899.xyz/2025/09/c2ba085f10fcb145aff7e9d5081b9382.png)

Go back to the directory where the `CLIProxyAPI` program is located, open the terminal or command line, and enter the command `cli-proxy-api --gemini-web-auth`. According to the prompt, paste the `Cookie` value we just copied and press Enter, you will see a message of successful verification, and the `Cookie` has been automatically saved.

![](https://img.072899.xyz/2025/09/e149d07875cb8dab12de95f82d2b3e45.png)

### The second method

If you are using a macOS system, or if the first method of authentication fails, you may need to manually enter the values of `__Secure-1PSID` and `__Secure-1PSIDTS`. Please switch to the "Application" tab and copy these two values as shown in the figure.

![](https://img.072899.xyz/2025/09/e5b5debae5ec74a31a1b527e506895e7.png)

![](https://img.072899.xyz/2025/09/7767f178e1186358f1a9a498108e5ac0.png)

When performing verification on the command line, manually fill in these two values according to the prompts to complete the verification.

![](https://img.072899.xyz/2025/09/b02fb7704d5c67385d781f9d9893e0b2.png)

### Verification steps

Next, we will perform verification. It should be noted that the program currently only supports text-to-image or image-to-text operations through OpenAI compatible interfaces and Gemini native interfaces. Therefore, the provider type `OpenAI Response` we previously set in `Cherry Studio` needs to be changed to `OpenAI`.

![](https://img.072899.xyz/2025/09/48892cc3ce1e3c4379b694afa45c5d35.png)

Add the model `NanoBanana` (ie `gemini-2.5-flash-image-preview`).

![](https://img.072899.xyz/2025/09/4674845c6412ec6f5366d109070047fc.png)

Now, let's test it in `Cherry Studio`!

![](https://img.072899.xyz/2025/09/fdd35aa92224cd76cbf888ce3ff2cce2.png)

Perfectly meets our requirements, enjoy the "banana"!

### Precautions

- ~~At this stage, please avoid adding multiple Gemini Web accounts in `CLIProxyAPI`. Because when there are multiple accounts, the program will poll calls, which may break the continuity of the conversation and cause the request to fail.~~ After the 6.0.17 version update, the program supports Gemini Web sticky sessions, and multiple accounts can be added.
- In `Cherry Studio`, **do not** add the `NanoBanana` model under the `OpenAI Response` provider type. It is known that `Cherry Studio` has a bug in this case, which will cause the program to crash.

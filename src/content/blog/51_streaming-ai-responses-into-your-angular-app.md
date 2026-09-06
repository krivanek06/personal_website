---
title: 'Streaming AI Responses Into Your Angular App'
seoTitle: 'Streaming AI Responses Into Your Angular App'
seoDescription: 'A practical walkthrough of streaming an LLM response into the browser: reading Server-Sent Events and fetch streams, rendering tokens as they arrive, canceling cleanly, and typing the partial response.'
slug: 51_streaming-ai-responses-into-your-angular-app
tags: angular, ai, streaming, typescript
order: 51
datePublished: 05.09.2026
readTime: 13
coverImage: article-cover/51_img_1.webp
---

You know the difference between a chat box that feels alive and one that feels broken. In the broken one you type, you send, and you stare at a spinner for five seconds before the whole answer appears at once. In the alive one the first word shows up almost instantly, then the rest fills in behind it word by word. Both take the same total time. The model is generating tokens one by one either way. The only difference is whether you show them as they come or hold them back.

That is the whole reason to stream. It is not faster overall. It is faster to the first useful thing on screen, and that first impression is what decides whether a user waits or walks away. A model might need eight seconds to write a full paragraph, but its first token often lands in under half a second. Streaming turns that eight second wait into a half second wait followed by a show.

In this post we build the streaming part by hand, in Angular. No SDK that hides it. We read the raw stream, render each token as it arrives, handle the thinking tokens that modern models send before the answer, cancel cleanly when the user leaves, and type the response so the whole thing is safe to work with. By the end you have a small chat component you can drop into any app that talks to an OpenAI-compatible endpoint.

## Two ways to read a stream

Before the code, you have to pick how the bytes reach you. There are two realistic options in the browser, and only one of them survives contact with a real model API.

The first is `EventSource`, the built in object for Server-Sent Events. It is genuinely pleasant to use. You point it at a URL, it keeps the connection open, and it fires your listener every time a new message arrives. It even reconnects for you when the connection drops. For a simple public feed it is hard to beat.

The problem is everything it cannot do. `EventSource` only sends GET requests. You cannot set an Authorization header, and you cannot send a JSON body. Most LLM endpoints need both. They expect a POST with your prompt in the body and your key in the header. So `EventSource` rules itself out for almost every real model API the moment you try to use it in production.

To be fair, there are still places where `EventSource` is the right call. If you control the server and can bake the prompt into the URL, or if the endpoint is a public feed with no auth, it saves you a few lines. But as soon as a secret or a request body is involved, you are out of luck.

The second option is a plain `fetch` with `stream: true` in the request body. You get a `ReadableStream` back from `response.body`, you pull chunks off it yourself, and you decode them. It is a little more code, but it works with POST, with headers, and with any body shape you want. That is the one we build.

The tradeoff in one line: `EventSource` is less code, `fetch` is more control. For LLMs you need the control, so `fetch` wins.

![Flat vector diagram comparing two ways to stream in the browser: EventSource on the left with a single GET arrow, and fetch ReadableStream on the right with a POST arrow carrying a JSON body and Authorization header, dark theme, neon green accents](./article-images/51_img_2.webp)

## Reading the stream

Here is the full reader. It sends the request and turns the response into a stream of text deltas.

```typescript
async function* streamChatCompletion(prompt: string, signal?: AbortSignal) {
  const response = await fetch('https://api.example.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer YOUR_KEY',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    }),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;

      const data = trimmed.slice(5).trim();
      if (data === '[DONE]') return;

      const chunk = JSON.parse(data);
      const delta = chunk.choices?.[0]?.delta?.content ?? '';
      if (delta) yield delta;
    }
  }
}
```

Before we unpack it, here is what the server is actually sending over the wire. The stream is Server-Sent Events sent over a POST. Each message is a line that starts with `data:`, followed by a JSON object, and the whole thing ends with a line that says `[DONE]`.

```text
data: {"choices":[{"delta":{"role":"assistant","content":""},"finish_reason":null}]}

data: {"choices":[{"delta":{"content":"A"},"finish_reason":null}]}

data: {"choices":[{"delta":{"content":" signal"},"finish_reason":null}]}

data: {"choices":[{"delta":{"content":" is"},"finish_reason":null}]}

data: [DONE]
```

A few things are happening here, and two of them bite people all the time.

First, the shape. Each parsed object has a `choices` array, and the text lives at `choices[0].delta.content`. That is the only field we read. There is also `finish_reason`, which is `null` while the stream is running and gets set to something like `stop` on the last chunk. We do not need it here, but it is useful if you want to know why the model stopped.

The buffer matters because chunks do not line up with lines. A single `read()` can return half a line, or three full lines, or the tail of one line and the head of the next. We append every chunk to `buffer`, split on newlines, and keep the last partial piece for the next round. That way we only ever try to parse complete lines.

The `{ stream: true }` flag on `decode` is not decoration either. Without it, a multibyte character that gets split across two chunks would turn into garbage characters. With it, the decoder remembers the unfinished byte and finishes it on the next chunk.

## Where the API key lives

You probably looked at the `Authorization: 'Bearer YOUR_KEY'` line and thought, wait, I should not put that in the browser. You are right, and it is worth saying out loud before you build the rest.

Anything you ship in the frontend is readable by anyone who opens devtools. Your key would be one keystroke away from anyone who visits the page. On top of that, most model APIs will reject a browser request anyway because of CORS, which is often the first confusing error people hit when they try this and see a red line in the console.

The fix is a thin proxy. You run a small endpoint on your own server that holds the key, forwards the prompt to the model, and streams the response straight back. The browser talks to your server, never to the model provider directly.

The proxy can be tiny. It takes the prompt, calls the same `stream: true` endpoint server side, and pipes the bytes through unchanged. Your Angular code barely changes. The only difference is that the fetch URL now points at your own server instead of the provider, and the Authorization header can go away entirely because your server adds it.

This is also where you add rate limits, logging, or usage tracking later, in one place, without touching the client. In a real app this is the shape you want: the browser streams from your backend, your backend streams from the model, and no secret ever touches the client.

## Handling the thinking before the answer

There is one more thing hiding in that delta shape, and it is the reason your first naive stream can look broken.

Modern reasoning models do not jump straight to the answer. They think first, and they stream that thinking as it happens. DeepSeek sends it as `delta.reasoning_content`, and OpenAI's reasoning models send it as `delta.reasoning`. It arrives before the real `content`, often as a long, rambling inner monologue.

Our reader ignores it on purpose, because it only reads `delta.content` and skips empty strings. That is the right default for most chat UIs. You usually do not want to dump the model's scratch pad onto the user.

If you do want to show the thinking, say in a collapsed section like the big chat apps, you branch on the two fields instead:

```typescript
const choice = chunk.choices?.[0];
const delta = choice?.delta ?? {};

if (delta.reasoning_content ?? delta.reasoning) {
  yield { kind: 'reasoning', text: delta.reasoning_content ?? delta.reasoning };
}
if (delta.content) {
  yield { kind: 'delta', text: delta.content };
}
```

The key point is not the exact field name. It is that the stream has more than one kind of text, and you get to decide which parts reach the user. Check the provider's docs for which field their model uses, then filter or surface it accordingly.

## Rendering tokens in Angular

Now we have a stream of deltas. The goal is to put them on screen as fast as they arrive.

The cleanest way in modern Angular is a signal. We keep the whole answer in one signal, append each delta, and let the template read it.

```typescript
import { Component, signal } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-chat',
  template: `
    @for (m of messages(); track $index) {
      <p>{{ m }}</p>
    }
    <button (click)="send()">Ask something</button>
  `,
})
export class ChatComponent {
  readonly messages = signal<string[]>([]);

  async send() {
    const prompt = 'Summarize what makes a good Angular component.';
    this.messages.update(list => [...list, '']);

    let text = '';
    for await (const delta of streamChatCompletion(prompt)) {
      text += delta;
      const index = this.messages().length - 1;
      this.messages.update(list => {
        const copy = [...list];
        copy[index] = text;
        return copy;
      });
    }
  }
}
```

We add an empty message first, then keep rewriting the last slot as text arrives. A signal write is cheap, and Angular re-renders the paragraph. The user sees words appear one by one.

If you come from the RxJS side of Angular, the same thing is an observable with `scan`. Each delta is a value, and `scan` folds them into an ever growing string.

```typescript
import { from, scan } from 'rxjs';

const text$ = from(streamChatCompletion(prompt)).pipe(
  scan((all, delta) => all + delta, '')
);
```

Both work, so pick by feel. I reach for the signal version here because the state is one string and the signal API is shorter. I reach for the observable version when the stream has to compose with other streams. An async generator is great for a single `for await` loop, but the moment you want to merge the assistant's answer into the same feed as the user's own messages, or throttle the updates, an observable is a more natural fit. The nice part is that RxJS can consume an async generator directly with `from`, so you are never locked in.

## Typing the partial response

A plain string is fine for a chat bubble. The moment you want to do anything with the answer, you want types.

The key rule is simple: type what you can trust, and validate the rest at the end. Mid-stream you cannot parse half a JSON object. The text is incomplete by definition. So we type the stream events, and we validate the finished message when it is done.

First the events. A stream can tell you three things: a new piece of text, a finished message, or an error.

```typescript
type StreamEvent =
  | { kind: 'delta'; text: string }
  | { kind: 'done'; message: AssistantMessage }
  | { kind: 'error'; error: unknown };
```

Then the finished message. Instead of hand writing an interface and hoping the server follows it, we validate with Zod. It runs at the boundary and gives us a value we can actually trust.

```typescript
import { z } from 'zod';

const AssistantMessageSchema = z.object({
  role: z.literal('assistant'),
  content: z.string(),
  id: z.string().optional(),
});

type AssistantMessage = z.infer<typeof AssistantMessageSchema>;
```

If you ask the model for structured data, say JSON for a form or a list of tags, the same idea holds, and it is worth spelling out because it is a common trap. People try to parse the JSON as it streams, token by token, and it never works. Half a JSON object is not valid JSON. The right pattern is two steps: stream the raw text into a buffer, then run the schema on the complete buffer at the end. If it fails you get a clear error at the boundary, not a runtime surprise deep inside your component.

The same boundary idea applies to function calling. The model streams tokens that describe a function call, and you only have a real argument object once the stream is done. Accumulate, then validate.

## Canceling cleanly

Users do not wait. They hit back, they navigate away, they close the tab. When that happens you want the request to stop, not keep running in the background and trying to update a component that is gone.

`fetch` gives you `AbortController` for exactly this. You create a controller, pass its `signal` into the fetch, and call `abort()` when you are done. In Angular the natural place to call it is `DestroyRef.onDestroy`.

```typescript
import { Component, DestroyRef, inject, signal } from '@angular/core';

@Component({ standalone: true, selector: 'app-chat', template: `...` })
export class ChatComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly controller = new AbortController();
  readonly messages = signal<string[]>([]);

  constructor() {
    this.destroyRef.onDestroy(() => this.controller.abort());
  }

  async send() {
    const prompt = 'Summarize signals in one sentence.';
    this.messages.update(list => [...list, '']);
    let text = '';

    try {
      for await (const delta of streamChatCompletion(prompt, this.controller.signal)) {
        text += delta;
        const index = this.messages().length - 1;
        this.messages.update(list => {
          const copy = [...list];
          copy[index] = text;
          return copy;
        });
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
      throw error;
    }
  }
}
```

The catch block is the detail most people skip. When you abort, `fetch` rejects with an `AbortError`. That is not a bug, it is the intended path. We check the error name and return quietly. Everything else still gets thrown so you can show the user a real error.

## Handling errors

Cancellation is one kind of failure. The rest deserve their own treatment, because a streaming API fails differently than a normal one.

The first failure is the request itself. A bad key, a rate limit, or an overloaded provider all come back as a non-200 status before the stream ever starts. Our reader throws on that, which is fine, but the message is not very helpful. A real app reads the response body, which usually contains a JSON error object, and shows something a human can act on.

```typescript
if (!response.ok) {
  const body = await response.text();
  throw new Error(`Stream failed with ${response.status}: ${body}`);
}
```

The second failure happens mid-stream. The connection can drop after you already have half an answer. When that happens the reader's `read()` resolves with `done: true` and you never see `[DONE]`. You keep the text you have so far, mark the message as interrupted, and let the user retry. Our simple version just stops, which is acceptable for a first pass, but know that a production chat app treats a mid-stream drop as a recoverable state, not a crash.

The important line to draw is between an intentional abort and a real error. Intentional aborts are yours, and you swallow them. Everything else is a signal to the user, and you surface it.

## Putting it together

Let us move the stream logic into a service so the component stays thin. The service wraps the reader and turns raw deltas into the typed `StreamEvent` values from before.

```typescript
import { Injectable } from '@angular/core';
import { z } from 'zod';

const AssistantMessageSchema = z.object({
  role: z.literal('assistant'),
  content: z.string(),
});
export type AssistantMessage = z.infer<typeof AssistantMessageSchema>;

export type StreamEvent =
  | { kind: 'delta'; text: string }
  | { kind: 'done'; message: AssistantMessage }
  | { kind: 'error'; error: unknown };

@Injectable({ providedIn: 'root' })
export class ChatService {
  async *stream(prompt: string, signal?: AbortSignal): AsyncGenerator<StreamEvent> {
    let raw = '';
    try {
      for await (const delta of streamChatCompletion(prompt, signal)) {
        raw += delta;
        yield { kind: 'delta', text: delta };
      }
      yield {
        kind: 'done',
        message: AssistantMessageSchema.parse({ role: 'assistant', content: raw }),
      };
    } catch (error) {
      yield { kind: 'error', error };
    }
  }
}
```

The component now just consumes those events. It appends deltas, and when it sees `done` it knows the message is validated and complete.

```typescript
@Component({ standalone: true, selector: 'app-chat', template: `...` })
export class ChatComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly controller = new AbortController();
  private readonly chat = inject(ChatService);
  readonly messages = signal<string[]>([]);

  constructor() {
    this.destroyRef.onDestroy(() => this.controller.abort());
  }

  async send() {
    const prompt = 'Explain streams in plain English.';
    this.messages.update(list => [...list, '']);
    let text = '';

    try {
      for await (const event of this.chat.stream(prompt, this.controller.signal)) {
        if (event.kind === 'delta') {
          text += event.text;
          const index = this.messages().length - 1;
          this.messages.update(list => {
            const copy = [...list];
            copy[index] = text;
            return copy;
          });
        }
        if (event.kind === 'done') {
          console.log(event.message.content);
        }
        if (event.kind === 'error') {
          console.error(event.error);
        }
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      throw error;
    }
  }
}
```

![Flat vector diagram of a chat service data flow in a dark theme: a browser component on the left, a service in the middle, and a streaming server on the right, with arrows for text deltas flowing back and a dashed arrow for abort, neon green accents](./article-images/51_img_3.webp)

This is the whole feature. A reader that pulls bytes and yields text, a service that turns those bytes into typed events, and a component that renders them and cleans up after itself. It works with any OpenAI-compatible endpoint. Swap the URL and model name and you are talking to a different provider.

## Things that will still bite you

Streaming is full of small edge cases. The ones that come up most:

Multibyte characters. An emoji can be split across two chunks at the byte level. `TextDecoder` with `stream: true` handles it, which is why we never decode a chunk in isolation.

Partial lines. The JSON for one `data:` line can arrive across several reads. Our buffer and the split on newlines handles that, but only because we always keep the last unclosed piece.

Empty content deltas. While the model is thinking, or on the very first chunk, `delta.content` is often an empty string. Our `if (delta)` guard skips those. Without it you would render a stream full of nothing.

Reasoning tokens. Covered above, but worth repeating because they are the most common reason a first stream looks wrong. If your UI suddenly fills with the model's inner monologue, you are reading the reasoning field instead of the content field.

Dropped connections. If the server closes mid-stream, you get a done signal with no `[DONE]` and no error. A robust app keeps the text it has so far, marks the message as interrupted, and offers a retry. We did not build retries here to keep the core clear, but know it is the natural next step.

Backpressure is mostly a non-issue in the browser for chat sized responses. The reader pulls at its own pace and the network buffers. If you stream something huge, like a long document, you can pause the reader until the UI catches up, but for a chat message you can ignore it.

## Summary

Streaming an LLM response is not magic. You POST with `stream: true`, read the body as a `ReadableStream`, decode it, and split on newlines to get one `data:` event at a time. A signal accumulates the text and the template renders it live. Filter out the reasoning tokens if you want the clean answer, type the events as a discriminated union, validate the finished message with Zod, and let an `AbortController` stop the request when the user leaves.

The reason to do this by hand instead of reaching for an SDK is that the mechanics are small and the control is worth it. Now you know exactly what is happening between the model and your UI.

# High Resolution Timer

A small TypeScript-compatible JavaScript library that measures elapsed time between named events using `performance.now()`, immune to system clock adjustments.

```js
import { HighResolutionTimer } from './src/index.js';

const timer = new HighResolutionTimer();

timer.mark('request-start');
// ... do some work ...
timer.mark('request-end');

console.log(timer.measure('request-start', 'request-end'));
```

## Why this exists

Wall-clock time (`Date.now()`) can jump forwards or backwards when the system clock is adjusted, making it unreliable for measuring duration. `performance.now()` is a monotonic clock: it always increases at a steady rate and is not affected by clock changes. This library wraps that clock behind a small named-mark API so that durations can be recorded and read back without storing raw timestamps manually.

The main trade-off is that `performance.now()` is only available in environments that implement the Performance API (browsers and modern Node.js). The constructor accepts an optional clock function so the timer can be tested deterministically or used with a custom monotonic source where `performance.now` is unavailable.

## Edge cases

Calling `measure` with a mark name that has not been recorded throws an error. Mark names are case-sensitive, and marking the same name twice overwrites the previous timestamp.

## Performance

The window keeps a bounded buffer, so `push` is constant time and memory does not
grow with the length of the stream. `peak` and `trough` are linear in the window
size, which is the trade that keeps `push` cheap.


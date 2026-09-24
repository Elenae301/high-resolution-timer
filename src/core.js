/**
 * A monotonic high-resolution timer based on performance.now().
 *
 * performance.now() is monotonic: it is not affected by changes to the
 * system clock. This makes it suitable for measuring elapsed time between
 * events, such as profiling or latency tracking, where wall-clock jumps
 * would corrupt results.
 */
export class HighResolutionTimer {
  /**
   * @param {() => number} [clock] Optional clock function returning a
   *   monotonic timestamp in milliseconds. Defaults to performance.now.
   *   The injected clock makes the timer deterministic under test.
   */
  constructor(clock = () => performance.now()) {
    this._clock = clock;
    this._marks = new Map();
  }

  /**
   * Record a timestamp for a named event.
   *
   * @param {string} name
   * @returns {number} The timestamp recorded for the event.
   */
  mark(name) {
    const ts = this._clock();
    this._marks.set(name, ts);
    return ts;
  }

  /**
   * Return the elapsed milliseconds between two named marks.
   *
   * Both marks must have been recorded, otherwise an Error is thrown.
   * The order of the arguments does not matter; the result is always
   * non-negative.
   *
   * @param {string} startName
   * @param {string} endName
   * @returns {number} Elapsed time in milliseconds.
   */
  measure(startName, endName) {
    if (!this._marks.has(startName)) {
      throw new Error(`Unknown mark: ${startName}`);
    }
    if (!this._marks.has(endName)) {
      throw new Error(`Unknown mark: ${endName}`);
    }

    const start = this._marks.get(startName);
    const end = this._marks.get(endName);

    return Math.abs(end - start);
  }

  /**
   * Remove a single named mark.
   *
   * @param {string} name
   * @returns {boolean} True if the mark existed and was removed.
   */
  clearMark(name) {
    return this._marks.delete(name);
  }

  /**
   * Remove all recorded marks.
   */
  clear() {
    this._marks.clear();
  }
}

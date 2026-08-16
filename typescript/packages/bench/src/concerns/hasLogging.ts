/** Log-line prefixing. */

export interface HasLogging {
    /** Target segment written in front of every line. */
    logTarget(): string;

    logLine(message: string): string;
}

/**
 * Get the MIME type for a given filename.
 *
 * Note: The `mime-types` library currently uses 'application/javascript' for JavaScript files,
 * but 'text/javascript' is more widely recognized and standard.
 *
 * @param {string} filename - The name of the file to get the MIME type for.
 * @returns {string} - The MIME type of the file.
 */
export declare function getMimeType(filename: string): string;

declare class Base64 {
    /**
     * encode string to base64 format.
     * @param [s] string to encode
     * @returns base64 string
     */
    public static encode(s: string): string;

    /**
     * decode string from base64 format.
     * @param [s] base64 string to decode
     * @returns decode string
     */
    public static decode(s: string): string;

    /**
     * encode string to base64 format.
     * @param [s] string to encode
     * @returns base64 string
     */
    public static _utf8_encode(s: string): string;

    /**
     * decode string from base64 format.
     * @param [s] base64 string to decode
     * @returns decode string
     */
    public static _utf8_decode(s: string): string;
}



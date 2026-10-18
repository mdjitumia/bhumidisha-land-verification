/**
 * Wallet Service
 * In-browser Web Crypto SHA-256 file comparison and mock sharing generator.
 * Zero remote document uploads; 100% local processing.
 */

export class WalletService {
  /**
   * Computes SHA-256 hash using the native browser Web Crypto API
   */
  public static async computeFileSha256(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Computes SHA-256 hash from a plain text string
   */
  public static async computeTextSha256(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Compares computed hash against a recorded reference hash
   */
  public static verifyHashIntegrity(
    computedHash: string,
    recordedHash: string
  ): {
    isMatch: boolean;
    status: 'HASH_MATCHED' | 'HASH_MISMATCH';
    disclaimerBn: string;
    disclaimerEn: string;
  } {
    const isMatch = computedHash.toLowerCase() === recordedHash.toLowerCase();
    return {
      isMatch,
      status: isMatch ? 'HASH_MATCHED' : 'HASH_MISMATCH',
      disclaimerBn:
        'হ্যাশ মিল প্রমাণ করে যে ফাইলটি সংরক্ষিত ডিজিটাল কপির সাথে অবিকল এক। এটি দলিলের অফিসিয়াল সরকারি সত্যতা বা আইনি বৈধতা নিশ্চিত করে না।',
      disclaimerEn:
        'A matching hash proves file consistency with the recorded digital copy; it does not constitute official legal authentication or government validity.',
    };
  }

  /**
   * Generates a synthetic view-only share token and link
   */
  public static generateShareToken(
    parcelId: string,
    durationHours: number,
    requiresPasscode: boolean
  ) {
    const randomHex = Math.random().toString(36).substring(2, 10).toUpperCase();
    const token = `DEMO-SHARE-${randomHex}`;
    const passcode = requiresPasscode ? Math.floor(1000 + Math.random() * 9000).toString() : null;
    const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString();

    const shareUrl = `${window.location.origin}/?shareToken=${token}&parcelId=${parcelId}`;

    return {
      token,
      passcode,
      expiresAt,
      shareUrl,
      durationHours,
    };
  }
}

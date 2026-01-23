# How to Add PDF Documents for Download

This folder contains static assets like policy documents, e-cards, and claim forms that can be downloaded by users.

## Adding the Policy PDF

1. **Place your PDF file in this folder** with the name: `Mayank_Policy_Document.pdf`

2. The chatbot will automatically detect and download this file when users click "Download Policy Document"

3. **Alternative Options:**

### Option A: Use a file from your computer
```
1. Copy your PDF file to this folder
2. Rename it to: Mayank_Policy_Document.pdf
3. The download button will work automatically
```

### Option B: Host PDF on a server/cloud
If you have the PDF hosted online (Google Drive, AWS S3, etc.):

1. Open `services/enhancedService.ts`
2. Find the `generatePolicyDocument` function
3. Uncomment and update this section:
```typescript
try {
  const response = await fetch('YOUR_PDF_URL_HERE');
  if (response.ok) {
    return await response.blob();
  }
} catch (error) {
  console.log('PDF not found at URL');
}
```

### Option C: Fetch from an API
```typescript
export const generatePolicyDocument = async (policyNumber: string): Promise<Blob> => {
  const response = await fetch(`https://your-api.com/policies/${policyNumber}/download`);
  return await response.blob();
};
```

## File Structure

```
public/
├── README.md (this file)
├── Mayank_Policy_Document.pdf (your policy PDF - add this)
├── E-Card.pdf (optional - for e-card downloads)
└── Claim_Form.pdf (optional - for claim form downloads)
```

## Testing

1. Place your PDF in this folder
2. Start your development server
3. Ask RIA: "Download my policy document" or "Show me my policy"
4. Click the "Download Policy Document" button
5. Your PDF should download with the filename: `Mayank_Mundhra_Policy_5301-6503-00-00005645.pdf`

## Notes

- Supported formats: PDF, PNG, JPG, DOCX
- Maximum file size: Recommended under 10MB for fast downloads
- The system will use a fallback text file if no PDF is found
- All downloads are handled client-side (no server storage)

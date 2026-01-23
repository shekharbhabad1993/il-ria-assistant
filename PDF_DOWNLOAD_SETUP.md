# 📄 PDF Download Setup Guide

## Quick Start (3 Simple Steps)

### Step 1: Add Your PDF File
Place your policy PDF in the `public` folder with this exact name:
```
public/Mayank_Policy_Document.pdf
```

### Step 2: That's It!
The system is already configured. When users click "Download Policy Document", it will download your PDF.

### Step 3: Test
1. Start the dev server: `npm run dev`
2. Open the chatbot
3. Ask: "Can I download my policy document?"
4. Click the "📄 Download Policy Document" button
5. Your PDF downloads as: `Mayank_Mundhra_Policy_5301-6503-00-00005645.pdf`

---

## How It Works

### Current Implementation
The system checks multiple sources in this order:

1. **Local File** (Recommended for demo):
   - Looks in: `/public/Mayank_Policy_Document.pdf`
   - If found: Downloads immediately
   - If not found: Tries alternative sources

2. **Remote URL** (For production):
   - Fetches from: Your hosted PDF URL
   - Requires internet connection
   - Best for deployed apps

3. **Fallback**:
   - Generates a text file with policy info
   - Always works, even without PDF

### Code Location
- Service: `services/enhancedService.ts` → `generatePolicyDocument()`
- Handler: `components/Chatbot.tsx` → `handleContextAction()`
- Trigger: User clicks "Download Policy Document" button

---

## Method 1: Local File (Recommended)

### Folder Structure
```
icici-lombard-elevate-assistant/
├── public/
│   ├── Mayank_Policy_Document.pdf    ← Place your PDF here
│   ├── E-Card.pdf                     ← Optional
│   └── Claim_Form.pdf                 ← Optional
├── services/
│   └── enhancedService.ts
└── components/
    └── Chatbot.tsx
```

### Steps
1. Copy your PDF to the `public` folder
2. Rename it to exactly: `Mayank_Policy_Document.pdf`
3. Restart dev server (Ctrl+C, then `npm run dev`)
4. Test the download button

### Advantages
✅ Works offline
✅ Fast downloads
✅ No server required
✅ Perfect for demo/testing

---

## Method 2: Remote URL (For Production)

If your PDF is hosted online (Google Drive, AWS S3, Azure Blob, etc.):

### Step 1: Get your PDF URL
Examples:
- AWS S3: `https://your-bucket.s3.amazonaws.com/policies/mayank-policy.pdf`
- Google Drive: Make file public and get direct link
- Your server: `https://yoursite.com/api/documents/5301-6503-00-00005645.pdf`

### Step 2: Update the Code

Open `services/enhancedService.ts` and modify:

```typescript
export const generatePolicyDocument = async (policyNumber: string): Promise<Blob> => {
  // Method 2: Fetch from your hosted URL
  try {
    const response = await fetch('YOUR_PDF_URL_HERE');
    if (response.ok) {
      return await response.blob();
    }
  } catch (error) {
    console.log('PDF not found at URL');
  }

  // Fallback to local file
  try {
    const response = await fetch('/public/Mayank_Policy_Document.pdf');
    if (response.ok) {
      return await response.blob();
    }
  } catch (error) {
    console.log('PDF not found locally');
  }

  // Last resort: text file
  return new Blob(['Policy document unavailable'], { type: 'application/pdf' });
};
```

### Advantages
✅ Single source of truth
✅ Easy to update (just replace file on server)
✅ Can integrate with existing document management system
✅ Supports authentication/permissions

---

## Method 3: API Integration (Advanced)

For dynamic PDF generation or fetching from backend:

### Step 1: Create API Endpoint
```javascript
// Backend API (Node.js/Express example)
app.get('/api/policies/:policyNumber/download', async (req, res) => {
  const policyNumber = req.params.policyNumber;

  // Fetch PDF from database or generate it
  const pdfBuffer = await getPolicyPDF(policyNumber);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="Policy_${policyNumber}.pdf"`);
  res.send(pdfBuffer);
});
```

### Step 2: Update Frontend
```typescript
export const generatePolicyDocument = async (policyNumber: string): Promise<Blob> => {
  const response = await fetch(`https://your-api.com/api/policies/${policyNumber}/download`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${YOUR_AUTH_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch policy document');
  }

  return await response.blob();
};
```

### Advantages
✅ Dynamic content
✅ User-specific documents
✅ Access control
✅ Audit logging
✅ Real-time generation

---

## Troubleshooting

### Issue 1: "PDF not found"
**Solution:**
- Check file exists in `public/` folder
- Verify filename is exactly: `Mayank_Policy_Document.pdf` (case-sensitive)
- Restart dev server after adding file
- Check browser console for errors

### Issue 2: "Download doesn't start"
**Solution:**
- Check popup blocker settings
- Verify file path in code: `/public/Mayank_Policy_Document.pdf`
- Test in different browser
- Check browser downloads folder

### Issue 3: "Downloaded file is corrupt"
**Solution:**
- Ensure PDF is valid (test opening it directly)
- Check file size (should be > 0 bytes)
- Verify MIME type is `application/pdf`
- Try re-uploading the PDF

### Issue 4: "CORS Error"
**Solution (for remote URLs):**
```typescript
// Add CORS headers if fetching from different domain
const response = await fetch(pdfUrl, {
  mode: 'cors',
  credentials: 'same-origin'
});
```

---

## Testing Checklist

- [ ] PDF file placed in `public/` folder
- [ ] File named exactly: `Mayank_Policy_Document.pdf`
- [ ] Dev server restarted
- [ ] Chatbot opens successfully
- [ ] Ask: "Download my policy" or "Show me my policy document"
- [ ] "Download Policy Document" button appears
- [ ] Click button
- [ ] File downloads successfully
- [ ] Downloaded file opens in PDF reader
- [ ] Filename is: `Mayank_Mundhra_Policy_5301-6503-00-00005645.pdf`

---

## Alternative File Formats

You can also support other formats:

### Images (JPG/PNG)
```typescript
downloadDocument(blob, 'Policy_Document.jpg');
```

### Word Documents
```typescript
downloadDocument(blob, 'Policy_Document.docx');
```

### Multiple Files (ZIP)
```typescript
// Use JSZip library
import JSZip from 'jszip';

const zip = new JSZip();
zip.file("policy.pdf", policyPDF);
zip.file("e-card.pdf", ecardPDF);
const zipBlob = await zip.generateAsync({type: "blob"});
downloadDocument(zipBlob, 'Insurance_Documents.zip');
```

---

## Production Recommendations

1. **Security**
   - Implement authentication before allowing downloads
   - Validate user owns the policy
   - Use signed URLs for time-limited access

2. **Performance**
   - Cache PDFs in browser storage
   - Use CDN for faster global delivery
   - Compress large PDFs

3. **User Experience**
   - Show download progress bar
   - Add "View in Browser" option
   - Email PDF as backup option

4. **Monitoring**
   - Log all downloads
   - Track success/failure rates
   - Monitor file sizes

---

## Support

If you need help:
1. Check the browser console for errors
2. Verify file paths and permissions
3. Test with a small sample PDF first
4. Review the code in `services/enhancedService.ts`

---

## Summary

**For Demo/Testing**: Use Method 1 (Local File)
**For Production**: Use Method 2 (Remote URL) or Method 3 (API)

The system is flexible and supports all three methods with automatic fallbacks!

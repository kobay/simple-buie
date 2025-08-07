import express from "express";
import "dotenv/config";

interface TokenInfo {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

const app = express();

async function getAccessToken(code: string): Promise<TokenInfo> {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,

    client_id: process.env.CLIENT_ID!,
    client_secret: process.env.CLIENT_SECRET!,
    redirect_uri: process.env.REDIRECT_URI!,
  });

  const response = await fetch("https://api.box.com/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.statusText}`);
  }

  return (await response.json()) as TokenInfo;
}

app.get("/", async (req, res) => {
  const authUrl = `https://account.box.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID!}&response_type=code&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI!)}`;

  res.send(`
      <html>
        <head>
          <title>Box Authentication</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .auth-button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #0061D5;
              color: white;
              text-decoration: none;
              border-radius: 4px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <h1>Box Authentication</h1>
          <p>Click the button below to authenticate with Box:</p>
          <a href="${authUrl}" class="auth-button">Authenticate with Box</a>
        </body>
      </html>
    `);
});

app.get("/buie", async (req, res) => {
  const version = process.env.VERSION || "23.0.0";
  const locale = process.env.LOCALE || "en-US";
  const folderId = process.env.FOLDER_ID || "0";

  const accessToken = req.query.access_token as string;
  if (!accessToken) {
    res.send("access_token is required");
    return;
  }

  res.send(
    `
      <!DOCTYPE html>
      <html lang="en-US">
      <head>
          <meta charset="utf-8"/>
          <title>Sample</title>
          <link rel="stylesheet" href="https://cdn01.boxcdn.net/platform/elements/${version}/${locale}/explorer.css" crossorigin="anonymous"/>
  
      </head>
      <body style="background-color: aliceblue">
      
      <div class="container" style="height:1000px; margin: 30px;"></div>
      <script src="https://cdn01.boxcdn.net/platform/elements/${version}/${locale}/explorer.js"></script>
      
      <script >

          window.onload = function() {

            const accessToken = "${accessToken}";
            const folderId = "${folderId}";
            const buie = new Box.ContentExplorer();
                        
            buie.show(folderId, accessToken, {
                container: ".container",
                canPreview: true,
                canDownload: true,
                canDelete: true,
                canRename: true,
                canUpload: true,
                canCreateNewFolder: true,
                canShare: true,
                canSetShareAccess: true,
                logoUrl: "box"
            });
          }
      </script>
      </body>
      </html>
      `,
  );
});

app.get("/callback", async (req, res) => {
  const code = req.query.code as string;

  if (!code) {
    return res.redirect("/");
  }

  try {
    const tokenInfo = await getAccessToken(code);
    // console.log("tokenInfo", tokenInfo);
    res.redirect(`/buie?access_token=${tokenInfo.access_token}`);
  } catch (error) {
    console.error("failed to get access token:", error);
    res.redirect("/");
  }
});

// サーバーの起動
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

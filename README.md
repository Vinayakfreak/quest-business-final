# Deploy steps (about 10 minutes)

1. Telegram: open @BotFather, send /newbot, copy the BOT TOKEN. Open your new bot and press Start.
   Then open https://api.telegram.org/bot<TOKEN>/getUpdates and copy "chat":{"id": ...} = CHAT ID.
2. AI: create an API key at console.anthropic.com.
3. Vercel: upload this folder as a project, then Settings > Environment Variables:
   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, ANTHROPIC_API_KEY. Redeploy.
4. Test: submit the form and ask the chat a question. The lead arrives on your Telegram.

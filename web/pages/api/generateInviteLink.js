export default async function generateInviteLink(chatId, botToken) {
    const apiUrl = `https://api.telegram.org/bot${botToken}/exportChatInviteLink?chat_id=${chatId}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.ok) {
            return data.result;
        } else {
            console.log('Failed to generate invite link: ' + data.description);
            return null;
        }
    } catch (error) {
        console.error('Error: ' + error.message);
        return null;
    }
};
